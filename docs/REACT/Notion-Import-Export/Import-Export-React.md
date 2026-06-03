# Import / Export en React

Ce document explique comment gérer l'import et l'export de fichiers dans une application React, notamment pour les formats CSV, TXT et Excel.

## Sommaire

- [Introduction](#introduction)
- [Importer des données](#importer-des-données)
  - [Importer un fichier texte (TXT)](#importer-un-fichier-texte-txt)
  - [Importer un fichier CSV](#importer-un-fichier-csv)
  - [Importer un fichier Excel](#importer-un-fichier-excel)
- [Exporter des données](#exporter-des-données)
  - [Exporter au format TXT](#exporter-au-format-txt)
  - [Exporter au format CSV](#exporter-au-format-csv)
  - [Exporter au format Excel](#exporter-au-format-excel)
- [Bonnes pratiques](#bonnes-pratiques)
- [Exemples complets](#exemples-complets)
- [Conclusion](#conclusion)

## Introduction

Dans React, l'import et l'export de fichiers se gèrent généralement à partir d'entrées `<input type="file" />` pour lire des fichiers, et de `Blob` ou de bibliothèques pour créer des fichiers à télécharger.

## Importer des données

L'import se fait souvent avec un champ de formulaire :

```jsx
<input type="file" accept=".txt,.csv,.xlsx,.xls" onChange={handleFileChange} />
```

### Importer un fichier texte (TXT)

Pour un fichier texte, on lit le contenu avec un `FileReader`.

```jsx
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    console.log('Contenu TXT :', text);
  };
  reader.readAsText(file);
};
```

### Importer un fichier CSV

Le CSV peut être lu comme du texte, puis parsé manuellement ou avec une bibliothèque comme `papaparse`.

```jsx
import Papa from 'papaparse';

const handleCsvChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log('Données CSV :', results.data);
    },
  });
};
```

### Importer un fichier Excel

Pour Excel, on utilise habituellement `xlsx`.

```jsx
import * as XLSX from 'xlsx';

const handleExcelChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Données Excel :', json);
  };
  reader.readAsArrayBuffer(file);
};
```

## Exporter des données

L'export consiste à créer un fichier côté client, puis à déclencher un téléchargement.

### Exporter au format TXT

```jsx
const exportTxt = (text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'donnees.txt';
  link.click();
  URL.revokeObjectURL(url);
};
```

### Exporter au format CSV

Pour exporter des données CSV, on convertit un tableau d'objets en chaîne textuelle.

```jsx
const exportCsv = (rows) => {
  const header = Object.keys(rows[0]).join(',');
  const data = rows
    .map((row) => Object.values(row).map((value) => `"${value}"`).join(','))
    .join('\n');
  const csv = `${header}\n${data}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'donnees.csv';
  link.click();
  URL.revokeObjectURL(url);
};
```

### Exporter au format Excel

Pour Excel, on peut utiliser `xlsx` pour générer un fichier `.xlsx`.

```jsx
import * as XLSX from 'xlsx';

const exportExcel = (data, fileName = 'donnees.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
```

## Bonnes pratiques

- Limiter les formats acceptés avec `accept=".txt,.csv,.xlsx,.xls"`.
- Vérifier la taille du fichier avant lecture.
- Gérer les erreurs de parsing et informer l'utilisateur.
- Préférer des bibliothèques fiables (`papaparse`, `xlsx`) pour les formats complexes.
- Ne pas oublier `URL.revokeObjectURL(url)` après téléchargement.

## Exemples complets

### Exemple d'import et export simple

```jsx
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function ImportExport() {
  const [csvData, setCsvData] = useState([]);

  const handleCsvChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const handleExportCsv = () => {
    if (!csvData.length) return;
    exportCsv(csvData);
  };

  const handleExportExcel = () => {
    if (!csvData.length) return;
    exportExcel(csvData, 'donnees.xlsx');
  };

  return (
    <div>
      <h1>Import / Export</h1>
      <input type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleCsvChange} />
      <button type="button" onClick={handleExportCsv}>Exporter CSV</button>
      <button type="button" onClick={handleExportExcel}>Exporter Excel</button>
    </div>
  );
}
```

## Conclusion

L'import et l'export en React sont simples avec les bonnes API. Pour les formats plats comme TXT et CSV, `FileReader` suffit, tandis que pour Excel, `xlsx` reste la solution la plus robuste.
