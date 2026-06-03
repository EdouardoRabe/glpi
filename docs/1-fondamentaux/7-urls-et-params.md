# 🔗 Guide: URLs, Params, et Template Literals

## 📖 Les 3 concepts clés

1. **useLocation** - Savoir où tu es
2. **useSearchParams** - Lire les paramètres d'URL
3. **Template literals** - Injecter des variables dans les strings

---

## 1️⃣ useLocation - Récupérer l'URL actuelle

```javascript
// ✅ IMPORTS NECESSAIRES
import { useLocation } from 'react-router-dom'

function MonComposant() {
  const location = useLocation()
  
  // location contient:
  // - pathname: '/produits' (le chemin)
  // - search: '?id=123&sort=prix' (les paramètres)
  // - hash: '#top' (ancre)
  // - state: {} (données du routeur)
  
  return (
    <div>
      <p>Tu es sur: {location.pathname}</p>
      <p>Paramètres: {location.search}</p>
    </div>
  )
}
```

---

## 2️⃣ useSearchParams - Lire les paramètres

### Simple: Lire les paramètres

```javascript
// ✅ IMPORTS NECESSAIRES
import { useSearchParams } from 'react-router-dom'

function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Lire les paramètres
  const search = searchParams.get('search')    // '?search=laptop' → 'laptop'
  const sort = searchParams.get('sort')        // '?sort=prix' → 'prix'
  const page = searchParams.get('page')        // '?page=2' → '2'
  
  return (
    <div>
      <p>Recherche: {search}</p>
      <p>Tri: {sort}</p>
      <p>Page: {page}</p>
    </div>
  )
}
```

### Avancé: Modifier les paramètres

```javascript
// ✅ IMPORTS NECESSAIRES
import { useSearchParams } from 'react-router-dom'

function Filters() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const handleSort = (newSort) => {
    // Ajouter/modifier un paramètre
    setSearchParams({ 
      search: searchParams.get('search'),
      sort: newSort 
    })
    // URL devient: ?search=laptop&sort=prix
  }
  
  const handleSearch = (terme) => {
    // Remplacer tous les paramètres
    setSearchParams({ 
      search: terme,
      page: 1  // Reset page
    })
    // URL devient: ?search=laptop&page=1
  }

  return (
    <div>
      <button onClick={() => handleSort('prix')}>Trier par prix</button>
      <button onClick={() => handleSort('nom')}>Trier par nom</button>
      <input onChange={(e) => handleSearch(e.target.value)} />
    </div>
  )
}
```

---

## 3️⃣ Template Literals - Injecter des variables avec $

### Basique:

```javascript
// ❌ SANS template literal (compliqué)
const nom = 'Alice'
const age = 25
const message = 'Bonjour, je suis ' + nom + ' et j\'ai ' + age + ' ans'
console.log(message)  // 'Bonjour, je suis Alice et j'ai 25 ans'

// ✅ AVEC template literal (facile!)
const message2 = `Bonjour, je suis ${nom} et j'ai ${age} ans`
console.log(message2)  // Même résultat!
```

### Dans les URLs:

```javascript
// ❌ SANS template literal
const userId = 123
const url = 'https://api.example.com/users/' + userId + '/details'

// ✅ AVEC template literal
const url2 = `https://api.example.com/users/${userId}/details`

// Tous les deux donnent la même URL
// https://api.example.com/users/123/details
```

### Avec des expressions complexes:

```javascript
const produit = { id: 5, nom: 'Laptop', prix: 999 }

// Injections simples
const message1 = `Produit: ${produit.nom}`

// Injections avec calculs
const message2 = `Prix avec taxe: ${produit.prix * 1.2}€`

// Injections avec conditions
const message3 = `${produit.prix > 500 ? 'Cher' : 'Bon marché'}`

