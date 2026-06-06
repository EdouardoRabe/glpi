import { parseCSV, checkCSVHeader } from "../../utils/csv.js";
import { parseCSVNumber }           from "../../utils/utils.js";
import api                          from "../../utils/api.js";
import Ticket                       from "../../model/Ticket.js";

const EXPECTED_HEADERS = [
    "num_ticket", "duration_second", "time_cost", "fixed_cost"
];

const _ticketCache = new Map();

async function findTicketByRef(ref) {
    const key = String(ref).trim();
    if (_ticketCache.has(key)) return _ticketCache.get(key);

    const tickets = await Ticket.getBy("external_id", key);

    if (tickets.length === 0) {
        console.warn(`[WARN] Aucun ticket trouvé avec external_id="${key}"`);
        _ticketCache.set(key, null);
        return null;
    }

    _ticketCache.set(key, tickets[0]);
    return tickets[0];
}


export const importFile3 = async (file) => {
    const text = await file.text();

    checkCSVHeader(text, EXPECTED_HEADERS);

    const rows    = parseCSV(text);
    const results = { created: 0, errors: [] };

    for (const row of rows) {
        try {
            const ref = row.num_ticket?.trim();

            if (!ref) {
                console.warn(`[WARN] Ligne ignorée : num_ticket vide`);
                continue;
            }

            const ticket = await findTicketByRef(ref);

            if (!ticket) {
                console.warn(`[WARN] Ticket ref "${ref}" introuvable — ligne ignorée`);
                results.errors.push({ row: ref, error: `Ticket introuvable (external_id=${ref})` });
                continue;
            }

            const duration   = parseCSVNumber(row.duration_second, 0);
            const cost_time  = parseCSVNumber(row.time_cost,       0);
            const cost_fixed = parseCSVNumber(row.fixed_cost,      0);

            const costPayload = {
                duration,
                cost_time,
                cost_fixed,
            };

            const result = await api.post(
                `Assistance/Ticket/${ticket.id}/Cost`,
                costPayload
            );

            if (result?.error) {
                throw new Error(
                    result.message || `Erreur création coût pour ticket #${ticket.id}`
                );
            }

            console.log(
                `[CREATED] Coût → Ticket #${ticket.id} (ref ${ref}) : ` +
                `duration=${duration}s, cost_time=${cost_time}, cost_fixed=${cost_fixed}`
            );
            results.created++;

        } catch (err) {
            console.error(`[ERROR] Ligne num_ticket="${row.num_ticket}" : ${err.message}`);
            results.errors.push({ row: row.num_ticket, error: err.message });
        }
    }

    console.log(
        `\nImport Feuille 3 terminé : ${results.created} coûts créés, ${results.errors.length} erreurs`
    );
    return results;
};

export default importFile3;