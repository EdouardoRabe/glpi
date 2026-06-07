# 📚 GUIDE - Array, Map et Set: Réunir, Filtrer, Transformer

> Guide complet pour manipuler **Array**, **Map** et **Set** en JavaScript/React.

---

## 🔵 PARTIE 1 : LES TABLEAUX (Array)

### Créer et initialiser

```javascript
// Vide
const arr = []
const arr2 = new Array()

// Avec valeurs initiales
const arr3 = [1, 2, 3]

// Pré-remplir
const arr4 = Array(5).fill(0)  // [0, 0, 0, 0, 0]

// De 0 à N
const arr5 = Array.from({ length: 5 }, (_, i) => i + 1)  // [1, 2, 3, 4, 5]
```

---

## 🔗 RÉUNIR DEUX TABLEAUX

### 1️⃣ Spread operator `...` (recommandé)

```javascript
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]

// Fusionner
const merged = [...arr1, ...arr2]  // [1, 2, 3, 4, 5, 6]

// Fusionner avec ajout
const withExtra = [...arr1, 99, ...arr2]  // [1, 2, 3, 99, 4, 5, 6]

// Fusionner plusieurs
const all = [...arr1, ...arr2, [7, 8], ...arr3]  // ⚠️ aplatir si besoin
```

### 2️⃣ `.concat()`

```javascript
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]

const merged = arr1.concat(arr2)  // [1, 2, 3, 4, 5, 6]
const merged2 = arr1.concat(arr2, [7, 8])  // [1, 2, 3, 4, 5, 6, 7, 8]

// .concat() ne modifie pas arr1
console.log(arr1)  // [1, 2, 3] - inchangé
```

### 3️⃣ `.push()` (modifie l'original ⚠️)

```javascript
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]

arr1.push(...arr2)  // arr1 devient [1, 2, 3, 4, 5, 6]
console.log(arr1)   // MODIFIÉ

// Attention
arr1.push(arr2)     // arr1 = [1, 2, 3, [4, 5, 6]] ❌ imbriqué
```

### 📊 Comparaison

| Méthode | Modifie l'original | Usage |
|---------|-------------------|-------|
| `[...a, ...b]` | ❌ Non | ✅ Recommandé en React |
| `.concat()` | ❌ Non | Bon pour la chaîne |
| `.push(...arr)` | ✅ Oui | Éviter dans React |

---

## 🧹 FILTRER UN TABLEAU

### 1️⃣ `.filter()` - Garder certains éléments

```javascript
const numbers = [1, 2, 3, 4, 5, 6]

// Pairs uniquement
const evens = numbers.filter(n => n % 2 === 0)  // [2, 4, 6]

// Supérieurs à 3
const big = numbers.filter(n => n > 3)  // [4, 5, 6]

// Avec objets
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true },
]

const activeUsers = users.filter(u => u.active)
// [{ id: 1, ... }, { id: 3, ... }]
```

### 2️⃣ Inverser le filtre (SAUF)

```javascript
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' },
]

// Tous SAUF les admins
const nonAdmins = users.filter(u => u.role !== 'admin')

// Equivalent
const nonAdmins2 = users.filter(u => !u.role.includes('admin'))
```

### 3️⃣ Chainer les filtres

```javascript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const result = data
  .filter(n => n > 2)      // [3, 4, 5, 6, 7, 8, 9, 10]
  .filter(n => n < 9)      // [3, 4, 5, 6, 7, 8]
  .filter(n => n % 2 === 0) // [4, 6, 8]
```

---

## 🎯 CHERCHER DANS UN TABLEAU

### 1️⃣ `.find()` - Trouver le premier

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]

// Trouver par ID
const user = users.find(u => u.id === 2)
// { id: 2, name: 'Bob' }

// Trouver ou undefined
const notFound = users.find(u => u.id === 999)
// undefined