// Injections avec fonctions
const message4 = `Nom en majuscule: ${produit.nom.toUpperCase()}`
```

---

## 🎯 Exemple complet: Moteur de recherche avec URLs

**src/pages/RechercheAvancee.jsx**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function RechercheAvancee() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(false)

  // Récupérer les paramètres actuels de l'URL
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'nom'
  const page = searchParams.get('page') || '1'

  // Quand les paramètres changent, faire la recherche
  useEffect(() => {
    if (search.trim()) {
      faireRecherche(search, sort, page)
    }
  }, [search, sort, page])

  // Fonction de recherche (simule un API call)
  const faireRecherche = async (terme, tri, pageNum) => {
    setLoading(true)
    
    // Simule un délai API
    await new Promise(resolve => setTimeout(resolve, 500))

    // Données simulées
    const donnees = [
      { id: 1, nom: 'Laptop', prix: 999 },
      { id: 2, nom: 'Laptop Gaming', prix: 1500 },
      { id: 3, nom: 'Laptop Budget', prix: 400 },
      { id: 4, nom: 'Téléphone', prix: 699 },
      { id: 5, nom: 'Laptop Professionnel', prix: 2000 }
    ]

    // Filtrer
    let resultat = donnees.filter(p =>
      p.nom.toLowerCase().includes(terme.toLowerCase())
    )

    // Trier
    if (tri === 'prix-asc') {
      resultat.sort((a, b) => a.prix - b.prix)
    } else if (tri === 'prix-desc') {
      resultat.sort((a, b) => b.prix - a.prix)
    } else {
      resultat.sort((a, b) => a.nom.localeCompare(b.nom))
    }

    setProduits(resultat)
    setLoading(false)
  }

  // Fonctions pour modifier l'URL
  const handleSearch = (terme) => {
    setSearchParams({
      search: terme,
      sort: sort,
      page: '1'
    })
  }

  const handleSort = (newSort) => {
    setSearchParams({
      search: search,
      sort: newSort,
      page: '1'
    })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🔍 Recherche Avancée</h1>

      {/* Afficher l'URL actuelle */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <p><strong>URL actuelle:</strong></p>
        <code>
          {/* ← Template literal pour montrer l'URL */}
          /recherche?search=${search}&sort=${sort}&page=${page}
        </code>
      </div>

      {/* Input de recherche */}
      <input
        type="text"
        placeholder="Chercher..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />

      {/* Sélecteur de tri */}
      <select
        value={sort}
        onChange={(e) => handleSort(e.target.value)}
        style={{
          padding: '8px',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      >
        <option value="nom">Nom (A-Z)</option>
        <option value="prix-asc">Prix (Croissant)</option>
        <option value="prix-desc">Prix (Décroissant)</option>
      </select>

      {/* Afficher le nombre de résultats */}
      <p>Résultats: <strong>{produits.length}</strong></p>

      {loading && <p>Chargement...</p>}

      {/* Afficher les résultats */}
      {!loading && produits.length === 0 && (
        <p>Aucun produit trouvé pour "{search}"</p>
      )}

      {/* Liste avec template literals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {produits.map(produit => (
          <div
            key={produit.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px'
            }}
          >
            <h3>{produit.nom}</h3>
            <p><strong>{produit.prix}€</strong></p>
            {/* ← Template literal pour créer un lien */}
            <a href={`/produit/${produit.id}?from=search&search=${search}`}>
              Voir détails
            </a>
          </div>
        ))}
      </div>

      {/* Info sur l'URL */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
        <h3>💡 Info sur cette URL:</h3>
        <ul>
          <li>Paramètre search: <code>{search || '(vide)'}</code></li>
          <li>Paramètre sort: <code>{sort}</code></li>
          <li>Paramètre page: <code>{page}</code></li>
          <li>
            Lien partageable: 
            <code>
              {/* Template literal pour créer le lien complet */}
              /recherche?search=${search}&sort=${sort}&page=${page}
            </code>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RechercheAvancee
```

---

## 📊 Comparaison: State vs URL

| Feature | State (useState) | URL (useSearchParams) |
|---------|------------------|---------------------|
| Partager | ❌ Non | ✅ Oui (copier l'URL) |
| Bookmark | ❌ Non | ✅ Oui |
| Historique | ❌ Non | ✅ Oui (bouton retour) |
| SEO | ❌ Non | ✅ Oui |
| Rapide | ✅ Oui | ⚠️ Plus lent |

---

## 🎯 Quand utiliser quoi?

### Utilise **State (useState)** pour:
- ❌ Forms temporaires
- ❌ Animations
- ❌ UI temporaire (menus, modales)

```javascript
const [menuOuvert, setMenuOuvert] = useState(false)
const [formData, setFormData] = useState({})
```

### Utilise **URL (useSearchParams)** pour:
- ✅ Recherche & filtres
- ✅ Pagination
- ✅ Tri
- ✅ Tout ce qui doit être shareable

```javascript
const [searchParams, setSearchParams] = useSearchParams()
// ?search=laptop&sort=prix&page=2
```

---

## 🎨 Template Literals: Cas d'usages courants

```javascript
// 1. URLs avec paramètres
const nom = 'alice'
const url = `https://api.example.com/profiles/${nom}`
// → https://api.example.com/profiles/alice

// 2. Queries SQL (attention au security!)
const id = 5
const query = `SELECT * FROM users WHERE id = ${id}`
// → SELECT * FROM users WHERE id = 5

// 3. Messages dynamiques
const produit = { nom: 'Laptop', prix: 999 }
const message = `Vous avez acheté ${produit.nom} pour ${produit.prix}€`

// 4. HTML dynamique
const items = ['apple', 'banana', 'orange']
const html = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join('')}
  </ul>
`

// 5. Conditions
const age = 25
const categorie = age >= 18 ? 'Adulte' : 'Enfant'
const message2 = `Vous êtes ${categorie}`
```

---

## ⚠️ ATTENTION: Sécurité avec template literals

```javascript
// ❌ DANGER: Injection XSS
const userInput = '<script>alert("hack")</script>'
const html = `<p>${userInput}</p>`  // ❌ Pas bon!

// ✅ BON: Utilise des bibliothèques ou échappe
import DOMPurify from 'dompurify'
const safe = DOMPurify.sanitize(userInput)
const html = `<p>${safe}</p>`

// ✅ BON: Ou utilise React (génère du JSX)
<p>{userInput}</p>  // React échappe automatiquement
```

---

## 🎯 Résumé

| Hook/Feature | Pour quoi | Exemple |
|-------------|----------|---------|
| `useLocation` | Savoir où tu es | `location.pathname` → '/produits' |
| `useSearchParams` | Lire/modifier les paramètres | `?search=laptop&sort=prix` |
| Template literals | Injecter des variables | `` `Bonjour ${nom}` `` |

---

**Maintenant ta doc couvre les URLs professionelles!** 🚀
