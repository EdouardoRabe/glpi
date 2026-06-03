# 1️⃣ Listes & .map()

## 📖 QUOI

**map()** est une fonction JavaScript pour transformer un tableau en autre chose.

En React, tu l'utilises pour **afficher une liste d'éléments** depuis un tableau.

```javascript
const nombres = [1, 2, 3]
const doubles = nombres.map(n => n * 2)  // [2, 4, 6]
```

---

## 💡 POURQUOI

**Sans .map()** tu devrais faire ça :
```javascript
❌ RÉPÉTITIF
function Liste() {
  return (
    <ul>
      <li>Article 1</li>
      <li>Article 2</li>
      <li>Article 3</li>
      <li>Article 4</li>
      {/* ... répéter 100 fois */}
    </ul>
  )
}
```

**Avec .map()** :
```javascript
✅ AUTOMATIQUE
function Liste() {
  const articles = ['Article 1', 'Article 2', 'Article 3', 'Article 4']
  
  return (
    <ul>
      {articles.map(article => <li>{article}</li>)}
    </ul>
  )
}
```

---

## 🛠️ COMMENT

### Modèle réutilisable simple

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function ListeSimple() {
  const [données] = useState([
    { id: 1, nom: 'Valeur1' },
    { id: 2, nom: 'Valeur2' }
  ])

  return (
    <ul>
      {données.map(item => (
        <li key={item.id}>{item.nom}</li>
      ))}
    </ul>
  )
}

export default ListeSimple
```

### Exemple 1 : Afficher une liste simple

**ListeSimple.jsx**
```javascript
import { useState } from 'react'

function ListeSimple() {
  const fruits = ['Pomme', 'Banane', 'Orange', 'Fraise']

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}

export default ListeSimple
```

### Exemple 2 : Afficher une liste d'objets

**Liste Utilisateurs.jsx**
```javascript
import { useState } from 'react'

function ListeUtilisateurs() {
  const [users] = useState([
    { id: 1, nom: 'Alice', email: 'alice@example.com' },
    { id: 2, nom: 'Bob', email: 'bob@example.com' },
    { id: 3, nom: 'Charlie', email: 'charlie@example.com' }
  ])

  return (
    <div>
      <h2>Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.nom}</strong>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListeUtilisateurs
```

### Exemple 3 : Ajouter/Supprimer des éléments

**ListeDynamique.jsx**
```javascript
import { useState } from 'react'

function ListeDynamique() {
  const [taches, setTaches] = useState(['Faire les courses', 'Étudier React'])
  const [nouvelleT ache, setNouvelleTache] = useState('')

  const ajouter = () => {
    if (nouvelleTache) {
      setTaches([...taches, nouvelleTache])
      setNouvelleTache('')
    }
  }

  const supprimer = (index) => {
    setTaches(taches.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2>Mes tâches</h2>
      <input
        value={nouvelleTache}
        onChange={(e) => setNouvelleTache(e.target.value)}
        placeholder="Nouvelle tâche"
      />
      <button onClick={ajouter}>Ajouter</button>

      <ul>
        {taches.map((tache, index) => (
          <li key={index}>
            {tache}
            <button onClick={() => supprimer(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListeDynamique
```

---

## 📌 EXEMPLE Complet

**Créer un panier de produits**

**Produit.jsx**
```javascript
function Produit({ nom, prix, onAjouter, onSupprimer }) {
  return (
    <div className="produit">
      <h3>{nom}</h3>
      <p>{prix}€</p>
      <button onClick={onAjouter}>Ajouter</button>
      <button onClick={onSupprimer}>Retirer</button>
    </div>
  )
}

export default Produit
```

**Panier.jsx**
```javascript
import { useState } from 'react'
import Produit from './Produit'

function Panier() {
  const [produits] = useState([
    { id: 1, nom: 'Laptop', prix: 999 },
    { id: 2, nom: 'Téléphone', prix: 699 },
    { id: 3, nom: 'Tablet', prix: 399 }
  ])

  const [panier, setPanier] = useState([])

  const ajouter = (produit) => {
    setPanier([...panier, produit])
  }

  const supprimer = (id) => {
    setPanier(panier.filter(p => p.id !== id))
  }

  const total = panier.reduce((sum, p) => sum + p.prix, 0)

  return (
    <div>
      <h1>Produits</h1>
      {produits.map(produit => (
        <Produit
          key={produit.id}
          nom={produit.nom}
          prix={produit.prix}
          onAjouter={() => ajouter(produit)}
          onSupprimer={() => supprimer(produit.id)}
        />
      ))}

      <h2>Votre panier</h2>
      <ul>
        {panier.map((item, index) => (
          <li key={index}>{item.nom} - {item.prix}€</li>
        ))}
      </ul>
      <p>Total: {total}€</p>
    </div>
  )
}

export default Panier
```

---

## ⚠️ Règles importantes

### 1. Utilise TOUJOURS une `key` unique

```javascript
❌ MAUVAIS : key={index } peut causer des bugs
{items.map((item, index) => <div key={index}>{item}</div>)}

✅ BON : Utilise un id unique
{items.map(item => <div key={item.id}>{item.nom}</div>)}
```

**Pourquoi ?** React utilise la `key` pour suivre les éléments. Sans une key unique, ça peut mélanger les données.

### 2. .map() retourne toujours un nouveau tableau

```javascript
const nombres = [1, 2, 3]

// .map() ne modifie pas l'original
const doubles = nombres.map(n => n * 2)

console.log(nombres)  // [1, 2, 3] (inchangé)
console.log(doubles)  // [2, 4, 6] (nouveau)
```

### 3. Autres méthodes utiles

```javascript
// .filter() = garder seulement certains éléments
const pairs = [1, 2, 3, 4, 5].filter(n => n % 2 === 0)
console.log(pairs)  // [2, 4]

// .find() = trouver le premier qui correspond
const admin = users.find(u => u.role === 'admin')

// .sort() = trier
const tries = [3, 1, 2].sort((a, b) => a - b)
console.log(tries)  // [1, 2, 3]

// .reduce() = additionner/combiner les éléments
const total = [1, 2, 3, 4].reduce((sum, n) => sum + n, 0)
console.log(total)  // 10
```

---

**[Suivant: Formulaires →](./2-formulaires.md)**