// Avec condition
const admin = users.find(u => u.role === 'admin')
if (admin) {
  console.log('Admin trouvé:', admin.name)
} else {
  console.log('Pas d\'admin')
}
```

### 2️⃣ `.findIndex()` - Trouver l'index

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

const index = users.findIndex(u => u.id === 2)
// 1

const notFound = users.findIndex(u => u.id === 999)
// -1 (pas trouvé)

// Utiliser l'index pour modifier
if (index !== -1) {
  users[index].name = 'Bob Updated'
}
```

### 3️⃣ `.includes()` - Vérifier existence

```javascript
const arr = [1, 2, 3, 4, 5]

arr.includes(3)   // true
arr.includes(10)  // false

// Avec objets (attention: par référence)
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

users.includes({ id: 1, name: 'Alice' })  // false ❌ (objet différent)

// Utiliser .some() à la place
users.some(u => u.id === 1)  // true ✅
```

### 4️⃣ `.some()` et `.every()`

```javascript
const numbers = [2, 4, 6, 8]

// Y a-t-il au moins un pair ?
numbers.some(n => n % 2 === 0)  // true

// Tous les éléments satisfont la condition ?
numbers.every(n => n % 2 === 0)  // true

// Appliqué aux users
const users = [
  { id: 1, active: true },
  { id: 2, active: false },
]

users.some(u => u.active)   // true (au moins un actif)
users.every(u => u.active)  // false (pas tous actifs)
```

---

## 🔄 TRANSFORMER UN TABLEAU

### 1️⃣ `.map()` - Transformer chaque élément

```javascript
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
]

// Extraire un champ
const names = users.map(u => u.name)
// ['Alice', 'Bob']

// Transformer en objet
const formatted = users.map(u => ({
  id: u.id,
  label: `${u.name} (${u.age}ans)`,
}))
// [
//   { id: 1, label: 'Alice (25ans)' },
//   { id: 2, label: 'Bob (30ans)' },
// ]

// Map + Filter (chaneur)
const adultNames = users
  .filter(u => u.age >= 18)
  .map(u => u.name)
// ['Alice', 'Bob']
```

### 2️⃣ `.flatMap()` - Map et aplatir

```javascript
const users = [
  { id: 1, tags: ['admin', 'user'] },
  { id: 2, tags: ['user'] },
  { id: 3, tags: ['user', 'moderator'] },
]

// Sans flatMap (imbriqué)
const tagsNested = users.map(u => u.tags)
// [['admin', 'user'], ['user'], ['user', 'moderator']]

// Avec flatMap (aplati)
const tags = users.flatMap(u => u.tags)
// ['admin', 'user', 'user', 'user', 'moderator']

// Équivalent
const tags2 = users.map(u => u.tags).flat()
```

### 3️⃣ `.flat()` - Aplatir les niveaux

```javascript
const nested = [1, [2, 3], [4, [5, 6]]]

nested.flat()        // [1, 2, 3, 4, [5, 6]] (1 niveau)
nested.flat(2)       // [1, 2, 3, 4, 5, 6] (2 niveaux)
nested.flat(Infinity) // [1, 2, 3, 4, 5, 6] (tous les niveaux)
```

### 4️⃣ `.reduce()` - Combiner en une valeur

```javascript
// Somme
const numbers = [1, 2, 3, 4, 5]
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 15

// Compter les occurrences
const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] ?? 0) + 1
  return acc
}, {})
// { apple: 3, banana: 2, cherry: 1 }

// Regrouper par propriété
const users = [
  { id: 1, department: 'IT', name: 'Alice' },
  { id: 2, department: 'HR', name: 'Bob' },
  { id: 3, department: 'IT', name: 'Charlie' },
]

const byDept = users.reduce((acc, user) => {
  const dept = user.department
  if (!acc[dept]) acc[dept] = []
  acc[dept].push(user)
  return acc
}, {})
// {
//   IT: [{ id: 1, ... }, { id: 3, ... }],
//   HR: [{ id: 2, ... }],
// }
```

---

## ✂️ COUPER/DÉCOUPER UN TABLEAU

### 1️⃣ `.slice()` - Extraire une portion (non-modifiant)

