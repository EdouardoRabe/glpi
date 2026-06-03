# 💾 Guide: Import et Export CSV en Format JSON

## 📖 QUOI

**CSV** = Données tabulaires (liste avec colonnes et rangées)

**Export CSV en JSON** = Convertir ta liste de données en fichier JSON et télécharger

**Import CSV depuis JSON** = Charger un fichier JSON et récupérer les données sous forme de liste

```javascript
// Données CSV (liste d'objets)
const utilisateurs = [
  { id: 1, nom: 'Alice', email: 'alice@example.com' },
  { id: 2, nom: 'Bob', email: 'bob@example.com' }
]

// Export en JSON: convertir en fichier .json et télécharger
exportCSVasJSON(utilisateurs, 'utilisateurs.json')

// Import depuis JSON: charger le fichier .json
const data = await importCSVfromJSON(file)
```

---

## 💡 POURQUOI

**Cas d'usage réels:**
- ✅ Exporter une liste d'utilisateurs en JSON
- ✅ Exporter un rapport en JSON pour une autre app
- ✅ Importer des données d'un fichier JSON
- ✅ Compatible avec toutes les APIs modernes
- ✅ Format léger et facile à manipuler

---

## 🛠️ COMMENT

### 🟢 PARTIE 1: EXPORT CSV EN FORMAT JSON

#### Technique: Convertir liste en JSON et télécharger

```javascript
// ✅ IMPORTS NECESSAIRES
// Aucun import nécessaire! C'est du JavaScript natif

// 1️⃣ Fonction réutilisable
const exportCSVasJSON = (donnees, nomFichier = 'data.json') => {
  // Convertir array en JSON string formaté
  const jsonString = JSON.stringify(donnees, null, 2)
  
  // Créer un Blob (fichier en mémoire)
  const blob = new Blob([jsonString], { type: 'application/json' })
  
  // Créer une URL et télécharger
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = nomFichier
  
  document.body.appendChild(lien)
  lien.click()
  document.body.removeChild(lien)
  
  // Nettoyer
  URL.revokeObjectURL(url)
}

// 2️⃣ Utilisation
const users = [
  { id: 1, nom: 'Alice', email: 'alice@example.com' },
  { id: 2, nom: 'Bob', email: 'bob@example.com' }
]

exportCSVasJSON(users, 'utilisateurs.json')
// Génère fichier: utilisateurs.json avec contenu:
// [
//   {
//     "id": 1,
//     "nom": "Alice",
//     "email": "alice@example.com"
//   },
//   ...
// ]
```

