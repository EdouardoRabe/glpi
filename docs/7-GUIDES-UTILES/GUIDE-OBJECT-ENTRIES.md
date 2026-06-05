# 📘 GUIDE - `Object.entries`, `Object.keys`, `Object.values` et usages pratiques

> Explications et exemples pour manipuler des objets en JavaScript et les convertir en Map/Array.

---

## 1. `Object.keys(obj)` — obtenir les clés

- Retourne un tableau des clés (strings) propres à l'objet.

```javascript
const o = { a: 1, b: 2 };
Object.keys(o); // ['a', 'b']
```

Usage typique: parcourir les clés, vérifier existence, compter propriétés.

---

## 2. `Object.values(obj)` — obtenir les valeurs

- Retourne un tableau des valeurs dans le même ordre que `Object.keys`.

```javascript
Object.values({ a: 1, b: 2 }); // [1, 2]
```

---

## 3. `Object.entries(obj)` — obtenir paires [clé, valeur]

- Retourne un tableau de paires `[key, value]`.

```javascript
Object.entries({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
```

Pourquoi utile:
- Permet de transformer rapidement un objet en `Map`: `new Map(Object.entries(obj))`.
- Permet d'utiliser `Array`-helpers (`map`, `filter`, `reduce`) sur les paires.

Exemple: inverser clé↔valeur

```javascript
const obj = { INCIDENT: 1, DEMANDE: 2 };
const reverse = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [String(v), k])
);
// reverse: { '1': 'INCIDENT', '2': 'DEMANDE' }
```

---

## 4. Transformer Object <-> Map

```javascript
const obj = { a: 1, b: 2 };
const map = new Map(Object.entries(obj));
// Map { 'a' => 1, 'b' => 2 }

const back = Object.fromEntries(map);
// { a: 1, b: 2 }
```

Utilité: `Map` permet des clés non-string, accès O(1) et méthodes `.get/.set/.has`.

---

## 5. Exemples pratiques (comptages, groupements)

### Compter par propriété

```javascript
const tickets = [ { type: 1 }, { type: 2 }, { type: 1 } ];

const counts = tickets.reduce((acc, t) => {
  const k = String(t.type);
  acc[k] = (acc[k] ?? 0) + 1;
  return acc;
}, {});

// counts: { '1': 2, '2': 1 }
```

Transforme en labels en utilisant `Object.entries` + reverse map (ID→LABEL):

```javascript
const TICKET_TYPE = { INCIDENT: 1, DEMANDE: 2 };
const idToLabel = Object.fromEntries(
  Object.entries(TICKET_TYPE).map(([label, id]) => [String(id), label])
);

const countsByLabel = Object.entries(counts).reduce((acc, [id, c]) => {
  const label = idToLabel[id] ?? `TYPE_${id}`;
  acc[label] = c;
  return acc;
}, {});
```

### Grouper objets par clé (groupBy)

```javascript
const users = [
  { id:1, dept:'IT' },
  { id:2, dept:'HR' },
  { id:3, dept:'IT' }
];

const byDept = users.reduce((acc, u) => {
  (acc[u.dept] ??= []).push(u);
  return acc;
}, {});

// byDept = { IT: [{...},{...}], HR: [{...}] }
```

---

## 6. Bonnes pratiques et pièges

- L'ordre: `Object.keys/values/entries` suivent l'ordre d'insertion des propriétés (depuis ES2015 pour la plupart des cas pratiques).
- Utiliser `String(id)` pour normaliser les clés si tu utilises des ids numériques comme clés d'objet.
- Préfère `Map` si tu as besoin de clés non-string ou d'API `.get/.set` plus claire.
- Pour itérer dans React, transforme en tableau: `Array.from(myMap.entries()).map(...)`.

---

## 7. Exemple concret avec `Ticket` (récap)

- Récupérer `TICKET_TYPE` (ex: `{ INCIDENT: 1, DEMANDE: 2 }`)
- Construire `idToLabel`:

```javascript
const idToLabel = Object.fromEntries(
  Object.entries(TICKET_TYPE).map(([label, id]) => [String(id), label])
);
```

- Compter les tickets et afficher par label

```javascript
const counts = tickets.reduce((acc, t) => {
  const id = String(t.type);
  acc[id] = (acc[id] ?? 0) + 1;
  return acc;
}, {});

const countsByLabel = Object.fromEntries(
  Object.entries(counts).map(([id, c]) => [idToLabel[id] ?? `TYPE_${id}`, c])
);
```

---

## 8. Raccourcis utiles

- Objet → Entrées: `Object.entries(obj)`
- Entrées → Objet: `Object.fromEntries(entries)`
- Objet → Map: `new Map(Object.entries(obj))`
- Map → Objet: `Object.fromEntries(myMap)`

---

Si tu veux, j'intègre un exemple concret dans `BODashboard.jsx` pour afficher le résumé par type. Veux‑tu que je l'ajoute ?
