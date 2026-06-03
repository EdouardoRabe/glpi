# 3️⃣ Appels API avec fetch (Simple et Pro)

## 📖 QUOI

**fetch** = fonction JavaScript pour faire des appels HTTP (requêtes) vers des serveurs/APIs.

```javascript
// ❌ ANCIEN (avec .then)
fetch('[URL]')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(erreur => console.log(erreur))

// ✅ MODERNE (avec async/await)
const data = await fetch('[URL]').then(r => r.json())
```

**API** = une adresse qui te retourne des données (JSON).

---

## 💡 POURQUOI

- ✅ Récupérer des données d'un serveur
- ✅ Envoyer des données au serveur
- ✅ Interagir avec des services externes
- ✅ Afficher du contenu dynamique

**Cas d'usage réels :**
- Instagram charge les photos depuis une API
- Google Maps récupère la carte depuis une API
- Ton app météo fait fetch vers une API météo

---

## 🛠️ COMMENT - PARTIE 1 : SIMPLE (.then)

### Modèle réutilisable 1 : GET (récupérer des données)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function MonAPI() {
  const [donnees, setDonnees] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    fetch('https://api.example.com/donnees')  // ← Remplace par ton URL
      .then(response => response.json())
      .then(data => {
        setDonnees(data)
        setLoading(false)
      })
      .catch(err => {
        setErreur(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Chargement...</p>
  if (erreur) return <p>Erreur: {erreur}</p>
  if (!donnees) return <p>Pas de données</p>

  return <div>Tes données ici</div>
}

export default MonAPI
```

### Modèle réutilisable 2 : POST (envoyer des données)

```javascript
// ✅ IMPORTS NECESSAIRES
// (fetch est natif, pas d'import nécessaire)

const envoyerDonnees = async (donnees) => {
  try {
    const response = await fetch('https://api.example.com/donnees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees)
    })

    if (!response.ok) throw new Error('Erreur réseau')
    
    const resultat = await response.json()
    console.log('Succès:', resultat)
  } catch (err) {
    console.log('Erreur:', err.message)
  }
}
```

### Exemple 1 : Récupérer une liste d'utilisateurs

**ListeUtilisateurs.jsx**
```javascript
import { useEffect, useState } from 'react'

function ListeUtilisateurs() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    // API gratuite pour tester
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setErreur(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>⏳ Chargement des utilisateurs...</p>
  if (erreur) return <p>❌ Erreur: {erreur}</p>
  if (users.length === 0) return <p>Pas d'utilisateurs</p>

  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListeUtilisateurs
```

### Exemple 2 : Chercher un utilisateur par ID

**SearchUtilisateur.jsx**
```javascript
import { useState } from 'react'

function SearchUtilisateur() {
  const [id, setId] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const chercher = () => {
    if (!id) {
      setErreur('Veuillez entrer un ID')
      return
    }

    setLoading(true)
    setErreur(null)
    setUser(null)

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Utilisateur non trouvé')
        return response.json()
      })
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setErreur(err.message)
        setLoading(false)
      })
  }

  return (
    <div>
      <h2>Chercher un utilisateur</h2>
      <input
        type="number"
        placeholder="ID (1-10)"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={chercher}>Chercher</button>

      {loading && <p>⏳ Chargement...</p>}
      {erreur && <p className="erreur">❌ {erreur}</p>}
      {user && (
        <div className="carte">
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Téléphone: {user.phone}</p>
          <p>Website: {user.website}</p>
        </div>
      )}
    </div>
  )
}

export default SearchUtilisateur
```

### Exemple 3 : Envoyer un formulaire (POST)

**CreerPost.jsx**
```javascript
import { useState } from 'react'

