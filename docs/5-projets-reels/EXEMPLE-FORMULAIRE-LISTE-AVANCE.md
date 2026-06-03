# 🚀 Exemple Amélioré: Formulaire → Liste avec useSearchParams

## 🎯 Différence avec l'ancienne version

**Ancienne:** Utilisait Context (données non partageables)  
**Nouvelle:** Utilise **useSearchParams** (URLs shareable, bookmarkable)

```
Ancienne: /resultat
Nouvelle: /recherche?search=laptop&sort=prix&page=1
          ↑ Partageable! Bookmarkable! SEO friendly!
```

---

## 📁 Structure

```
src/
├── pages/
│   └── Recherche.jsx          ← Formulaire + Résultats
└── App.jsx
```

---

## 💻 Code complet

### App.jsx avec routing

**src/App.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Recherche from './pages/Recherche'

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        backgroundColor: '#333',
        padding: '15px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>🔍 Moteur de Recherche - Professionnel</h1>
      </nav>

      <Routes>
        <Route path="/" element={<Recherche />} />
        <Route path="/recherche" element={<Recherche />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### Page Recherche COMPLÈTE

**src/pages/Recherche.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'

function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Récupérer les paramètres de l'URL
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'nom'
  const page = parseInt(searchParams.get('page') || '1')

  // Données simulées (normalement une API)
  const toutLesProduits = [
    { id: 1, nom: 'Laptop', categorie: 'Électronique', prix: 999 },
    { id: 2, nom: 'Téléphone', categorie: 'Électronique', prix: 699 },
    { id: 3, nom: 'Livre JavaScript', categorie: 'Livres', prix: 45 },
    { id: 4, nom: 'Tablet', categorie: 'Électronique', prix: 399 },
    { id: 5, nom: 'Livre React', categorie: 'Livres', prix: 55 },
    { id: 6, nom: 'Souris', categorie: 'Accessoires', prix: 29 },
    { id: 7, nom: 'Clavier', categorie: 'Accessoires', prix: 89 },
    { id: 8, nom: 'Laptop Gaming', categorie: 'Électronique', prix: 1500 },
    { id: 9, nom: 'Livre HTML', categorie: 'Livres', prix: 35 }
  ]

  // Filtrer et trier
  const produitsFiltres = useMemo(() => {
    let resultat = toutLesProduits.filter(p =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.categorie.toLowerCase().includes(search.toLowerCase())
    )

    // Trier
    if (sort === 'prix-asc') {
      resultat.sort((a, b) => a.prix - b.prix)
    } else if (sort === 'prix-desc') {
      resultat.sort((a, b) => b.prix - a.prix)
    } else {
      resultat.sort((a, b) => a.nom.localeCompare(b.nom))
    }

    return resultat
  }, [search, sort])

  // Pagination
  const itemsParPage = 3
  const totalPages = Math.ceil(produitsFiltres.length / itemsParPage)
  const produitsPagines = produitsFiltres.slice(
    (page - 1) * itemsParPage,
    page * itemsParPage
  )

  // Fonctions pour modifier l'URL
  const handleSearch = (terme) => {
    // ← Template literal pour construire l'URL
    setSearchParams(`?search=${terme}&sort=${sort}&page=1`)
  }

  const handleSort = (newSort) => {
    setSearchParams(`?search=${search}&sort=${newSort}&page=1`)
  }

  const handlePage = (newPage) => {
    setSearchParams(`?search=${search}&sort=${sort}&page=${newPage}`)
  }

  const handleReset = () => {
    setSearchParams('')  // Réinitialise l'URL
  }

  return (
    <div style={styles.container}>
      {/* Formulaire */}
      <div style={styles.formulaire}>
        <h2>🔍 Recherche</h2>

        {/* Input de recherche */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Chercher un produit ou une catégorie..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Filtres */}
        <div style={styles.filtres}>
          <div>
            <label>Trier par:</label>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              style={styles.select}
            >
              <option value="nom">Nom (A-Z)</option>
              <option value="prix-asc">Prix (Croissant)</option>
              <option value="prix-desc">Prix (Décroissant)</option>
            </select>
          </div>

          <button onClick={handleReset} style={styles.resetButton}>
            ✖️ Réinitialiser
          </button>
        </div>

        {/* Afficher l'URL actuelle */}
        <div style={styles.urlBox}>
          <p><strong>URL actuelle:</strong></p>
          <code>
            {/* Template literal pour montrer l'URL complète */}
            ?search=${search}&sort=${sort}&page=${page}
          </code>
          <p style={{ fontSize: '12px', color: '#666' }}>
            💡 Tu peux copier cette URL et la partager!
          </p>
        </div>
      </div>

      {/* Résultats */}
      <div style={styles.resultats}>
        <h2>📊 Résultats</h2>

        {/* Stats */}
        <div style={styles.stats}>
          <p>
            Affichage {produitsPagines.length > 0 ? (page - 1) * itemsParPage + 1 : 0} à
            {' '}{Math.min(page * itemsParPage, produitsFiltres.length)}
            {' '}sur <strong>{produitsFiltres.length}</strong> résultats
          </p>
        </div>

        {/* Affichage: Aucun résultat */}
        {produitsFiltres.length === 0 && (
          <div style={styles.empty}>
            <h3>Aucun résultat 😞</h3>
            <p>Aucun produit ne correspond à "{search}"</p>
            {search && (
              <button onClick={handleReset} style={styles.button}>
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {/* Liste de produits */}
        {produitsFiltres.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {produitsPagines.map(produit => (
                <div key={produit.id} style={styles.card}>
                  <h3>{produit.nom}</h3>
                  <p style={styles.categorie}>📁 {produit.categorie}</p>
                  <p style={styles.prix}>{produit.prix}€</p>
                  {/* Template literal pour créer un lien avec contexte */}
                  <a href={`?search=${search}&sort=${sort}&page=${page}`}>
                    📌 Garder cette recherche
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page === 1}
                  style={{
                    ...styles.pagButton,
                    opacity: page === 1 ? 0.5 : 1,
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Précédent
                </button>

                <div style={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      style={{
                        ...styles.pageNumber,
                        backgroundColor: p === page ? '#007bff' : '#f0f0f0',
                        color: p === page ? 'white' : 'black',
                        fontWeight: p === page ? 'bold' : 'normal'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page === totalPages}
                  style={{
                    ...styles.pagButton,
                    opacity: page === totalPages ? 0.5 : 1,
                    cursor: page === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info pédago */}
      <div style={styles.infoBox}>
        <h3>💡 Comment ça marche?</h3>
        <ul>
          <li>Change la recherche → L'URL se met à jour automatiquement</li>
          <li>Copie l'URL → Quelqu'un peut voir exactement ta recherche</li>
          <li>Utilise le bouton retour du navigateur → Reviens à la recherche précédente</li>
          <li>Bookmark l'URL → Retrouve ta recherche plus tard</li>
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  formulaire: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px'
  },
  searchBox: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  filtres: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '15px'
  },
  select: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  resetButton: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  urlBox: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '5px',
    borderLeft: '4px solid #007bff'
  },
  resultats: {
    marginBottom: '30px'
  },
  stats: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  categorie: {
    color: '#666',
    marginBottom: '10px'
  },
  prix: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'green',
    marginBottom: '10px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    alignItems: 'center',
    marginTop: '30px'
  },
  pagButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  pageNumbers: {
    display: 'flex',
    gap: '5px'
  },
  pageNumber: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  infoBox: {
    backgroundColor: '#e7ffe7',
    padding: '20px',
    borderRadius: '10px',
    borderLeft: '4px solid #28a745'
  }
}

export default Recherche
```

---

## 🎯 Points clés

✅ **useSearchParams** - Les données dans l'URL  
✅ **Template literals** - Construire les URLs dynamically  
✅ **Pagination** - Afficher par pages  
✅ **Filtre + Tri** - Tout dans l'URL  
✅ **Shareable** - Copie l'URL et partage!  
✅ **Bookmarkable** - Enregistre la recherche  

---

## 📊 Avantage: URLs shareable

```
Avant:
❌ User A: cherche "laptop"
   User B: reçoit mais voit rien (pas la recherche)

Après:
✅ User A: envoie /recherche?search=laptop&sort=prix&page=1
   User B: reçoit et voit EXACTEMENT la même chose!
```

---

## 🚀 Tester

```bash
npm create vite@latest recherche-pro -- --template react
cd recherche-pro
npm install react-router-dom
# Copie le code
npm run dev

# Essaie:
# /recherche?search=laptop
# /recherche?search=laptop&sort=prix-asc
# /recherche?search=&sort=prix-desc&page=2
```

**C'est du React professionnel!** 🎉
