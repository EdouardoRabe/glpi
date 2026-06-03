# Composants Réutilisables - Interactifs

> ⚠️ **IMPORTANT:** Copie-colle directement ces composants. Contrairement aux modèles ci-avant avec `[]`, ici tu copie-colle tel quel et tu customises les valeurs après!

## 🔍 Composant: Barre de recherche

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function BarreRecherche({ onSearch, placeholder = "Chercher..." }) {
  const [valeur, setValeur] = useState('')

  const handleChange = (e) => {
    const newValue = e.target.value
    setValeur(newValue)
    onSearch(newValue)
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={valeur}
      onChange={handleChange}
      style={{
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%'
      }}
    />
  )
}

export default BarreRecherche
```

**Utilisation**
```javascript
const [resultat, setResultat] = useState('')

<BarreRecherche 
  placeholder="Chercher des produits..."
  onSearch={(valeur) => setResultat(valeur)}
/>
<p>Résultat: {resultat}</p>
```

---

## 🔘 Composant: Modale

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Modale({ titre, contenu, bouton = "Ouvrir" }) {
  const [ouvert, setOuvert] = useState(false)

  const styles = {
    overlay: {
      display: ouvert ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999
    },
    modale: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      zIndex: 1000,
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    },
    buttons: {
      marginTop: '20px',
      display: 'flex',
      gap: '10px'
    }
  }

  return (
    <>
      <button onClick={() => setOuvert(true)}>
        {bouton}
      </button>

      {ouvert && <div style={styles.overlay} onClick={() => setOuvert(false)} />}
      
      {ouvert && (
        <div style={styles.modale}>
          <h2>{titre}</h2>
          <p>{contenu}</p>
          <div style={styles.buttons}>
            <button onClick={() => setOuvert(false)}>Fermer</button>
            <button style={{backgroundColor: 'blue', color: 'white'}}>
              Confirmer
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Modale
```

**Utilisation**
```javascript
<Modale 
  titre="Confirmation"
  contenu="Êtes-vous sûr?"
  bouton="Ouvrir"
/>
```

---

## 📑 Composant: Onglets (Tabs)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Onglets({ onglets }) {
  const [actif, setActif] = useState(0)

  const styles = {
    buttons: {
      display: 'flex',
      borderBottom: '2px solid #eee'
    },
    button: (isActive) => ({
      padding: '10px 20px',
      border: 'none',
      backgroundColor: isActive ? 'white' : '#f5f5f5',
      cursor: 'pointer',
      borderBottom: isActive ? '2px solid blue' : 'none',
      fontWeight: isActive ? 'bold' : 'normal'
    }),
    contenu: {
      padding: '20px',
      backgroundColor: 'white'
    }
  }

  return (
    <div>
      <div style={styles.buttons}>
        {onglets.map((onglet, index) => (
          <button
            key={index}
            style={styles.button(actif === index)}
            onClick={() => setActif(index)}
          >
            {onglet.label || onglet}
          </button>
        ))}
      </div>
      <div style={styles.contenu}>
        {onglets[actif].contenu || onglets[actif]}
      </div>
    </div>
  )
}

export default Onglets
```

**Utilisation**
```javascript
const myOnglets = [
  { label: 'Général', contenu: 'Contenu 1' },
  { label: 'Avancé', contenu: 'Contenu 2' },
  { label: 'À propos', contenu: 'Contenu 3' }
]

<Onglets onglets={myOnglets} />
```

---

## ⭐ Composant: Notation (Rating)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Rating({ max = 5, onRate }) {
  const [note, setNote] = useState(0)

  const handleClick = (valeur) => {
    setNote(valeur)
    onRate(valeur)
  }

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          onClick={() => handleClick(i + 1)}
          style={{
            fontSize: '30px',
            cursor: 'pointer',
            color: note >= i + 1 ? 'gold' : 'gray'
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default Rating
```

**Utilisation**
```javascript
<Rating max={5} onRate={(note) => console.log('Note:', note)} />
```

---

## ✅ Composant: Checkbox

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

export default Checkbox
```

**Utilisation**
```javascript
const [accepte, setAccepte] = useState(false)

<Checkbox 
  label="J'accepte les conditions"
  checked={accepte}
  onChange={setAccepte}
/>
```

---

## 🔘 Composant: Toggle Switch

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Toggle({ label, initialValue = false, onChange }) {
  const [active, setActive] = useState(initialValue)

  const handleToggle = () => {
    const newValue = !active
    setActive(newValue)
    onChange(newValue)
  }

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    toggle: {
      width: '50px',
      height: '25px',
      backgroundColor: active ? 'green' : 'gray',
      borderRadius: '12px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.3s'
    },
    circle: {
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: active ? '27px' : '2px',
      transition: 'left 0.3s'
    }
  }

  return (
    <div style={styles.container}>
      {label && <span>{label}</span>}
      <div style={styles.toggle} onClick={handleToggle}>
        <div style={styles.circle}></div>
      </div>
    </div>
  )
}

export default Toggle
```

**Utilisation**
```javascript
<Toggle 
  label="Mode sombre" 
  onChange={(etat) => console.log(etat)}
/>
```

---

**[Suivant: Structures →](./3-structures.md)**
