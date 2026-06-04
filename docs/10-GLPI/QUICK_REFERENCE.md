# Référence rapide - Cheat sheet

## 🚀 Importer les services

```javascript
import { getAll, getById, createItem, updateItem, patchItem, deleteItem } from "../Services/crudService"
import { apiRequest } from "../Services/apiClient"
import { getValidAccessToken, clearTokens } from "../Services/authService"
```

---

## 📦 CRUD Basique

### Lire
```javascript
const all = await getAll("Ticket", { limit: 20 })
const one = await getById("Ticket", 123)
```

### Créer
```javascript
const created = await createItem("Ticket", {
  name: "Titre",
  content: "Description"
})
```

### Mettre à jour
```javascript
const updated = await patchItem("Ticket", 123, {
  status: 6
})
```

### Supprimer
```javascript
await deleteItem("Ticket", 123)
```

---

## 🔍 Filtres courants

```javascript
// Par statut
{ filter: "status=in=(1,2,3,4)" }

// Par utilisateur assigné
{ filter: "_users_id_assign=42" }

// Par urgence
{ filter: "urgency=ge=3" }  // >= 3

// Combiné
{ filter: "status=2;priority=ge=15" }
```

---

## 📊 Pagination

```javascript
const page1 = await getAll("Ticket", { limit: 20, offset: 0 })
const page2 = await getAll("Ticket", { limit: 20, offset: 20 })

const totalPages = Math.ceil(page1.totalcount / 20)
```

---

## 🎯 Statuts Ticket

| ID | Statut |
|----|--------|
| 1  | Nouveau |
| 2  | Assigné |
| 3  | Planifié |
| 4  | Attente |
| 5  | Résolu |
| 6  | Fermé |

---

## ⚡ Priorités

| Valeur | Urgence |
|--------|---------|
| 1 | Faible |
| 2 | Normal |
| 3 | Élevée |
| 4 | Très élevée |
| 5 | Critique |

---

## ⚠️ Gestion des erreurs

```javascript
try {
  const ticket = await getById("Ticket", 123)
} catch (error) {
  const status = error.response?.status
  if (status === 401) console.error("Authentification")
  if (status === 403) console.error("Accès refusé")
  if (status === 404) console.error("Non trouvé")
  if (status === 500) console.error("Erreur serveur")
}
```

---

## 🔐 Authentification

```javascript
// Récupérer un token valide
const token = await getValidAccessToken()

// Forcer un refresh
const freshToken = await getValidAccessToken({ forceRefresh: true })

// Déconnexion
clearTokens()
```

---

## 📝 Exemples rapides

### Récupérer tous les tickets ouverts
```javascript
const open = await getAll("Ticket", {
  filter: "status=in=(1,2,3,4)",
  sort: "-priority"
})
```

### Créer et assigner un ticket
```javascript
const ticket = await createItem("Ticket", {
  name: "Bug critique",
  content: "Description...",
  urgency: 5,
  type: 1
})

await patchItem("Ticket", ticket.id, {
  _users_id_assign: 42
})
```

### Fermer un ticket
```javascript
await patchItem("Ticket", 123, {
  status: 6,
  solution: "Problème résolu"
})
```

### Récupérer un ordinateur
```javascript
const computer = await getById("Computer", 456)
console.log(`${computer.name} - ${computer.nbcores} cores`)
```

### Récupérer un utilisateur
```javascript
const user = await getById("User", 42)
console.log(`${user.name} (${user.email})`)
```

---

## 🌐 Endpoints principaux

```javascript
// Tickets
"/Ticket"           // Tous
"/Ticket/123"       // Un ticket
POST "/Ticket"      // Créer

// Ordinateurs
"/Computer"
"/Computer/456"

// Utilisateurs
"/User"
"/User/42"

// Catégories
"/ITILCategory"
```

---

## 💾 Stockage des données

```javascript
// Les tokens sont automatiquement sauvés dans localStorage
// Structure :
// {
//   "glpi.tokens": {
//     "accessToken": "...",
//     "refreshToken": "...",
//     "tokenType": "Bearer",
//     "expiresAt": 1686422000000
//   }
// }

// Pour nettoyer :
localStorage.removeItem("glpi.tokens")
```

---

## 🔧 Variables d'environnement

```env
VITE_GLPI_API_BASE_URL=http://glpi.local/api.php/v2.3
VITE_GLPI_TOKEN_URL=http://glpi.local/api.php/token
VITE_GLPI_CLIENT_ID=...
VITE_GLPI_CLIENT_SECRET=...
VITE_GLPI_USERNAME=glpi
VITE_GLPI_PASSWORD=glpi
VITE_GLPI_SCOPES=api user email graphql status
```

---

## 📱 Transformer les données

```javascript
// Date string → Date object
const date = new Date(ticket.date_creation)
const daysOld = Math.floor((Date.now() - date) / (1000*60*60*24))

// ID → Statut
const status = {1:"Nouveau", 2:"Assigné", 6:"Fermé"}[ticket.status]

// Tableau filtré
const urgent = tickets.filter(t => t.priority >= 20)

// Compter
const total = tickets.length

// Mapper
const names = tickets.map(t => t.name)
```

---

📚 Voir les guides complets :
- [JSON Parsing](./JSON_PARSING_GUIDE.md)
- [Structures GLPI](./GLPI_API_DATA_STRUCTURES.md)
- [Exemples détaillés](./API_USAGE_EXAMPLES.md)
