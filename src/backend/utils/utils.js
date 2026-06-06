
export function parseDDMMYYYY(dateStr, timeStr = "00:00") {
    const parts = dateStr.trim().split(/[-\/]/);
    let day, month, year;

    if (parts[0].length === 4) {
        // Format YYYY-MM-DD (input HTML)
        [year, month, day] = parts;
    } else {
        // Format DD/MM/YYYY (CSV)
        [day, month, year] = parts;
    }

    const [hours, minutes] = timeStr.trim().split(":");
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), 0);
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

export const TICKET_TYPE = [
    { id: 1, name: "Incident" },
    { id: 2, name: "Request" },
];

export const TICKET_STATUS = [
    { id: 1, name: "New" },
    { id: 2, name: "Processing (Assigned)" },
    { id: 3, name: "Processing (Planned)" },
    { id: 4, name: "Pending" },
    { id: 5, name: "Solved" },
    { id: 6, name: "Closed" },
];

export const TICKET_PRIORITY = [
    { id: 1, name: "Very Low" },
    { id: 2, name: "Low" },
    { id: 3, name: "Medium" },
    { id: 4, name: "High" },
    { id: 5, name: "Very High" },
    { id: 6, name: "Major" },
];

export function getEnumIdByName(arr, value, fallback) {
    if (!value) return fallback;
    const key = value.trim().toLowerCase();
    const found = arr.find(item => item.name.toLowerCase() === key);
    return found?.id ?? fallback;
}

export function getEnumNameById(arr, id) {
    return arr.find(item => item.id === id)?.name ?? null;
}
export function parseCSVNumber(value, fallback = 0) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return fallback;
    }
    const normalized = String(value).trim().replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? fallback : parsed;
}



export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
 

export function isImageFile(filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}
 
