# 1️⃣ Context API - État Global

## 📖 QUOI

**Context API** = partager des données entre TOUS tes composants sans passer par les props (évite le "prop drilling").

```javascript
const MonContext = createContext()

// Fournisseur
<MonContext.Provider value={donnees}>
  <App />
</MonContext.Provider>

// Utilisation
const donnees = useContext(MonContext)
```

---

## 💡 POURQUOI

**Problème sans Context :**
```
App
├── Navbar          ← Veut l'utilisateur
├── Sidebar         ← Veut l'utilisateur
│   └── MenuItem    ← Veut l'utilisateur
│       └── Button  ← Veut enfin l'utilisateur!
```

Tu dois passer `utilisateur` via props à travers 4 niveaux! 😱

**Solution avec Context :**
App met l'utilisateur dans Context → Button peut y accéder directement! 🎉

---

## 🛠️ COMMENT

### Modèle réutilisable

**MonContext.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { createContext, useState } from 'react'

export const MonContext = createContext()

export function MonProvider({ children }) {
  const [valeur, setValeur] = useState(false)

  const value = {
    valeur,
    setValeur
  }

  return (
    <MonContext.Provider value={value}>
      {children}
    </MonContext.Provider>
  )
}
```

**Utilisation dans un composant :**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useContext } from 'react'
import { MonContext } from './MonContext'

function MonComposant() {
  const { valeur, setValeur } = useContext(MonContext)

  return <p>{valeur}</p>
}
```

### Exemple 1 : Contexte d'utilisateur

**UtilisateurContext.jsx**
```javascript
import { createContext, useState } from 'react'

export const UtilisateurContext = createContext()

export function UtilisateurProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null)
  const [isLogged, setIsLogged] = useState(false)

  const login = (nom, email) => {
    setUtilisateur({ nom, email })
    setIsLogged(true)
  }

  const logout = () => {
    setUtilisateur(null)
    setIsLogged(false)
  }

  const value = {
    utilisateur,
    isLogged,
    login,
    logout
  }

  return (
    <UtilisateurContext.Provider value={value}>
      {children}
    </UtilisateurContext.Provider>
  )
}
```

**App.jsx**
```javascript
import { UtilisateurProvider } from './UtilisateurContext'
import Navbar from './Navbar'
import Accueil from './Accueil'

function App() {
  return (
    <UtilisateurProvider>
      <Navbar />
      <Accueil />
    </UtilisateurProvider>
  )
}

export default App
```

**Navbar.jsx**
```javascript
import { useContext } from 'react'
import { UtilisateurContext } from './UtilisateurContext'

function Navbar() {
  const { utilisateur, isLogged, logout } = useContext(UtilisateurContext)

  return (
    <nav>
      {isLogged ? (
        <>
          <p>Bienvenue {utilisateur.nom}!</p>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <p>Non connecté</p>
      )}
    </nav>
  )
}

export default Navbar
```

### Exemple 2 : Theme (Clair/Sombre)

**ThemeContext.jsx**
```javascript
import { createContext, useState } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const value = { theme, toggleTheme }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

**App.jsx (avec styles)**
```javascript
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from './ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  const styles = {
    backgroundColor: theme === 'light' ? 'white' : 'black',
    color: theme === 'light' ? 'black' : 'white'
  }

  return (
    <div style={styles}>
      <h1>Mon App</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  )
}

export default App
```

---

## 📌 EXEMPLE Complet

**Contexte panier d'achat global**

**PanierContext.jsx**
```javascript
import { createContext, useState } from 'react'

export const PanierContext = createContext()

export function PanierProvider({ children }) {
  const [articles, setArticles] = useState([])

  const ajouter = (produit) => {
    setArticles([...articles, { ...produit, id: Date.now() }])
  }

  const supprimer = (id) => {
    setArticles(articles.filter(a => a.id !== id))
  }

  const vider = () => {
    setArticles([])
  }

  const total = articles.reduce((sum, a) => sum + a.prix, 0)

  const value = {
    articles,
    ajouter,
    supprimer,
    vider,
    total,
    nombre: articles.length
  }

  return (
    <PanierContext.Provider value={value}>
      {children}
    </PanierContext.Provider>
  )
}
```

**Panier.jsx**
```javascript
import { useContext } from 'react'
import { PanierContext } from './PanierContext'

function Panier() {
  const { articles, supprimer, total } = useContext(PanierContext)

  return (
    <div>
      <h2>Mon Panier ({articles.length})</h2>
      {articles.length === 0 ? (
        <p>Panier vide</p>
      ) : (
        <>
          <ul>
            {articles.map(a => (
              <li key={a.id}>
                {a.nom} - {a.prix}€
                <button onClick={() => supprimer(a.id)}>❌</button>
              </li>
            ))}
          </ul>
          <h3>Total: {total}€</h3>
        </>
      )}
    </div>
  )
}

export default Panier
```

---

## ⚠️ Bonnes pratiques

### 1. Crée un hook personnalisé pour ton contexte

```javascript
// ✅ BON
export function useUtilisateur() {
  return useContext(UtilisateurContext)
}

// Dans un composant (plus facile à utiliser)
function MonComposant() {
  const { utilisateur } = useUtilisateur()
}

// ❌ Au lieu de
function MonComposant() {
  const { utilisateur } = useContext(UtilisateurContext)
}
```

### 2. Ne mets pas TOUT dans un seul Context

```javascript
❌ MAUVAIS : Un Context pour tout
const GlobalContext = createContext()
// utilisateur, theme, panier, language, etc...

✅ BON : Contextes séparés
const UtilisateurContext = createContext()
const ThemeContext = createContext()
const PanierContext = createContext()
```

### 3. Imbrication des Providers

```javascript
function App() {
  return (
    <UtilisateurProvider>
      <ThemeProvider>
        <PanierProvider>
          <AppContent />
        </PanierProvider>
      </ThemeProvider>
    </UtilisateurProvider>
  )
}
```

---

**[Suivant: Custom Hooks →](./2-custom-hooks.md)**
