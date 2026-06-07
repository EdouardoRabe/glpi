# Guide des Utils

Fonctions utilitaires disponibles dans `src/backend/utils/`.

---

## Table des matières

1. [utils.js](#1-utilsjs--glpi--dates--enums)
2. [arrayUtils.js](#2-arrayutilsjs)
3. [comparisonUtils.js](#3-comparisonutilsjs)
4. [dateUtils.js](#4-dateutilsjs)
5. [exportUtils.js](#5-exportutilsjs)
6. [moreUtils.js](#6-moreutilsjs)
7. [numberUtils.js](#7-numberutilsjs)
8. [objectUtils.js](#8-objectutilsjs)
9. [stringUtils.js](#9-stringutilsjs)
10. [typeUtils.js](#10-typeutilsjs)
11. [validationUtils.js](#11-validationutilsjs)

---

## 1. utils.js — GLPI / Dates / Enums

Import :
```javascript
import {
    parseDDMMYYYY, toGLPIDateTime,
    TICKET_TYPE, TICKET_STATUS, TICKET_PRIORITY,
    getEnumIdByName, getEnumNameById,
    parseCSVNumber,
} from "../utils/utils";
```

---

### parseDDMMYYYY

Parse une date depuis un input HTML (`YYYY-MM-DD`) ou un CSV (`DD/MM/YYYY`), avec une heure optionnelle.

```javascript
parseDDMMYYYY(dateStr, timeStr?)
```

| Argument | Type | Défaut | Description |
|---|---|---|---|
| `dateStr` | string | — | Date au format `DD/MM/YYYY` ou `YYYY-MM-DD` |
| `timeStr` | string | `"00:00"` | Heure au format `HH:MM` |

**Retour :** `Date`

```javascript
parseDDMMYYYY("03/06/2026", "13:45") // → Date (locale)
parseDDMMYYYY("2026-06-03", "09:00") // → Date (depuis input HTML)
parseDDMMYYYY("03/06/2026")          // → Date à 00:00
```

---

### toGLPIDateTime

Formate un objet `Date` en string attendu par GLPI (`YYYY-MM-DD HH:MM:SS`).

```javascript
toGLPIDateTime(date)
```

| Argument | Type | Description |
|---|---|---|
| `date` | Date | Objet Date JavaScript |

**Retour :** `string`

```javascript
const date = parseDDMMYYYY("03/06/2026", "13:45");
toGLPIDateTime(date) // → "2026-06-03 13:45:00"
```

---

### TICKET_TYPE / TICKET_STATUS / TICKET_PRIORITY

Tableaux de référence `{ id, name }` pour les enums GLPI.

```javascript
TICKET_TYPE     // [{ id: 1, name: "Incident" }, { id: 2, name: "Request" }]
TICKET_STATUS   // [{ id: 1, name: "New" }, ..., { id: 6, name: "Closed" }]
TICKET_PRIORITY // [{ id: 1, name: "Very Low" }, ..., { id: 6, name: "Major" }]
```

Utilisation dans un `<select>` :
```jsx
<select value={type} onChange={(e) => setType(Number(e.target.value))}>
    {TICKET_TYPE.map((t) => (
        <option key={t.id} value={t.id}>{t.name}</option>
    ))}
</select>
```

---

### getEnumIdByName

Trouve l'ID d'un enum à partir de son nom.

```javascript
getEnumIdByName(arr, value, fallback)
```

| Argument | Type | Description |
|---|---|---|
| `arr` | Array | `TICKET_TYPE`, `TICKET_STATUS` ou `TICKET_PRIORITY` |
| `value` | string | Valeur texte (ex: `"Medium"`, `"Incident"`) |
| `fallback` | number | Valeur par défaut si non trouvé |

**Retour :** `number`

```javascript
getEnumIdByName(TICKET_PRIORITY, "Medium", 3)  // → 3
getEnumIdByName(TICKET_TYPE,     "Incident", 1) // → 1
getEnumIdByName(TICKET_STATUS,   "Closed", 1)   // → 6
getEnumIdByName(TICKET_TYPE,     "Inconnu", 1)  // → 1 (fallback)
```

---

### getEnumNameById

Trouve le nom d'un enum à partir de son ID.

```javascript
getEnumNameById(arr, id)
```

| Argument | Type | Description |
|---|---|---|
| `arr` | Array | `TICKET_TYPE`, `TICKET_STATUS` ou `TICKET_PRIORITY` |
| `id` | number | ID à chercher |

**Retour :** `string | null`

```javascript
getEnumNameById(TICKET_STATUS,   1) // → "New"
getEnumNameById(TICKET_PRIORITY, 3) // → "Medium"
getEnumNameById(TICKET_TYPE,     9) // → null
```

---

### parseCSVNumber

Parse une valeur CSV (string) en nombre, en gérant les virgules et les valeurs vides.

```javascript
parseCSVNumber(value, fallback?)
```

```javascript
parseCSVNumber("8,7")  // → 8.7
parseCSVNumber("109")  // → 109
parseCSVNumber("")     // → 0
parseCSVNumber(null)   // → 0
parseCSVNumber("abc", -1) // → -1
```

---

## 2. arrayUtils.js

Import :
```javascript
import { isEmpty, groupBy, chunk, unique, ... } from "../utils/arrayUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `isEmpty(arr)` | Vrai si tableau vide ou non-tableau | `isEmpty([]) → true` |
| `contains(arr, val)` | Vrai si val est dans le tableau | `contains([1,2], 2) → true` |
| `unique(arr)` | Supprime les doublons | `unique([1,1,2]) → [1,2]` |
| `findDuplicates(arr)` | Retourne les doublons | `findDuplicates([1,1,2]) → [1]` |
| `groupBy(arr, key)` | Groupe par propriété ou fonction | voir ci-dessous |
| `flatten(arr, depth?)` | Aplatit un tableau | `flatten([[1],[2]]) → [1,2]` |
| `chunk(arr, size)` | Divise en sous-tableaux | `chunk([1,2,3,4], 2) → [[1,2],[3,4]]` |
| `intersection(a, b)` | Éléments communs | `intersection([1,2],[2,3]) → [2]` |
| `union(a, b)` | Fusion sans doublons | `union([1,2],[2,3]) → [1,2,3]` |
| `difference(a, b)` | Éléments dans a mais pas b | `difference([1,2,3],[2]) → [1,3]` |
| `max(arr)` | Maximum numérique | `max([1,5,3]) → 5` |
| `min(arr)` | Minimum numérique | `min([1,5,3]) → 1` |
| `sum(arr)` | Somme | `sum([1,2,3]) → 6` |
| `average(arr)` | Moyenne | `average([1,2,3]) → 2` |
| `first(arr)` | Premier élément | `first([1,2,3]) → 1` |
| `last(arr)` | Dernier élément | `last([1,2,3]) → 3` |
| `shuffle(arr)` | Mélange aléatoire | `shuffle([1,2,3]) → [2,1,3]` |

```javascript
// groupBy
const tickets = [
    { id: 1, status: "New" },
    { id: 2, status: "Closed" },
    { id: 3, status: "New" },
];
groupBy(tickets, "status")
// → { New: [{id:1,...},{id:3,...}], Closed: [{id:2,...}] }

// chunk — utile pour les imports par lots
chunk([1,2,3,4,5], 2) // → [[1,2],[3,4],[5]]
```

---

## 3. comparisonUtils.js

Import :
```javascript
import { compareDates, compareNumbers, getYear, splitDate } from "../utils/comparisonUtils";
```

| Fonction | Description | Retour |
|---|---|---|
| `compareDates(d1, d2)` | Compare deux dates | `-1 / 0 / 1` |
| `compareYears(d1, d2)` | Compare les années | `-1 / 0 / 1` |
| `compareMonths(d1, d2)` | Compare les mois | `-1 / 0 / 1` |
| `compareDays(d1, d2)` | Compare les jours | `-1 / 0 / 1` |
| `compareNumbers(n1, n2)` | Compare deux nombres | `-1 / 0 / 1` |
| `compareTexts(t1, t2)` | Compare deux textes (sensible casse) | `-1 / 0 / 1` |
| `compareTextsIgnoreCase(t1, t2)` | Compare deux textes (insensible casse) | `-1 / 0 / 1` |
| `getYear(date)` | Extrait l'année | `number` |
| `getMonth(date)` | Extrait le mois (1-12) | `number` |
| `getDay(date)` | Extrait le jour (1-31) | `number` |
| `splitDate(date)` | Décompose une date | `{year, month, day, hours, minutes, seconds}` |
| `areDatesEqual(d1, d2)` | Dates identiques ? | `boolean` |
| `areTextsEqual(t1, t2)` | Textes identiques ? | `boolean` |

```javascript
// Trier des tickets par date
tickets.sort((a, b) => compareDates(a.date_creation, b.date_creation));

// Extraire composants
const { year, month, day } = splitDate("2026-06-03T13:45:00");
// → { year: 2026, month: 6, day: 3, hours: 13, minutes: 45, seconds: 0 }
```

---

## 4. dateUtils.js

Import :
```javascript
import { formatToYYYYMMDD_HHmmss, formatDateFlexible } from "../utils/dateUtils";
```

| Fonction | Description | Exemple de sortie |
|---|---|---|
| `formatToYYYYMMDD(val)` | `YYYY-MM-DD` | `"2026-06-03"` |
| `formatToDDMMYYYY(val)` | `DD-MM-YYYY` | `"03-06-2026"` |
| `formatToDDMMYYYY_slash(val)` | `DD/MM/YYYY` | `"03/06/2026"` |
| `formatToYYYYMMDD_HHmm(val)` | `YYYY-MM-DD HH:mm` | `"2026-06-03 13:45"` |
| `formatToYYYYMMDD_HHmmss(val)` | `YYYY-MM-DD HH:mm:ss` | `"2026-06-03 13:45:00"` |
| `formatToISO(val)` | ISO 8601 | `"2026-06-03T13:45:00.000Z"` |
| `formatToLocale(val, locale?)` | Format localisé | `"3 juin 2026"` |
| `formatDateFlexible(val, pattern)` | Pattern libre | voir ci-dessous |

```javascript
// Pattern libre
formatDateFlexible("2026-06-03", "DD/MM/YYYY") // → "03/06/2026"
formatDateFlexible("2026-06-03", "YYYY/MM/DD HH:mm") // → "2026/06/03 00:00"

// Locale
formatToLocale("2026-06-03", "fr-FR", { dateStyle: "long" })
// → "3 juin 2026"
```

> Toutes ces fonctions acceptent : `string`, `Date`, ou timestamp.

---

## 5. exportUtils.js

Import :
```javascript
import { exportRowsToCSV, exportRowsToPDF } from "../utils/exportUtils";
```

### exportRowsToCSV

Télécharge un tableau de données en fichier CSV.

```javascript
exportRowsToCSV({ rows, columns, filename?, delimiter? })
```

```javascript
exportRowsToCSV({
    rows: computers,
    columns: [
        { key: "name",         label: "Nom" },
        { key: "serial",       label: "Numéro de série" },
        { key: "status",       label: "État", value: (row) => row.status?.name },
        { key: "location",     label: "Lieu", value: (row) => row.location?.name },
    ],
    filename: "computers_export",
    delimiter: ";",
});
```

### exportRowsToPDF

Télécharge un tableau de données en PDF.

```javascript
exportRowsToPDF({ rows, columns, filename?, title?, orientation? })
```

```javascript
exportRowsToPDF({
    rows: tickets, //Objet simple
    columns: [
        { key: "id",     label: "ID" },
        { key: "name",   label: "Titre" },
        { key: "status", label: "Statut", value: (row) => row.status?.name },
    ],
    filename: "tickets_export",
    title: "Liste des tickets",
    orientation: "landscape", // "portrait" ou "landscape"
});

const exportPDF = () => {
    exportRowsToPDF({
        rows: filteredTickets.map(({ ticket }) => ticket), // Objet complexe
        columns: [
            { key: "id",     label: "ID" },
            { key: "name",   label: "Titre" },
            { key: "status", label: "Statut", value: (row) => row.status?.name },
        ],
        filename: "tickets_export",
        title: `Liste des tickets ${filteredTickets.length}`,
        orientation: "landscape",
    });
    console.log("Fichier pdf exporter");
}

<div>
    <button onClick={() => exportPDF()}>EXPORT PDF</button>
</div>
```

---

## 6. moreUtils.js

Import :
```javascript
import { capitalize, slugify, truncate, addDays } from "../utils/moreUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `capitalize(str)` | Première lettre en majuscule | `capitalize("bonjour") → "Bonjour"` |
| `titleCase(str)` | Chaque mot en majuscule | `titleCase("hello world") → "Hello World"` |
| `slugify(str)` | URL-friendly | `slugify("Héllo Wörld") → "hello-world"` |
| `truncate(str, len, suffix?)` | Coupe à longueur | `truncate("Hello World", 5) → "Hello..."` |
| `escapeHtml(str)` | Échappe le HTML | `escapeHtml("<p>") → "&lt;p&gt;"` |
| `addDays(date, days)` | Ajoute des jours | `addDays(new Date(), 7)` |
| `addMonths(date, months)` | Ajoute des mois | `addMonths(new Date(), 3)` |
| `startOfDay(date)` | Début du jour (00:00:00) | `startOfDay(new Date())` |
| `endOfDay(date)` | Fin du jour (23:59:59) | `endOfDay(new Date())` |
| `isPalindrome(str)` | Palindrome ? | `isPalindrome("radar") → true` |

---

## 7. numberUtils.js

Import :
```javascript
import { round, percentage, clamp, formatNumber } from "../utils/numberUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `round(num, decimals?)` | Arrondit | `round(8.765, 2) → 8.77` |
| `ceil(num)` | Arrondit vers le haut | `ceil(8.1) → 9` |
| `floor(num)` | Arrondit vers le bas | `floor(8.9) → 8` |
| `clamp(num, min, max)` | Limite entre min et max | `clamp(150, 0, 100) → 100` |
| `percentage(val, total, dec?)` | Calcule un % | `percentage(3, 10) → 30` |
| `percentageValue(pct, total)` | Valeur depuis un % | `percentageValue(30, 100) → 30` |
| `abs(num)` | Valeur absolue | `abs(-5) → 5` |
| `isEven(num)` | Pair ? | `isEven(4) → true` |
| `isOdd(num)` | Impair ? | `isOdd(3) → true` |
| `isPrime(num)` | Premier ? | `isPrime(7) → true` |
| `gcd(a, b)` | PGCD | `gcd(12, 8) → 4` |
| `lcm(a, b)` | PPCM | `lcm(4, 6) → 12` |
| `formatNumber(num, dec?, decSep?, thousSep?)` | Formate avec séparateurs | `formatNumber(1234567.5, 2) → "1 234 567,50"` |

---

## 8. objectUtils.js

Import :
```javascript
import { pick, omit, deepClone, groupBy } from "../utils/objectUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `isEmpty(obj)` | Objet vide ? | `isEmpty({}) → true` |
| `hasProperty(obj, key)` | A une propriété ? | `hasProperty({a:1}, "a") → true` |
| `getDeepProperty(obj, path, def?)` | Accès profond | `getDeepProperty(obj, "status.name")` |
| `pick(obj, keys)` | Garde seulement certaines clés | voir ci-dessous |
| `omit(obj, keys)` | Exclut certaines clés | voir ci-dessous |
| `merge(obj1, obj2)` | Fusionne deux objets | `merge({a:1}, {b:2}) → {a:1, b:2}` |
| `clone(obj)` | Clone superficiel | `clone({a:1})` |
| `deepClone(obj)` | Clone profond | `deepClone({a:{b:1}})` |
| `equals(obj1, obj2)` | Égalité superficielle | `equals({a:1}, {a:1}) → true` |
| `invert(obj)` | Inverse clés/valeurs | `invert({a:"x"}) → {x:"a"}` |
| `mapValues(obj, fn)` | Transforme les valeurs | voir ci-dessous |

```javascript
// pick — garder seulement certains champs
const ticket = { id: 1, name: "Bug", content: "...", is_deleted: false };
pick(ticket, ["id", "name"]) // → { id: 1, name: "Bug" }

// omit — exclure certains champs
omit(ticket, ["is_deleted", "content"]) // → { id: 1, name: "Bug" }

// getDeepProperty
const computer = { status: { id: 1, name: "En production" } };
getDeepProperty(computer, "status.name")        // → "En production"
getDeepProperty(computer, "location.name", "—") // → "—" (default)

// mapValues
mapValues({ a: 1, b: 2 }, (v) => v * 10) // → { a: 10, b: 20 }
```

---

## 9. stringUtils.js

Import :
```javascript
import { toString, joinValues, truncate, padLeft } from "../utils/stringUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `toString(val)` | Convertit en string | `toString(null) → ""` |
| `toStringFormatted(val, indent?)` | Convertit avec indentation JSON | `toStringFormatted({a:1}) → '{\n  "a": 1\n}'` |
| `joinValues(arr, sep?)` | Joint un tableau en string | `joinValues([1,2,3], " - ") → "1 - 2 - 3"` |
| `repeatString(str, n)` | Répète | `repeatString("ab", 3) → "ababab"` |
| `padLeft(str, len, char?)` | Pad à gauche | `padLeft("5", 3, "0") → "005"` |
| `padRight(str, len, char?)` | Pad à droite | `padRight("5", 3, "0") → "500"` |
| `replaceAll(str, search, rep)` | Remplace tout | `replaceAll("a-b-c", "-", "_") → "a_b_c"` |
| `startsWith(str, prefix, cs?)` | Commence par ? | `startsWith("Hello", "He") → true` |
| `endsWith(str, suffix, cs?)` | Finit par ? | `endsWith("Hello", "lo") → true` |
| `substring(str, start, end?)` | Extrait | `substring("Hello", 1, 3) → "el"` |
| `split(str, sep?, limit?)` | Divise | `split("a,b,c", ",") → ["a","b","c"]` |

---

## 10. typeUtils.js

Import :
```javascript
import { isString, isArray, isNullOrUndefined, isValidEmail } from "../utils/typeUtils";
```

| Fonction | Vérifie | Exemple |
|---|---|---|
| `isString(val)` | string | `isString("a") → true` |
| `isNumber(val)` | number fini | `isNumber(42) → true` |
| `isBoolean(val)` | boolean | `isBoolean(false) → true` |
| `isArray(val)` | tableau | `isArray([]) → true` |
| `isObject(val)` | objet (non null, non array, non Date) | `isObject({}) → true` |
| `isNull(val)` | null | `isNull(null) → true` |
| `isUndefined(val)` | undefined | `isUndefined(undefined) → true` |
| `isNullOrUndefined(val)` | null ou undefined | `isNullOrUndefined(null) → true` |
| `isDefined(val)` | ni null ni undefined | `isDefined(0) → true` |
| `isDate(val)` | Date valide | `isDate(new Date()) → true` |
| `isEmptyString(val)` | string vide | `isEmptyString("  ") → true` |
| `isEmptyValue(val)` | null/undefined/""/[]/\{\} | `isEmptyValue([]) → true` |
| `isValidEmail(val)` | email valide | `isValidEmail("a@b.com") → true` |
| `isValidUrl(val)` | URL valide | `isValidUrl("https://glpi.local") → true` |
| `isUUID(val)` | UUID valide | `isUUID("f47ac10b-...") → true` |
| `isValidJSON(val)` | JSON parseable | `isValidJSON('{"a":1}') → true` |

---

## 11. validationUtils.js

Import :
```javascript
import { validateRequiredProperties, validateLength } from "../utils/validationUtils";
```

| Fonction | Description | Exemple |
|---|---|---|
| `validateEmail(email)` | Email valide ? | `validateEmail("a@b.com") → true` |
| `validateUrl(url)` | URL valide ? | `validateUrl("https://...") → true` |
| `validateDate(date)` | Date valide ? | `validateDate("2026-06-03") → true` |
| `validateNumber(val)` | Nombre valide ? | `validateNumber("42") → true` |
| `validateInteger(val)` | Entier valide ? | `validateInteger(3.5) → false` |
| `validateNonNegativeInteger(val)` | Entier >= 0 ? | `validateNonNegativeInteger(-1) → false` |
| `validateLength(str, min, max)` | Longueur valide ? | `validateLength("Hi", 1, 10) → true` |
| `validateStrongPassword(pwd)` | Mot de passe fort ? | 8+ chars, majuscule, chiffre, spécial |
| `validatePattern(val, regex)` | Correspond au regex ? | `validatePattern("ABC", /^[A-Z]+$/) → true` |
| `validateInList(val, list)` | Dans la liste ? | `validateInList(2, [1,2,3]) → true` |
| `validateRequiredProperties(obj, keys)` | Propriétés requises présentes ? | voir ci-dessous |

```javascript
// validateRequiredProperties — valider un formulaire
const ticket = { name: "Bug", content: "", type: 1 };
validateRequiredProperties(ticket, ["name", "content", "type"])
// → false (content est vide)

validateRequiredProperties(ticket, ["name", "type"])
// → true
```
