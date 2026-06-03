# 4️⃣ useState - État local

## 📖 QUOI

**useState** est un hook React qui te permet d'ajouter de l'**état (state)** à un composant.

**État** = données qui peuvent changer dans le composant.

```javascript
const [valeur, setValeur] = useState(valeurInitiale)
```

- `valeur` = la valeur actuelle
- `setValeur` = fonction pour changer la valeur
- `valeurInitiale` = la valeur au démarrage

---

## 💡 POURQUOI

**Sans state :**
```javascript
function Compteur() {
  let count = 0;  // Simple variable
  return (
    <>
      <p>{count}</p>
      <button onClick={() => count++}>+</button>  {/* ❌ Ça ne s'affiche pas! */}
    </>
  )
}
```

React **ne met pas à jour** les variables simples. Pour que React sache qu'il faut re-rendre, tu dois utiliser `useState`.

**Avec state :**
```javascript
function Compteur() {
  const [count, setCount] = useState(0);  // ✅ Etat React
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>  {/* ✅ Ça fonctionne! */}
    </>
  )
}
```

---

## 🛠️ COMMENT

### Modèle réutilisable

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function MonComposant() {
  const [valeur, setValeur] = useState(0)  // ← Remplace 0 par ta valeur initiale
  
  const gererChangement = () => {
    setValeur(valeur + 1)  // ← Remplace par ton action
  }

  return (
    <div>
      <p>{valeur}</p>
      <button onClick={gererChangement}>Changer</button>
    </div>
  )
}

export default MonComposant
```

### Exemple 1 : Compteur simple

**Compteur.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Compteur() {
  const [count, setCount] = useState(0)

  const incrementer = () => {
    setCount(count + 1)
  }

  const decrementer = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementer}>+</button>
      <button onClick={decrementer}>-</button>
    </div>
  )
}

export default Compteur
```

### Exemple 2 : Formulaire avec state

**Formulaire.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Formulaire() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  const handleNomChange = (e) => {
    setNom(e.target.value)  // e.target.value = input du user
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = () => {
    console.log('Nom:', nom)
    console.log('Email:', email)
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder="Nom"
        value={nom}
        onChange={handleNomChange}
      />
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleSubmit}>Envoyer</button>
    </div>
  )
}

export default Formulaire
```

### Exemple 3 : Toggle (afficher/cacher)

**Toggle.jsx**
```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Toggle() {
  const [visible, setVisible] = useState(false)

  const basculer = () => {
    setVisible(!visible)  // ! = inverse la valeur
  }

  return (
    <div>
      <button onClick={basculer}>
        {visible ? 'Cacher' : 'Afficher'}
      </button>
      {visible && <p>Contenu secret!</p>}
    </div>
  )
}

export default Toggle
```

---

## 📌 EXEMPLE Complet

**Créer un système de panier d'achat**

**Panier.jsx**
```javascript
import { useState } from 'react'

function Panier() {
  const [articles, setArticles] = useState([])
  const [nomArticle, setNomArticle] = useState('')
  const [prix, setPrix] = useState('')

  const ajouter = () => {
    if (nomArticle && prix) {
      const nouvelArticle = {
        id: Date.now(),
        nom: nomArticle,
        prix: parseFloat(prix)
      }
      setArticles([...articles, nouvelArticle])  // Ajouter au tableau
      setNomArticle('')  // Réinitialiser
      setPrix('')
    }
  }

  const supprimer = (id) => {
    setArticles(articles.filter(article => article.id !== id))
  }

  const total = articles.reduce((sum, article) => sum + article.prix, 0)

  return (
    <div>
      <h2>Mon Panier</h2>
      
      <input
        placeholder="Nom de l'article"
        value={nomArticle}
        onChange={(e) => setNomArticle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prix"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
      />
      <button onClick={ajouter}>Ajouter</button>

      <ul>
        {articles.map(article => (
          <li key={article.id}>
            {article.nom} - {article.prix}€
            <button onClick={() => supprimer(article.id)}>❌</button>
          </li>
        ))}
      </ul>

      <h3>Total: {total.toFixed(2)}€</h3>
    </div>
  )
}

export default Panier
```

---

## ⚠️ Règles importantes

### 1. Ne modifie JAMAIS le state directement
```javascript
❌ ERREUR
const [count, setCount] = useState(0)
count = count + 1  // ❌ Ne fonctionne pas!

✅ BON
const [count, setCount] = useState(0)
setCount(count + 1)  // ✅ Utilise setCount
```

### 2. useState dans les boucles et conditions = ERREUR
```javascript
❌ ERREUR
if (condition) {
  const [count, setCount] = useState(0)  // ❌ Pas bon!
}

✅ BON : useState toujours au top du composant
const [count, setCount] = useState(0)
```

### 3. Plusieurs states

```javascript
function Profil() {
  const [nom, setNom] = useState('Bob')
  const [age, setAge] = useState(25)
  const [email, setEmail] = useState('bob@example.com')

  return (
    <div>
      <p>{nom}</p>
      <p>{age}</p>
      <p>{email}</p>
    </div>
  )
}
```

---

**[Suivant: useEffect →](./5-useEffect.md)**