```javascript
const arr = [0, 1, 2, 3, 4, 5, 6]

arr.slice()        // [0, 1, 2, 3, 4, 5, 6] - copie
arr.slice(2)       // [2, 3, 4, 5, 6] - du index 2 à la fin
arr.slice(2, 5)    // [2, 3, 4] - du 2 au 5 (5 exclu)
arr.slice(-2)      // [5, 6] - les 2 derniers
arr.slice(-3, -1)  // [4, 5] - du 3e dernier au 2e dernier

// Utile pour paginer
const data = Array.from({ length: 100 }, (_, i) => i + 1)
const page = 2
const pageSize = 10
const paginated = data.slice((page - 1) * pageSize, page * pageSize)
// [11, 12, ..., 20]
```

### 2️⃣ `.splice()` - Modifier le tableau ⚠️

```javascript
const arr = [0, 1, 2, 3, 4, 5, 6]

// Supprimer 3 éléments à partir de l'index 2
const removed = arr.splice(2, 3)
// removed = [2, 3, 4]
// arr = [0, 1, 5, 6] ✅ MODIFIÉ

// Ajouter des éléments
const arr2 = [0, 1, 5, 6]
arr2.splice(2, 0, 2, 3, 4)  // Ajouter sans supprimer
// arr2 = [0, 1, 2, 3, 4, 5, 6]

// En React, préférer
const arr3 = [0, 1, 5, 6]
const updated = [...arr3.slice(0, 2), 2, 3, 4, ...arr3.slice(2)]
// [0, 1, 2, 3, 4, 5, 6]
```

---

## 🔀 TRIER UN TABLEAU

### 1️⃣ `.sort()` - Trier (modifie l'original ⚠️)

```javascript
const numbers = [3, 1, 4, 1, 5, 9, 2, 6]

// Numérique croissant
const sorted = [...numbers].sort((a, b) => a - b)
// [1, 1, 2, 3, 4, 5, 6, 9]

// Numérique décroissant
const sortedDesc = [...numbers].sort((a, b) => b - a)
// [9, 6, 5, 4, 3, 2, 1, 1]

// Alphabétique
const words = ['cherry', 'apple', 'banana']
const sorted2 = [...words].sort()
// ['apple', 'banana', 'cherry']

// Objet - par champ
const users = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

const sortedByName = [...users].sort((a, b) =>
  a.name.localeCompare(b.name)
)
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]

const sortedById = [...users].sort((a, b) => a.id - b.id)
```

---

---

## 🔟 LIMITER LE NOMBRE DE RÉSULTATS

### `.slice()` - L'équivalent du LIMIT SQL

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Les 3 premiers
const first3 = arr.slice(0, 3)
// [1, 2, 3]

// Les 5 premiers
const first5 = arr.slice(0, 5)
// [1, 2, 3, 4, 5]

// Les 3 derniers
const last3 = arr.slice(-3)
// [8, 9, 10]
```

### Cas pratique : Top 10 après un tri

```javascript
const users = [
  { id: 1, name: 'Alice', score: 85 },
  { id: 2, name: 'Bob', score: 95 },
  { id: 3, name: 'Charlie', score: 70 },
  // ...
]

// Top 10 des meilleurs scores
const top10 = [...users]
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
```

### Explication

```javascript
.sort((a, b) => b.score - a.score)
```

Trie les scores du plus grand au plus petit.

```javascript
.slice(0, 10)
```

Garde uniquement les 10 premiers éléments.

### Exemple complet : Top 3

```javascript
const users = [
  { name: 'Alice', score: 85 },
  { name: 'Bob', score: 95 },
  { name: 'Charlie', score: 70 },
  { name: 'David', score: 90 },
]

const top3 = [...users]
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)

