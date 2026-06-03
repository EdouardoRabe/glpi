# 🎯 GUIDE - Array Methods: .map(), .filter(), .find(), .reduce()

> Reference rapide pour manipuler les tableaux en React

---

## 📍 .map() - Transformer chaque élément

### Basique
```jsx
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8]
```

### Avec React - Afficher liste
```jsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

return (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

### Transformer objets
```jsx
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const names = users.map(u => u.name);
// ['Alice', 'Bob']

const ids = users.map(u => u.id);
// [1, 2]

const formatted = users.map(u => `${u.id}: ${u.name}`);
// ['1: Alice', '2: Bob']
```

### Retourner objets
```jsx
const names = ['Alice', 'Bob'];
const users = names.map((name, index) => ({
  id: index + 1,
  name: name
}));
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

---

## 🔍 .filter() - Garder certains éléments

### Basique
```jsx
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]
```

### Avec objets
```jsx
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
];

const active = users.filter(u => u.active);
// [Alice, Charlie]

const inactive = users.filter(u => !u.active);
// [Bob]
```

### En React
```jsx
const [status, setStatus] = useState('all');

const filtered = status === 'all' 
  ? users 
  : users.filter(u => u.active === (status === 'active'));

return (
  <>
    <button onClick={() => setStatus('all')}>Tous</button>
    <button onClick={() => setStatus('active')}>Actifs</button>
    <ul>
      {filtered.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  </>
);
```

### Supprimer un élément
```jsx
const [items, setItems] = useState([1, 2, 3, 4]);

const removeItem = (id) => {
  setItems(items.filter(i => i !== id));
};
```

---

## 🔎 .find() - Trouver UN élément

### Basique
```jsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }

const notFound = users.find(u => u.id === 999);
// undefined
```

### Vérifier avant d'utiliser
```jsx
const user = users.find(u => u.id === id);

if (user) {
  console.log('Trouvé:', user.name);
} else {
  console.log('Pas trouvé');
}
```

### Avec index
```jsx
const index = users.findIndex(u => u.id === 2);
// 1
```

---

## ➕ .reduce() - Agréger/combiner

### Somme simple
```jsx
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((total, n) => total + n, 0);
// 10
```

### Compter occurrences
```jsx
const fruits = ['apple', 'banana', 'apple', 'orange', 'apple'];
const count = fruits.reduce((acc, fruit) => ({
  ...acc,
  [fruit]: (acc[fruit] || 0) + 1
}), {});
// { apple: 3, banana: 1, orange: 1 }
```

### Transformer array en objet
```jsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

const byId = users.reduce((acc, user) => ({
  ...acc,
  [user.id]: user
}), {});
// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
```

### Aplatir array
```jsx
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, sub) => [...acc, ...sub], []);
// [1, 2, 3, 4, 5]
```

---

## 🔗 Chainer les méthodes

```jsx
const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 28, active: true }
];

// 1. Filtrer actifs
// 2. Trier par age
// 3. Extraire noms
const result = users
  .filter(u => u.active)
  .sort((a, b) => a.age - b.age)
  .map(u => u.name);
// ['Alice', 'Charlie']
```

---

## 🎯 Autres méthodes utiles

### .includes() - Est-ce qu'élément existe?
```jsx
const permissions = ['read', 'write'];
permissions.includes('write');  // true
```

### .some() - Au moins un match?
```jsx
const users = [{ active: false }, { active: true }];
const hasActive = users.some(u => u.active);  // true
```

### .every() - Tous match?
```jsx
const users = [{ active: true }, { active: true }];
const allActive = users.every(u => u.active);  // true
```

### .sort() - Trier
```jsx
const numbers = [3, 1, 4, 1, 5];
numbers.sort((a, b) => a - b);  // [1, 1, 3, 4, 5]

const users = [{ name: 'Bob' }, { name: 'Alice' }];
users.sort((a, b) => a.name.localeCompare(b.name));
// Alice d'abord
```

### .reverse() - Inverser
```jsx
const arr = [1, 2, 3];
arr.reverse();  // [3, 2, 1]
```

### .join() - Convertir en string
```jsx
const arr = ['Alice', 'Bob', 'Charlie'];
arr.join(', ');  // 'Alice, Bob, Charlie'
```

### .slice() - Copie partielle (NON-mutant)
```jsx
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3);  // [2, 3]
arr.slice(-2);  // [4, 5] (derniers 2)
```

### .splice() - ⚠️ Modifie original!
```jsx
const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2);  // Supprime 2 éléments à partir index 1
// Return: [2, 3], arr = [1, 4, 5]  ⚠️ MUTATION!
// En React, utiliser .filter() ou .slice()
```

---

## 🎯 Checklist Rapide

| Besoin | Méthode |
|--------|---------|
| Afficher liste | `.map()` |
| Supprimer un | `.filter(item => item.id !== id)` |
| Chercher un | `.find(item => item.id === id)` |
| Vérifier existence | `.includes()` ou `.some()` |
| Trier | `.sort()` |
| Compter | `.reduce()` |
| Aplatir | `.reduce(...spread)` |
| Ajouter | `[...array, new]` |
| Créer copie | `.slice()` ou `[...array]` |

---

## ⚠️ Pièges Courants

| Erreur | Cause | Correction |
|--------|-------|-----------|
| Mutation | `.push()`, `.splice()` | Utiliser spread `[...]` ou `.filter()` |
| Oubli return | `.map(item => { calc })` | Besoin `=> ({ ... })` ou `return` |
| .map() retourne undefined | Pas de return | Ajouter accolades et return |
| Array pas mis à jour | Filter/map pas assigné | `setArray(filtered)` |

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)  
→ [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)
