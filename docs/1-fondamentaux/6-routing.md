# 6️⃣ React Router - Navigation multipages

## 📖 QUOI

**React Router** = une bibliothèque qui permet de naviguer entre plusieurs pages dans une app React sans recharger la page.

```javascript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// Ça crée des pages avec des URLs différentes
// /accueil, /produits, /contact, etc.
```

---

## 💡 POURQUOI

Sans React Router:
- ❌ Tu peux pas naviguer entre "pages"
- ❌ Pas d'URLs différentes pour différents contenus
- ❌ L'app recharge à chaque changement

Avec React Router:
- ✅ Vraies pages avec URLs (`/accueil`, `/produits`)
- ✅ Historique du navigateur (bouton retour fonctionne)
- ✅ Pas de rechargement (app fluide)
- ✅ Partageables (tu peux envoyer `/produits/123`)

---

## 🛠️ COMMENT

### Étape 1: Installer React Router

```bash
npm install react-router-dom
```

### Étape 2: Créer tes pages

**src/pages/Accueil.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien de spécial)

function Accueil() {
  return (
    <div>
      <h1>Bienvenue sur l'Accueil</h1>
      <p>Ceci est la page d'accueil</p>
    </div>
  )
}

export default Accueil
```

**src/pages/Produits.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'

function Produits() {
  const produits = [
    { id: 1, nom: 'Laptop', prix: 999 },
    { id: 2, nom: 'Téléphone', prix: 699 },
    { id: 3, nom: 'Tablet', prix: 399 }
  ]

  return (
    <div>
      <h1>Nos Produits</h1>
      <ul>
        {produits.map(p => (
          <li key={p.id}>
            <Link to={`/produits/${p.id}`}>
              {p.nom} - {p.prix}€
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Produits
```

**src/pages/DetailProduit.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useParams, Link } from 'react-router-dom'

function DetailProduit() {
  const { id } = useParams()  // Récupère l'ID de l'URL

  const produits = {
    1: { nom: 'Laptop', prix: 999, description: 'Super laptop' },
    2: { nom: 'Téléphone', prix: 699, description: 'Téléphone rapide' },
    3: { nom: 'Tablet', prix: 399, description: 'Tablet légère' }
  }

  const produit = produits[id]

  return (
    <div>
      <h1>{produit.nom}</h1>
      <p>{produit.description}</p>
      <p>Prix: {produit.prix}€</p>
      <Link to="/produits">← Retour aux produits</Link>
    </div>
  )
}

export default DetailProduit
```

**src/pages/Contact.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    alert(`Message envoyé depuis ${email}`)
    setEmail('')
    setMessage('')
  }

  return (
    <div>
      <h1>Nous contacter</h1>
      <input
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSubmit}>Envoyer</button>
    </div>
  )
}

export default Contact
```

### Étape 3: Créer la Navigation

**src/components/Navigation.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '15px',
      display: 'flex',
      gap: '20px'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        🏠 Accueil
      </Link>
      <Link to="/produits" style={{ color: 'white', textDecoration: 'none' }}>
        📦 Produits
      </Link>
      <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
        ✉️ Contact
      </Link>
    </nav>
  )
}

export default Navigation
```

### Étape 4: Configurer les Routes dans App.jsx

**src/App.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Accueil from './pages/Accueil'
import Produits from './pages/Produits'
import DetailProduit from './pages/DetailProduit'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/:id" element={<DetailProduit />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

---

## 📌 EXEMPLE Complet

Quand tu cliques sur "Produits":
1. URL change en `/produits`
2. Le composant `Produits` s'affiche
3. Pas de rechargement ⚡

Quand tu cliques sur "Laptop":
1. URL change en `/produits/1`
2. Le composant `DetailProduit` récupère l'ID avec `useParams()`
3. Affiche les détails du produit 1

---

## 🎯 Concepts clés

| Concept | Utilité |
|---------|---------|
| `<Route>` | Définit une page (URL) |
| `<Routes>` | Conteneur pour toutes les routes |
| `<BrowserRouter>` | Enveloppe l'app pour activer le routing |
| `<Link>` | Lien pour naviguer (sans rechargement) |
| `useParams()` | Récupère les paramètres de l'URL |
| `:id` | Paramètre dynamique dans l'URL |

---

## ⚠️ Important

```javascript
// ✅ BON - Utilise Link de react-router
import { Link } from 'react-router-dom'
<Link to="/produits">Produits</Link>

// ❌ MAUVAIS - Utilise <a> normal (recharge la page!)
<a href="/produits">Produits</a>
```

---

**[Suivant: Structure de projet →](../5-projets-reels/STRUCTURE-PROJET.md)**
