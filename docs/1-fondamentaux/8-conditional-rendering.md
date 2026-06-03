# 🎛️ Conditional Rendering - Afficher/Cacher du contenu

## 📖 QUOI

**Conditional rendering** = afficher ou cacher du contenu selon une condition

```javascript
// Affiche <p> seulement si numero existe
{numeroPasseport && <p>Numéro de passeport: {numeroPasseport}</p>}
```

---

## 💡 POURQUOI

**Sans conditions:**
```javascript
❌ MAUVAIS
<p>Numéro de passeport: {numeroPasseport}</p>
<p>Numéro de demande: {numeroDemande}</p>
// Affiche même si les valeurs sont vides!
```

**Avec conditions:**
```javascript
✅ BON
{numeroPasseport && <p>Numéro de passeport: {numeroPasseport}</p>}
{numeroDemande && <p>Numéro de demande: {numeroDemande}</p>}
// Affiche seulement si les valeurs existent!
```

---

## 🛠️ COMMENT - 4 techniques

### 1️⃣ Opérateur AND (&&) - Le plus courant

**Affiche SEULEMENT si la condition est vraie**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Profil() {
  const [isConnecte, setIsConnecte] = useState(false)
  const [nomUtilisateur, setNomUtilisateur] = useState('')

  return (
    <div>
      {/* Affiche seulement si isConnecte est true */}
      {isConnecte && <p>Bienvenue {nomUtilisateur}!</p>}

      {/* Affiche seulement si nomUtilisateur n'est pas vide */}
      {nomUtilisateur && <p>Tu es: {nomUtilisateur}</p>}

      {/* Affiche seulement si la condition matérielle est vraie */}
      {isConnecte && nomUtilisateur && <button>Modifier le profil</button>}
    </div>
  )
}
```

**Comment ça marche:**
```javascript
true && <p>Affiche</p>     // ✅ Affiche
false && <p>Cache</p>       // ❌ Cache

// Utile aussi avec des variables
const user = { nom: 'Alice' }
{user.nom && <p>{user.nom}</p>}  // Affiche "Alice"

const empty = ''
{empty && <p>Text</p>}  // Cache (string vide = false)
```

---

### 2️⃣ Opérateur Ternaire (?) - SINON...

**Affiche CECI si condition vraie, SINON affiche ÇA**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function EtatUtilisateur() {
  const [isConnecte, setIsConnecte] = useState(false)

  return (
    <div>
      {/* Si isConnecte = true, affiche "Accueil", sinon "Connexion" */}
      <h1>
        {isConnecte ? 'Accueil' : 'Connexion'}
      </h1>

      {/* Peut aussi afficher du JSX */}
      {isConnecte ? (
        <div>
          <p>Tu es connecté!</p>
          <button>Déconnexion</button>
        </div>
      ) : (
        <div>
          <p>Tu n'es pas connecté</p>
          <button>Connexion</button>
        </div>
      )}

      {/* Avec plusieurs conditions */}
      <p style={{
        color: isConnecte ? 'green' : 'red'
      }}>
        Status: {isConnecte ? 'En ligne' : 'Hors ligne'}
      </p>
    </div>
  )
}
```

**Syntaxe:**
```javascript
{condition ? <afficheSiVrai /> : <afficheSiFaux />}

// Exemple simple
{age >= 18 ? 'Adulte' : 'Enfant'}

// Exemple complex
{isLoading ? <Spinner /> : <Contenu />}
```

---

### 3️⃣ IF/ELSE avec fonction

**Pour les cas complexes**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Statut() {
  const [statut, setStatut] = useState('en attente')  // 'en attente', 'approuve', 'refuse'

  // Fonction pour afficher le contenu
  const afficherStatut = () => {
    if (statut === 'en attente') {
      return <p style={{ color: 'orange' }}>⏳ En attente</p>
    } else if (statut === 'approuve') {
      return <p style={{ color: 'green' }}>✅ Approuvé</p>
    } else if (statut === 'refuse') {
      return <p style={{ color: 'red' }}>❌ Refusé</p>
    } else {
      return <p>État inconnu</p>
    }
  }

  return (
    <div>
      <h2>Statut de la demande</h2>
      {afficherStatut()}
    </div>
  )
}
```

**Ou SWITCH (parfois plus lisible):**

```javascript
function AfficherStatut({ statut }) {
  const afficherStatut = () => {
    switch (statut) {
      case 'en attente':
        return <p style={{ color: 'orange' }}>⏳ En attente</p>
      case 'approuve':
        return <p style={{ color: 'green' }}>✅ Approuvé</p>
      case 'refuse':
        return <p style={{ color: 'red' }}>❌ Refusé</p>
      default:
        return <p>État inconnu</p>
    }
  }

  return <div>{afficherStatut()}</div>
}
```

---

### 4️⃣ IIFE (Immediatent Invoked Function Expression)

**Pour les cas VRAIMENT complexes**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function Formulaire() {
  const [age, setAge] = useState(15)

  return (
    <div>
      {(() => {
        // Logique complexe
        if (age < 13) {
          return <p>Trop jeune</p>
        } else if (age < 18) {
          return <p>Besoin permission parent</p>
        } else if (age > 65) {
          return <p>Tarif senior</p>
        } else {
          return <p>Tarif normal</p>
        }
      })()}
    </div>
  )
}
```

---

## 📌 EXEMPLE complet: Formulaire avec conditions

