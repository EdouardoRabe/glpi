import JSZip                         from "jszip";
import { uploadMultipartV1, postV1 } from "../../utils/apiV1.js";
import Asset                         from "../../model/Asset.js";
import { isImageFile }               from "../../utils/utils.js";

const IGNORED_PREFIXES = ["__MACOSX/", "_MACOSX/", "__MACOSX\\", "_MACOSX\\"];

const MIME_MAP = {
    png:  "image/png",
    jpg:  "image/jpeg",
    jpeg: "image/jpeg",
    gif:  "image/gif",
    webp: "image/webp",
    bmp:  "image/bmp",
};

// ─── Magic bytes ──────────────────────────────────────────────────────────────
// File signature detection: supports multi-part signatures with offsets
// This prevents false positives (e.g., RIFF for WAV vs WEBP)

const MAGIC_BYTES = [
    { ext: "png",  mime: "image/png",  parts: [{ offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }] },
    { ext: "jpg",  mime: "image/jpeg", parts: [{ offset: 0, bytes: [0xFF, 0xD8, 0xFF] }] },
    { ext: "gif",  mime: "image/gif",  parts: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] },
    { ext: "bmp",  mime: "image/bmp",  parts: [{ offset: 0, bytes: [0x42, 0x4D] }] },
    { ext: "webp", mime: "image/webp", parts: [
        { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },     // RIFF header
        { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }      // WEBP at offset 8 (avoids WAV false positives)
    ]},
];

function matchesPart(uint8Array, part) {
    return part.bytes.every((byte, i) => uint8Array[part.offset + i] === byte);
}

function matchesSignature(uint8Array, sig) {
    return sig.parts.every(part => matchesPart(uint8Array, part));
}

function detectRealMime(uint8Array) {
    const sig = MAGIC_BYTES.find(s => matchesSignature(uint8Array, s));
    return sig ? sig.mime : null;
}

function mimeFromFilename(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    return MIME_MAP[ext] ?? "application/octet-stream";
}

async function fixIfMisnamed(uint8Array, filename) {
    const declaredMime = mimeFromFilename(filename);
    const realMime     = detectRealMime(uint8Array);

    if (!realMime || realMime === declaredMime) {
        return { blob: new Blob([uint8Array], { type: declaredMime }), filename, wasFixed: false };
    }

    console.warn(`[FIX] "${filename}" déclaré comme ${declaredMime} mais signature réelle : ${realMime}. Re-encodage...`);

    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: realMime });
        const url  = URL.createObjectURL(blob);
        const img  = new Image();

        img.onload = () => {
            const canvas  = document.createElement("canvas");
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);

            canvas.toBlob((fixedBlob) => {
                URL.revokeObjectURL(url);
                const ext       = realMime.split("/")[1].replace("jpeg", "jpg");
                const baseName  = filename.substring(0, filename.lastIndexOf("."));
                resolve({ blob: fixedBlob, filename: `${baseName}.${ext}`, wasFixed: true });
            }, realMime, 0.92);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Impossible de lire "${filename}" (signature: ${realMime})`));
        };

        img.src = url;
    });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isIgnoredPath(path) {
    if (IGNORED_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
    if (path.endsWith(".DS_Store")) return true;
    if (path.endsWith("/"))         return true;
    return false;
}

function assetNameFromPath(zipPath) {
    const filename = zipPath.split("/").pop().split("\\").pop();
    return filename.substring(0, filename.lastIndexOf("."));
}


async function findAssetByName(name) {
    const results = await Asset.getBy("name", name);
    if (results.length > 0) {
        return { asset: results[0], itemtype: results[0].itemType };
    }
    console.warn(`[WARN] Asset introuvable pour la photo : "${name}"`);
    return null;
}

async function uploadDocument(assetName, uint8Array, filename) {
    const { blob: fileBlob, filename: finalFilename, wasFixed } = await fixIfMisnamed(uint8Array, filename);

    if (wasFixed) console.log(`[FIX] "${filename}" corrigé → "${finalFilename}"`);

    const manifest = {
        input: {
            name:      assetName,
            _filename: [finalFilename],
        },
    };

    const result = await uploadMultipartV1("Document", manifest, fileBlob, finalFilename);

    if (!result?.id) {
        console.error(`[ERROR] uploadDocument — API error: ${JSON.stringify(result)}`);
    }

    return result.id;
}

async function linkDocumentToAsset(documentId, itemtype, itemId) {
    const result = await postV1("Document_Item", {
        input: {
            documents_id: documentId,
            itemtype,
            items_id:     itemId,
        },
    });

    if (!result?.id) {
        console.error(`[ERROR] linkDocumentToAsset — API error: ${JSON.stringify(result)}`);
    }

    return result.id;
}

// ─── Import principal ─────────────────────────────────────────────────────────

export const importFile4 = async (file) => {
    const results = { updated: 0, errors: [] };

    const zip = await JSZip.loadAsync(file);

    const imageEntries = Object.entries(zip.files).filter(([path, entry]) => {
        if (entry.dir)           return false;
        if (isIgnoredPath(path)) return false;
        if (!isImageFile(path))  return false;
        return true;
    });

    if (imageEntries.length === 0) {
        console.warn("[WARN] Aucune image trouvée dans le ZIP.");
        return results;
    }

    console.log(`[INFO] ${imageEntries.length} image(s) trouvée(s) dans le ZIP.`);

    for (const [zipPath, zipEntry] of imageEntries) {
        const assetName = assetNameFromPath(zipPath);

        try {
            const found = await findAssetByName(assetName);
            if (!found) continue;

            const uint8Array = await zipEntry.async("uint8array");
            const filename   = zipPath.split("/").pop().split("\\").pop();

            const documentId = await uploadDocument(assetName, uint8Array, filename);
            console.log(`[UPLOADED] Document #${documentId} créé pour "${assetName}"`);

            await linkDocumentToAsset(documentId, found.itemtype, found.asset.id);
            console.log(`[LINKED] Document #${documentId} lié à ${found.itemtype} "${assetName}" (#${found.asset.id})`);

            results.updated++;

        } catch (err) {
            // Echec silencieux — remplacer par throw si besoin
            console.error(`[ERROR] Photo "${assetName}" : ${err.message}`);
            results.errors.push({ asset: assetName, error: err.message });
        }
    }

    console.log(`\nImport Feuille 4 terminé : ${results.updated} photo(s) importée(s), ${results.errors.length} erreur(s).`);
    return results;
};

export default importFile4;