# 💾 Guide: Import et Export CSV en Format XML

## 📖 QUOI

**CSV** = Données tabulaires (liste avec colonnes et rangées)

**Export CSV en XML** = Convertir ta liste de données en fichier XML structuré et télécharger

**Import CSV depuis XML** = Charger un fichier XML et récupérer les données sous forme de liste

```javascript
// Données CSV (liste d'objets)
const utilisateurs = [
  { id: 1, nom: 'Alice', email: 'alice@example.com' },
  { id: 2, nom: 'Bob', email: 'bob@example.com' }
]

// Export en XML: convertir en fichier .xml et télécharger
exportCSVasXML(utilisateurs, 'utilisateurs.xml')

// Import depuis XML: charger le fichier .xml et parser
const data = await importCSVfromXML(file)
```

---

## 💡 POURQUOI

**Cas d'usage réels:**
- ✅ Exporter pour les systèmes legacy (SAP, ERP)
- ✅ Intégration avec d'autres entreprises
- ✅ Format structuré et lisible pour non-devs
- ✅ Importer des données d'autres systèmes XML
- ✅ Avoir une structure claire avec balises

---

## 🛠️ COMMENT

### 🔴 PARTIE 1: EXPORT CSV EN FORMAT XML

#### Technique: Convertir liste en XML et télécharger

```javascript
// ✅ IMPORTS NECESSAIRES
// Aucun import nécessaire! C'est du JavaScript natif

// 1️⃣ Convertir array en XML string
const csvVersXML = (donnees, nomRacine = 'Donnees', nomLigne = 'Ligne') => {
  // En-tête XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${nomRacine}>\n`
  
  // Pour chaque ligne de données
  donnees.forEach(item => {
    xml += `  <${nomLigne}>\n`
    
    // Chaque propriété devient une balise XML
    for (const [cle, valeur] of Object.entries(item)) {
      xml += `    <${cle}>${valeur}</${cle}>\n`
    }
    
    xml += `  </${nomLigne}>\n`
  })
  
  // Pied de page XML
  xml += `</${nomRacine}>`
  return xml
}

// 2️⃣ Fonction réutilisable pour télécharger
const exportCSVasXML = (donnees, nomFichier = 'data.xml') => {
  // Convertir en XML
  const xmlString = csvVersXML(donnees, 'Utilisateurs', 'Utilisateur')
  
  // Créer un Blob (fichier en mémoire)
  const blob = new Blob([xmlString], { type: 'application/xml' })
  
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

// 3️⃣ Utilisation
const users = [
  { id: 1, nom: 'Alice', email: 'alice@example.com' },
  { id: 2, nom: 'Bob', email: 'bob@example.com' }
]

exportCSVasXML(users, 'utilisateurs.xml')
// Génère fichier: utilisateurs.xml avec contenu:
// <?xml version="1.0" encoding="UTF-8"?>
// <Utilisateurs>
//   <Utilisateur>
//     <id>1</id>
//     <nom>Alice</nom>
//     <email>alice@example.com</email>
//   </Utilisateur>
//   <Utilisateur>
//     <id>2</id>
//     <nom>Bob</nom>
//     <email>bob@example.com</email>
//   </Utilisateur>
// </Utilisateurs>
```

#### Exemple React Complet: Export CSV en XML

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function ExportCSVasXML() {
  const [donnees, setDonnees] = useState([
    { demandeId: 1, typeDemande: 'nouveau titre', statut: 'en cours' },
    { demandeId: 2, typeDemande: 'duplicata', statut: 'terminee' },
    { demandeId: 3, typeDemande: 'renouvellement', statut: 'en cours' }
  ])

  const csvVersXML = (donnees, nomRacine = 'Donnees', nomLigne = 'Ligne') => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${nomRacine}>\n`
    
    donnees.forEach(item => {
      xml += `  <${nomLigne}>\n`
      for (const [cle, valeur] of Object.entries(item)) {
        xml += `    <${cle}>${valeur}</${cle}>\n`
      }
      xml += `  </${nomLigne}>\n`
    })
    
    xml += `</${nomRacine}>`
    return xml
  }

  const exportCSVasXML = (donnees, nomFichier = 'data.xml') => {
    const xmlString = csvVersXML(donnees, 'Demandes', 'Demande')
    const blob = new Blob([xmlString], { type: 'application/xml' })
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
      <h2>Exporter CSV en XML</h2>
      <button onClick={() => exportCSVasXML(donnees, 'demandes.xml')}>
        📥 Télécharger en XML
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
      
      <h3>Aperçu du fichier XML qui sera téléchargé:</h3>
      <pre>{csvVersXML(donnees, 'Demandes', 'Demande')}</pre>
    </div>
  )
}

