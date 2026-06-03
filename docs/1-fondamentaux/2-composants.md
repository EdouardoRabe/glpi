# 2️⃣ Composants & JSX

## 📖 QUOI

**Un composant** est une fonction JavaScript qui retourne du **JSX** (HTML à l'intérieur du JavaScript).

**JSX** = syntaxe pour écrire du HTML directement en JavaScript.

```javascript
// Sans JSX (compliqué)
const element = createElement('button', null, 'Clique');

// Avec JSX (simple!)
const element = <button>Clique</button>;
```

---

## 💡 POURQUOI

- ✅ Réutilisabilité : Crée une fois, utilise partout
- ✅ Maintenabilité : Facile à modifier et corriger
- ✅ Organisation : Code plus propre et lisible
- ✅ Dynamique : Le HTML peut changer selon les données

---

## 🛠️ COMMENT

### Créer un composant simple

**Modèle réutilisable :**
```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function NomComposant() {
  return (
    <div>
      {/* Ton HTML ici */}
    </div>
  )
}

export default NomComposant
```

### Exemples de composants

**Composant simple (pas de props ni state)**
```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Bienvenue() {
  return <h1>Bonjour React!</h1>
}

export default Bienvenue
```

**Composant avec du HTML plus complexe**
```javascript
function Carte() {
  return (
    <div className="carte">
      <img src="photo.jpg" alt="profil" />
      <h2>Mon Profil</h2>
      <p>Développeur React</p>
      <button>En savoir plus</button>
    </div>
  )
}

export default Carte
```

**Utiliser le composant dans App.jsx**
```javascript
import Carte from './Carte'

function App() {
  return (
    <div>
      <Carte />
      <Carte />  {/* Tu peux le réutiliser! */}
    </div>
  )
}

export default App
```

---

## 📌 EXEMPLE Complet

### Structure d'un vrai projet

**src/composants/Bouton.jsx**
```javascript
function Bouton() {
  return <button>Clique-moi</button>
}

export default Bouton
```

**src/composants/En-tete.jsx**
```javascript
function EnTete() {
  return (
    <header>
      <h1>Mon Site</h1>
      <nav>
        <a href="/">Accueil</a>
        <a href="/about">À propos</a>
      </nav>
    </header>
  )
}

export default EnTete
```

**src/App.jsx**
```javascript
import EnTete from './composants/En-tete'
import Bouton from './composants/Bouton'

function App() {
  return (
    <>
      <EnTete />
      <main>
        <h2>Contenu</h2>
        <Bouton />
      </main>
    </>
  )
}

export default App
```

---

## ⚠️ Règles importantes

### 1. Les noms de composants doivent commencer par une majuscule
```javascript
✅ function MonComposant() { ... }
❌ function monComposant() { ... }  // React ne va pas le reconnaître
```

### 2. Un composant doit retourner UN SEUL élément racine
```javascript
❌ ERREUR : Deux éléments
function Mauvais() {
  return (
    <h1>Titre</h1>
    <p>Contenu</p>  // ❌ Deux éléments!
  )
}

✅ BON : Enveloppe avec Fragment <>
function Bon() {
  return (
    <>
      <h1>Titre</h1>
      <p>Contenu</p>
    </>
  )
}
```

### 3. JSX doit être des balises valides

```javascript
❌ <input>  // Manque la fermeture
✅ <input />  // Input auto-fermé (correct)
✅ <br />  // Tous les éléments self-closing doivent se fermer
```

---

## 🎨 Ajouter du CSS

### Méthode 1 : Fichier CSS séparé
```javascript
// Bouton.jsx
import './Bouton.css'

function Bouton() {
  return <button className="mon-bouton">Clique</button>
}

export default Bouton
```

```css
/* Bouton.css */
.mon-bouton {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

### Méthode 2 : Inline styles
```javascript
function Bouton() {
  const styles = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }

  return <button style={styles}>Clique</button>
}
```

---

**[Suivant: Props →](./3-props.md)**
