# 2️⃣ Custom Hooks

## 📖 QUOI

**Un custom hook** = une fonction réutilisable qui utilise d'autres hooks (useState, useEffect, etc.).

Tu crées ta propre logique réutilisable!

```javascript
function use[NomLogique]() {
  const [valeur, setValeur] = useState()
  
  useEffect(() => {
    // Logique
  }, [])
  
  return [valeur, setValeur]
}
```

---

## 💡 POURQUOI

- ✅ Réutiliser la même logique dans plusieurs composants
- ✅ Garder les composants propres et simples
- ✅ Partager du code complexe facilement
- ✅ Plus facile à tester

---

## 🛠️ COMMENT

### Exemple 1 : Hook untuk form

**useForm.js**
```javascript
import { useState } from 'react'

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, handleChange, reset, setErrors }
}
```

**Utilisation**
```javascript
function LoginForm() {
  const { values, handleChange, reset } = useForm({
    email: '',
    password: ''
  })

  return (
    <div>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
      />
      <button onClick={reset}>Réinitialiser</button>
    </div>
  )
}
```

### Exemple 2 : Hook pour récupérer des données

**useFetch.js**
```javascript
import { useState, useEffect } from 'react'

export function useFetch([url]) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch([url])
      .then(r => r.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [[url]])

  return { data, loading, error }
}
```

**Utilisation**
```javascript
function Utilisateurs() {
  const { data: users, loading, error } = useFetch(
    'https://api.example.com/users'
  )

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur: {error}</p>

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.nom}</li>)}
    </ul>
  )
}
```

### Exemple 3 : Hook pour Local Storage

**useLocalStorage.js**
```javascript
import { useState, useEffect } from 'react'

export function useLocalStorage([key], [initialValue]) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem([key])
    return item ? JSON.parse(item) : [initialValue]
  })

  useEffect(() => {
    window.localStorage.setItem([key], JSON.stringify(value))
  }, [value, [key]])

  return [value, setValue]
}
```

**Utilisation**
```javascript
function Preferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Changer
      </button>
    </div>
  )
}
```

### Exemple 4 : Hook pour comptage avec délai

**useDelayedCounter.js**
```javascript
import { useState, useEffect } from 'react'

export function useDelayedCounter([initialValue] = 0, [delay] = 1000) {
  const [count, setCount] = useState([initialValue])

  const increment = () => {
    setCount(c => c + 1)
  }

  const decrement = () => {
    setCount(c => c - 1)
  }

  const reset = () => {
    setCount([initialValue])
  }

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Auto-incrément')
      setCount(c => c + 1)
    }, [delay])

    return () => clearInterval(timer)
  }, [[delay]])

  return { count, increment, decrement, reset }
}
```

---

## 📌 EXEMPLE Complet

**Hook pour gérer un panier**

**usePanier.js**
```javascript
import { useState } from 'react'

export function usePanier() {
  const [articles, setArticles] = useState([])

  const ajouter = (produit) => {
    const existe = articles.find(a => a.id === produit.id)
    
    if (existe) {
      setArticles(articles.map(a =>
        a.id === produit.id
          ? { ...a, quantite: a.quantite + 1 }
          : a
      ))
    } else {
      setArticles([...articles, { ...produit, quantite: 1 }])
    }
  }

  const supprimer = (id) => {
    setArticles(articles.filter(a => a.id !== id))
  }

  const total = articles.reduce((sum, a) => sum + a.prix * a.quantite, 0)

  return { articles, ajouter, supprimer, total }
}
```

**Utilisation**
```javascript
function Boutique() {
  const { articles, ajouter, supprimer, total } = usePanier()

  return (
    <div>
      <h1>Panier ({articles.length})</h1>
      <ul>
        {articles.map(a => (
          <li key={a.id}>
            {a.nom} x{a.quantite} = {a.prix * a.quantite}€
            <button onClick={() => supprimer(a.id)}>❌</button>
          </li>
        ))}
      </ul>
      <p>Total: {total}€</p>
    </div>
  )
}
```

---

## ⚠️ Règles importantes

### 1. Le nom doit commencer par "use"

```javascript
✅ function useMonHook() { ... }
❌ function monHook() { ... }  // Pas bon
```

### 2. Les hooks personnalisés se composent d'autres hooks

```javascript
✅ BON : Utilise d'autres hooks
function useMaLogique() {
  const [state, setState] = useState()
  useEffect(() => { ... }, [])
  return state
}

❌ ERREUR : Attendre une condition
function useMaLogique() {
  if (condition) {
    const [state, setState] = useState()  // ❌ Pas bon!
  }
}
```

---

**[Suivant: Patterns →](./3-patterns.md)**
