# 1️⃣ Setup & Structure du projet

## 📖 QUOI

**Setup React** c'est initialiser un nouveau projet React avec tous les outils nécessaires pour démarrer.

### Structure d'un projet React
```
mon-app/
├── node_modules/          ← Les dépendances (NPM packages)
├── public/                ← Fichiers statiques (images, favicon)
│   └── index.html         ← Page HTML principale
├── src/                   ← Ton code (l'important!)
│   ├── App.jsx            ← Composant principal
│   ├── main.jsx           ← Point d'entrée
│   └── App.css            ← Styles
├── package.json           ← Configuration du projet
└── vite.config.js         ← Config Vite
```

---

## 💡 POURQUOI

- ✅ Tu as un environnement de développement prêt
- ✅ Hot reload (vois les changements en temps réel)
- ✅ Outils de build et optimisation
- ✅ Gestion des dépendances automatique
- ✅ Un serveur local pour tester

---

## 🛠️ COMMENT

### Étape 1 : Créer un projet avec Vite (rapide et moderne)
```bash
npm create vite@latest [nom-du-projet] -- --template react
cd [nom-du-projet]
npm install
```

### Étape 2 : Lancer le serveur de développement
```bash
npm run dev
```
→ Ouvre `http://localhost:5173` 🚀

### Étape 3 : Structure de base d'un fichier React

**src/App.jsx** (composant principal)
```javascript
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>Mon app React</h1>
      <p>Ça marche!</p>V
    </div>
  )
}

export default App
```

**src/main.jsx** (utilisé automatiquement par Vite)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 📌 EXEMPLE

### Créer et configurer ton premier projet

```bash
# 1. Crée le projet
npm create vite@latest mon-app-react -- --template react

# 2. Entre dans le dossier
cd mon-app-react

# 3. Installe les dépendances
npm install

# 4. Lance le dev server
npm run dev
```

Tu devrais voir → **Vite + React** ✅

### Modifier App.jsx
```javascript
function App() {
  return (
    <>
      <h1>🎉 Ça marche!</h1>
      <p>Mon premier composant React</p>
    </>
  )
}

export default App
```

Sauvegarde → Le navigateur se met à jour **automatiquement** ⚡

---

## 📋 Commandes utiles

| Commande | Effet |
|----------|-------|
| `npm run dev` | Lance le serveur de dev |
| `npm run build` | Build pour la production |
| `npm run preview` | Vois le build final localement |

---

**[Suivant: Composants & JSX →](./2-composants.md)**