#### Exemple React Complet: Export CSV en JSON

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function ExportCSVasJSON() {
  const [donnees, setDonnees] = useState([
    { demandeId: 1, typeDemande: 'nouveau titre', statut: 'en cours' },
    { demandeId: 2, typeDemande: 'duplicata', statut: 'terminee' },
    { demandeId: 3, typeDemande: 'renouvellement', statut: 'en cours' }
  ])

  const exportCSVasJSON = (donnees, nomFichier = 'data.json') => {
    const jsonString = JSON.stringify(donnees, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const lien = document.createElement('a')
    lien.href = url
    lien.download = nomFichier
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
    
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>Exporter CSV en JSON</h2>
      <button onClick={() => exportCSVasJSON(donnees, 'demandes.json')}>
        📥 Télécharger en JSON
      </button>
      
      <h3>Aperçu des données (CSV):</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            {Object.keys(donnees[0]).map(cle => <th key={cle}>{cle}</th>)}
          </tr>
        </thead>
        <tbody>
          {donnees.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((val, i) => <td key={i}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>Aperçu du fichier JSON qui sera téléchargé:</h3>
      <pre>{JSON.stringify(donnees, null, 2)}</pre>
    </div>
  )
}

export default ExportCSVasJSON
```

---

### 🔵 PARTIE 2: IMPORT CSV DEPUIS JSON

#### Technique: Charger fichier JSON et récupérer données

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

// 1️⃣ Fonction réutilisable
const importCSVfromJSON = async (file) => {
  try {
    // Lire le fichier comme texte
    const texte = await file.text()
    
    // Parser le JSON en objet JavaScript
    const donnees = JSON.parse(texte)
    
    // Vérifier que c'est un array (CSV list)
    if (!Array.isArray(donnees)) {
      throw new Error('Le JSON doit être une liste (array), pas un objet')
    }
    
    return donnees
    
  } catch (error) {
    throw new Error(`Erreur import JSON: ${error.message}`)
  }
}

// 2️⃣ Utilisation dans un composant
function ImportCSVfromJSON() {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    
    if (!file) return
    
    try {
      setErreur(null)
      
      // Vérifier l'extension
      if (!file.name.endsWith('.json')) {
        throw new Error('Veuillez sélectionner un fichier .json')
      }
      
      // Importer et parser
      const data = await importCSVfromJSON(file)
      setDonnees(data)
      
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <div>
      <h2>Importer CSV depuis JSON</h2>
      
      <input 
        type="file" 
        accept=".json" 
        onChange={handleFileChange}
      />
      
      {erreur && <p className="erreur">❌ {erreur}</p>}
      
      {donnees && (
        <div>
          <h3>✅ Données importées (JSON → CSV):</h3>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                {Object.keys(donnees[0]).map(cle => <th key={cle}>{cle}</th>)}
              </tr>
            </thead>
            <tbody>
              {donnees.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ImportCSVfromJSON
```

---

### 🟣 PARTIE 3: EXEMPLE COMPLET (Export + Import JSON)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function GestionCSVJSON() {
  const [donnees, setDonnees] = useState([
    { id: 1, nom: 'Alice', email: 'alice@example.com', statut: 'actif' },
    { id: 2, nom: 'Bob', email: 'bob@example.com', statut: 'inactif' },
    { id: 3, nom: 'Charlie', email: 'charlie@example.com', statut: 'actif' }
  ])
  const [message, setMessage] = useState('')

  // ===== EXPORT JSON =====
  const exportCSVasJSON = (donnees, nomFichier = 'data.json') => {
    const jsonString = JSON.stringify(donnees, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const lien = document.createElement('a')
    lien.href = url
    lien.download = nomFichier
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
    
    URL.revokeObjectURL(url)
    setMessage('✅ CSV exporté en JSON!')
  }

  // ===== IMPORT JSON =====
  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setMessage('')
      
      if (!file.name.endsWith('.json')) {
        throw new Error('Doit être un fichier .json')
      }
      
      const texte = await file.text()
      const data = JSON.parse(texte)
      
      if (!Array.isArray(data)) {
        throw new Error('Le JSON doit être une liste')
      }
      
      setDonnees(data)
      setMessage('✅ CSV importé depuis JSON!')
      
    } catch (err) {
      setMessage(`❌ Erreur: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion CSV - Format JSON</h1>

      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      {/* EXPORT */}
      <section>
        <h2>📥 Exporter CSV en JSON</h2>
        <button onClick={() => exportCSVasJSON(donnees, 'utilisateurs.json')}>
          Télécharger en JSON
        </button>
      </section>

      {/* IMPORT */}
      <section>
        <h2>📤 Importer CSV depuis JSON</h2>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleImportJSON}
        />
      </section>

      {/* TABLEAU */}
      <section>
        <h2>📋 Données actuelles (CSV)</h2>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              {Object.keys(donnees[0]).map(cle => <th key={cle}>{cle}</th>)}
            </tr>
          </thead>
          <tbody>
            {donnees.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, i) => <td key={i}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default GestionCSVJSON
```

---

## ⚠️ PIÈGES COURANTS

### Piège 1️⃣: Oublier `null, 2` dans JSON.stringify()

```javascript
// ❌ Non formaté (difficile à lire)
JSON.stringify(donnees)

// ✅ Formaté avec indentation
JSON.stringify(donnees, null, 2)
```

### Piège 2️⃣: Ne pas vérifier que c'est un array

```javascript
// ❌ PEUT CRASH (si JSON est un objet {}, pas un array [])
const data = JSON.parse(jsonString)
data.map(...)  // Erreur si pas array!

// ✅ VÉRIFIER D'ABORD
if (!Array.isArray(data)) {
  throw new Error('Doit être une liste!')
}
```

### Piège 3️⃣: Oublier `await` sur `file.text()`

```javascript
// ❌ ERREUR (file.text() est une Promise)
const texte = file.text()
const data = JSON.parse(texte)  // Crash!

// ✅ CORRECT
const texte = await file.text()
const data = JSON.parse(texte)
```

### Piège 4️⃣: Oublier de nettoyer les URLs

```javascript
// ❌ Fuite mémoire
const url = URL.createObjectURL(blob)
// Pas de URL.revokeObjectURL(url) ❌

// ✅ Toujours nettoyer
const url = URL.createObjectURL(blob)
// ... utiliser ...
URL.revokeObjectURL(url)  // ✅ Libérer la mémoire
```

---

## 🎯 Résumé rapide

```javascript
// ✅ Export CSV EN JSON (simplement!)
const json = JSON.stringify(data, null, 2)
downloadFile(json, 'data.json', 'application/json')

// ✅ Import CSV DEPUIS JSON
const data = JSON.parse(await file.text())
if (!Array.isArray(data)) throw new Error('Doit être une liste!')

// Utilisation
exportCSVasJSON(myList, 'export.json')
const imported = await importCSVfromJSON(selectedFile)
```

---

**Créée:** 2026-05-01  
**Version:** 1.0
