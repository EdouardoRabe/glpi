# 🔄 GUIDE - Pourquoi mon composant ne se met pas à jour?

> Checklist rapide quand l'état change pas ou le rendu change pas

---

## 🔍 CHECKLIST RAPIDE

**Mon composant ne change pas → Tester dans l'ordre:**

- [ ] **1. Mutation d'état?** – Vous modifiez directement l'objet/array?
- [ ] **2. setState appelé?** – Y a-t-il vraiment un `setState()`?
- [ ] **3. useEffect mal config?** – Dépendances oubliées/mauvaises?
- [ ] **4. Parent pas re-render?** – Le parent change-t-il?
- [ ] **5. Memo() bloque?** – Composant enrobé avec `React.memo`?
- [ ] **6. State non utilisé** – Vous avez setState mais utilisez pas la var?

---

## ❌ PROBLÈME 1: Mutation d'État

### Le vrai problème
React compare la référence (pas le contenu). Si vous mutez, c'est la même adresse mémoire.

### ❌ BAD - Mutation d'Array
```jsx
const [items, setItems] = useState([1, 2, 3]);

const addItem = () => {
  items.push(4);  // ⚠️ MUTATION! Même reference!
  setItems(items);  // React voit rien de nouveau
};
```

### ✅ GOOD - Créer nouvel array
```jsx
const addItem = () => {
  setItems([...items, 4]);  // ✅ Nouvelle référence
  // Ou:
  setItems(prev => [...prev, 4]);
};
```

### ❌ BAD - Mutation d'Objet
```jsx
const [user, setUser] = useState({ name: 'Alice', age: 30 });

const changeAge = () => {
  user.age = 31;  // ⚠️ MUTATION!
  setUser(user);  // React voit rien
};
```

### ✅ GOOD - Créer nouvel objet
```jsx
const changeAge = () => {
  setUser({ ...user, age: 31 });  // ✅ Nouvel objet
  // Ou:
  setUser(prev => ({ ...prev, age: 31 }));
};
```

### ❌ BAD - Mutation imbriquée
```jsx
const [data, setData] = useState({
  user: { name: 'Alice' }
});

const changeName = () => {
  data.user.name = 'Bob';  // ⚠️ Mutation!
  setData(data);
};
```

### ✅ GOOD - Copie complète
```jsx
const changeName = () => {
  setData({
    ...data,
    user: { ...data.user, name: 'Bob' }
  });
};
```

---

## ❌ PROBLÈME 2: setState non appelé

### ❌ BAD - Oubli setState
```jsx
const handleClick = () => {
  count = count + 1;  // ⚠️ Juste la variable, pas setState!
  console.log(count);  // Affiche dans console mais UI change pas
};
```

### ✅ GOOD - Utiliser setState
```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);  // ✅ Tout change
};
```

---

## ❌ PROBLÈME 3: useEffect mal configuré

### ❌ BAD - Dépendances vides = code jamais re-run
```jsx
useEffect(() => {
  setCount(count + 1);  // Undo infinite loop
}, []);  // ⚠️ VIDE! Jamais appelé après le mount initial
```

### ✅ GOOD - Ajouter dépendances
```jsx
useEffect(() => {
  console.log('count a changé:', count);
}, [count]);  // ✅ Appelé quand count change
```

### ❌ BAD - Infinite loop (sans dépendances)
```jsx
useEffect(() => {
  setData(data + 1);  // Cause re-render
});  // ⚠️ Pas de [], donc rappelé à chaque render!
```

### ✅ GOOD - Ajouter dépendances explicites
```jsx
useEffect(() => {
  // Faire quelque chose une fois
  console.log('Composant monté');
}, []);  // ✅ Une seule fois
```

---

## ❌ PROBLÈME 4: Parent ne re-render pas

### Situation
Vous changez state dans Parent, mais Child ne se met pas à jour.

### ❌ BAD - Pas de props
```jsx
// Parent
const [shared, setShared] = useState('test');
return <Child />;  // ⚠️ shared pas passé!

// Child
function Child() {
  return <p>{shared}</p>;  // Error: undefined!
}
```

### ✅ GOOD - Passer en props
```jsx
// Parent
return <Child value={shared} onChange={setShared} />;

// Child
function Child({ value, onChange }) {
  return <p>{value}</p>;
}
```

---

## ❌ PROBLÈME 5: React.memo bloque

### Situation
Vous avez enrobé avec `memo()` mais ça ne change pas.

### ❌ BAD - memo() avec inline object
```jsx
const Child = React.memo(({ user }) => {
  return <p>{user.name}</p>;
});

// Parent
const [name, setName] = useState('Alice');
return <Child user={{ name }} />;  // ⚠️ Nouvel objet à chaque render!
// memo() voit: "C'est pas le même user, re-render"
```

### ✅ GOOD - Objet stable
```jsx
const [user, setUser] = useState({ name: 'Alice' });
return <Child user={user} />;  // ✅ Même objet = pas de re-render
```

---

## ❌ PROBLÈME 6: State défini mais pas utilisé

### ❌ BAD - Oubli la variable
```jsx
const [count, setCount] = useState(0);

return (
  <div>
    <button onClick={() => setCount(count + 1)}>+1</button>
    <p>{num}</p>  // ⚠️ TYPO! C'est 'count', pas 'num'
  </div>
);
```

### ✅ GOOD - Utiliser la bonne variable
```jsx
return <p>{count}</p>;  // ✅ Correct
```

---

## 🎯 Tests Rapides

```jsx
const TestDebug = () => {
  const [state, setState] = useState(0);

  // Teste 1: setState fonctionne?
  const test1 = () => {
    console.log('Avant:', state);
    setState(state + 1);
    // TOUJOURS affiche l'ancienne valeur ici (closure!)
    console.log('Après (ce n\'change pas):', state);
  };

  // Teste 2: Voir les mutations
  const [arr, setArr] = useState([1, 2]);
  const testMutation = () => {
    arr.push(3);  // Mutation!
    console.log('Array:', arr);  // Affiche [1,2,3]
    setArr(arr);
    // Mais UI ne change pas!
  };

  return (
    <>
      <p>State: {state}</p>
      <button onClick={test1}>Test setState</button>
      <button onClick={testMutation}>Test Mutation</button>
    </>
  );
};
```

---

## 💡 Outils de Debug

**Ajouter un log rapide:**
```jsx
useEffect(() => {
  console.log('Componente re-render, state=', state);
}, [state]);
```

**React DevTools:**
1. Installer extension
2. Outils DevTools → Onglet "Profiler"
3. Voir quels composants re-render

**Console.log les setState:**
```jsx
const [debug, setDebug] = useState(false);
// Chaque fois que debug change, log automatique
useEffect(() => { console.log('Debug changé:', debug); }, [debug]);
```

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)  
→ [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md)
