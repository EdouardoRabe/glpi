# Guide Complet: Les Strings en JavaScript

Ce guide couvre toutes les méthodes et propriétés essentielles des strings en JavaScript avec des exemples pratiques.

## Table des matières

1. [Propriétés](#propriétés)
2. [Cas et conversion](#cas-et-conversion)
3. [Recherche et vérification](#recherche-et-vérification)
4. [Extraction et découpe](#extraction-et-découpe)
5. [Remplacement](#remplacement)
6. [Répétition et remplissage](#répétition-et-remplissage)
7. [Séparation et division](#séparation-et-division)
8. [Trim et whitespace](#trim-et-whitespace)
9. [Comparaison](#comparaison)
10. [Cas d'usage courants](#cas-dusage-courants)

---

## Propriétés

### `length` — Longueur de la string

```javascript
const text = "Hello World";
console.log(text.length); // 11

// Cas d'usage: Vérifier si une string est vide
if (text.length === 0) {
  console.log("String vide");
}

if (text.length > 5) {
  console.log("String longue");
}
```

---

## Cas et conversion

### `toLowerCase()` — Convertir en minuscules

```javascript
const text = "Hello World";
console.log(text.toLowerCase()); // "hello world"

// Cas d'usage: Filtrage case-insensitive
const searchTerm = "HELLO";
const assets = ["Hello Phone", "World Item"];
const results = assets.filter(asset => 
  asset.toLowerCase().includes(searchTerm.toLowerCase())
);
// Retourne: ["Hello Phone"]
```

### `toUpperCase()` — Convertir en MAJUSCULES

```javascript
const text = "Hello World";
console.log(text.toUpperCase()); // "HELLO WORLD"

// Cas d'usage: Afficher des codes en majuscules
const code = "abc123";
console.log(`Code: ${code.toUpperCase()}`); // "Code: ABC123"
```

### `charAt(index)` — Obtenir le caractère à un index

```javascript
const text = "Hello";
console.log(text.charAt(0)); // "H"
console.log(text.charAt(1)); // "e"
console.log(text.charAt(10)); // "" (rien si hors limites)

// Cas d'usage: Première lettre en majuscule
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
console.log(capitalize("hello")); // "Hello"
```

### `charCodeAt(index)` — Code Unicode

```javascript
const text = "A";
console.log(text.charCodeAt(0)); // 65

// Cas d'usage: Vérifier si c'est une lettre
function isLetter(char) {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}
```

---

## Recherche et vérification

### `includes(searchString)` — Vérifier si la string contient un texte

```javascript
const text = "Hello World";
console.log(text.includes("World")); // true
console.log(text.includes("world")); // false (case-sensitive)
console.log(text.includes("xyz")); // false

// Cas d'usage: Filtrage LIKE (utilisé dans FOAssetsList)
const assets = [
  { name: "Dell Monitor" },
  { name: "HP Computer" },
  { name: "Dell Keyboard" }
];
const searchTerm = "dell";
const filtered = assets.filter(asset =>
  asset.name.toLowerCase().includes(searchTerm.toLowerCase())
);
// Retourne: [{ name: "Dell Monitor" }, { name: "Dell Keyboard" }]
```

### `startsWith(searchString)` — Commence par

```javascript
const url = "https://example.com";
console.log(url.startsWith("https")); // true
console.log(url.startsWith("http")); // false

// Cas d'usage: Vérifier le protocole
if (url.startsWith("http://") || url.startsWith("https://")) {
  console.log("URL valide");
}
```

### `endsWith(searchString)` — Finit par

```javascript
const filename = "document.pdf";
console.log(filename.endsWith(".pdf")); // true
console.log(filename.endsWith(".doc")); // false

// Cas d'usage: Vérifier l'extension
const validExtensions = [".pdf", ".xlsx", ".csv"];
const isValid = validExtensions.some(ext => filename.endsWith(ext));
```

### `indexOf(searchString)` — Position du texte

```javascript
const text = "Hello World Hello";
console.log(text.indexOf("Hello")); // 0 (première occurrence)
console.log(text.indexOf("World")); // 6
console.log(text.indexOf("xyz")); // -1 (pas trouvé)

// Cas d'usage: Vérifier si trouvé et obtenir la position
if (text.indexOf("World") !== -1) {
  console.log("World trouvé!");
}

// Chercher la deuxième occurrence
const firstIndex = text.indexOf("Hello");
const secondIndex = text.indexOf("Hello", firstIndex + 1);
console.log(secondIndex); // 12
```

### `lastIndexOf(searchString)` — Dernière position

```javascript
const text = "Hello World Hello";
console.log(text.lastIndexOf("Hello")); // 12 (dernière occurrence)
console.log(text.lastIndexOf("World")); // 6
```

### `search(regex)` — Chercher avec une regex

```javascript
const text = "Contact: hello@example.com";
console.log(text.search(/@/)); // 17

const text2 = "Price: $99.99";
console.log(text2.search(/\$/)); // 7
```

---

## Extraction et découpe

### `slice(start, end)` — Extraire une partie

```javascript
const text = "Hello World";
console.log(text.slice(0, 5)); // "Hello"
console.log(text.slice(6)); // "World"
console.log(text.slice(-5)); // "World" (5 derniers caractères)
console.log(text.slice(-5, -1)); // "Worl"

// Cas d'usage: Tronquer un texte
function truncate(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
console.log(truncate("Hello World", 8)); // "Hello..."
```

### `substring(start, end)` — Alternative à slice

```javascript
const text = "Hello World";
console.log(text.substring(0, 5)); // "Hello"
console.log(text.substring(6, 11)); // "World"

// Différence avec slice: substring ne supporte pas les index négatifs
console.log(text.slice(-5)); // "World"
console.log(text.substring(-5)); // "Hello World" (traite -5 comme 0)
```

### `substr(start, length)` — Extraire par longueur

```javascript
const text = "Hello World";
console.log(text.substr(0, 5)); // "Hello"
console.log(text.substr(6, 5)); // "World"

// ⚠️ DEPRECATED: Utiliser slice() à la place
```

---

## Remplacement

### `replace(searchValue, replaceValue)` — Remplacer première occurrence

```javascript
const text = "Hello World Hello";
console.log(text.replace("Hello", "Hi")); // "Hi World Hello" (première seule)
console.log(text.replace(/Hello/g, "Hi")); // "Hi World Hi" (avec regex globale)

// Cas d'usage: Remplacer dans un formulaire
const sentence = "Hello [NAME], welcome!";
const name = "Alice";
const result = sentence.replace("[NAME]", name);
console.log(result); // "Hello Alice, welcome!"
```

### `replaceAll(searchValue, replaceValue)` — Remplacer toutes les occurrences

```javascript
const text = "Hello World Hello";
console.log(text.replaceAll("Hello", "Hi")); // "Hi World Hi"

// Cas d'usage: Nettoyer un texte
const dirty = "apple, apple, apple";
const clean = dirty.replaceAll("apple", "orange");
console.log(clean); // "orange, orange, orange"

// Alternative avec regex
console.log(text.replace(/Hello/g, "Hi")); // "Hi World Hi"
```

---

## Répétition et remplissage

### `repeat(count)` — Répéter la string

```javascript
const text = "ab";
console.log(text.repeat(3)); // "ababab"
console.log(text.repeat(0)); // ""

// Cas d'usage: Créer des séparateurs
console.log("=".repeat(20)); // "===================="
console.log("- ".repeat(5)); // "- - - - - "
```

### `padStart(targetLength, padString)` — Remplir au début

```javascript
const num = "5";
console.log(num.padStart(3, "0")); // "005"

// Cas d'usage: Formater des numéros de référence
const id = "123";
console.log(id.padStart(5, "REF-")); // "REF-123" (mieux: REF-00123)

// Meilleur exemple
console.log(num.padStart(5, "0")); // "00005"
```

### `padEnd(targetLength, padString)` — Remplir à la fin

```javascript
const text = "Hi";
console.log(text.padEnd(5, ".")); // "Hi..."

// Cas d'usage: Alignement dans des listes
const items = ["Item", "Another"];
items.forEach(item => console.log(item.padEnd(15, ".")));
// "Item.............."
// "Another..........."
```

---

## Séparation et division

### `split(separator)` — Diviser en array

```javascript
const text = "Hello World Hello";
console.log(text.split(" ")); // ["Hello", "World", "Hello"]
console.log(text.split("")); // ["H", "e", "l", "l", "o", ...]
console.log(text.split("l")); // ["He", "", "o Wor", "d He", "", "o"]

// Cas d'usage: Parser un CSV
const csv = "John,25,Paris";
const [name, age, city] = csv.split(",");
console.log(name, age, city); // "John" "25" "Paris"

// Avec limite
console.log(text.split(" ", 2)); // ["Hello", "World"]
```

---

## Trim et whitespace

### `trim()` — Supprimer les espaces aux extrémités

```javascript
const text = "  Hello World  ";
console.log(text.trim()); // "Hello World"
console.log(`|${text.trim()}|`); // "|Hello World|"

// Cas d'usage: Nettoyer les inputs utilisateur
const userInput = "  john@example.com  ";
const email = userInput.trim();
console.log(email); // "john@example.com"
```

### `trimStart()` / `trimLeft()` — Trim au début

```javascript
const text = "  Hello  ";
console.log(text.trimStart()); // "Hello  "
console.log(text.trimLeft()); // "Hello  " (alias)
```

### `trimEnd()` / `trimRight()` — Trim à la fin

```javascript
const text = "  Hello  ";
console.log(text.trimEnd()); // "  Hello"
console.log(text.trimRight()); // "  Hello" (alias)
```

---

## Comparaison

### `localeCompare(compareString)` — Comparer deux strings

```javascript
console.log("a".localeCompare("b")); // -1 (a < b)
console.log("b".localeCompare("a")); // 1 (b > a)
console.log("a".localeCompare("a")); // 0 (égal)

// Cas d'usage: Trier un array de strings
const names = ["Charlie", "Alice", "Bob"];
names.sort((a, b) => a.localeCompare(b));
console.log(names); // ["Alice", "Bob", "Charlie"]
```

### Comparaison simple `===`

```javascript
const a = "hello";
const b = "hello";
console.log(a === b); // true

console.log("hello" === "Hello"); // false (case-sensitive)
console.log("hello".toLowerCase() === "Hello".toLowerCase()); // true
```

---

## Cas d'usage courants

### 1. Filtrage LIKE (utilisé dans FOAssetsList)

```javascript
const assets = [
  { name: "Dell Monitor 24\"" },
  { name: "HP Computer" },
  { name: "Dell Keyboard" }
];

const searchTerm = "dell";
const filtered = assets.filter(asset =>
  asset.name.toLowerCase().includes(searchTerm.toLowerCase())
);
// ✅ Retourne: [{ name: "Dell Monitor 24\"" }, { name: "Dell Keyboard" }]
```

### 2. Validation d'email

```javascript
function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}

// Meilleur: avec regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### 3. Capitaliser un texte

```javascript
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

console.log(capitalize("hello world")); // "Hello world"
console.log(capitalize("HELLO")); // "Hello"
```

### 4. Formater un numéro de téléphone

```javascript
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, ""); // Supprimer tout sauf chiffres
  return `+33 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
}

console.log(formatPhone("0123456789")); // "+33 123 456 789"
```

### 5. Extraire le domaine d'une email

```javascript
function extractDomain(email) {
  return email.slice(email.indexOf("@") + 1);
}

console.log(extractDomain("john@gmail.com")); // "gmail.com"
```

### 6. Vérifier si une string commence et finit par le même caractère

```javascript
function hasSameEnds(text) {
  return text.charAt(0) === text.charAt(text.length - 1);
}

console.log(hasSameEnds("racecar")); // true
console.log(hasSameEnds("hello")); // false
```

### 7. Inverser une string

```javascript
function reverse(text) {
  return text.split("").reverse().join("");
}

console.log(reverse("hello")); // "olleh"

// Alternative plus courte
const reverse2 = (text) => [...text].reverse().join("");
```

### 8. Compter les occurrences d'un caractère

```javascript
function countOccurrences(text, char) {
  return text.split(char).length - 1;
}

console.log(countOccurrences("hello world", "l")); // 3

// Alternative
function countOccurrences2(text, char) {
  return text.match(new RegExp(char, "g"))?.length || 0;
}
```

### 9. Créer un slug (URL-friendly)

```javascript
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

console.log(createSlug("Hello World 2024!")); // "hello-world-2024"
```

### 10. Vérifier si une string est un palindrome

```javascript
function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/\s/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("A man a plan a canal Panama")); // true
```

---

## Tableau récapitulatif

| Méthode | Objectif | Exemple |
|---------|----------|---------|
| `toLowerCase()` | Minuscules | `"HELLO".toLowerCase()` → `"hello"` |
| `toUpperCase()` | Majuscules | `"hello".toUpperCase()` → `"HELLO"` |
| `includes()` | Contient | `"hello".includes("ell")` → `true` |
| `startsWith()` | Commence par | `"hello".startsWith("he")` → `true` |
| `endsWith()` | Finit par | `"hello".endsWith("lo")` → `true` |
| `indexOf()` | Position | `"hello".indexOf("l")` → `2` |
| `slice()` | Extraire | `"hello".slice(1, 4)` → `"ell"` |
| `split()` | Diviser | `"a,b".split(",")` → `["a", "b"]` |
| `replace()` | Remplacer 1ère | `"hello".replace("l", "L")` → `"heLlo"` |
| `replaceAll()` | Remplacer tout | `"hello".replaceAll("l", "L")` → `"heLLo"` |
| `trim()` | Supprimer espaces | `" hello ".trim()` → `"hello"` |
| `repeat()` | Répéter | `"ab".repeat(3)` → `"ababab"` |
| `padStart()` | Remplir début | `"5".padStart(3, "0")` → `"005"` |
| `length` | Longueur | `"hello".length` → `5` |

---

## Tips de performance

### ❌ Lent: Multiples toLowerCase() pour chaque comparaison
```javascript
const searchTerm = "HELLO";
const assets = ["Hello", "hello", "HELLO"];

// ❌ Appelle toLowerCase() 3 fois
const filtered = assets.filter(asset =>
  asset.toLowerCase() === searchTerm.toLowerCase()
);
```

### ✅ Rapide: toLowerCase() une seule fois
```javascript
const searchTerm = "hello";
const assets = ["Hello", "hello", "HELLO"];

// ✅ Mieux: normalize une fois
const filtered = assets.filter(asset =>
  asset.toLowerCase() === searchTerm
);
```

---

Besoin d'aide pour appliquer une méthode spécifique? 👍
