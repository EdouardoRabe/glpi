# 🚨 GUIDE - Erreurs React: Causes et Fixes

> Les erreurs les plus courantes et comment les corriger

---

## ❌ "Cannot read property 'X' of undefined"

### Cause
Vous essayez d'accéder à une propriété sur `undefined` ou `null`.

### ❌ BAD
```jsx
function UserCard({ user }) {
  return <p>{user.name}</p>;  // ⚠️ Si user=undefined, crash!
}

// Utilisé sans prop:
<UserCard />
```

### ✅ FIX 1 - Vérifier avant
```jsx
return <p>{user?.name}</p>;  // ✅ Optional chaining
// ou
return user ? <p>{user.name}</p> : <p>Pas d'user</p>;
```

### ✅ FIX 2 - Valeur par défaut
```jsx
function UserCard({ user = {} }) {
  return <p>{user.name || 'Anonymous'}</p>;
}
```

### ✅ FIX 3 - Destructuring avec défault
```jsx
function UserCard({ user: { name = 'Unknown' } = {} }) {
  return <p>{name}</p>;
}
```

---

## ❌ "is not a function"

### Cause
Vous appelez quelque chose qui n'est pas une fonction.

### ❌ BAD
```jsx
const users = [{ name: 'Alice' }];
users.map();  // ⚠️ Pas de callback!

// OU
const result = myVar();  // ⚠️ myVar n'est pas une function
```

### ✅ FIX
```jsx
users.map(u => u.name);  // ✅ Passer callback

// Vérifier le type:
if (typeof myVar === 'function') {
  myVar();
}
```

### ❌ BAD - Oubli parenthèses
```jsx
<button onClick={handleClick}>  // ✅ Correct (référence)
<button onClick={handleClick()}>  // ⚠️ Appelle immédiatement!

// handleClick() retourne undefined, pas une function
```

### ✅ GOOD
```jsx
// Référence (sans appel):
onClick={handleClick}

// Avec paramètres:
onClick={() => handleClick(userId)}

// Avec bind:
onClick={handleClick.bind(this, userId)}
```

---

## ❌ "Each child in a list should have a unique 'key' prop"

### Cause
`.map()` sans `key` ou avec `key={index}`.

### ❌ BAD 1 - Sans key
```jsx
{users.map(user => (
  <li>{user.name}</li>  // ⚠️ Pas de key!
))}
```

### ❌ BAD 2 - Index comme key
```jsx
{users.map((user, index) => (
  <li key={index}>{user.name}</li>  // ⚠️ Problématique!
))}
// Si vous supprimez ou réordonnez, state se mélange
```

### ✅ GOOD - Unique ID
```jsx
{users.map(user => (
  <li key={user.id}>{user.name}</li>  // ✅ Stable & unique
))}
```

### 🔑 Pourquoi?
React utilise `key` pour identifier. Avec `index`:
- Vous supprimez user[0] → user[1] devient index 0
- React pense c'est le même élément! State se mélange.

[Voir GUIDE-CLOSURES-STALE-STATE.md pour plus].

---

## ❌ "Can't set state on unmounted component"

### Cause
Vous appelez `setState` après que le composant soit supprimé.

### ❌ BAD
```jsx
useEffect(() => {
  setTimeout(() => {
    setData(123);  // ⚠️ Si composant démonté, erreur!
  }, 1000);
}, []);
```

### ✅ FIX - Cleanup avec flag
```jsx
useEffect(() => {
  let isMounted = true;

  setTimeout(() => {
    if (isMounted) {  // ✅ Vérifier avant setState
      setData(123);
    }
  }, 1000);

  return () => {
    isMounted = false;  // Cleanup
  };
}, []);
```

### ✅ FIX - Abort Controller
```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api', { signal: controller.signal })
    .then(r => r.json())
    .then(data => setData(data));

  return () => controller.abort();
}, []);
```

---

## ⚠️ "Warning: Unhandled promise rejection"

