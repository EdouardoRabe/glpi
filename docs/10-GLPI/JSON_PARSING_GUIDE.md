# Guide du Parsing JSON ↔ JavaScript

## 📌 Introduction

Quand on travaille avec l'API GLPI, on reçoit des données en JSON (texte) et on doit les transformer en objets JavaScript pour les manipuler. Et inversement, on envoie des objets JavaScript que Axios transforme en JSON.

Ce guide explique comment gérer les conversions et les pièges courants.

---

## 🔄 Parsing JSON vers JavaScript

### Cas 1 : Axios gère tout automatiquement

Quand on utilise Axios, la plupart du temps on n'a rien à faire :

```javascript
// ❌ INCORRECT - ne pas faire ça
const response = await axios.get("http://glpi.local/api.php/v2/Ticket")
const jsonString = response.data  // Ce n'est PAS une string !
const parsed = JSON.parse(jsonString)  // ❌ Erreur : response.data est déjà un objet

// ✅ CORRECT
const response = await axios.get("http://glpi.local/api.php/v2/Ticket")
const tickets = response.data  // C'est déjà un objet JavaScript
console.log(tickets[0].name)  // Accès direct
```

**Pourquoi ?** Axios a un intercepteur qui fait `JSON.parse()` automatiquement sur le `Content-Type: application/json`.

---

### Cas 2 : Vous recevez une string JSON brute

Si pour une raison quelconque vous avez une string JSON :

```javascript
// Vous avez une string JSON brute
const jsonString = '{"id": 123, "name": "Mon Ticket", "status": 2}'

// Convertir en objet JavaScript
const ticket = JSON.parse(jsonString)

console.log(ticket.id)    // 123
console.log(ticket.name)  // "Mon Ticket"

// Accéder aux propriétés
if (ticket.status === 2) {
  console.log("Ouvert")
}
```

**Points importants :**
- Les clés DOIVENT être entre guillemets dans la string JSON
- Les strings JSON doivent utiliser des guillemets doubles `"`, pas simples `'`
- Les valeurs `null`, `true`, `false` sont valides en JSON

---

### Cas 3 : Gérer les erreurs de parsing

```javascript
const maybJsonString = '{"id": 123 ERREUR}'  // JSON invalide

try {
  const obj = JSON.parse(maybJsonString)
} catch (error) {
  console.error("JSON invalide :", error.message)
  // Affichage : "JSON invalide : Unexpected token E in JSON at position 13"
}
```

---

## 🔄 Parsing JavaScript vers JSON

### Cas 1 : Axios gère tout automatiquement

Quand on envoie une requête POST/PUT avec des données :

```javascript
// ❌ INCORRECT - ne pas faire ça
const ticket = { name: "Mon Ticket", content: "Description" }
const jsonString = JSON.stringify(ticket)
await axios.post("http://glpi.local/api.php/v2/Ticket", jsonString)
// ❌ Vous envoyez une string, pas un objet

// ✅ CORRECT
const ticket = { name: "Mon Ticket", content: "Description" }
await axios.post("http://glpi.local/api.php/v2/Ticket", ticket)
// Axios fait JSON.stringify() automatiquement
```

**Pourquoi ?** Axios a un intercepteur qui :
1. Appelle `JSON.stringify()` sur les données
2. Ajoute le header `Content-Type: application/json`

---

### Cas 2 : Vous devez envoyer une string JSON brute

Rarement utile, mais si nécessaire :

```javascript
const ticket = { name: "Mon Ticket", content: "Description" }

// Convertir en string JSON
const jsonString = JSON.stringify(ticket)
// jsonString = '{"name":"Mon Ticket","content":"Description"}'

// Envoyer
await axios.post("http://glpi.local/api.php/v2/Ticket", jsonString)
```

---

## 📊 Structures de données courantes GLPI

### Ticket simple

```javascript
// ✅ Objet JavaScript
const ticket = {
  id: 123,
  name: "Problème d'accès",
  content: "Je n'arrive pas à accéder au réseau",
  type: 1,  // 1=Incident, 2=Demande
  status: 2,  // 1=Nouveau, 2=Assigné, etc.
  urgency: 4,
  impact: 2,
  priority: 5,
  date_creation: "2024-06-03 10:30:00",
  date_mod: "2024-06-03 14:45:00",
  // ...
}

// 🔄 Convertir en JSON pour envoyer à l'API
const jsonString = JSON.stringify(ticket)
// jsonString = '{"id":123,"name":"Problème d\'accès",...}'
```

### Collection de tickets

