# ❌ vs ✅ GUIDE - Patterns: Avant/Après

> Erreurs courantes côte à côte avec les bonnes pratiques

---

## 🎯 STATE & MUTATION

### ❌ Mutation Array
```jsx
const [items, setItems] = useState([1, 2, 3]);

const addItem = () => {
  items.push(4);  // ⚠️ MUTATION
  setItems(items);  // React ne voit rien
};
```

### ✅ Bonne Pratique
```jsx
const addItem = () => {
  setItems([...items, 4]);  // ✅ Nouvel array
};
```

---

## 🎯 STATE & MUTATION - Objet

### ❌ Mutation Objet
```jsx
const [user, setUser] = useState({ name: 'Alice', age: 30 });

const birthday = () => {
  user.age = 31;  // ⚠️ MUTATION
  setUser(user);  // Ne re-render pas
};
```

### ✅ Bonne Pratique
```jsx
const birthday = () => {
  setUser({ ...user, age: 31 });  // ✅ Nouvel objet
};

// Ou callback:
const birthday = () => {
  setUser(prev => ({ ...prev, age: prev.age + 1 }));
};
```

---

## 🎯 USEEFFECT - Infinite Loop

### ❌ Infinite Loop
```jsx
useEffect(() => {
  setCount(count + 1);
});  // ⚠️ Relancé à chaque render!
// Boucle infinie
```

### ✅ Bonne Pratique - Une seule fois
```jsx
useEffect(() => {
  console.log('Mounted once');
}, []);  // ✅ Dépendances vides
```

### ✅ Bonne Pratique - Quand dependance change
```jsx
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);  // ✅ Re-run si count change
```

---

## 🎯 USEEFFECT - Async/Await

### ❌ async directement
```jsx
useEffect(async () => {  // ⚠️ MAUVAIS!
  const data = await fetch('/api');
}, []);
```

### ✅ Bonne Pratique
```jsx
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch('/api');
    setData(await data.json());
  };
  fetchData();
}, []);
```

---

## 🎯 CLOSURES - setState dans Async

### ❌ Stale State
```jsx
const [count, setCount] = useState(0);

setTimeout(() => {
  console.log(count);  // ⚠️ Toujours 0!
  setCount(count + 1);  // Capture anciene valeur
}, 1000);
```

### ✅ Bonne Pratique 1 - Fonction update
```jsx
setTimeout(() => {
  setCount(prev => prev + 1);  // ✅ Fonction
}, 1000);
```

### ✅ Bonne Pratique 2 - Dépendances
```jsx
useEffect(() => {
  setTimeout(() => {
    console.log(count);  // ✅ Bonne valeur
    setCount(count + 1);
  }, 1000);
}, [count]);  // ✅ Re-run si count change
```

---

## 🎯 ARRAY - Supprimer Element

### ❌ Mutation
```jsx
const [items, setItems] = useState([...]);

const remove = (id) => {
  const index = items.findIndex(i => i.id === id);
  items.splice(index, 1);  // ⚠️ MUTATION!
  setItems(items);
};
```

### ✅ Bonne Pratique
```jsx
const remove = (id) => {
  setItems(items.filter(i => i.id !== id));  // ✅ Créer nouveau
};
```

---

## 🎯 ARRAY - Modifier Element

### ❌ Mutation
```jsx
const [items, setItems] = useState([...]);

const update = (id, newName) => {
  const item = items.find(i => i.id === id);
  item.name = newName;  // ⚠️ MUTATION!
  setItems(items);
};
```

### ✅ Bonne Pratique
```jsx
const update = (id, newName) => {
  setItems(items.map(i => 
    i.id === id ? { ...i, name: newName } : i
  ));
};
```

---

## 🎯 LIST KEYS - Index comme clé

### ❌ Index Key (Dangereux)
```jsx
{users.map((user, index) => (
  <li key={index}>{user.name}</li>  // ⚠️ Index change!
))}

// Si on supprime user[0]:
// user[1] devient index 0 → React confus!
```

### ✅ Bonne Pratique - ID Universel
```jsx
{users.map(user => (
  <li key={user.id}>{user.name}</li>  // ✅ Stable
))}
```

---

