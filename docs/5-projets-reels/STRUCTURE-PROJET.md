# 📁 Guide: Structure d'un Projet React Réel

## 🎯 Structure recommandée

```
mon-app/
├── node_modules/               ← Dépendances (npm install)
├── public/                      ← Fichiers statiques
│   ├── index.html              ← Page HTML principale
│   └── favicon.ico             ← Icône
├── src/                         ← TON CODE (l'important!)
│   ├── pages/                  ← Les pages de l'app
│   │   ├── Accueil.jsx
│   │   ├── Produits.jsx
│   │   ├── DetailProduit.jsx
│   │   └── Contact.jsx
│   ├── components/             ← Composants réutilisables
│   │   ├── Navigation.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Bouton.jsx
│   │   └── Card.jsx
│   ├── hooks/                  ← Custom hooks
│   │   ├── useForm.js
│   │   └── useFetch.js
│   ├── context/                ← Context API
│   │   ├── UtilisateurContext.jsx
│   │   └── ThemeContext.jsx
│   ├── styles/                 ← Fichiers CSS
│   │   ├── App.css
│   │   ├── Navigation.css
│   │   └── variables.css
│   ├── utils/                  ← Fonctions utilitaires
│   │   ├── api.js
│   │   └── formatage.js
│   ├── App.jsx                 ← Composant principal
│   ├── main.jsx                ← Point d'entrée
│   └── App.css
├── package.json                ← Dépendances du projet
├── vite.config.js              ← Configuration Vite
└── README.md                   ← Documentation du projet
```

---

## 📝 Explication de chaque dossier

### `src/pages/`
**Contient les pages principales de l'app**
```javascript
// Chaque page = un composant = une URL
Accueil.jsx      → /
Produits.jsx     → /produits
Contact.jsx      → /contact
```

### `src/components/`
**Composants réutilisables**
```javascript
// Petits composants utilisés partout
Navigation.jsx   → Utilisé dans toutes les pages
Card.jsx         → Réutilisé pour chaque produit
Bouton.jsx       → Réutilisé pour tous les boutons
```

### `src/hooks/`
**Custom hooks (logique réutilisable)**
```javascript
useForm.js       → Logique formulaire
useFetch.js      → Logique pour API
```

### `src/context/`
**État global**
```javascript
UtilisateurContext.jsx  → Données utilisateur partagées
ThemeContext.jsx        → Thème (clair/sombre)
```

### `src/styles/`
**Fichiers CSS**
```css
App.css          → Styles généraux
Navigation.css   → Styles de la nav
variables.css    → Couleurs, polices, etc.
```

### `src/utils/`
**Fonctions utilitaires**
```javascript
api.js           → Appels API réutilisables
formatage.js     → Formater dates, prix, etc.
```

---

## 🏗️ Exemple réel: Explorer le projet

```
src/
├── pages/
│   ├── Accueil.jsx           ← Page d'accueil
│   ├── Produits.jsx          ← Liste des produits
│   ├── DetailProduit.jsx     ← Détail 1 produit
│   └── Contact.jsx           ← Formulaire contact
├── components/
│   ├── Navigation.jsx        ← Menu en haut
│   ├── Header.jsx            ← En-tête
│   ├── Footer.jsx            ← Pied de page
│   ├── ProductCard.jsx       ← Carte produit
│   └── FormField.jsx         ← Champ formulaire
├── hooks/
│   ├── useForm.js            ← Gère un formulaire
│   └── useFetch.js           ← Récupère données API
├── context/
│   └── PanierContext.jsx     ← Panier partagé
├── styles/
│   ├── App.css
│   ├── Navigation.css
│   └── variables.css
└── App.jsx                   ← Routing setup
```

---

## 💡 Bonnes pratiques

### 1. Un fichier = Un composant

```javascript
❌ MAUVAIS - Tout dans un fichier
function App() {
  return (
    <div>
      <Navigation />
      <ProductCard />
      <Footer />
    </div>
  )
}

✅ BON - Fichiers séparés
App.jsx
Navigation.jsx
ProductCard.jsx
Footer.jsx
```

### 2. Noms clairs et cohérents

```javascript
❌ MAUVAIS
Comp.jsx
util.js
h.js

✅ BON
ProductCard.jsx
apiUtils.js
useForm.js
```

### 3. Styles proches du composant

```javascript
// ProductCard.jsx
import './ProductCard.css'

function ProductCard() { ... }
```

### 4. Grouper par fonctionnalité

```
❌ MAUVAIS

components/
  Button.jsx
  Input.jsx
  Form.jsx
  ProductCard.jsx
  UserProfile.jsx

✅ BON

components/
  Form/
    Input.jsx
    Button.jsx
    Form.jsx
  Product/
    ProductCard.jsx
  User/
    UserProfile.jsx
```

---

## 🚀 Commencer un nouveau projet

```bash
# 1. Créer le projet
npm create vite@latest mon-app -- --template react
cd mon-app

# 2. Installer les dépendances
npm install

# 3. Installer React Router (si tu veux plusieurs pages)
npm install react-router-dom

# 4. Créer la structure
mkdir src/pages src/components src/hooks src/context src/styles src/utils

# 5. Lancer le dev server
npm run dev
```

---

## 📊 Checklist de structure

- [ ] Dossier `pages/` créé avec tes pages
- [ ] Dossier `components/` avec composants réutilisables
- [ ] Navigation.jsx pour le menu
- [ ] App.jsx avec les routes
- [ ] Dossier `styles/` pour CSS
- [ ] Dossier `utils/` pour fonctions partagées
- [ ] `package.json` avec `react-router-dom` installé

---

**[Suivant: Exemple complet d'une vraie app →](./EXEMPLE-APP-COMPLETE.md)**
