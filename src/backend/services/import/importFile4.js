import JSZip                         from "jszip";
import { patchV1 }                   from "../../utils/apiV1.js";
import Computer                      from "../../model/Computer.js";
import Monitor                       from "../../model/Monitor.js";
import { isImageFile, uint8ArrayToBase64DataURI } from "../../utils/utils.js";

const IGNORED_PREFIXES = ["__MACOSX/", "_MACOSX/", "__MACOSX\\", "_MACOSX\\"];


function isIgnoredPath(path) {
    if (IGNORED_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
    if (path.endsWith(".DS_Store"))  return true;
    if (path.endsWith("/"))          return true;
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


async function uploadPicture(itemtype, id, base64DataURI) {
    return patchV1(`${itemtype}/${id}`, {
        input: {
            id,
            picture: base64DataURI,
        },
    });
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

            const uint8Array  = await zipEntry.async("uint8array");
            const filename    = zipPath.split("/").pop().split("\\").pop();
            const base64URI   = uint8ArrayToBase64DataURI(uint8Array, filename);

            const patchResult = await uploadPicture(
                found.itemtype,
                found.asset.id,
                base64URI
            );

            if (!patchResult) {
                console.warn(
                    `[WARN] Photo "${assetName}" — PATCH échoué sur ${found.itemtype} #${found.asset.id}`
                );
                continue;
            }

            console.log(
                `[UPDATED] Photo de ${found.itemtype} "${assetName}" (#${found.asset.id}) mise à jour.`
            );
            results.updated++;

        } catch (err) {
            console.error(`[ERROR] Photo "${assetName}" : ${err.message}`);
            results.errors.push({ asset: assetName, error: err.message });
        }
    }

    console.log(
        `\nImport Feuille 4 terminé : ${results.updated} photo(s) mise(s) à jour, ${results.errors.length} erreur(s).`
    );
    return results;
};

export default importFile4;