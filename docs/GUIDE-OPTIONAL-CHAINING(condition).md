# 🔐 Guide: Optional Chaining (?.) et Nullish Coalescing (??)

## 📖 QUOI

**Optional Chaining** (`?.`) = Syntaxe moderne pour accéder **en sécurité** à des propriétés qui pourraient être `null` ou `undefined`.

```javascript
// ❌ ANCIEN (longtemps et lourd)
{donnees && donnees[0] && donnees[0].numeroDemande}

// ✅ MODERNE (court et propre)
{donnees?.[0]?.numeroDemande}
```

**Nullish Coalescing** (`??`) = Fournir une valeur par défaut si c'est `null` ou `undefined`.

```javascript
{donnees?.[0]?.numeroDemande ?? 'N/A'}  // Affiche 'N/A' si undefined
```

---

## 💡 POURQUOI

### Sans optional chaining (❌ ANCIEN)

```javascript
// Si 'donnees' est null/undefined, ça crash!
const num = donnees[0].numeroDemande  // ❌ ERROR!

// Faut vérifier chaque niveau
const num = donnees && donnees[0] && donnees[0].numeroDemande  // ⚠️ Lourd!
```

### Avec optional chaining (✅ MODERNE)

```javascript
// Retourne undefined en sécurité si n'importe quel niveau est null/undefined
const num = donnees?.[0]?.numeroDemande  // ✅ Safe!

// En React:
<h2>Demande {donnees?.[0]?.numeroDemande}</h2>
```

**Avantages:**
- ✅ Moins de code
- ✅ Plus lisible
- ✅ Pas de crash si la donnée manque
- ✅ Standard moderne (2024)

---

## 🛠️ COMMENT

### Technique 1️⃣: Accéder à une propriété (`?.`)

```javascript
// Objet simple
const user = { nom: 'Alice', email: 'alice@example.com' }
const email = user?.email         // "alice@example.com"
const phone = user?.phone         // undefined (pas d'erreur!)

// Si user est null/undefined
const user2 = null
const email2 = user2?.email       // undefined (pas de crash!)

// ❌ ANCIEN (sans optional chaining)
const email3 = user2 && user2.email  // undefined (mais plus lourd à écrire)
```

### Technique 2️⃣: Accéder à un array (`?.[index]`)

```javascript
const demandes = [
  { id: 1, titre: 'Demande 1' },
  { id: 2, titre: 'Demande 2' }
]

// Accéder au premier élément
const firstDemande = demandes?.[0]        // { id: 1, titre: 'Demande 1' }
const titre = demandes?.[0]?.titre        // "Demande 1"

// Si l'array est null/undefined
const demandes2 = null
const firstDemande2 = demandes2?.[0]      // undefined (pas d'erreur!)

// ❌ ANCIEN (sans optional chaining)
const titre2 = demandes2 && demandes2[0] && demandes2[0].titre  // Lourd!
```

### Technique 3️⃣: Appeler une fonction (`?.()`)

```javascript
const obj = {
  sayHello: () => 'Bonjour!'
}

obj.sayHello?.()      // "Bonjour!"

const obj2 = null
obj2?.sayHello?.()    // undefined (pas d'erreur!)

// ❌ ANCIEN (sans optional chaining)
obj2 && obj2.sayHello && obj2.sayHello()  // Lourd!
```

### Technique 4️⃣: Nullish Coalescing (`??`) - Valeur par défaut

```javascript
// Si la valeur est null ou undefined, utiliser une valeur par défaut
const numero = donnees?.[0]?.numeroDemande ?? 'N/A'
const nom = utilisateur?.nom ?? 'Anonyme'
const age = personne?.age ?? 18

// Exemples concrets
console.log(undefined ?? 'défaut')    // "défaut"
console.log(null ?? 'défaut')         // "défaut"
console.log(0 ?? 'défaut')            // 0 (car 0 n'est pas null!)
console.log('Alice' ?? 'défaut')      // "Alice"

// ❌ ANCIEN (.||. ne fonctionne pas bien pour 0 ou false)
const age2 = personne.age || 18  // Si age=0, devient 18! ❌
const age3 = personne.age ?? 18  // Si age=0, reste 0! ✅
```

---

## 📌 Exemples React concrets