```javascript
// Réponse de l'API (déjà objet après axios)
const response = {
  data: [
    { id: 1, name: "Ticket 1", status: 2 },
    { id: 2, name: "Ticket 2", status: 5 },
    { id: 3, name: "Ticket 3", status: 1 }
  ],
  totalcount: 342,
  count: 3
}

// Accéder aux tickets
response.data.forEach(ticket => {
  console.log(`${ticket.id}: ${ticket.name}`)
})

// ✅ Itérer et transformer
const ticketNames = response.data.map(t => t.name)
// ["Ticket 1", "Ticket 2", "Ticket 3"]
```

### Ticket créé (réponse POST)

```javascript
// Après création
const createdTicket = {
  id: 456,  // ID généré par GLPI
  name: "Nouveau ticket",
  content: "Description...",
  date_creation: "2024-06-03 15:00:00",
  status: 1,
  // ... autres champs avec valeurs par défaut
}

// Utiliser l'ID retourné
console.log(`Ticket créé avec l'ID : ${createdTicket.id}`)
```

---

## ⚠️ Pièges courants

### Piège 1 : Les dates sont des strings, pas des objets Date

```javascript
// ❌ INCORRECT
const ticket = { date_creation: "2024-06-03 10:30:00" }
const jour = ticket.date_creation.getDate()  // ❌ Erreur : getDate n'existe pas

// ✅ CORRECT
const ticket = { date_creation: "2024-06-03 10:30:00" }
const date = new Date(ticket.date_creation)
const jour = date.getDate()
```

### Piège 2 : Vérifier les valeurs null/undefined

```javascript
// ❌ INCORRECT
const ticket = { assigned_to: null }
const name = ticket.assigned_to.name  // ❌ Erreur : Impossible d'accéder à .name

// ✅ CORRECT
const ticket = { assigned_to: null }
const name = ticket.assigned_to?.name  // undefined (safe navigation)

// Ou vérifier d'abord
if (ticket.assigned_to) {
  const name = ticket.assigned_to.name
}
```

### Piège 3 : Les IDs sont des nombres, pas des strings

```javascript
// Dans une réponse de l'API
const ticket = { id: 123, name: "..." }  // id est un nombre

// ❌ INCORRECT (comparaison stricte échoue)
if (ticket.id === "123") { }  // false

// ✅ CORRECT
if (ticket.id === 123) { }  // true
if (String(ticket.id) === "123") { }  // true aussi
```

### Piège 4 : Les tableaux vides vs null

```javascript
// ❌ INCORRECT
const tickets = null
tickets.length  // ❌ Erreur : Impossible d'accéder à .length

// ✅ CORRECT
const tickets = []  // Toujours un tableau, même vide
if (tickets.length === 0) {
  console.log("Aucun ticket")
}

// Sécuriser
const ticketList = null
const count = ticketList?.length || 0  // 0
```

---

## 🛠️ Outils utiles

### JSON.stringify() avec formatage

```javascript
const ticket = { id: 123, name: "Test" }

// Compact (par défaut)
JSON.stringify(ticket)
// '{"id":123,"name":"Test"}'

// Lisible (avec indentation)
JSON.stringify(ticket, null, 2)
// {
//   "id": 123,
//   "name": "Test"
// }
```

### JSON.stringify() avec filtrage

```javascript
const ticket = { id: 123, name: "Test", secret: "XXX" }

// Envoyer à l'API en excluant certains champs
const filtered = JSON.stringify(ticket, ['id', 'name'])
// '{"id":123,"name":"Test"}'  // "secret" est exclu
```

### Vérifier si c'est du JSON valide

```javascript
function isValidJSON(str) {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

isValidJSON('{"id": 123}')  // true
isValidJSON('INVALID')      // false
```

---

## 📝 Résumé des bonnes pratiques

| Action | ❌ À ÉVITER | ✅ À FAIRE |
|--------|------------|-----------|
| **Recevoir JSON d'Axios** | `JSON.parse(response.data)` | `response.data` (déjà objet) |
| **Envoyer data à Axios** | `JSON.stringify(obj)` | `obj` (Axios le fait) |
| **Vérifier null** | `obj.prop.name` | `obj.prop?.name` |
| **Comparer IDs** | `id === "123"` | `id === 123` |
| **Dater les dates** | `ticket.date.getDate()` | `new Date(ticket.date).getDate()` |
| **Itérer tableau** | Boucle for | `.map()`, `.forEach()`, `.filter()` |

---

## 🔗 Ressources

- [MDN - JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [MDN - JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Axios Documentation](https://axios-http.com/)
