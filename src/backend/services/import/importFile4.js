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

function mimeFromFilename(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    return MIME_MAP[ext] ?? "application/octet-stream";
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
    const mimeType = mimeFromFilename(filename);
    const fileBlob = new Blob([uint8Array], { type: mimeType });

    const manifest = {
        input: {
            name:      assetName,
            _filename: [filename],
        },
    };

    const result = await uploadMultipartV1("Document", manifest, fileBlob, filename);
    console.log(`[DEBUG] uploadDocument — result: ${JSON.stringify(result)}`);

    if(result?.error) {
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

            // Étape 1 — Upload de l'image comme document GLPI
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