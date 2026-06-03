# 🚀 Exemple Complet: App E-commerce avec React Router

## 📦 Une app complète avec:
- ✅ Multiple pages (Accueil, Produits, Détail, Contact, Panier)
- ✅ React Router (navigation)
- ✅ Context (panier partagé)
- ✅ Formulaires
- ✅ API (jsonplaceholder simulée)
- ✅ Structure réelle

---

## 📁 Structure du projet

```
ecommerce-app/
├── src/
│   ├── pages/
│   │   ├── Accueil.jsx
│   │   ├── Produits.jsx
│   │   ├── DetailProduit.jsx
│   │   ├── Panier.jsx
│   │   └── Contact.jsx
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── ProductCard.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── PanierContext.jsx
│   ├── App.jsx
│   └── App.css
```

---

## 📝 Code complet

### 1️⃣ Context du Panier

**src/context/PanierContext.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { createContext, useState } from 'react'

export const PanierContext = createContext()

export function PanierProvider({ children }) {
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

  const vider = () => {
    setArticles([])
  }

  const total = articles.reduce((sum, a) => sum + a.prix * a.quantite, 0)

  return (
    <PanierContext.Provider value={{ articles, ajouter, supprimer, vider, total }}>
      {children}
    </PanierContext.Provider>
  )
}
```

### 2️⃣ Navigation

**src/components/Navigation.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { PanierContext } from '../context/PanierContext'

function Navigation() {
  const { articles } = useContext(PanierContext)

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>🏠 Accueil</Link>
      <Link to="/produits" style={styles.link}>📦 Produits</Link>
      <Link to="/contact" style={styles.link}>✉️ Contact</Link>
      <Link to="/panier" style={styles.link}>
        🛒 Panier ({articles.length})
      </Link>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '15px 20px',
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px'
  }
}

export default Navigation
```

### 3️⃣ Pages

**src/pages/Accueil.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'

function Accueil() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🛍️ Bienvenue in notre boutique</h1>
      <p>Découvre nos produits exceptionnels</p>
      <Link to="/produits">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>
          Voir les produits →
        </button>
      </Link>
    </div>
  )
}

export default Accueil
```

**src/pages/Produits.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function Produits() {
  const produits = [
    { id: 1, nom: 'Laptop', prix: 999, description: 'Laptop puissant' },
    { id: 2, nom: 'Téléphone', prix: 699, description: 'Téléphone rapide' },
    { id: 3, nom: 'Tablet', prix: 399, description: 'Tablet légère' },
    { id: 4, nom: 'Montre', prix: 299, description: 'Montre connectée' },
    { id: 5, nom: 'Écouteurs', prix: 199, description: 'Écouteurs sans fil' }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1>📦 Nos Produits</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {produits.map(p => (
          <ProductCard key={p.id} produit={p} />
        ))}
      </div>
    </div>
  )
}

export default Produits
```

**src/pages/DetailProduit.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useParams, Link } from 'react-router-dom'
import { useContext } from 'react'
import { PanierContext } from '../context/PanierContext'

function DetailProduit() {
  const { id } = useParams()
  const { ajouter } = useContext(PanierContext)

  const produits = {
    1: { nom: 'Laptop', prix: 999, description: 'Laptop ultra puissant avec 16GB RAM', stock: 5 },
    2: { nom: 'Téléphone', prix: 699, description: 'Téléphone 5G très rapide', stock: 10 },
    3: { nom: 'Tablet', prix: 399, description: 'Tablet 10 pouces légère', stock: 8 },
    4: { nom: 'Montre', prix: 299, description: 'Montre intelligente', stock: 15 },
    5: { nom: 'Écouteurs', prix: 199, description: 'Écouteurs sans fil avec ANC', stock: 20 }
  }

  const produit = produits[id]

  const handleAjouter = () => {
    ajouter({ id: parseInt(id), ...produit })
    alert(`${produit.nom} ajouté au panier!`)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/produits" style={{ color: 'blue', textDecoration: 'underline' }}>
        ← Retour
      </Link>
      <h1>{produit.nom}</h1>
      <p>{produit.description}</p>
      <h2>Prix: {produit.prix}€</h2>
      <p>Stock: {produit.stock} disponibles</p>
      <button 
        onClick={handleAjouter}
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🛒 Ajouter au panier
      </button>
    </div>
  )
}

