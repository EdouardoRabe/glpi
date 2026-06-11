import { parseCSV, checkCSVHeader } from "../../utils/csv.js";
import { postV1 }                   from "../../utils/apiV1.js";
import Asset                        from "../../model/Asset.js";
import { ASSET_TYPES_CONFIG }       from "../../utils/type.js";
import {
    parseDDMMYYYY,
    toGLPIDateTime,
    getEnumIdByName,
    TICKET_TYPE,
    TICKET_PRIORITY,
} from "../../utils/utils.js";
import StatusTicket from "../../model/StatusTicket.js";
import Ticket from "../../model/Ticket.js";

const EXPECTED_HEADERS = [
    "ref_ticket", "date", "heure", "type",
    "titre", "description", "status", "priority", "items",
];

const _cache = new Map();


async function findAssetByName(name) {
    const trimmed  = name.trim();
    const cacheKey = `asset::${trimmed.toLowerCase()}`;

    if (_cache.has(cacheKey)) return _cache.get(cacheKey);

    const results = await Asset.getBy("name", trimmed);

    if (results.length > 0) {
        const found = { asset: results[0], itemtype: results[0].itemType };
        _cache.set(cacheKey, found);
        return found;
    }

    console.warn(`[WARN] Asset introuvable : "${trimmed}"`);
    _cache.set(cacheKey, null);
    return null;
}


function parseItems(raw) {
    if (!raw || raw.trim() === "") return [];
    try {
        const parsed = JSON.parse(raw.trim());
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // pas du JSON → valeur simple
    }
    return [raw.trim()];
}

export const importFile2 = async (file) => {
    const text = await file.text();

    checkCSVHeader(text, EXPECTED_HEADERS);

    const rows    = parseCSV(text);
    const results = { created: 0, errors: [] };

    for (const row of rows) {
        try {
            const date    = parseDDMMYYYY(row.date, row.heure);
            const dateStr = toGLPIDateTime(date);
            
            const statAll = await StatusTicket.getAll();
            const stat = StatusTicket.getByLanguageName(statAll, "english", row.status) ?? StatusTicket.getByLanguageName(statAll, "french", row.status);
            const type     = getEnumIdByName(TICKET_TYPE,     row.type,     1);
            let status   =  stat ? stat.id_status : 1;
            const priority = getEnumIdByName(TICKET_PRIORITY, row.priority, 3);
            let isClosed = false;

            if(status === 6) {
                status =2;
                isClosed = true;
            }

            const ticketPayload = {
                input: {
                    name:       row.titre?.trim()       ?? "",
                    content:    row.description?.trim() ?? "",
                    externalid: row.ref_ticket?.trim()  ?? "",
                    date:       dateStr,
                    type,
                    status,
                    priority,
                },
            };

            console.log(`Création ticket ref "${row.ref_ticket}"... Payload: ${JSON.stringify(ticketPayload)}`);

            const ticketResult = await postV1("Ticket", ticketPayload);

            if (!ticketResult?.id) {
                throw new Error(
                    `Création ticket échouée (ref ${row.ref_ticket}) : ${JSON.stringify(ticketResult)}`
                );
            }

            const ticketId = ticketResult.id;
            console.log(`[CREATED] Ticket #${ticketId} — "${row.titre}" (ref CSV: ${row.ref_ticket})`);

            const itemNames = parseItems(row.items);

            for (const itemName of itemNames) {
                const found = await findAssetByName(itemName);

                if (!found) {
                    console.warn(`[WARN] Ticket #${ticketId} — item ignoré : "${itemName}" introuvable`);
                    continue;
                }

                const assetConfig = ASSET_TYPES_CONFIG[found.itemtype.toLowerCase()];
                if (!assetConfig?.linkable) {
                    console.warn(`[SKIP] Ticket #${ticketId} — ${found.itemtype} "${itemName}" n'est pas linkable aux tickets`);
                    continue;
                }

                const itemtype = found.itemtype.toLowerCase() === "socket" ? "Glpi\\Socket" : found.itemtype;

                const assocPayload = {
                    input: {
                        tickets_id: ticketId,
                        itemtype: itemtype,
                        items_id: found.asset.id,
                    },
                };

                const assocResult = await postV1(`Ticket/${ticketId}/Item_Ticket`, assocPayload);

                if (!assocResult?.id) {
                    console.warn(
                        `[WARN] Ticket #${ticketId} — association "${itemName}" (${found.itemtype}) échouée : ${JSON.stringify(assocResult)}`
                    );
                } else {
                    console.log(`[LINKED] Ticket #${ticketId} ← ${found.itemtype} "${itemName}" (#${found.asset.id})`);
                }
            }

            if(isClosed){
                const data = { status: { id: 6 } };
                await Ticket.updateStatic(ticketId, data);
            }

            results.created++;

        } catch (err) {
            console.error(`[ERROR] Ticket ref "${row.ref_ticket}" : ${err.message}`);
            results.errors.push({ row: row.ref_ticket, error: err.message });
        }
    }

    console.log(`\nImport Feuille 2 terminé : ${results.created} tickets créés, ${results.errors.length} erreurs`);
    return results;
};

export default importFile2;