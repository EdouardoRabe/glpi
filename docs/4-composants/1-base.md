# Composants Réutilisables - De base

> ⚠️ **IMPORTANT:** Chaque composant ci-dessous peut être copié-collé directement. Les parties entre `[...]` sont juste pour montrer quoi remplacer du contexte!

## 🔘 Composant: Bouton Réutilisable

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Bouton({ 
  label = "Clique", 
  onClick, 
  couleur = "blue",
  disabled = false 
}) {
  const styles = {
    backgroundColor: couleur,
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1
  }

  return (
    <button 
      style={styles} 
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Bouton
```

**Utilisation**
```javascript
<Bouton 
  label="Valider" 
  couleur="green"
  onClick={() => console.log('Cliqué!')}
/>

<Bouton 
  label="Supprimer" 
  couleur="red"
/>

<Bouton 
  label="En cours..." 
  disabled={true}
/>
```

---

## 🎴 Composant: Carte (Card)

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Carte({ 
  titre, 
  contenu, 
  image,
  action
}) {
  const styles = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    maxWidth: '300px'
  }

  return (
    <div style={styles}>
      {image && <img src={image} alt={titre} style={{width: '100%'}} />}
      <h3>{titre}</h3>
      <p>{contenu}</p>
      {action && <button>{action}</button>}
    </div>
  )
}

export default Carte
```

**Utilisation**
```javascript
<Carte 
  titre="Mon Produit"
  contenu="Description du produit"
  image="produit.jpg"
  action="Acheter"
/>
```

---

## 📋 Composant: Liste simple

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Liste({ 
  items, 
  onDelete 
}) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item, index) => (
        <li 
          key={index}
          style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>{item}</span>
          {onDelete && (
            <button 
              onClick={() => onDelete(index)}
              style={{ background: 'red', color: 'white' }}
            >
              ❌
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Liste
```

**Utilisation**
```javascript
const [taches, setTaches] = useState(['Tâche 1', 'Tâche 2'])

<Liste 
  items={taches}
  onDelete={(index) => setTaches(taches.filter((_, i) => i !== index))}
/>
```

---

## 🏷️ Composant: Badge/Tag

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Badge({ texte, couleur = "gray" }) {
  const styles = {
    display: 'inline-block',
    backgroundColor: couleur,
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  }

  return <span style={styles}>{texte}</span>
}

export default Badge
```

**Utilisation**
```javascript
<Badge texte="Nouveau" couleur="green" />
<Badge texte="Important" couleur="red" />
<Badge texte="Info" couleur="blue" />
```

---

## 🎯 Composant: Conteneur centré

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Conteneur({ largeur = "600px", children }) {
  const styles = {
    maxWidth: largeur,
    margin: '0 auto',
    padding: '20px'
  }

  return <div style={styles}>{children}</div>
}

export default Conteneur
```

**Utilisation**
```javascript
<Conteneur largeur="800px">
  <h1>Mon contenu</h1>
  <p>Centré et avec du padding</p>
</Conteneur>
```

---

## 👤 Composant: Avatar

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Avatar({ image, nom, taille = "50px" }) {
  const styles = {
    width: taille,
    height: taille,
    borderRadius: '50%',
    backgroundImage: image ? `url(${image})` : 'none',
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={styles} title={nom}>
      {!image && nom?.charAt(0)}
    </div>
  )
}

export default Avatar
```

**Utilisation**
```javascript
<Avatar image="photo.jpg" nom="Alice" taille="80px" />
<Avatar nom="Bob" taille="40px" />  {/* Sans image, initiale */}
```

---

## 📊 Composant: Progress bar

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function ProgressBar({ pourcentage, couleur = "blue" }) {
  const containerStyles = {
    width: '100%',
    height: '10px',
    backgroundColor: '#eee',
    borderRadius: '5px',
    overflow: 'hidden'
  }

  const barStyles = {
    width: `${pourcentage}%`,
    height: '100%',
    backgroundColor: couleur,
    transition: 'width 0.3s ease'
  }

  return (
    <div style={containerStyles}>
      <div style={barStyles}></div>
    </div>
  )
}

export default ProgressBar
```

**Utilisation**
```javascript
<ProgressBar pourcentage={75} couleur="green" />
<ProgressBar pourcentage={30} couleur="orange" />
```

---

**[Suivant: Composants interactifs →](./2-interactifs.md)**