function CreerPost() {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const publier = () => {
    if (!titre || !contenu) {
      setMessage('❌ Remplissez tous les champs')
      return
    }

    setLoading(true)

    const nouvellePubli = {
      title: titre,
      body: contenu,
      userId: 1
    }

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouvellePubli)
    })
      .then(response => response.json())
      .then(data => {
        setMessage(`✅ Publication créée! ID: ${data.id}`)
        setTitre('')
        setContenu('')
        setLoading(false)
      })
      .catch(err => {
        setMessage(`❌ Erreur: ${err.message}`)
        setLoading(false)
      })
  }

  return (
    <div>
      <h2>Créer une publication</h2>
      <input
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      <textarea
        placeholder="Contenu"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows="5"
      />
      <button onClick={publier} disabled={loading}>
        {loading ? 'En cours...' : 'Publier'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreerPost
```

---

## 📌 EXEMPLE Complet

**Galerie d'images depuis API**

```javascript
import { useEffect, useState } from 'react'

function Galerie() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtreId, setFiltreId] = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos?_limit=20')
      .then(r => r.json())
      .then(data => {
        setPhotos(data)
        setLoading(false)
      })
      .catch(err => {
        console.log('Erreur:', err)
        setLoading(false)
      })
  }, [])

  const filtrees = filtreId
    ? photos.filter(p => p.albumId.toString() === filtreId)
    : photos

  if (loading) return <p>⏳ Chargement des photos...</p>

  return (
    <div>
      <h1>Galerie</h1>
      <input
        type="number"
        placeholder="Filtrer par album ID"
        value={filtreId}
        onChange={(e) => setFiltreId(e.target.value)}
      />

      <div className="grille">
        {filtrees.map(photo => (
          <div key={photo.id} className="photo">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Galerie
```

---

## 🛠️ COMMENT - PARTIE 2 : PRO (async/await) ⭐

> **C'est la façon moderne et recommandée!**

### Pattern de base GET

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data')
    
    // 1️⃣ Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }
    
    // 2️⃣ Parser le JSON
    const data = await response.json()
    
    // 3️⃣ Utiliser les données
    console.log(data)
    return data
    
  } catch (error) {
    // 4️⃣ Gérer l'erreur
    console.error('Erreur fetch:', error.message)
    throw error
  }
}
```

### Utiliser dans useEffect

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function App() {
  const [donnees, setDonnees] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setErreur(null)
        
        const response = await fetch('https://api.example.com/data')
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`)
        }
        
        const data = await response.json()
        setDonnees(data)
        
      } catch (error) {
        setErreur(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Affichage
  if (loading) return <p>⏳ Chargement...</p>
  if (erreur) return <p>❌ Erreur: {erreur}</p>
  if (!donnees) return <p>Pas de données</p>

  return <pre>{JSON.stringify(donnees, null, 2)}</pre>
}

export default App
```

### Exemple 1 (PRO): Récupérer une liste d'utilisateurs avec async/await

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function ListeUtilisateurs() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        
        const data = await response.json()
        setUsers(data)
        
      } catch (error) {
        setErreur(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <p>⏳ Chargement des utilisateurs...</p>
  if (erreur) return <p>❌ Erreur: {erreur}</p>
  if (users.length === 0) return <p>Pas d'utilisateurs</p>

  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListeUtilisateurs
```

### Exemple 2 (PRO): Chercher un utilisateur par ID avec async/await

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function SearchUtilisateur() {
  const [id, setId] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  const chercher = async () => {
    if (!id) {
      setErreur('Veuillez entrer un ID')
      return
    }

    try {
      setLoading(true)
      setErreur(null)
      setUser(null)

      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      
      if (!response.ok) throw new Error('Utilisateur non trouvé')
      
      const data = await response.json()
      setUser(data)
      
    } catch (error) {
      setErreur(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Chercher un utilisateur</h2>
      <input
        type="number"
        placeholder="ID (1-10)"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={chercher} disabled={loading}>
        {loading ? '⏳ Chargement...' : 'Chercher'}
      </button>

      {erreur && <p className="erreur">❌ {erreur}</p>}
      {user && (
        <div className="carte">
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Téléphone: {user.phone}</p>
          <p>Website: {user.website}</p>
        </div>
      )}
    </div>
  )
}

export default SearchUtilisateur
```

### Exemple 3 (PRO): Envoyer un formulaire (POST) avec async/await

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function CreerPost() {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const publier = async () => {
    if (!titre || !contenu) {
      setMessage('❌ Remplissez tous les champs')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titre,
          body: contenu,
          userId: 1
        })
      })

      if (!response.ok) throw new Error('Erreur: impossible créer le post')
      
      const data = await response.json()
      setMessage(`✅ Publication créée! ID: ${data.id}`)
      setTitre('')
      setContenu('')
      
    } catch (error) {
      setMessage(`❌ Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Créer une publication</h2>
      <input
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      <textarea
        placeholder="Contenu"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows="5"
      />
      <button onClick={publier} disabled={loading}>
        {loading ? '⏳ En cours...' : '✅ Publier'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreerPost
```

### Les 4 Méthodes HTTP (GET, POST, PUT, DELETE)

```javascript
// ✅ GET - Récupérer
const fetchGet = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json()
}

// POST - Créer
const fetchPost = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json()
}

// PUT - Modifier
const fetchPut = async (url, data) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json()
}

// DELETE - Supprimer
const fetchDelete = async (url) => {
  const response = await fetch(url, { method: 'DELETE' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return true
}

// Utilisation
await fetchGet('https://api.example.com/users')
await fetchPost('https://api.example.com/users', { nom: 'Alice' })
await fetchPut('https://api.example.com/users/1', { nom: 'Alice Updated' })
await fetchDelete('https://api.example.com/users/1')
```

### Avec authentification (Headers)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

const fetchAvecAuth = async (url, token) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // ← Token d'authentification
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    return await response.json()
    
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// Utilisation
const token = 'abc123token...'
const data = await fetchAvecAuth('https://api.example.com/protected', token)
```

### Avec timeout (ne pas attendre indéfiniment)

```javascript
const fetchAvecTimeout = async (url, timeoutMs = 5000) => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    const response = await fetch(url, {
      signal: controller.signal  // ← Signal d'annulation
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    return await response.json()
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Timeout: requête trop lente (> 5s)')
    } else {
      console.error('Erreur:', error)
    }
  }
}

// Utilisation (timeout de 3 secondes)
await fetchAvecTimeout('https://api.example.com/data', 3000)
```

---

## 📊 Comparaison: .then() vs async/await

| Aspect | `.then()` | `async/await` |
|--------|----------|---------------|
| Lisibilité | ❌ Moins lisible | ✅ Plus lisible |
| Nesting | ❌ `.then().then()...` | ✅ Linéaire |
| Gestion erreurs | ❌ `.catch()` séparé | ✅ `try/catch` unifié |
| Gestion `finally` | ❌ Complexe | ✅ Simple avec `finally` |
| Modern | ❌ Ancien | ✅ Standard 2024 |

```javascript
// ❌ ANCIEN (.then)
function App() {
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(data => setData(data))
      .catch(e => setErreur(e))
  }, [])
}

// ✅ MODERNE (async/await)
function App() {
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(url)
        const data = await r.json()
        setData(data)
      } catch (e) {
        setErreur(e)
      }
    })()
  }, [])
}
```

---

## ⚠️ Règles importantes

### 1. Les étapes du fetch

```javascript
fetch('url')                      // 1. Fais la requête
  .then(response => response.json())  // 2. Parse en JSON
  .then(data => { ... })          // 3. Utilise les données
  .catch(err => { ... })          // 4. Gère les erreurs
