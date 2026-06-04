import Papa from "papaparse";

export function parseCSV(text) {
    const {data, errors} = Papa.parse(text.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: (h) => h.trim().toLowerCase(),
    });

    if (errors.length) {
        const msg = errors.map((e) => `ligne ${e.row} : ${e.message}`).join(", ");
        throw new Error(`Erreur(s) de parsing CSV -> ${msg}`);
    }

    return data;
}


export function getCSVHeader(text) {
    const lignes = text.trim().split('\n')

    return lignes[0].split(',').map(e => e.trim());
}

export function checkCSVHeader(text, realHeader, ignoreCase = true) {
    const header = getCSVHeader(text);

    const norm = (c) =>
        ignoreCase ? String(c).trim().toLowerCase() : String(c).trim();

    const expected = realHeader.map(norm);
    const got = header.map(norm);

    for (let i = 0; i < got.length; i++) {
        if (!expected.includes(got[i])) {
            throw new Error(
                `Erreur: la colonne "${header[i].trim()}" ne correspond à aucune colonne attendue (attendu: ${realHeader.join(", ")})`
            );
        }
    }

    for (let i = 0; i < expected.length; i++) {
        if (!got.includes(expected[i])) {
            throw new Error(
                `Erreur: la colonne obligatoire "${realHeader[i]}" est absente du CSV`
            );
        }
    }
}