export default ExportCSVasXML
```

---

### 🟡 PARTIE 2: IMPORT CSV DEPUIS XML

#### Technique: Charger XML et extraire données

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

// 1️⃣ Parser XML en array (CSV)
const xmlVersCSV = (xmlString, nomLigne = 'Ligne') => {
  // Créer un parser XML
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
  
  // Vérifier les erreurs de parsing
  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('XML invalide ou mal formé')
  }
  
  // Trouver toutes les lignes (éléments avec le nom souhaité)
  const lignes = xmlDoc.getElementsByTagName(nomLigne)
  const csv = []
  
  // Convertir chaque balise en objet
  lignes.forEach(ligne => {
    const item = {}
    
    // Pour chaque enfant de la ligne
    for (const child of ligne.children) {
      // Prendre le nom de la balise comme clé et le contenu comme valeur
      item[child.tagName] = child.textContent
    }
    
    csv.push(item)
  })
  
  return csv
}

// 2️⃣ Fonction réutilisable
const importCSVfromXML = async (file, nomLigne = 'Ligne') => {
  try {
    // Lire le fichier comme texte
    const texte = await file.text()
    
    // Parser en array
    const donnees = xmlVersCSV(texte, nomLigne)
    
    return donnees
    
  } catch (error) {
    throw new Error(`Erreur import XML: ${error.message}`)
  }
}

// 3️⃣ Utilisation dans un composant
function ImportCSVfromXML() {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    
    if (!file) return
    
    try {
      setErreur(null)
      
      // Vérifier l'extension
      if (!file.name.endsWith('.xml')) {
        throw new Error('Veuillez sélectionner un fichier .xml')
      }
      
      // Importer et parser
      // ATTENTION: utiliser le bon nom de ligne (ex: 'Utilisateur' pas 'Ligne')
      const data = await importCSVfromXML(file, 'Utilisateur')
      setDonnees(data)
      
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <div>
      <h2>Importer CSV depuis XML</h2>
      
      <input 
        type="file" 
        accept=".xml" 
        onChange={handleFileChange}
      />
      
      {erreur && <p className="erreur">❌ {erreur}</p>}
      
      {donnees && (
        <div>
          <h3>✅ Données importées (XML → CSV):</h3>
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

export default ImportCSVfromXML
```

---