### Cause
`.catch()` manquant ou error pas gérée.

### ❌ BAD
```jsx
fetch('/api').then(r => r.json())
  .then(data => setData(data));
  // ⚠️ Si erreur, pas de handler!
```

### ✅ FIX
```jsx
fetch('/api')
  .then(r => r.json())
  .then(data => setData(data))
  .catch(err => console.error('Error:', err));
```

### ✅ BETTER - Avec async/await
```jsx
try {
  const res = await fetch('/api');
  const data = await res.json();
  setData(data);
} catch (err) {
  console.error('Error:', err);
}
```

---

## ❌ "Maximum update depth exceeded"

### Cause
Infinite loop de re-render (useEffect sans dépendances).

### ❌ BAD
```jsx
useEffect(() => {
  setState(state + 1);  // Cause re-render
});  // ⚠️ Pas de [], relancé à chaque render!
```

### ✅ FIX
```jsx
useEffect(() => {
  // Faire quelque chose UNE FOIS
  console.log('Mounted');
}, []);  // ✅ Dépendances vides
```

---

## ❌ "React does not recognize the X prop"

### Cause
Vous passez un attribut HTML invalide.

### ❌ BAD
```jsx
<button myCustom="5">Click</button>
// ⚠️ Dans Dev, warning (supprimé en Prod)
// Mais attribut pas passé au DOM
```

### ✅ FIX - Propriété React
```jsx
<button onClick={handleClick} disabled={isDisabled}>
  Click
</button>
```

### ✅ FIX 2 - Custom data
```jsx
<button data-id="5">Click</button>
// ✅ data-* attributes autorisés
```

---

## ❌ "Multiple children with same key"

### Cause
Deux éléments avec la même `key`.

### ❌ BAD
```jsx
{items.map(item => (
  <div key="same">  // ⚠️ Tous ont key="same"
    {item.name}
  </div>
))}
```

### ✅ GOOD
```jsx
{items.map((item, i) => (
  <div key={item.id}>  // ✅ Unique ID
    {item.name}
  </div>
))}
```

---

## ❌ "Cannot update state during render"

### Cause
`setState` appelé directement dans le composant (pas dans handler/useEffect).

### ❌ BAD
```jsx
function Component() {
  const [count, setCount] = useState(0);
  
  setCount(count + 1);  // ⚠️ Appelé à chaque render!
  
  return <p>{count}</p>;
}
```

### ✅ GOOD
```jsx
function Component() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);  // ✅ Dans handler
  };
  
  return <button onClick={increment}>{count}</button>;
}
```

---

## ❌ "Unexpected token"

### Cause
Erreur de syntaxe (typo, parenthèse, etc).

### ❌ BAD
```jsx
const obj = { name: 'Alice' name: 'Bob' };  // ⚠️ Virgule manquante
const arr = [1, 2, 3;  // ⚠️ Crochet fermant manquant
```

### ✅ FIX
```jsx
const obj = { name: 'Alice', name: 'Bob' };  // ✅ Virgule
const arr = [1, 2, 3];  // ✅ Crochet
```

---

## ⚠️ "ESLint: X is missing from dependency array"

### Cause
Variable utilisée dans `useEffect` mais pas dans dépendances.

### ❌ BAD
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);  // ⚠️ count utilisé mais absent de []
}, []);
```

### ✅ FIX
```jsx
useEffect(() => {
  console.log(count);
}, [count]);  // ✅ Ajouter dépendance
```

---

## 🎯 Checklist Rapide

| Erreur | Vérifications |
|--------|----------------|
| undefined | Utiliser `?.` ou vérifier avant |
| not a function | Vérifier c'est vraiment une fonction |
| missing key | Tous les éléments `.map()` ont `key` |
| state on unmounted | Vérifier `isMounted` avant setState |
| infinite loop | Ajouter `[]` aux useEffect |
| Syntax error | Utiliser linter/prettier |

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)  
→ [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)