### Exemple 1️⃣: Accéder à des données imbriquées d'une API

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function ApparenceDemandes() {
  const [donnees, setDonnees] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/demandes')
        const data = await response.json()
        setDonnees(data)
        // data = { 
        //   found: true, 
        //   demandes: [
        //     { numeroDemande: 3, typeDemande: 'nouveau titre' },
        //     { numeroDemande: 4, typeDemande: 'duplicata' }
        //   ]
        // }
      } catch (error) {
        console.error(error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div>
      {/* ✅ Sûr même si donnees est null ou l'array est vide */}
      <h2>Demande {donnees?.demandes?.[0]?.numeroDemande}</h2>
      <p>Type: {donnees?.demandes?.[0]?.typeDemande ?? 'Pas de type'}</p>
      
      {/* Afficher la liste */}
      <ul>
        {donnees?.demandes?.map(demande => (
          <li key={demande.numeroDemande}>
            {demande.typeDemande} - ID: {demande.numeroDemande}
          </li>
        )) ?? <li>Aucune demande</li>}
      </ul>
    </div>
  )
}

export default ApparenceDemandes
```

### Exemple 2️⃣: Comparaison ANCIEN vs MODERNE

```javascript
// ❌ ANCIEN
function AfficherUtilisateur(data) {
  if (data && data.utilisateur && data.utilisateur.profil) {
    return (
      <div>
        <h1>{data.utilisateur.profil.nom}</h1>
        <p>{data.utilisateur.profil.email}</p>
      </div>
    )
  }
  return <p>Pas de données</p>
}

// ✅ MODERNE
function AfficherUtilisateur(data) {
  const nom = data?.utilisateur?.profil?.nom
  const email = data?.utilisateur?.profil?.email
  
  return (
    <div>
      <h1>{nom ?? 'Anonyme'}</h1>
      <p>{email ?? 'Pas d\'email'}</p>
    </div>
  )
}
```

### Exemple 3️⃣: Ton cas exact

```javascript
// ✅ IMPORTS NECESSAIRES
import { useEffect, useState } from 'react'

function HistoriqueDemandes() {
  const [donnees, setDonnees] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await fetch('https://api.example.com/demandes')
        const data = await response.json()
        setDonnees(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistorique()
  }, [])

  if (loading) return <p>⏳ Chargement...</p>
  if (!donnees?.found) return <p>❌ Aucune demande trouvée</p>

  return (
    <div>
      {/* ✅ MODERNE avec optional chaining */}
      <h2>Historique de statut de la demande {donnees?.[0]?.numeroDemande}</h2>
      <p>Message: {donnees?.message ?? 'Pas de message'}</p>
      
      <ul>
        {donnees?.demandes?.map(demande => (
          <li key={demande.demandeId}>
            <strong>{demande.typeDemande}</strong> - 
            Statut: {demande.derniersStatut} - 
            Demandeur: {demande.nomDemandeur}
          </li>
        )) ?? <li>Aucune demande</li>}
      </ul>
    </div>
  )
}

export default HistoriqueDemandes
```

---

## 📊 Tableau Comparatif

| Cas | ❌ ANCIEN | ✅ MODERNE |
|-----|----------|-----------|
| Propriété | `user && user.email` | `user?.email` |
| Array | `arr && arr[0] && arr[0].id` | `arr?.[0]?.id` |
| Fonction | `func && func()` | `func?.()` |
| Valeur défaut | `val \|\| 'défaut'` | `val ?? 'défaut'` |
| Imbriqué | `a && a.b && a.b.c` | `a?.b?.c` |

---

## ⚠️ PIÈGES COURANTS

### Piège 1️⃣: Confondre `||` et `??`

```javascript
// ❌ MAUVAIS (|| inclut false, 0, '')
const age = user.age || 18  // Si age=0, devient 18!

// ✅ BON (?? inclut seulement null/undefined)
const age = user.age ?? 18  // Si age=0, reste 0
```

### Piège 2️⃣: Oublier que `?.` retourne undefined

```javascript
// ❌ ERREUR (tu penses que c'est string, mais c'est undefined!)
const nom = user?.nom
console.log(nom.toUpperCase())  // ❌ Crash! undefined n'a pas toUpperCase()

// ✅ BON (vérifier ou utiliser ??)
const nom = user?.nom ?? ''
console.log(nom.toUpperCase())  // ✅ OK
```

### Piège 3️⃣: Mélanger directement dans les attributs JSX

```javascript
// ⚠️ Peut afficher "undefined"
<h1>{donnees?.titre}</h1>  // Si undefined, affiche "undefined"

// ✅ MIEUX (avec ??)
<h1>{donnees?.titre ?? 'Sans titre'}</h1>
```

---

## 🎯 Règle d'or

> **Utilise `?.` chaque fois que tu accèdes à une propriété qui POURRAIT être null/undefined**

```javascript
// ✅ LA BONNE HABITUDE À PRENDRE
const user = fetchUser()  // Peut être null!
const email = user?.email            // Safe!
const phone = user?.phone ?? 'N/A'   // Safe + défaut!
const greeting = user?.getName?.()   // Safe si la fonction existe!
```

---

**Créée:** 2026-05-01  
**Version:** 1.0
