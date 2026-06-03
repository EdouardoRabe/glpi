# 2️⃣ Formulaires

## 📖 QUOI

**Un formulaire React** = des champs (input, textarea, select) qui mettent à jour l'état quand l'user tape.

```javascript
const [nom, setNom] = useState('')

<input 
  value={nom}
  onChange={(e) => setNom(e.target.value)}
/>
```

---

## 💡 POURQUOI

- ✅ Capturer les données de l'user
- ✅ Valider les données avant d'envoyer
- ✅ Afficher les erreurs
- ✅ Envoyer les données à un serveur

---

## 🛠️ COMMENT

### Modèle réutilisable

### Modèle réutilisable

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function MonFormulaire() {
  const [champ, setChamp] = useState('')
  const [erreur, setErreur] = useState('')

  const gererChange = (e) => {
    setChamp(e.target.value)
  }

  const valider = () => {
    if (!champ) {
      setErreur('Ce champ est requis')
      return
    }
    setErreur('')
    console.log('Valide!')
  }

  return (
    <div>
      <input
        value={champ}
        onChange={gererChange}
        placeholder="Entrez une valeur"
      />
      {erreur && <p className="erreur">{erreur}</p>}
      <button onClick={valider}>Envoyer</button>
    </div>
  )
}

export default MonFormulaire
```

### Exemple 1 : Formulaire simple

**Connexion.jsx**
```javascript
import { useState } from 'react'

function Connexion() {
  const [email, setEmail] = useState('')
  const [motdepasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')

  const handleConnexion = () => {
    if (!email || !motdepasse) {
      setErreur('Tous les champs sont requis')
      return
    }

    if (!email.includes('@')) {
      setErreur('Email invalide')
      return
    }

    setErreur('')
    console.log('Connexion réussie!', { email, motdepasse })
  }

  return (
    <div className="formulaire">
      <h2>Connexion</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
        />
      </div>

      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          value={motdepasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="●●●●●"
        />
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      <button onClick={handleConnexion}>Se connecter</button>
    </div>
  )
}

export default Connexion
```

### Exemple 2 : Formulaire avec select et textarea

**Comment.jsx**
```javascript
import { useState } from 'react'

function Comment() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('general')
  const [message, setMessage] = useState('')

  const handleEnvoyer = () => {
    const donnees = { nom, email, sujet, message }
    console.log('Commentaire envoyé:', donnees)
  }

  return (
    <div className="formulaire">
      <h2>Nous contacter</h2>

      <input
        placeholder="Votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />

      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select value={sujet} onChange={(e) => setSujet(e.target.value)}>
        <option value="general">Sujet général</option>
        <option value="bug">Signaler un bug</option>
        <option value="suggestion">Suggestion</option>
      </select>

      <textarea
        placeholder="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="5"
      />

      <button onClick={handleEnvoyer}>Envoyer</button>
    </div>
  )
}

export default Comment
```

### Exemple 3 : Formulaire avec validation complexe

**Inscription.jsx**
```javascript
import { useState } from 'react'

function Inscription() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motdepasse: '',
    confirmation: ''
  })

  const [erreurs, setErreurs] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const valider = () => {
    const nouveauxErreurs = {}

    if (!formData.nom) nouveauxErreurs.nom = 'Nom requis'
    if (!formData.email.includes('@')) nouveauxErreurs.email = 'Email invalide'
    if (formData.motdepasse.length < 6) nouveauxErreurs.motdepasse = 'Minimum 6 caractères'
    if (formData.motdepasse !== formData.confirmation) {
      nouveauxErreurs.confirmation = 'Les mots de passe ne correspondent pas'
    }

    setErreurs(nouveauxErreurs)
    return Object.keys(nouveauxErreurs).length === 0
  }

  const handleInscription = () => {
    if (valider()) {
      console.log('Inscription réussie!', formData)
    }
  }

  return (
    <div className="formulaire">
      <h2>Inscription</h2>

      <div>
        <label>Nom</label>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Votre nom"
        />
        {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
        />
        {erreurs.email && <p className="erreur">{erreurs.email}</p>}
      </div>

      <div>
        <label>Mot de passe</label>
        <input
          name="motdepasse"
          type="password"
          value={formData.motdepasse}
          onChange={handleChange}
          placeholder="●●●●●●"
        />
        {erreurs.motdepasse && <p className="erreur">{erreurs.motdepasse}</p>}
      </div>

      <div>
        <label>Confirmer le mot de passe</label>
        <input
          name="confirmation"
          type="password"
          value={formData.confirmation}
          onChange={handleChange}
          placeholder="●●●●●●"
        />
        {erreurs.confirmation && <p className="erreur">{erreurs.confirmation}</p>}
      </div>

      <button onClick={handleInscription}>S'inscrire</button>
    </div>
  )
}

export default Inscription
```

---

## 📌 EXEMPLE Complet

**Fiche produit avec commentaires**

```javascript
import { useState } from 'react'

function FicheProduit() {
  const [commentaires, setCommentaires] = useState([])
  const [nom, setNom] = useState('')
  const [note, setNote] = useState('5')
  const [texte, setTexte] = useState('')

  const ajouter = () => {
    if (nom && texte) {
      setCommentaires([
        ...commentaires,
        {
          id: Date.now(),
          nom,
          note,
          texte,
          date: new Date().toLocaleDateString()
        }
      ])
      setNom('')
      setNote('5')
      setTexte('')
    }
  }

  return (
    <div>
      <h1>Produit Awesome</h1>

      <h2>Laisser un commentaire</h2>
      <input
        placeholder="Votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <select value={note} onChange={(e) => setNote(e.target.value)}>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐</option>
        <option value="3">3 ⭐</option>
        <option value="4">4 ⭐</option>
        <option value="5">5 ⭐</option>
      </select>
      <textarea
        placeholder="Votre avis"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows="4"
      />
      <button onClick={ajouter}>Ajouter un commentaire</button>

      <h2>Commentaires ({commentaires.length})</h2>
      {commentaires.map(c => (
        <div key={c.id} className="commentaire">
          <strong>{c.nom}</strong> - {c.note} ⭐ ({c.date})
          <p>{c.texte}</p>
        </div>
      ))}
    </div>
  )
}

export default FicheProduit
```

---

## ⚠️ Règles importantes

### 1. Accéder à la valeur de l'input

```javascript
// e.target.value = la valeur tapée par l'user
const handleChange = (e) => {
  console.log(e.target.value)  // 'hello'
  setTexte(e.target.value)
}
```

### 2. Contrôlé vs Non-contrôlé

```javascript
// ✅ BON : Contrôlé (tu contrôles la valeur)
function Bon() {
  const [valeur, setValeur] = useState('')
  return <input value={valeur} onChange={(e) => setValeur(e.target.value)} />
}

// ❌ À éviter : Non-contrôlé
function Mauvais() {
  return <input />  // React ne gère pas la valeur
}
```

### 3. Traiter les événements

```javascript
// onClick
<button onClick={() => handleClick()}>Clique</button>

// onSubmit (formulaire)
<form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
  <input />
  <button type="submit">Envoyer</button>
</form>

// onKeyDown
<input onKeyDown={(e) => {
  if (e.key === 'Enter') handleSubmit()
}} />
```

---

**[Suivant: API & fetch →](./3-api.md)**
