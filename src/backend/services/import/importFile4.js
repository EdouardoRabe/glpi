import JSZip        from "jszip";
import { uploadMultipartV1, postV1 } from "../../utils/apiV1.js";
import Computer    from "../../model/Computer.js";
import Monitor     from "../../model/Monitor.js";
import { isImageFile } from "../../utils/utils.js";

const IGNORED_PREFIXES = ["__MACOSX/", "_MACOSX/", "__MACOSX\\", "_MACOSX\\"];

const MIME_MAP = {
    png:  "image/png",
    jpg:  "image/jpeg",
    jpeg: "image/jpeg",
    gif:  "image/gif",
    webp: "image/webp",
    bmp:  "image/bmp",
};

// ─── Magic bytes pour détecter le vrai type de fichier ───────────────────────

const MAGIC_BYTES = [
    { mime: "image/png",  bytes: [0x89, 0x50, 0x4E, 0x47] },
    { mime: "image/jpeg", bytes: [0xFF, 0xD8, 0xFF] },
    { mime: "image/gif",  bytes: [0x47, 0x49, 0x46] },
    { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
    { mime: "image/bmp",  bytes: [0x42, 0x4D] },
];

/**
 * Détecte le vrai type MIME d'un fichier via ses magic bytes.
 * @param {Uint8Array} uint8Array
 * @returns {string|null} MIME type réel ou null si inconnu
 */
function detectRealMime(uint8Array) {
    for (const { mime, bytes } of MAGIC_BYTES) {
        if (bytes.every((byte, i) => uint8Array[i] === byte)) {
            return mime;
        }
    }
    return null;
}

/**
 * Retourne le MIME type déclaré par l'extension du fichier.
 * @param {string} filename
 * @returns {string}
 */
function mimeFromFilename(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    return MIME_MAP[ext] ?? "application/octet-stream";
}

/**
 * Vérifie si le fichier est mal renommé (signature ≠ extension).
 * Si oui, re-encode via canvas pour corriger.
 * Si non, retourne le blob tel quel.
 *
 * @param {Uint8Array} uint8Array
 * @param {string} filename
 * @returns {Promise<{blob: Blob, filename: string, wasFixed: boolean}>}
 */
async function fixIfMisnamed(uint8Array, filename) {
    const declaredMime = mimeFromFilename(filename);
    const realMime     = detectRealMime(uint8Array);

    // Si on ne détecte pas ou si signatures correspondent → pas de problème
    if (!realMime || realMime === declaredMime) {
        const blob = new Blob([uint8Array], { type: declaredMime });
        return { blob, filename, wasFixed: false };
    }

    // Signature ≠ extension → re-encoder via canvas avec le vrai type
    console.warn(
        `[FIX] "${filename}" déclaré comme ${declaredMime} mais signature réelle : ${realMime}. Re-encodage...`
    );

    return new Promise((resolve, reject) => {
        const blob = new Blob([uint8Array], { type: realMime });
        const url  = URL.createObjectURL(blob);
        const img  = new Image();

        img.onload = () => {
            const canvas  = document.createElement("canvas");
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);

            // On re-encode dans le vrai type réel
            canvas.toBlob((fixedBlob) => {
                URL.revokeObjectURL(url);

                // Corriger aussi l'extension du nom de fichier
                const ext        = realMime.split("/")[1].replace("jpeg", "jpg");
                const baseName   = filename.substring(0, filename.lastIndexOf("."));
                const fixedName  = `${baseName}.${ext}`;

                resolve({ blob: fixedBlob, filename: fixedName, wasFixed: true });
            }, realMime, 0.92);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Impossible de lire le fichier "${filename}" (signature: ${realMime})`));
        };

        img.src = url;
    });
}

// ─── Helpers existants (identiques à importFile4-back) ───────────────────────

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
    const computers = await Computer.getBy("name", name);
    if (computers.length > 0) return { asset: computers[0], itemtype: "Computer" };

    const monitors = await Monitor.getBy("name", name);
    if (monitors.length > 0) return { asset: monitors[0], itemtype: "Monitor" };

    console.warn(`[WARN] Asset introuvable pour la photo : "${name}"`);
    return null;
}

/**
 * Étape 1 : Upload du fichier image comme Document GLPI.
 * Retourne l'ID du document créé.
 */
async function uploadDocument(assetName, uint8Array, filename) {
    // Corriger le fichier si mal renommé
    const { blob: fileBlob, filename: finalFilename, wasFixed } = await fixIfMisnamed(uint8Array, filename);

    if (wasFixed) {
        console.log(`[FIX] "${filename}" corrigé → "${finalFilename}"`);
    }

    const manifest = {
        input: {
            name:      assetName,
            _filename: [finalFilename],
        },
    };

    const result = await uploadMultipartV1("Document", manifest, fileBlob, finalFilename);
    console.log(`[DEBUG] uploadDocument — result: ${JSON.stringify(result)}`);

    if (result?.error) {
        console.error(`[ERROR] uploadDocument — API error: ${JSON.stringify(result)}`);
    }

    if (!result?.id) {
        console.error(`[ERROR] uploadDocument — API error: ${JSON.stringify(result)}`);
    }

    return result.id;
}

/**
 * Étape 2 : Liaison du document à l'asset via Document_Item.
 */
async function linkDocumentToAsset(documentId, itemtype, itemId) {
    const result = await postV1("Document_Item", {
        input: {
            documents_id: documentId,
            itemtype:     itemtype,
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

            // Étape 1 — Upload (avec correction automatique si fichier mal renommé)
            const documentId = await uploadDocument(assetName, uint8Array, filename);
            console.log(`[UPLOADED] Document #${documentId} créé pour "${assetName}"`);

            // Étape 2 — Liaison du document à l'asset
            await linkDocumentToAsset(documentId, found.itemtype, found.asset.id);
            console.log(`[LINKED] Document #${documentId} lié à ${found.itemtype} "${assetName}" (#${found.asset.id})`);

            results.updated++;

        } catch (err) {
            console.error(`[ERROR] Photo "${assetName}" : ${err.message}`);
            results.errors.push({ asset: assetName, error: err.message });
        }
    }

    console.log(
        `\nImport Feuille 4 terminé : ${results.updated} photo(s) importée(s), ${results.errors.length} erreur(s).`
    );
    return results;
};

export default importFile4;