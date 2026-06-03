# 3️⃣ Patterns & Bonnes pratiques

## 📖 QUOI

**Patterns** = solutions éprouvées et bonnes pratiques pour organiser ton code React.

Les patterns aident à garder le code propre, maintenable et scalable.

---

## 💡 POURQUOI

- ✅ Code plus lisible
- ✅ Bugs moins fréquents
- ✅ Plus facile à maintenir
- ✅ Facilite la collaboration

---

## 🛠️ Les patterns importants

### Pattern 1 : Composition de composants

**Au lieu de** : Un composant monolithe
```javascript
❌ function Card() {
  return (
    <div>
      <h2>Titre</h2>
      <img />
      <p>Contenu</p>
      <button>Action</button>
    </div>
  )
}
```

**Mieux** : Composants composables
```javascript
✅ function Card({ children }) {
  return <div className="card">{children}</div>
}

function CardHeader({ title }) {
  return <h2>{title}</h2>
}

function CardBody({ children }) {
  return <div>{children}</div>
}

function CardFooter({ action }) {
  return <button>{action}</button>
}

// Utilisation
<Card>
  <CardHeader title="Mon titre" />
  <CardBody>Contenu ici</CardBody>
  <CardFooter action="Cliquer" />
</Card>
```

### Pattern 2 : Render props

**Pour passer du JSX en prop :**

```javascript
function DataFetcher({ render, url }) {
  const { data, loading } = useFetch(url)

  return loading ? <p>Chargement...</p> : render(data)
}

// Utilisation
<DataFetcher
  url="https://api.example.com/users"
  render={(users) => (
    <ul>
      {users.map(u => <li key={u.id}>{u.nom}</li>)}
    </ul>
  )}
/>
```

### Pattern 3 : Higher Order Component (HOC)

**Pour ajouter de la logique à un composant :**

```javascript
function withTheme(Component) {
  return function ThemedComponent(props) {
    const [theme, setTheme] = useState('light')

    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
      <Component
        {...props}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )
  }
}

// Utilisation
function MonApp({ theme, toggleTheme }) {
  return (
    <div style={{ background: theme === 'light' ? 'white' : 'black' }}>
      <button onClick={toggleTheme}>Changer thème</button>
    </div>
  )
}

export default withTheme(MonApp)
```

### Pattern 4 : Conditional rendering

**Afficher différent contenu selon une condition :**

```javascript
// ✅ Option 1 : Ternaire
{isLoading ? <p>Chargement...</p> : <p>Fait!</p>}

// ✅ Option 2 : AND (&&)
{hasError && <p>Erreur!</p>}

// ✅ Option 3 : IF/ELSE
{(() => {
  if (isLoading) return <p>Chargement...</p>
  if (hasError) return <p>Erreur!</p>
  return <p>Succès!</p>
})()}

// ✅ Option 4 : Switch
{(() => {
  switch (status) {
    case 'loading': return <p>Chargement...</p>
    case 'error': return <p>Erreur!</p>
    case 'success': return <p>Succès!</p>
    default: return null
  }
})()}
```

### Pattern 5 : Key dans les listes

```javascript
// ❌ PAS BON : Key=index
{items.map((item, index) => <div key={index}>{item}</div>)}

// ✅ BON : Key unique
{items.map(item => <div key={item.id}>{item.nom}</div>)}
```

### Pattern 6: Controlled vs Uncontrolled inputs

```javascript
// ✅ CONTROLLED (Recommandé)
function Controlled() {
  const [value, setValue] = useState('')
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

// ❌ UNCONTROLLED (À éviter)
function Uncontrolled() {
  const inputRef = useRef()
  return <input ref={inputRef} />
}
```

---

## 📌 Erreurs commune à éviter

### 1. Appels API sans dépendances

```javascript
❌ ERREUR : Boucle infinie
function App() {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
    // Manque les dépendances!
  })
}

✅ BON
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData)
}, [])  // ← Dépendances vides
```

### 2. État dérivé

```javascript
❌ ERREUR : Stocker des données qui peuvent être calculées
function App({ items }) {
  const [count, setCount] = useState(items.length)
  // Et si items change? count ne met pas à jour!
}

✅ BON : Calculer au rendu
function App({ items }) {
  const count = items.length  // Toujours à jour
}
```

### 3. Mutation directe du state

```javascript
❌ ERREUR
const [user, setUser] = useState({ name: 'Bob' })

user.name = 'Alice'  // ❌ Ne fonctionne pas!
setUser(user)

✅ BON
setUser({ ...user, name: 'Alice' })  // Copie + change
```

### 4. Props en tant que source de vérité

```javascript
❌ ERREUR
function Child({ initialValue }) {
  const [value, setValue] = useState(initialValue)
  // Si initialValue change, value ne met pas à jour!
}

✅ BON
function Child({ initialValue }) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])  // Mets à jour si prop change
}
```

---

## ✅ Checklist React

Avant d'envoyer ton code :

- [ ] Les props qui changent sont dans `useEffect` dépendances
- [ ] Pas de state dérivable (calculé à partir d'autres states)
- [ ] Les listes ont des clés uniques
- [ ] Pas d'appels API directs (utilise `useEffect`)
- [ ] Gestion des états loading/error
- [ ] Les noms des composants commencent par majuscule
- [ ] Pas de mutation directe du state
- [ ] Les hooks sont au top du composant

---

C'est la fin de la documentation **Avancée**! 🎉

[Retour à l'INDEX](../INDEX.md)