export default DetailProduit
```

**src/pages/Panier.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useContext } from 'react'
import { PanierContext } from '../context/PanierContext'
import { Link } from 'react-router-dom'

function Panier() {
  const { articles, supprimer, vider, total } = useContext(PanierContext)

  if (articles.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🛒 Panier vide</h1>
        <Link to="/produits">
          <button>Continuer les achats</button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🛒 Mon Panier</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{a.nom}</td>
              <td>{a.prix}€</td>
              <td>{a.quantite}</td>
              <td>{a.prix * a.quantite}€</td>
              <td>
                <button 
                  onClick={() => supprimer(a.id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total: {total}€</h2>
      <div style={{ gap: '10px', display: 'flex' }}>
        <button onClick={vider} style={{ backgroundColor: 'orange', color: 'white' }}>
          Vider le panier
        </button>
        <button style={{ backgroundColor: 'green', color: 'white' }}>
          Procéder au paiement
        </button>
      </div>
    </div>
  )
}

export default Panier
```

**src/pages/Contact.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' })
  const [erreurs, setErreurs] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = () => {
    const newErreurs = {}
    if (!formData.nom) newErreurs.nom = 'Nom requis'
    if (!formData.email.includes('@')) newErreurs.email = 'Email invalide'
    if (!formData.message) newErreurs.message = 'Message requis'

    setErreurs(newErreurs)

    if (Object.keys(newErreurs).length === 0) {
      alert('✅ Message envoyé!')
      setFormData({ nom: '', email: '', message: '' })
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>✉️ Nous contacter</h1>

      <div style={{ marginBottom: '15px' }}>
        <label>Nom</label>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Votre nom"
          style={{ width: '100%', padding: '10px' }}
        />
        {erreurs.nom && <p style={{ color: 'red' }}>{erreurs.nom}</p>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Votre email"
          style={{ width: '100%', padding: '10px' }}
        />
        {erreurs.email && <p style={{ color: 'red' }}>{erreurs.email}</p>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Votre message"
          rows="5"
          style={{ width: '100%', padding: '10px' }}
        />
        {erreurs.message && <p style={{ color: 'red' }}>{erreurs.message}</p>}
      </div>

      <button 
        onClick={handleSubmit}
        style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px' }}
      >
        Envoyer
      </button>
    </div>
  )
}

export default Contact
```

### 4️⃣ Composant ProductCard

**src/components/ProductCard.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { PanierContext } from '../context/PanierContext'

function ProductCard({ produit }) {
  const { ajouter } = useContext(PanierContext)

  return (
    <div style={styles.card}>
      <h3>{produit.nom}</h3>
      <p>{produit.description}</p>
      <h2>{produit.prix}€</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/produits/${produit.id}`}>
          <button style={styles.button}>Voir détails</button>
        </Link>
        <button 
          onClick={() => ajouter(produit)}
          style={{ ...styles.button, backgroundColor: 'green' }}
        >
          🛒 Ajouter
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default ProductCard
```

### 5️⃣ App.jsx avec React Router

**src/App.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PanierProvider } from './context/PanierContext'
import Navigation from './components/Navigation'
import Accueil from './pages/Accueil'
import Produits from './pages/Produits'
import DetailProduit from './pages/DetailProduit'
import Panier from './pages/Panier'
import Contact from './pages/Contact'

function App() {
  return (
    <PanierProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/:id" element={<DetailProduit />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </PanierProvider>
  )
}

export default App
```

---

## 🎯 What you learned

✅ Multiple pages avec React Router  
✅ Navigation sans rechargement  
✅ Paramètres d'URL dynamiques (`:id`)  
✅ Context pour l'état global (panier)  
✅ Formulaires avec validation  
✅ Organisation réelle d'un projet  
✅ Composants réutilisables  

---

## 🚀 Pour tester

```bash
# 1. Crée le projet
npm create vite@latest ecommerce-app -- --template react
cd ecommerce-app

# 2. Installe react-router
npm install react-router-dom

# 3. Remplace le contenu de src/ avec les fichiers ci-dessus

# 4. Lance l'app
npm run dev
```

Maintenant tu peux:
- Naviguer entre pages (URL change)
- Ajouter des produits au panier
- Voir le détail d'un produit
- Envoyer un formulaire contact

**C'est une vraie app!** 🎉
