# 5️⃣ useEffect - Effets secondaires

## 📖 QUOI

**useEffect** te permet de faire des **effets secondaires** (actions qui se passent EN DEHORS du rendu).

```javascript
useEffect(() => {
  // Ton code ici - s'exécute à des moments précis
}, [dependances])
```

### Effets secondaires typiques
- 📡 Récupérer des données d'une API
- 📝 Mettre à jour le `document.title`
- 🔔 S'abonner à des événements
- 🧹 Nettoyer les ressources

---

## 💡 POURQUOI - Importance

**Sans useEffect** tu ne pourrais pas :
- ❌ Charger des données quand le composant apparaît
- ❌ Écouter les changements de variables
- ❌ Nettoyer quand le composant disparaît

**Avec useEffect tu peux** :
- ✅ Exécuter du code au moment exacte du cycle de vie
- ✅ Contrôler quand l'effet se déclenche
- ✅ Nettoyer proprement après

---

## 🛠️ COMMENT

### Modèle réutilisable

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect } from 'react'

function MonComposant() {
  useEffect(() => {
    // Ton code s'exécute ici
    console.log('Action')

    // Optionnel: nettoyer
    return () => {
      console.log('Nettoyage')
    }
  }, [])  // ← Modifie les dépendances selon ton besoin

  return <div>Contenu</div>
}

export default MonComposant
```

### Les 3 cas d'utilisation

#### Cas 1 : S'exécuter une seule fois au démarrage

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect } from 'react'

function Composant() {
  useEffect(() => {
    console.log('Composant monté!')  // Une seule fois
  }, [])  // ← Crochets vides = une seule fois

  return <h1>Hello</h1>
}

export default Composant
```

#### Cas 2 : S'exécuter quand une variable change

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function Compteur() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(`Count a changé: ${count}`)
    // S'exécute à chaque fois que count change
  }, [count])  // ← Dépendance: count

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

export default Compteur
```

#### Cas 3 : Nettoyer quand le composant disparaît

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect } from 'react'

function Minuteur() {
  useEffect(() => {
    // Action
    const timer = setInterval(() => {
      console.log('Tick!')
    }, 1000)

    // Nettoyage
    return () => {
      clearInterval(timer)
      console.log('Minuteur arrêté')
    }
  }, [])

  return <p>Minuteur en cours...</p>
}

export default Minuteur
```

---

## 📌 EXEMPLE Complet

### Récupérer des données d'une API

**UtilisateurAPI.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function UtilisateurAPI({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    setLoading(true)

    // Récupérer les données
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setErreur(err.message)
        setLoading(false)
      })
  }, [userId])  // Re-récupère si userId change

  if (loading) return <p>Chargement...</p>
  if (erreur) return <p>Erreur: {erreur}</p>
  if (!user) return <p>Pas de données</p>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Téléphone: {user.phone}</p>
    </div>
  )
}

export default UtilisateurAPI
```

### Plusieurs useEffect

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function Dashboard() {
  const [titre, setTitre] = useState('Mon Dashboard')
  const [count, setCount] = useState(0)

  // Effect 1 : Changer le titre du document
  useEffect(() => {
    document.title = titre
  }, [titre])

  // Effect 2 : Logs quand count change
  useEffect(() => {
    console.log('Count:', count)
  }, [count])

  // Effect 3 : Au démarrage seulement
  useEffect(() => {
    console.log('Dashboard montée!')
    
    return () => {
      console.log('Dashboard démontée')
    }
  }, [])

  return (
    <div>
      <h1>{titre}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
      />
    </div>
  )
}

export default Dashboard
```

---

## 📊 Tableau des dépendances

| Dépendances | Quand s'exécute |
|------------|----------------|
| `[]` | UNE SEULE FOIS au démarrage |
| `[variable]` | Quand `variable` change |
| `[var1, var2]` | Quand l'une des deux change |
| Absent | À CHAQUE rendu (⚠️ attention!) |

---

## ⚠️ Règles importantes

### 1. useEffect toujours au top du composant

```javascript
❌ ERREUR
function Mauvais() {
  if (condition) {
    useEffect(() => { ... })  // ❌ Pas bon!
  }
  return <div>...</div>
}

✅ BON
function Bon() {
  useEffect(() => { ... })  // ✅ Au top
  
  if (condition) {
    // Du code libre
  }
  return <div>...</div>
}
```

### 2. Toujours retourner une fonction de nettoyage si nécessaire

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect } from 'react'

useEffect(() => {
  const listener = () => console.log('click')
  window.addEventListener('click', listener)

  // Nettoyer pour éviter les fuites mémoire
  return () => {
    window.removeEventListener('click', listener)
  }
}, [])
```

### 3. Les dépendances oubliées = bugs

```javascript
❌ ERREUR : Variable utilisée mais pas dans les dépendances
function Compteur() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)  // ❌ count utilisé mais pas en dépendance
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])  // ❌ Dépendances incomplètes!
}

✅ BON
function Compteur() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1)  // ✅ Bonne pratique
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
}
```

---

**[Suivant: Listes & .map() →](../2-pratique/1-listes.md)**
