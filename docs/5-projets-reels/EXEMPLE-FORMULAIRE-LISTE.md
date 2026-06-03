# 📝 Exemple: Formulaire → Liste (Recherche)

## 🎯 Cas d'usage réel

Utilisateur remplie un formulaire de recherche → voit une liste de résultats filtrés

**Parfait pour:**
- Search bar
- Filtres
- Tri
- Pagination

---

## 📁 Structure

```
src/
├── pages/
│   ├── Recherche.jsx         ← Formulaire + liste
│   └── ResultatRecherche.jsx ← Affiche les résultats
├── context/
│   └── RechercheContext.jsx  ← Partage les données
└── App.jsx
```

---

## 💻 Code complet

### 1️⃣ Context de recherche

**src/context/RechercheContext.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { createContext, useState } from 'react'

export const RechercheContext = createContext()

export function RechercheProvider({ children }) {
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])
  const [triPar, setTriPar] = useState('nom')

  const effectuerRecherche = (terme) => {
    setRecherche(terme)

    // Simuler une recherche (normalement tu ferais un fetch API)
    const produits = [
      { id: 1, nom: 'Laptop', categorie: 'Électronique', prix: 999 },
      { id: 2, nom: 'Téléphone', categorie: 'Électronique', prix: 699 },
      { id: 3, nom: 'Livre JavaScript', categorie: 'Livres', prix: 45 },
      { id: 4, nom: 'Tablet', categorie: 'Électronique', prix: 399 },
      { id: 5, nom: 'Livre React', categorie: 'Livres', prix: 55 },
      { id: 6, nom: 'Souris', categorie: 'Accessoires', prix: 29 },
      { id: 7, nom: 'Clavier', categorie: 'Accessoires', prix: 89 }
    ]

    // Filtrer selon la recherche
    const filtered = produits.filter(p =>
      p.nom.toLowerCase().includes(terme.toLowerCase()) ||
      p.categorie.toLowerCase().includes(terme.toLowerCase())
    )

    setResultats(filtered)
  }

  const value = {
    recherche,
    resultats,
    triPar,
    setTriPar,
    effectuerRecherche
  }

  return (
    <RechercheContext.Provider value={value}>
      {children}
    </RechercheContext.Provider>
  )
}
```

### 2️⃣ Page de recherche avec formulaire

**src/pages/Recherche.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { RechercheContext } from '../context/RechercheContext'

function Recherche() {
  const [terme, setTerme] = useState('')
  const { effectuerRecherche, resultats, triPar, setTriPar } = useContext(RechercheContext)
  const navigate = useNavigate()

  const handleRechercher = () => {
    if (terme.trim()) {
      effectuerRecherche(terme)
      navigate('/resultats')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRechercher()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formulaire}>
        <h1>🔍 Rechercher dans notre catalogue</h1>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Chercher un produit ou une catégorie..."
            value={terme}
            onChange={(e) => setTerme(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
          />
          <button 
            onClick={handleRechercher}
            style={styles.boutton}
          >
            Rechercher
          </button>
        </div>

        <div style={styles.filtres}>
          <label>Trier par:</label>
          <select 
            value={triPar}
            onChange={(e) => setTriPar(e.target.value)}
            style={styles.select}
          >
            <option value="nom">Nom (A-Z)</option>
            <option value="prix-asc">Prix (Croissant)</option>
            <option value="prix-desc">Prix (Décroissant)</option>
          </select>
        </div>

        <div style={styles.stats}>
          <p>Résultats trouvés: <strong>{resultats.length}</strong></p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  formulaire: {
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '10px'
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  boutton: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  filtres: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  select: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  stats: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    textAlign: 'center'
  }
}

export default Recherche
```

### 3️⃣ Page d'affichage des résultats

**src/pages/ResultatRecherche.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RechercheContext } from '../context/RechercheContext'

function ResultatRecherche() {
  const { recherche, resultats, triPar } = useContext(RechercheContext)

  // Trier les résultats
  const resultatsTriés = useMemo(() => {
    const copy = [...resultats]
    
    if (triPar === 'prix-asc') {
      copy.sort((a, b) => a.prix - b.prix)
    } else if (triPar === 'prix-desc') {
      copy.sort((a, b) => b.prix - a.prix)
    } else {
      copy.sort((a, b) => a.nom.localeCompare(b.nom))
    }
    
    return copy
  }, [resultats, triPar])

  if (resultats.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h2>Aucun résultat 😞</h2>
          <p>Aucun produit ne correspond à "{recherche}"</p>
          <Link to="/recherche">
            <button style={styles.bouton}>Nouvelle recherche</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📊 Résultats de recherche</h1>
        <p>Recherche: <strong>"{recherche}"</strong></p>
        <p>Résultats: <strong>{resultatsTriés.length}</strong></p>
        <Link to="/recherche">
          <button style={styles.boutonRetour}>← Nouvelle recherche</button>
        </Link>
      </div>

      <div style={styles.liste}>
        {resultatsTriés.map(produit => (
          <div key={produit.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <h3>{produit.nom}</h3>
              <span style={styles.prix}>{produit.prix}€</span>
            </div>
            <p style={styles.categorie}>Catégorie: {produit.categorie}</p>
            <button style={styles.bouton}>
              Voir détails
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px'
  },
  liste: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  item: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  prix: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'green'
  },
  categorie: {
    color: '#666',
    marginBottom: '15px'
  },
  bouton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  boutonRetour: {
    padding: '10px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px'
  }
}

export default ResultatRecherche
```

### 4️⃣ App.jsx avec les routes

**src/App.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RechercheProvider } from './context/RechercheContext'
import Recherche from './pages/Recherche'
import ResultatRecherche from './pages/ResultatRecherche'

function App() {
  return (
    <RechercheProvider>
      <BrowserRouter>
        <nav style={{ 
          backgroundColor: '#333', 
          padding: '15px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <h1>🔍 Moteur de Recherche</h1>
        </nav>

        <Routes>
          <Route path="/" element={<Recherche />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/resultats" element={<ResultatRecherche />} />
        </Routes>
      </BrowserRouter>
    </RechercheProvider>
  )
}

export default App
```

---

## 🎯 Flux de l'app

```
1. Utilisateur arrive sur /recherche
   ↓
2. Remplit le formulaire "Laptop"
   ↓
3. Clique sur "Rechercher"
   ↓
4. Données sauvegardées dans Context
   ↓
5. Navigation vers /resultats
   ↓
6. Affiche liste de produits filtrés
   ↓
7. Possibilité de trier (prix, nom)
```

---

## ✨ Points clés

✅ **Formulaire** → Récupère l'input  
✅ **Context** → Partage les données  
✅ **Navigation** → Va vers la page résultats  
✅ **Liste** → Affiche les résultats filtrés  
✅ **Tri** → Réorganise la liste  
✅ **Pas de rechargement** → Apps fluide ⚡

---

## 🚀 Pour tester

```bash
npm create vite@latest recherche-app -- --template react
cd recherche-app
npm install react-router-dom
# Copie-colle le code
npm run dev
```

Maintenant tu as un **moteur de recherche complet** ! 🎉
