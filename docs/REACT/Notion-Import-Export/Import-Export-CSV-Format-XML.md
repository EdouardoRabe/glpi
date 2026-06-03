# 📄 Import / Export CSV — Format XML

Ce document explique comment importer des données **CSV** et les exporter en format **XML**.

## Sommaire

- [Concept](#concept)
- [Importer CSV](#importer-csv)
  - [Lire un fichier CSV](#lire-un-fichier-csv)
  - [Parser en données](#parser-en-données)
- [Exporter en XML](#exporter-en-xml)
  - [Fonction d'export](#fonction-dexport)
  - [Télécharger le fichier](#télécharger-le-fichier)
- [Exemple complet React](#exemple-complet-react)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Concept

**Flux:**

```
CSV (Import) → Données → XML (Export)
```

**Exemple CSV d'entrée:**
```csv
id,nom,prix,quantite
1,Ordinateur,1500.00,3
2,Souris,25.50,10
3,Clavier,75.00,5
```

**Résultat XML:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<produits>
  <produit>
    <id>1</id>
    <nom>Ordinateur</nom>
    <prix>1500.00</prix>
    <quantite>3</quantite>
  </produit>
  <produit>
    <id>2</id>
    <nom>Souris</nom>
    <prix>25.50</prix>
    <quantite>10</quantite>
  </produit>
  <produit>
    <id>3</id>
    <nom>Clavier</nom>
    <prix>75.00</prix>
    <quantite>5</quantite>
  </produit>
</produits>
```

---

## Importer CSV

### Lire un fichier CSV

```jsx
const handleCsvChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const csvTexte = e.target.result;
    const donnees = parseCsv(csvTexte);
    console.log(donnees);
  };
  reader.readAsText(file);
};
```

### Parser le CSV en données

```javascript
// ═══════════════════════════════════════════════════
// Convertir CSV brut en tableau d'objets
// ═══════════════════════════════════════════════════

export function parseCsv(csvTexte) {
  const lignes = csvTexte.trim().split('\n');

  // Ligne 0 = entêtes
  const entetes = lignes[0].split(',').map(e => e.trim());

  // Lignes suivantes = données
  const donnees = [];

  for (let i = 1; i < lignes.length; i++) {
    const ligne = lignes[i].trim();
    if (!ligne) continue; // Ignorer les lignes vides

    const valeurs = splitLigneCsv(ligne);
    const objet = {};

    entetes.forEach((entete, index) => {
      objet[entete] = valeurs[index]?.trim() ?? '';
    });

    donnees.push(objet);
  }

  return donnees;
}

// Gérer les valeurs entre guillemets
function splitLigneCsv(ligne) {
  const resultat = [];
  let courant = '';
  let dansGuillemets = false;

  for (const caractere of ligne) {
    if (caractere === '"') {
      dansGuillemets = !dansGuillemets;
    } else if (caractere === ',' && !dansGuillemets) {
      resultat.push(courant);
      courant = '';
    } else {
      courant += caractere;
    }
  }

  resultat.push(courant);
  return resultat;
}
```

---

## Exporter en XML

### Fonction d'export

```javascript
// ═══════════════════════════════════════════════════
// Exporter les données en XML
// ═══════════════════════════════════════════════════

export function exporterEnXml(donnees, nomFichier = 'export.xml', rootName = 'donnees', rowName = 'ligne') {
  if (!donnees || !donnees.length) {
    console.error('Aucune donnée à exporter');
    return;
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<${rootName}>\n`;

  for (const item of donnees) {
    xml += `  <${rowName}>\n`;
    
    for (const [cle, valeur] of Object.entries(item)) {
      const cleXml = cle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const valeurXml = escapeXml(String(valeur));
      xml += `    <${cleXml}>${valeurXml}</${cleXml}>\n`;
    }
    
    xml += `  </${rowName}>\n`;
  }

  xml += `</${rootName}>`;

  // Créer un Blob
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });

  // Déclencher le téléchargement
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}

// Échapper les caractères spéciaux pour XML
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ═══════════════════════════════════════════════════
// Utilisation
// ═══════════════════════════════════════════════════

const donnees = [
  { id: '1', nom: 'Ordinateur', prix: '1500.00', quantite: '3' },
  { id: '2', nom: 'Souris', prix: '25.50', quantite: '10' },
  { id: '3', nom: 'Clavier', prix: '75.00', quantite: '5' },
];

exporterEnXml(donnees, 'produits.xml', 'produits', 'produit');
```

### Télécharger le fichier

Fichier `produits.xml` généré:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<produits>
  <produit>
    <id>1</id>
    <nom>Ordinateur</nom>
    <prix>1500.00</prix>
    <quantite>3</quantite>
  </produit>
  <produit>
    <id>2</id>
    <nom>Souris</nom>
    <prix>25.50</prix>
    <quantite>10</quantite>
  </produit>
  <produit>
    <id>3</id>
    <nom>Clavier</nom>
    <prix>75.00</prix>
    <quantite>5</quantite>
  </produit>
</produits>
```

---

## Exemple complet React

```jsx
import { useState } from 'react';

function ImportExportCsvXml() {
  const [donnees, setDonnees] = useState([]);
  const [error, setError] = useState('');

  // Importer CSV
  const handleCsvChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvTexte = e.target.result;
        const donneesParsees = parseCsv(csvTexte);
        setDonnees(donneesParsees);
        setError('');
      } catch (err) {
        setError('Erreur: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Exporter en XML
  const handleExport = () => {
    if (!donnees.length) {
      setError('Aucune donnée à exporter');
      return;
    }
    exporterEnXml(donnees, 'produits.xml', 'produits', 'produit');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📥 Import CSV → 📤 Export XML</h2>

      {/* Import */}
      <div style={{ marginBottom: '20px' }}>
        <h3>1️⃣ Importer un fichier CSV</h3>
        <input type="file" accept=".csv" onChange={handleCsvChange} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Affichage des données */}
      {donnees.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>2️⃣ Données importées</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                {Object.keys(donnees[0]).map((cle) => (
                  <th key={cle}>{cle}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donnees.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, vidx) => (
                    <td key={vidx}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Export */}
      {donnees.length > 0 && (
        <div>
          <h3>3️⃣ Exporter les données en XML</h3>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            💾 Télécharger XML
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Fonctions utilitaires
// ═══════════════════════════════════════════════════

function parseCsv(csvTexte) {
  const lignes = csvTexte.trim().split('\n');
  const entetes = lignes[0].split(',').map(e => e.trim());
  const donnees = [];

  for (let i = 1; i < lignes.length; i++) {
    const ligne = lignes[i].trim();
    if (!ligne) continue;

    const valeurs = splitLigneCsv(ligne);
    const objet = {};
    entetes.forEach((entete, index) => {
      objet[entete] = valeurs[index]?.trim() ?? '';
    });

    donnees.push(objet);
  }

  return donnees;
}

function splitLigneCsv(ligne) {
  const resultat = [];
  let courant = '';
  let dansGuillemets = false;

  for (const caractere of ligne) {
    if (caractere === '"') {
      dansGuillemets = !dansGuillemets;
    } else if (caractere === ',' && !dansGuillemets) {
      resultat.push(courant);
      courant = '';
    } else {
      courant += caractere;
    }
  }

  resultat.push(courant);
  return resultat;
}

function exporterEnXml(donnees, nomFichier, rootName, rowName) {
  if (!donnees || !donnees.length) {
    console.error('Aucune donnée à exporter');
    return;
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<${rootName}>\n`;

  for (const item of donnees) {
    xml += `  <${rowName}>\n`;
    for (const [cle, valeur] of Object.entries(item)) {
      const cleXml = cle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const valeurXml = escapeXml(String(valeur));
      xml += `    <${cleXml}>${valeurXml}</${cleXml}>\n`;
    }
    xml += `  </${rowName}>\n`;
  }

  xml += `</${rootName}>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default ImportExportCsvXml;
```

---

## Bonnes pratiques

```javascript
// ✅ 1. Échapper les caractères spéciaux XML
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ✅ 2. Ajouter la déclaration XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

// ✅ 3. Nettoyer les noms d'éléments XML
const cleXml = cle.replace(/[^a-zA-Z0-9_-]/g, '_');

// ✅ 4. Vérifier que les données existent
if (!donnees || !donnees.length) {
  console.error('Aucune donnée');
  return;
}

// ✅ 5. Gérer les guillemets dans le CSV
if (valeur.includes(',') || valeur.includes('"')) {
  valeur = `"${valeur.replace(/"/g, '""')}"`;
}
```

---

## 📊 Tableau récapitulatif

| Étape | Fonction |
|-------|----------|
| Lire CSV | `FileReader` |
| Parser CSV | `parseCsv()` |
| Convertir en XML | `exporterEnXml()` |
| Exporter | `URL.createObjectURL()` |
| Télécharger | Clic sur lien |

---

## 🎯 Résumé

> **Import CSV** → **Export XML** : Convertir facilement les données tabulaires CSV en format XML structuré et hiérarchique.