## 🎯 CONTROLLED INPUT

### ❌ Uncontrolled
```jsx
function Form() {
  return <input placeholder="Name" />;
}
// React ne sait pas la valeur!
```

### ✅ Bonne Pratique - Controlled
```jsx
function Form() {
  const [name, setName] = useState('');
  
  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
    />
  );
}
```

---

## 🎯 FORM SUBMIT

### ❌ Oubli preventDefault
```jsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button>Submit</button>
</form>

// ⚠️ Page recharge à chaque submit!
```

### ✅ Bonne Pratique
```jsx
const handleSubmit = (e) => {
  e.preventDefault();  // ✅ Empêcher reload
  console.log('Form submitted');
};

<form onSubmit={handleSubmit}>
  ...
</form>
```

---

## 🎯 BUTTON CLICK - Appel direct

### ❌ Appelle immédiatement
```jsx
<button onClick={handleClick()}>  // ⚠️ () = appel immédiat!
  Click
</button>
```

### ✅ Bonne Pratique - Référence
```jsx
<button onClick={handleClick}>  // ✅ Référence
  Click
</button>
```

### ✅ Avec paramètres
```jsx
<button onClick={() => handleClick(userId)}>  // ✅ Wrapper
  Click
</button>
```

---

## 🎯 EVENT HANDLER - Passer paramètres

### ❌ Mauvais contexte
```jsx
const handleDelete = (id) => {
  console.log('Delete:', id);
};

{items.map(item => (
  <button onClick={handleDelete(item.id)}>  // ⚠️ Appelle immédiatement!
    Delete
  </button>
))}
```

### ✅ Bonne Pratique - Arrow function
```jsx
{items.map(item => (
  <button onClick={() => handleDelete(item.id)}>  // ✅ Wrapper
    Delete
  </button>
))}
```

---

## 🎯 CONDITIONAL RENDER

### ❌ Logique confuse
```jsx
return errors || data ? <Data /> : <Empty />;  // ⚠️ Ambigü
```

### ✅ Bonne Pratique - Explicite
```jsx
if (loading) return <Loading />;
if (error) return <Error msg={error} />;
if (!data || data.length === 0) return <Empty />;
return <Data items={data} />;
```

### ✅ Ou avec opérateur ternaire
```jsx
return loading ? (
  <Loading />
) : error ? (
  <Error msg={error} />
) : data.length === 0 ? (
  <Empty />
) : (
  <Data items={data} />
);
```

---

## 🎯 OPTIONAL CHAINING

### ❌ Vérifications imbriquées
```jsx
if (user && user.profile && user.profile.name) {
  console.log(user.profile.name);  // ⚠️ Verbeux
}
```

### ✅ Bonne Pratique - Optional chaining
```jsx
console.log(user?.profile?.name);  // ✅ Court & clair
```

---

## 🎯 DESTRUCTURING

### ❌ Accès imbriqué
```jsx
function Component(props) {
  return <p>{props.user.name}</p>;  // ⚠️ Répétition
}
```

### ✅ Bonne Pratique - Destructure
```jsx
function Component({ user }) {
  return <p>{user.name}</p>;  // ✅ Propre
}

// Vraiment destructure
function Component({ user: { name } }) {
  return <p>{name}</p>;  // ✅ Ultra-court
}
```

---

## 🎯 MAPPING - Oubli return

### ❌ Sans return
```jsx
const doubled = numbers.map(n => {
  n * 2;  // ⚠️ Pas de return!
});
// [undefined, undefined, ...]
```

### ✅ Bonne Pratique 1 - Avec accolades
```jsx
const doubled = numbers.map(n => {
  return n * 2;  // ✅ Return explicite
});
```

### ✅ Bonne Pratique 2 - Arrow syntax
```jsx
const doubled = numbers.map(n => n * 2);  // ✅ Implicite
```

---

## 🎯 DEPENDENCIES - Manquant

### ❌ Variable utilisée, pas dans []
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);  // ⚠️ count utilisé
}, []);  // ✅ Mais absent de []!
```

### ✅ Bonne Pratique
```jsx
useEffect(() => {
  console.log(count);
}, [count]);  // ✅ Ajouter dépendance
```

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)