```

### 2. Méthodes HTTP

```javascript
// GET : Récupérer (défaut)
fetch('https://api.com/users')

// POST : Créer
fetch('https://api.com/users', {
  method: 'POST',
  body: JSON.stringify({ nom: 'Bob' })
})

// PUT : Modifier
fetch('https://api.com/users/1', {
  method: 'PUT',
  body: JSON.stringify({ nom: 'Alice' })
})

// DELETE : Supprimer
fetch('https://api.com/users/1', {
  method: 'DELETE'
})
```

### 3. Status codes

```javascript
const response = await fetch('url')

if (!response.ok) {
  // 404, 500, etc.
  throw new Error(`Erreur ${response.status}`)
}

// 200, 201, etc.
const data = await response.json()
```

### 4. Headers

```javascript
fetch('url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'  // Pour authentification
  },
  body: JSON.stringify(donnees)
})
```

---

## 🎯 APIs gratuites pour tester

| API | URL | Données |
|-----|-----|---------|
| JSONPlaceholder | https://jsonplaceholder.typicode.com | Posts, users, photos |
| PokeAPI | https://pokeapi.co/api/v2 | Pokémons |
| OpenWeatherMap | https://api.openweathermap.org | Météo |
| CoinGecko | https://api.coingecko.com | Cryptomonnaies |

---

**[Suivant: Context API →](../3-avance/1-context.md)**