console.log(top3)
```

Résultat :

```javascript
[
  { name: 'Bob', score: 95 },
  { name: 'David', score: 90 },
  { name: 'Alice', score: 85 }
]
```

### Attention

```javascript
users.sort(...)
```

modifie le tableau original.

Pour éviter cela :

```javascript
const top10 = [...users]
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
```

Le `...users` crée une copie avant le tri.

## 🟢 PARTIE 2 : LES MAP

### Créer et initialiser

```javascript
// Map vide
const map = new Map()

// Avec valeurs initiales
const map2 = new Map([
  ['clé1', 'valeur1'],
  ['clé2', 'valeur2'],
])

// À partir d'objets
const obj = { a: 1, b: 2 }
const fromObj = new Map(Object.entries(obj))
// Map { 'a' => 1, 'b' => 2 }
```

### Opérations basiques

```javascript
const map = new Map()

// Ajouter
map.set('name', 'Alice')
map.set('age', 30)

// Lire
map.get('name')  // 'Alice'
map.get('job')   // undefined

// Vérifier l'existence
map.has('age')   // true
map.has('salary')  // false

// Supprimer
map.delete('age')
map.has('age')   // false

// Taille
map.size  // 1

// Vider
map.clear()
map.size  // 0
```

### Itérer sur une Map

```javascript
const map = new Map([
  ['id', 1],
  ['name', 'Alice'],
  ['age', 30],
])

// Clés
for (const key of map.keys()) {
  console.log(key)  // 'id', 'name', 'age'
}

// Valeurs
for (const value of map.values()) {
  console.log(value)  // 1, 'Alice', 30
}

// Clé-valeur
for (const [key, value] of map.entries()) {
  console.log(`${key}: ${value}`)
}

// Raccourci
for (const [key, value] of map) {
  console.log(`${key}: ${value}`)
}

// Avec forEach
map.forEach((value, key) => {
  console.log(`${key}: ${value}`)
})
```

### Map vs Object

| Opération | Map | Object |
|-----------|-----|--------|
| Créer | `new Map()` | `{}` |
| Ajouter | `.set(k, v)` | `[k] = v` |
| Lire | `.get(k)` | `[k]` |
| Supprimer | `.delete(k)` | `delete obj[k]` |
| Vérifier | `.has(k)` | `'k' in obj` |
| Taille | `.size` | `Object.keys().length` |
| Clés complexes | ✅ Oui | ❌ Converties string |

### Cas d'usage : Compter avec une Map

```javascript
const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']

// Avec objet
const countObj = {}
fruits.forEach(fruit => {
  countObj[fruit] = (countObj[fruit] ?? 0) + 1
})
// { apple: 3, banana: 2, cherry: 1 }

// Avec Map
const countMap = new Map()
fruits.forEach(fruit => {
  countMap.set(fruit, (countMap.get(fruit) ?? 0) + 1)
})
// Map { 'apple' => 3, 'banana' => 2, 'cherry' => 1 }

// Avec Array.reduce() + Map
const countMap2 = fruits.reduce((map, fruit) => {
  map.set(fruit, (map.get(fruit) ?? 0) + 1)
  return map
}, new Map())
```

### Convertir Map <-> Object

```javascript
// Map → Object
const map = new Map([['a', 1], ['b', 2]])
const obj = Object.fromEntries(map)
// { a: 1, b: 2 }

// Object → Map
const obj2 = { x: 10, y: 20 }
const map2 = new Map(Object.entries(obj2))
// Map { 'x' => 10, 'y' => 20 }
```

### Associer deux tableaux / sources de données dans une Map

**Cas d'usage courant** : tu as un tableau de tickets, et tu dois récupérer les items pour chaque ticket. Tu veux une Map avec `{ ticketId → {ticket, items} }`.

#### Pattern 1 : Synchrone (tous les items déjà dispo)

```javascript
     {
                Array.from(tickets.entries()).map( ([ ticketId, {ticket, items, nbCom, nbMon} ]) =>(
                        <div key={ticketId}>
                            <p>{ticket.name}</p>
                            <p>Ordinateurs : {nbCom}</p>
                            <p>Moniteurs : {nbMon}</p>
                            {items.map( (item) => (
                                    <p key={item.name}>{item.name}</p>
                                )
                            )}
                        </div>
                    )
                )
    }

