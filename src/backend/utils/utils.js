/**
 * Parse une date au format DD/MM/YYYY et une heure HH:MM
 * en utilisant le fuseau local du navigateur (pas UTC).
 * @param {string} dateStr - ex: "03/06/2026"
 * @param {string} timeStr - ex: "13:45"
 * @returns {Date}
 */
export function parseDDMMYYYY(dateStr, timeStr = "00:00") {
    const [day, month, year] = dateStr.trim().split("/");
    const [hours, minutes]   = timeStr.trim().split(":");
    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        0
    );
}

/**
 * Formate un objet Date en "YYYY-MM-DD HH:MM:SS" (format attendu par GLPI V1).
 * Utilise les méthodes locales pour respecter le fuseau du PC.
 * @param {Date} date
 * @returns {string}
 */
export function toGLPIDateTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
}


export const TICKET_TYPE = {
    incident: 1,
    request:  2,
};

export const TICKET_STATUS = {
    new:                1,
    processing_assigned: 2,
    processing_planned:  3,
    pending:            4,
    solved:             5,
    closed:             6,
};

export const TICKET_PRIORITY = {
    "very low": 1,
    low:        2,
    medium:     3,
    high:       4,
    "very high": 5,
    major:      6,
};

/**
 * Résout une valeur texte vers son entier GLPI.
 * @param {Object} map   - un des maps ci-dessus
 * @param {string} value - valeur brute du CSV
 * @param {number} fallback - valeur par défaut si non trouvée
 * @returns {number}
 */
export function resolveEnum(map, value, fallback) {
    if (!value) return fallback;
    const key = value.trim().toLowerCase();
    return map[key] ?? fallback;
}

export function parseCSVNumber(value, fallback = 0) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return fallback;
    }
    const normalized = String(value).trim().replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? fallback : parsed;
}