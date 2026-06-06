import { parseCSV, checkCSVHeader }           from "../../utils/csv.js";
import { postV1 }                              from "../../utils/apiV1.js";
import Computer                                from "../../model/Computer.js";
import Monitor                                 from "../../model/Monitor.js";
import {
    parseDDMMYYYY,
    toGLPIDateTime,
    getEnumIdByName,
    TICKET_TYPE,
    TICKET_STATUS,
    TICKET_PRIORITY,
} from "../../utils/utils.js";

const EXPECTED_HEADERS = [
    "ref_ticket", "date", "heure", "type",
    "titre", "description", "status", "priority", "items",
];

const _cache = new Map();

async function findAssetByName(name) {
    const trimmed = name.trim();
    const cacheKey = `asset::${trimmed.toLowerCase()}`;

    if (_cache.has(cacheKey)) return _cache.get(cacheKey);

    const computers = await Computer.getBy("name", trimmed);
    if (computers.length > 0) {
        const found = { asset: computers[0], itemtype: "Computer" };
        _cache.set(cacheKey, found);
        return found;
    }

    const monitors = await Monitor.getBy("name", trimmed);
    if (monitors.length > 0) {
        const found = { asset: monitors[0], itemtype: "Monitor" };
        _cache.set(cacheKey, found);
        return found;
    }

    console.warn(`[WARN] Asset introuvable : "${trimmed}"`);
    _cache.set(cacheKey, null);
    return null;
}

/**
 * Parse la colonne Items du CSV.
 * Accepte : ["PC-ADM-001","MN-FORM-002"] ou PC-ADM-001
 * @returns {string[]}
 */
function parseItems(raw) {
    if (!raw || raw.trim() === "") return [];
    try {
        const parsed = JSON.parse(raw.trim());
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // pas du JSON → on traite comme une valeur simple
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

            const type     = getEnumIdByName(TICKET_TYPE,     row.type,     1); // défaut: Incident
            const status   = getEnumIdByName(TICKET_STATUS,   row.status,   1); // défaut: New
            const priority = getEnumIdByName(TICKET_PRIORITY, row.priority, 3); // défaut: Medium


            const ticketPayload = {
                input: {
                    name:     row.titre?.trim()       ?? "",
                    content:  row.description?.trim() ?? "",
                    externalid: row.ref_ticket?.trim() ?? "",
                    date:     dateStr,
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
                    console.warn(
                        `[WARN] Ticket #${ticketId} — item ignoré : "${itemName}" introuvable`
                    );
                    continue;
                }

                const assocPayload = {
                    input: {
                        tickets_id: ticketId,
                        itemtype:   found.itemtype,
                        items_id:   found.asset.id,
                    },
                };

                const assocResult = await postV1(
                    `Ticket/${ticketId}/Item_Ticket`,
                    assocPayload
                );

                if (!assocResult?.id) {
                    console.warn(
                        `[WARN] Ticket #${ticketId} — association "${itemName}" (${found.itemtype}) échouée : ${JSON.stringify(assocResult)}`
                    );
                } else {
                    console.log(
                        `[LINKED] Ticket #${ticketId} ← ${found.itemtype} "${itemName}" (#${found.asset.id})`
                    );
                }
            }

            results.created++;

        } catch (err) {
            console.error(`[ERROR] Ticket ref "${row.ref_ticket}" : ${err.message}`);
            results.errors.push({ row: row.ref_ticket, error: err.message });
        }
    }

    console.log(
        `\nImport Feuille 2 terminé : ${results.created} tickets créés, ${results.errors.length} erreurs`
    );
    return results;
};

export default importFile2;