```

```javascript
const tickets = [
  { id: 1, name: 'Ticket A' },
  { id: 2, name: 'Ticket B' },
]

const items = [
  { id: 101, ticketId: 1, description: 'Item 1' },
  { id: 102, ticketId: 1, description: 'Item 2' },
  { id: 103, ticketId: 2, description: 'Item 3' },
]

// Créer une Map: key = ticketId, value = {ticket, items}
const ticketMap = new Map()

tickets.forEach(ticket => {
  const ticketItems = items.filter(item => item.ticketId === ticket.id)
  ticketMap.set(ticket.id, {
    ticket,
    items: ticketItems,
  })
})

// Utiliser
const ticketData = ticketMap.get(1)
// { ticket: {...}, items: [{...}, {...}] }

// Itérer
for (const [ticketId, data] of ticketMap) {
  console.log(`Ticket ${ticketId}:`, data.ticket.name)
  console.log(`  Items: ${data.items.length}`)
}
```

#### Pattern 2 : Asynchrone (fetch items pour chaque ticket)

```javascript
// Cas: tu dois appeler await ticket.getItems(ticketId) pour chaque ticket

const tickets = [...]  // du serveur

// Créer la Map avec await (dans une fonction async)
const buildTicketMap = async () => {
  const ticketMap = new Map()

  for (const ticket of tickets) {
    const items = await ticket.getItems(ticket.id)  // ⚠️ Fetch séquentiel
    ticketMap.set(ticket.id, {
      ticket,
      items,
    })
  }

  return ticketMap
}

const map = await buildTicketMap()
```

#### Pattern 3 : Parallèle (meilleure performance)

```javascript
// Fetch tous les items en parallèle (plus rapide)

const buildTicketMapParallel = async () => {
  const ticketMap = new Map()

  // 1. Créer les promises pour TOUS les tickets en parallèle
  const promises = tickets.map(async (ticket) => {
    const items = await ticket.getItems(ticket.id)
    return { ticket, items }
  })

  // 2. Attendre que TOUS les fetches se terminent
  const allData = await Promise.all(promises)

  // 3. Construire la Map
  allData.forEach(({ ticket, items }) => {
    ticketMap.set(ticket.id, { ticket, items })
  })

  return ticketMap
}

const map = await buildTicketMapParallel()
```

#### Pattern 4 : Avec reduce (plus concis)

```javascript
// Synchrone avec reduce
const ticketMap = tickets.reduce((map, ticket) => {
  const ticketItems = items.filter(item => item.ticketId === ticket.id)
  map.set(ticket.id, { ticket, items: ticketItems })
  return map
}, new Map())

// Asynchrone (attention: reduce ne supporte pas async directement)
// Préférer la boucle ou Promise.all ci-dessus
```

#### Cas d'usage dans React : Hook custom

```javascript
import { useState, useEffect } from 'react'

