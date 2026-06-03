# 📝 GUIDE - Gérer les clés API de GLPI

## Stocker les clés API de manière sécurisée

### Étape 1 : Crée un fichier `.env` à la racine

```bash
# .env
VITE_GLPI_URL=https://glpi.example.com/api/rest.php
VITE_GLPI_APP_TOKEN=ton_app_token_ici
VITE_GLPI_SESSION_TOKEN=ton_session_token_ici
```

⚠️ **Important :** Les variables destinées au frontend doivent commencer par `VITE_` (Vite) ou `REACT_APP_` (Create React App).

### Étape 2 : Ajoute `.env` à `.gitignore`

```bash
# .gitignore
.env
.env.local
```

**Cela empêche les tokens d'être pushés sur GitHub !**

### Étape 3 : Utilise les variables dans le code

```jsx
// À la racine du projet
const GLPI_URL = import.meta.env.VITE_GLPI_URL
const GLPI_APP_TOKEN = import.meta.env.VITE_GLPI_APP_TOKEN

// Utilisation dans fetch
fetch(`${GLPI_URL}/search/Ticket`, {
  headers: {
    'App-Token': GLPI_APP_TOKEN,
    'Session-Token': sessionToken
  }
})
```

### Étape 4 : Sur le serveur de production

Sur ton serveur, configure les variables d'environnement directement (**jamais dans le code**).

Exemple avec Vercel :
1. Va dans Settings → Environment Variables
2. Ajoute tes tokens
3. Deploy

---

**[← Guides Principaux](GUIDE-IMPORTS.md)**