**src/pages/FormulairePasseport.jsx**

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function FormulairePasseport() {
  const [numeroPasseport, setNumeroPasseport] = useState('')
  const [numeroDemande, setNumeroDemande] = useState('')
  const [estValide, setEstValide] = useState(false)
  const [typeDoc, setTypeDoc] = useState('passport')  // 'passport' ou 'carte'

  const handleSubmit = () => {
    if (numeroPasseport && numeroDemande) {
      setEstValide(true)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>📋 Formulaire de demande</h1>

      {/* Affiche seulement si estValide = true */}
      {estValide && (
        <div style={{ color: 'green', marginBottom: '20px' }}>
          ✅ Formulaire valide!
        </div>
      )}

      {/* Input pour numéro de passeport */}
      <div style={{ marginBottom: '15px' }}>
        <label>Numéro de passeport</label>
        <input
          value={numeroPasseport}
          onChange={(e) => setNumeroPasseport(e.target.value)}
          placeholder="Ex: 12345678"
          style={{ width: '100%', padding: '8px' }}
        />
        
        {/* Affiche seulement si input vide */}
        {!numeroPasseport && (
          <p style={{ color: 'red', fontSize: '12px' }}>
            ⚠️ Ce champ est requis
          </p>
        )}

        {/* Affiche seulement si input rempli */}
        {numeroPasseport && (
          <p style={{ color: 'green', fontSize: '12px' }}>
            ✅ Numéro saisi: {numeroPasseport}
          </p>
        )}
      </div>

      {/* Input pour numéro de demande */}
      <div style={{ marginBottom: '15px' }}>
        <label>Numéro de demande</label>
        <input
          value={numeroDemande}
          onChange={(e) => setNumeroDemande(e.target.value)}
          placeholder="Ex: REQ-2024-001"
          style={{ width: '100%', padding: '8px' }}
        />

        {/* Affiche seulement si input rempli */}
        {numeroDemande && (
          <p style={{ color: 'green', fontSize: '12px' }}>
            ✅ Numéro de demande: {numeroDemande}
          </p>
        )}
      </div>

      {/* Sélecteur de type */}
      <div style={{ marginBottom: '15px' }}>
        <label>Type de document</label>
        <select
          value={typeDoc}
          onChange={(e) => setTypeDoc(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="passport">Passeport</option>
          <option value="carte">Carte d'identité</option>
        </select>
      </div>

      {/* Affiche différent texte selon typeDoc */}
      {typeDoc === 'passport' && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          📝 Pour un passeport: délai 4-6 semaines
        </p>
      )}

      {typeDoc === 'carte' && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          📝 Pour une carte d'identité: délai 2-3 semaines
        </p>
      )}

      {/* Affiche résumé seulement si les deux champs sont remplis */}
      {numeroPasseport && numeroDemande && (
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <h3>📋 Résumé</h3>
          <p>Numéro de passeport: {numeroPasseport}</p>
          <p>Numéro de demande: {numeroDemande}</p>
          <p>Type: {typeDoc === 'passport' ? 'Passeport' : 'Carte d\'identité'}</p>
        </div>
      )}

      {/* Bouton actif seulement si les deux champs remplis */}
      <button
        onClick={handleSubmit}
        disabled={!numeroPasseport || !numeroDemande}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: (numeroPasseport && numeroDemande) ? 'green' : 'gray',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: (numeroPasseport && numeroDemande) ? 'pointer' : 'not-allowed',
          opacity: (numeroPasseport && numeroDemande) ? 1 : 0.5
        }}
      >
        {estValide ? '✅ Validé!' : 'Valider'}
      </button>

      {/* Message d'erreur avec condition ternaire */}
      <p style={{ marginTop: '15px', color: 'red' }}>
        {!numeroPasseport && !numeroDemande
          ? '⚠️ Remplissez tous les champs'
          : !numeroPasseport
          ? '⚠️ Remplissez le numéro de passeport'
          : !numeroDemande
          ? '⚠️ Remplissez le numéro de demande'
          : ''}
      </p>
    </div>
  )
}

export default FormulairePasseport
```

---

## 📊 Comparaison des techniques

| Technique | Usage | Exemple |
|-----------|-------|---------|
| `&&` | Affiche SI condition vraie | `{isLoggedIn && <Logout />}` |
| `?:` | SI vraie AFFICHE ceci SINON cela | `{age >= 18 ? 'Adulte' : 'Enfant'}` |
| `if/else` | Logique complexe | Voir switch example |
| `IIFE` | Très complexe | Seulement si nécessaire |

---

## ⚡ Cas pratiques courants

```javascript
// 1. Affiche bouton seulement si user connecté
{user && <button>Mon profil</button>}

// 2. Affiche message selon l'état de chargement
{loading ? <Spinner /> : <Contenu />}

// 3. Affiche section seulement si données existent
{user?.email && <p>Email: {user.email}</p>}

// 4. Affiche erreur seulement s'il y en a
{erreur && <p style={{ color: 'red' }}>Erreur: {erreur}</p>}

// 5. Affiche ou cache avec booléen
{showDetails && <Details />}

// 6. Affiche liste ou message vide
{items.length > 0 ? <ListeItems /> : <MessageVide />}
```

---

## 🎯 Votre cas spécifique

```javascript
// ❌ SANS condition (affiche même vide)
<p>Numéro de passeport: {numeroPasseport}</p>
<p>Numéro de demande: {numeroDemande}</p>

// ✅ AVEC condition (affiche seulement si rempli)
{numeroPasseport && <p>Numéro de passeport: {numeroPasseport}</p>}
{numeroDemande && <p>Numéro de demande: {numeroDemande}</p>}

// ✅ OU AVEC message d'erreur
{numeroPasseport ? (
  <p>✅ Numéro de passeport: {numeroPasseport}</p>
) : (
  <p style={{ color: 'red' }}>⚠️ Passeport requis</p>
)}
```

---

**Maintenant tu sais afficher/cacher du contenu conditionnellement!** 🎉