const useTicketMapWithItems = (tickets) => {
  const [ticketMap, setTicketMap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tickets || tickets.length === 0) {
      setTicketMap(new Map())
      return
    }

    setLoading(true)
    setError(null)

    // Fetch tous les items en parallèle
    Promise.all(
      tickets.map(async (ticket) => {
        const items = await ticket.getItems(ticket.id)
        return { ticket, items }
      })
    )
      .then((allData) => {
        const map = new Map()
        allData.forEach(({ ticket, items }) => {
          map.set(ticket.id, { ticket, items })
        })
        setTicketMap(map)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [tickets])

  return { ticketMap, loading, error }
}

// Utilisation
export default function TicketListWithItems() {
  const [tickets, setTickets] = useState([])
  const { ticketMap, loading, error } = useTicketMapWithItems(tickets)

  useEffect(() => {
    Ticket.getAll().then(setTickets)
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur: {error}</p>

  return (
    <div>
      {Array.from(ticketMap.entries()).map(([ticketId, { ticket, items }]) => (
        <div key={ticketId}>
          <h3>{ticket.name}</h3>
          <ul>
            {items.map(item => (
              <li key={item.id}>{item.description}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

#### Avantages de ce pattern

| Aspect | Tableau imbriqué | Map |
|--------|------------------|-----|
| Accès rapide par ID | ❌ `.find()` lent | ✅ `.get(id)` O(1) |
| Lisibilité | ❌ tickets[i].items | ✅ ticketMap.get(id).items |
| Modification | ❌ Besoin filter + spread | ✅ map.set(id, {...}) |
| Taille | ❌ Duplique structure | ✅ Référence unique |

---

## 🔴 PARTIE 3 : LES SET

### Créer et initialiser

```javascript
// Set vide
const set = new Set()

// Avec valeurs
const set2 = new Set([1, 2, 3, 4, 5])

// À partir d'un Array
const arr = [1, 2, 2, 3, 3, 3]
const set3 = new Set(arr)  // Set { 1, 2, 3 } - doublons supprimés

// À partir de chaîne
const set4 = new Set('hello')  // Set { 'h', 'e', 'l', 'o' }
```

### Opérations basiques

```javascript
const set = new Set()

// Ajouter
set.add(1)
set.add(2)
set.add(3)

// Vérifier l'existence
set.has(2)  // true
set.has(10) // false

// Supprimer
set.delete(2)
set.has(2)  // false

// Taille
set.size  // 2

// Vider
set.clear()
set.size  // 0
```

### Itérer sur un Set

```javascript
const set = new Set(['apple', 'banana', 'cherry'])

// Boucle for...of
for (const item of set) {
  console.log(item)  // 'apple', 'banana', 'cherry'
}

// forEach
set.forEach(item => {
  console.log(item)
})

// Convertir en array
const arr = Array.from(set)
const arr2 = [...set]
// ['apple', 'banana', 'cherry']
```

### Cas d'usage : Supprimer les doublons

```javascript
// Avant
const arr = [1, 2, 2, 3, 3, 3, 4, 5, 5]

// Après - avec Set
const unique = [...new Set(arr)]
// [1, 2, 3, 4, 5]

// Objet - par champ
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 1, name: 'Alice', email: 'alice@example.com' }, // doublon
]

// Unique par ID
const uniqueById = Array.from(
  new Map(users.map(u => [u.id, u])).values()
)
// Garde le premier de chaque ID

// Unique par email
const uniqueByEmail = Array.from(
  new Map(users.map(u => [u.email, u])).values()
)
```

### Opérations d'ensemble

```javascript
const setA = new Set([1, 2, 3])
const setB = new Set([2, 3, 4])

// Union (tous les éléments)
const union = new Set([...setA, ...setB])
// Set { 1, 2, 3, 4 }

// Intersection (éléments communs)
const intersection = new Set(
  [...setA].filter(x => setB.has(x))
)
// Set { 2, 3 }

// Différence (dans A mais pas dans B)
const difference = new Set(
  [...setA].filter(x => !setB.has(x))
)
// Set { 1 }

// Symétrique (dans A ou B, mais pas dans les deux)
const symmetric = new Set([
  ...setA.filter(x => !setB.has(x)),
  ...setB.filter(x => !setA.has(x)),
])
// Set { 1, 4 }
```

---

## 🎯 RÉSUMÉ COMPARATIF

| Besoin | Array | Map | Set |
|--------|-------|-----|-----|
| Stocker liste ordonnée | ✅ Oui | ❌ Non | ❌ Non |
| Clés complexes | ❌ Non | ✅ Oui | N/A |
| Valeurs uniques | ❌ Non | N/A | ✅ Oui |
| Itération rapide | ✅ | ✅ | ✅ |
| Vérifier existence | `.includes()` | `.has()` | `.has()` |
| Ajouter élément | `.push()` | `.set()` | `.add()` |
| Supprimer élément | `.splice()` | `.delete()` | `.delete()` |

---

## 💡 COMBINER Array, Map, Set

### Exemple 1 : Fusionner et dédupliquer

```javascript
const list1 = [1, 2, 3, 4]
const list2 = [3, 4, 5, 6]

// Combiner + dupliquer
const combined = [...list1, ...list2]
// [1, 2, 3, 4, 3, 4, 5, 6]

// Unique
const unique = [...new Set(combined)]
// [1, 2, 3, 4, 5, 6]
```

### Exemple 2 : Compter et filtrer

```javascript
const votes = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']

// Compter
const count = new Map()
votes.forEach(vote => {
  count.set(vote, (count.get(vote) ?? 0) + 1)
})

// Filtrer (au moins 2 votes)
const popular = Array.from(count.entries())
  .filter(([, votes]) => votes >= 2)
  .map(([name]) => name)
// ['apple', 'banana']
```

### Exemple 3 : Filtrer et regrouper

```javascript
const users = [
  { id: 1, dept: 'IT', role: 'dev' },
  { id: 2, dept: 'HR', role: 'manager' },
  { id: 3, dept: 'IT', role: 'admin' },
  { id: 4, dept: 'IT', role: 'dev' },
]

// Filtrer (IT uniquement)
const itUsers = users.filter(u => u.dept === 'IT')

// Regrouper par rôle
const byRole = itUsers.reduce((acc, user) => {
  const role = user.role
  if (!acc[role]) acc[role] = []
  acc[role].push(user)
  return acc
}, {})

// Utiliser une Map pour clarté
const byRoleMap = new Map()
itUsers.forEach(user => {
  if (!byRoleMap.has(user.role)) {
    byRoleMap.set(user.role, [])
  }
  byRoleMap.get(user.role).push(user)
})
```

---

## ⚡ PIÈGES COURANTS À ÉVITER

### ❌ Modifier un array sans spread

```javascript
// ❌ Mauvais en React
const users = [{id: 1, name: 'Alice'}]
users[0].name = 'Bob'  // Mutation
setState(users)  // Peut ne pas re-render

// ✅ Bon
const updated = users.map(u =>
  u.id === 1 ? { ...u, name: 'Bob' } : u
)
setState(updated)
```

### ❌ Oublier le spread dans une imbrication

```javascript
// ❌ Mauvais
const user = { id: 1, address: { city: 'Paris' } }
user.address.city = 'Lyon'

// ✅ Bon
const updated = {
  ...user,
  address: { ...user.address, city: 'Lyon' }
}
```

### ❌ Comparer des objets dans un Set

```javascript
const set = new Set()
set.add({ id: 1 })
set.add({ id: 1 })

set.size  // 2 ❌ (deux objets différents)

// Utiliser une key string à la place
const set2 = new Set(['id:1', 'id:2', 'id:1'])
set2.size  // 2 ✅
```

### ❌ .sort() modifie l'original

```javascript
// ❌ Mauvais
const data = [3, 1, 2]
const sorted = data.sort((a, b) => a - b)
// data est maintenant [1, 2, 3] — modifié!

// ✅ Bon
const sorted = [...data].sort((a, b) => a - b)
// data reste [3, 1, 2]
```

---

## 📖 RÉFÉRENCE RAPIDE

```javascript
// Tableau - réunir
const merged = [...arr1, ...arr2]

// Tableau - filtrer
const filtered = arr.filter(x => x > 5)

// Tableau - transformer
const mapped = arr.map(x => x * 2)

// Tableau - chercher
const found = arr.find(x => x.id === 1)

// Tableau - compter
const count = arr.reduce((sum, x) => sum + x, 0)

// Map - stocker clé-valeur
const map = new Map([['key', 'value']])
map.get('key')
map.has('key')

// Map - combiner deux tableaux
const ticketMap = new Map()
tickets.forEach(ticket => {
  const items = itemList.filter(i => i.ticketId === ticket.id)
  ticketMap.set(ticket.id, { ticket, items })
})

// Set - valeurs uniques
const unique = new Set(arr)
unique.has(value)
[...unique]  // Convertir en array
```
