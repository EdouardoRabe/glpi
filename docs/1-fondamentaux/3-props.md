# 3️⃣ Props - Passer des données

## 📖 QUOI

**Props** (propriétés) = données qu'un composant parent envoie à un composant enfant.

C'est comment tu **passes des informations** entre composants.

```javascript
// Parent envoie : <Bouton texte="Cliquez-moi" />
// Enfant reçoit : texte = "Cliquez-moi"
```

---

## 💡 POURQUOI

- ✅ Rendre les composants **flexibles et réutilisables**
- ✅ Éviter de dupliquer du code
- ✅ Passer des données d'un parent à l'enfant
- ✅ Rendre les composants génériques

**Exemple réel :**
Au lieu de créer 10 boutons différents, tu crées 1 composant Bouton et tu passes le texte en prop.

---

## 🛠️ COMMENT

### Modèle réutilisable

**Composant enfant (reçoit les props)**
```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function MonComposant({ prop1, prop2, prop3 }) {
  return (
    <div>
      {/* Utilise les props */}
      <p>{prop1}</p>
      <p>{prop2}</p>
    </div>
  )
}

export default MonComposant
```

**Composant parent (envoie les props)**
```javascript
// ✅ IMPORTS NECESSAIRES
import MonComposant from './MonComposant'

function App() {
  return (
    <MonComposant prop1="valeur1" prop2="valeur2" prop3="valeur3" />
  )
}

export default App
```

### Exemple 1 : Bouton réutilisable

**Bouton.jsx**
```javascript
function Bouton({ texte, couleur }) {
  const styles = {
    backgroundColor: couleur,
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }

  return <button style={styles}>{texte}</button>
}

export default Bouton
```

**App.jsx**
```javascript
import Bouton from './Bouton'

function App() {
  return (
    <div>
      <Bouton texte="Valider" couleur="green" />
      <Bouton texte="Annuler" couleur="red" />
      <Bouton texte="Suivant" couleur="blue" />
    </div>
  )
}

export default App
```

### Exemple 2 : Carte avec plusieurs props

**Carte.jsx**
```javascript
function Carte({ nom, age, ville, image }) {
  return (
    <div className="carte">
      <img src={image} alt={nom} />
      <h3>{nom}</h3>
      <p>Age: {age} ans</p>
      <p>Ville: {ville}</p>
    </div>
  )
}

export default Carte
```

**App.jsx**
```javascript
function App() {
  return (
    <div>
      <Carte 
        nom="Alice" 
        age={25} 
        ville="Paris" 
        image="alice.jpg" 
      />
      <Carte 
        nom="Bob" 
        age={30} 
        ville="Lyon" 
        image="bob.jpg" 
      />
    </div>
  )
}

export default App
```

---

## 📌 EXEMPLE Complet

**Créer un système d'affichage d'utilisateurs**

**Utilisateur.jsx**
```javascript
function Utilisateur({ id, nom, email, role }) {
  return (
    <div className="utilisateur">
      <h4>{nom}</h4>
      <p>Email: {email}</p>
      <p>Rôle: {role}</p>
      <button>Voir profil</button>
    </div>
  )
}

export default Utilisateur
```

**App.jsx**
```javascript
import Utilisateur from './Utilisateur'

function App() {
  const users = [
    { id: 1, nom: 'Edouardo', email: 'edo@example.com', role: 'Admin' },
    { id: 2, nom: 'Marie', email: 'marie@example.com', role: 'User' },
    { id: 3, nom: 'Jean', email: 'jean@example.com', role: 'User' }
  ]

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {users.map(user => (
        <Utilisateur 
          key={user.id}
          id={user.id}
          nom={user.nom}
          email={user.email}
          role={user.role}
        />
      ))}
    </div>
  )
}

export default App
```

---

## ⚠️ Règles importantes

### 1. Les props sont en **lecture seule** (immuables)
```javascript
❌ ERREUR : Ne peux pas modifier
function Mauvais({ nom }) {
  nom = "Nouveau nom"  // ❌ Ne fonctionne pas!
  return <p>{nom}</p>
}

✅ BON : Utilise useState si tu veux modifier
import { useState } from 'react'

function Bon({ nom }) {
  const [valeur, setValeur] = useState(nom)
  
  const changer = () => {
    setValeur("Nouveau nom")
  }
  
  return (
    <>
      <p>{valeur}</p>
      <button onClick={changer}>Changer</button>
    </>
  )
}
```

### 2. Les types de props

```javascript
// Chaîne
<Composant texte="Hello" />

// Nombre
<Composant age={25} />

// Booléen
<Composant actif={true} />
{/* ou simplement: */}
<Composant actif />

// Objet
<Composant user={{ nom: 'Bob', age: 30 }} />

// Tableau
<Composant couleurs={['rouge', 'bleu']} />

// Fonction
<Composant onClick={() => console.log('click')} />
```

### 3. Props par défaut

```javascript
function Bouton({ texte = "Cliquez", couleur = "blue" }) {
  return <button style={{ backgroundColor: couleur }}>{texte}</button>
}

// Si tu fais : <Bouton /> 
// Les props par défaut seront utilisés: texte="Cliquez", couleur="blue"
```

---

**[Suivant: useState →](./4-useState.md)**
