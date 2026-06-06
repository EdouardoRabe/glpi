import api from "./api.js";

export function rsqlValue(value) {
        if (typeof value === "number") return String(value);
        const str = String(value);
        if (/[\s,;()=!<>]/.test(str)) return `"${str.replace(/"/g, '\\"')}"`;
        return str;
}

export function clause(column, op, value) {
        if (Array.isArray(value)) {
            const list = value.map(v => rsqlValue(v)).join(",");
            return `${column}${op}(${list})`;
        }
        return `${column}${op}${rsqlValue(value)}`;
}

export function and(...clauses) {
        return clauses.filter(Boolean).join(";");
}

export function or(...clauses) {
        return clauses.filter(Boolean).join(",");
}

export async function fetchAll(queryParams = {}, endpoint, limit) {
        let start = 0;
        const allItems = [];

        while (true) {
            const result = await api.get(endpoint, null, {
                query: { ...queryParams, start, limit: limit },
            });

            if (result?.error) {
                console.warn(`Erreur lors de la récupération des données depuis ${endpoint} (start=${start}, limit=${limit}) :`, result);
                // Nataoko silencieux
            }

            const items = Array.isArray(result) ? result : result?.data ?? [];
            allItems.push(...items);

            if (items.length < limit) break;
            start += limit;
        }

        return allItems;
}