### 🟣 PARTIE 3: EXEMPLE COMPLET (Export + Import XML)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function GestionCSVXML() {
  const [donnees, setDonnees] = useState([
    { id: 1, nom: 'Alice', email: 'alice@example.com', statut: 'actif' },
    { id: 2, nom: 'Bob', email: 'bob@example.com', statut: 'inactif' },
    { id: 3, nom: 'Charlie', email: 'charlie@example.com', statut: 'actif' }
  ])
  const [message, setMessage] = useState('')

  // ===== EXPORT XML =====
  const csvVersXML = (donnees, nomRacine = 'Donnees', nomLigne = 'Ligne') => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${nomRacine}>\n`
    donnees.forEach(item => {
      xml += `  <${nomLigne}>\n`
      for (const [cle, valeur] of Object.entries(item)) {
        xml += `    <${cle}>${valeur}</${cle}>\n`
      }
      xml += `  </${nomLigne}>\n`
    })
    xml += `</${nomRacine}>`
    return xml
  }

  const exportCSVasXML = (donnees, nomFichier = 'data.xml') => {
    const xmlString = csvVersXML(donnees, 'Utilisateurs', 'Utilisateur')
    const blob = new Blob([xmlString], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    
    const lien = document.createElement('a')
    lien.href = url
    lien.download = nomFichier
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
    
    URL.revokeObjectURL(url)
    setMessage('✅ CSV exporté en XML!')
  }

  // ===== IMPORT XML =====
  const handleImportXML = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setMessage('')
      
      if (!file.name.endsWith('.xml')) {
        throw new Error('Doit être un fichier .xml')
      }
      
      const texte = await file.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(texte, 'application/xml')
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML mal formé')
      }
      
      const lignes = xmlDoc.getElementsByTagName('Utilisateur')
      const data = []
      
      lignes.forEach(ligne => {
        const item = {}
        for (const child of ligne.children) {
          item[child.tagName] = child.textContent
        }
        data.push(item)
      })
      
      setDonnees(data)
      setMessage('✅ CSV importé depuis XML!')
      
    } catch (err) {
      setMessage(`❌ Erreur: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion CSV - Format XML</h1>

      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      {/* EXPORT */}
      <section>
        <h2>📥 Exporter CSV en XML</h2>
        <button onClick={() => exportCSVasXML(donnees, 'utilisateurs.xml')}>
          Télécharger en XML
        </button>
      </section>

      {/* IMPORT */}
      <section>
        <h2>📤 Importer CSV depuis XML</h2>
        <input 
          type="file" 
          accept=".xml" 
          onChange={handleImportXML}
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

export default GestionCSVXML
```

---

## ⚠️ PIÈGES COURANTS

### Piège 1️⃣: Mauvais nom de ligne au parsing

```javascript
// ❌ Si XML a <Demande> mais on cherche <Utilisateur>
const lignes = xmlDoc.getElementsByTagName('Utilisateur')  // Rien trouvé!

// ✅ CORRECT: utiliser le bon nom
const lignes = xmlDoc.getElementsByTagName('Demande')
```

### Piège 2️⃣: XML mal formé

```javascript
// ❌ Si XML a des caractères spéciaux non échappés
<nom>O'Brien</nom>  // Erreur! L'apostrophe casse le XML

// ✅ Échapper avec &apos; ou utiliser des guillemets
<nom>O&apos;Brien</nom>
// Ou dans le code:
xml += `    <nom>O&apos;Brien</nom>\n`
```

### Piège 3️⃣: Oublier `await` sur `file.text()`

```javascript
// ❌ ERREUR
const texte = file.text()
const xmlDoc = parser.parseFromString(texte)  // Crash!

// ✅ CORRECT
const texte = await file.text()
const xmlDoc = parser.parseFromString(texte)
```

### Piège 4️⃣: Oublier de nettoyer les URLs

```javascript
// ❌ Fuite mémoire
const url = URL.createObjectURL(blob)
// Pas de URL.revokeObjectURL()

// ✅ Toujours nettoyer
const url = URL.createObjectURL(blob)
// ... utiliser ...
URL.revokeObjectURL(url)
```

### Piège 5️⃣: Oublier les caractères spéciaux en XML

```javascript
// ❌ Certains caractères cassent le XML
<email>bob@example.com & alice@example.com</email>  // & pour AND

// ✅ Échapper les caractères spéciaux
<email>bob@example.com &amp; alice@example.com</email>

// Caractères à échapper:
// & → &amp;
// < → &lt;
// > → &gt;
// " → &quot;
// ' → &apos;
```

---

## 🎯 Résumé rapide

```javascript
// ✅ Export CSV EN XML
const xml = csvVersXML(data, 'Racine', 'Item')
downloadFile(xml, 'data.xml', 'application/xml')

// ✅ Import CSV DEPUIS XML (ATTENTION au nom de ligne!)
const data = xmlVersCSV(await file.text(), 'Item')

// Utilisation
exportCSVasXML(myList, 'Utilisateurs', 'Utilisateur', 'export.xml')
const imported = await importCSVfromXML(selectedFile, 'Utilisateur')
```

---

**Créée:** 2026-05-01  
**Version:** 1.0
