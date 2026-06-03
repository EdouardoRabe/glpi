# 🔑 Guide: API Keys et Authentification

## 📖 QUOI

**API Key** = Un code secret qui te permet d'accéder à une API (comme une clé pour ouvrir une porte)

```javascript
// ❌ MAUVAIS (clé en dur = visible!)
const apiKey = 'sk_live_123abc456def789'
const response = await fetch('https://api.example.com/data', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
})

// ✅ BON (clé cachée dans .env)
const apiKey = import.meta.env.VITE_API_KEY
const response = await fetch('https://api.example.com/data', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
})
```

---

## 💡 POURQUOI

**Pourquoi les clés API existent:**
- ✅ Protéger ton API (empêcher l'accès non autorisé)
- ✅ Tracker qui utilise l'API
- ✅ Limiter l'utilisation (quotas)
- ✅ Facturer les utilisateurs

**Pourquoi PAS mettre la clé en dur:**
- ❌ Visible dans le code (GitHub, etc.)
- ❌ N'importe qui peut l'utiliser
- ❌ Quelqu'un peut vidanger ton compte
- ❌ Difficulté à changer la clé
- ❌ Fuite de données possible

**Solution: Utiliser `.env` (variables d'environnement)**
- ✅ Clé cachée
- ✅ Non versionée (pas dans Git)
- ✅ Facile à changer
- ✅ Sécurisée

---

## 🛠️ COMMENT

### 🔵 PARTIE 1: EXEMPLE SIMPLE (❌ À NE PAS FAIRE!)

```javascript
// ❌ MAUVAIS - NE JAMAIS FAIRE ÇA!
// (La clé est visible dans le code)

// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function APICallBad() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // ❌ DANGER: La clé est visible!
  const API_KEY = 'sk_live_51234567890abcdef'
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

  const fetchMeteo = async () => {
    try {
      setLoading(true)
      
      // ❌ Clé exposée ici aussi
      const response = await fetch(`${API_URL}?q=Paris&appid=${API_KEY}`)
      
      if (!response.ok) throw new Error('Erreur API')
      
      const result = await response.json()
      setData(result)
      
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchMeteo}>Récupérer la météo</button>
      {loading && <p>Chargement...</p>}
      {data && <p>Température: {data.main.temp}°C</p>}
    </div>
  )
}

export default APICallBad

// ❌ PROBLÈMES:
// 1. La clé est dans le code source Git
// 2. Tout le monde qui lit le repo a la clé
// 3. Quelqu'un peut l'utiliser et vider ton quota/compte
// 4. Difficile de changer la clé
```

---

### 🟢 PARTIE 2: EXEMPLE PRO AVEC .ENV (✅ LA BONNE FAÇON!)

#### Step 1️⃣: Créer le fichier `.env`

```
// Fichier: .env (racine du projet)

# API Keys
VITE_API_KEY=sk_live_51234567890abcdef
VITE_API_URL=https://api.openweathermap.org/data/2.5/weather

# Autres clés
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_KEY=pk_live_xxxxxxxxxxxxxxxx
```

**IMPORTANT:**
- ✅ Mettre `.env` dans `.gitignore` (pour ne pas le commiter)
- ✅ Ne JAMAIS partager `.env`
- ✅ Créer `.env.example` avec des placeholders

```
// Fichier: .env.example (à commiter dans Git)

VITE_API_KEY=your_api_key_here
VITE_API_URL=https://api.openweathermap.org/data/2.5/weather
VITE_GITHUB_TOKEN=your_github_token_here
VITE_STRIPE_KEY=your_stripe_key_here
```

```
// Fichier: .gitignore

.env
.env.local
.env.*.local
node_modules/
dist/
```

#### Step 2️⃣: Utiliser les clés dans React

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function APICallGood() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  // ✅ Récupérer depuis .env (Vite)
  const API_KEY = import.meta.env.VITE_API_KEY
  const API_URL = import.meta.env.VITE_API_URL

  // Debug: vérifier que les clés sont bien chargées
  // console.log('API Key chargée:', API_KEY ? '✅ Oui' : '❌ Non')

  const fetchMeteo = async (ville = 'Paris') => {
    try {
      setLoading(true)
      setErreur(null)
      
      // ✅ Clé cachée, pas visible!
      const response = await fetch(`${API_URL}?q=${ville}&appid=${API_KEY}`)
      
      if (!response.ok) throw new Error('Erreur API')
      
      const result = await response.json()
      setData(result)
      
    } catch (error) {
      setErreur(error.message)
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Météo</h2>
      <button onClick={() => fetchMeteo('Paris')}>Paris</button>
      <button onClick={() => fetchMeteo('Londres')}>Londres</button>
      <button onClick={() => fetchMeteo('Tokyo')}>Tokyo</button>
      
      {loading && <p>⏳ Chargement...</p>}
      {erreur && <p>❌ Erreur: {erreur}</p>}
      {data && (
        <div>
          <h3>{data.name}</h3>
          <p>Température: {data.main.temp}°C</p>
          <p>Description: {data.weather[0].description}</p>
        </div>
      )}
    </div>
  )
}

export default APICallGood
```

#### Step 3️⃣: Configuration Vite (si pas automatique)

```javascript
// Fichier: vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Les variables .env sont automatiquement chargées avec VITE_ prefix
})
```

---

### 🟡 PARTIE 3: EXEMPLE AVEC BEARER TOKEN

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function APIWithBearerToken() {
  const [utilisateurs, setUtilisateurs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)

  // ✅ Clé depuis .env
  const TOKEN = import.meta.env.VITE_GITHUB_TOKEN
  const API_URL = 'https://api.github.com'

  const fetchUtilisateurs = async (username) => {
    try {
      setLoading(true)
      setErreur(null)
      
      // ✅ Bearer Token dans la requête
      const response = await fetch(`${API_URL}/users/${username}/repos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,  // ← Clé sécurisée!
          'Accept': 'application/vnd.github+json'
        }
      })
      
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      
      const data = await response.json()
      setUtilisateurs(data)
      
    } catch (error) {
      setErreur(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Repos GitHub</h2>
      <input 
        type="text" 
        placeholder="Username"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            fetchUtilisateurs(e.target.value)
          }
        }}
      />
      
      {loading && <p>⏳ Chargement...</p>}
      {erreur && <p>❌ Erreur: {erreur}</p>}
      
      {utilisateurs && (
        <ul>
          {utilisateurs.map(repo => (
            <li key={repo.id}>
              <strong>{repo.name}</strong>
              <p>{repo.description}</p>
              <a href={repo.html_url} target="_blank">Voir</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default APIWithBearerToken
```

---

### 🟣 PARTIE 4: EXEMPLE COMPLET (POST avec clé)

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'

function CreerArticleAvecCle() {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // ✅ Clés depuis .env
  const API_KEY = import.meta.env.VITE_API_KEY
  const API_URL = import.meta.env.VITE_API_URL

  const creerArticle = async () => {
    if (!titre || !contenu) {
      setMessage('❌ Remplissez tous les champs')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      
      // ✅ POST avec clé d'authentification
      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,  // ← Clé sécurisée
          'X-API-Key': API_KEY  // Ou dans le header (selon l'API)
        },
        body: JSON.stringify({
          titre: titre,
          contenu: contenu,
          date: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      
      const result = await response.json()
      setMessage(`✅ Article créé! ID: ${result.id}`)
      setTitre('')
      setContenu('')
      
    } catch (error) {
      setMessage(`❌ Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Créer un article</h2>
      
      <input 
        type="text"
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      
      <textarea
        placeholder="Contenu"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows="5"
      />
      
      <button onClick={creerArticle} disabled={loading}>
        {loading ? '⏳ Envoi...' : '✅ Créer'}
      </button>
      
      {message && (
        <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export default CreerArticleAvecCle
```

---

## 🔐 Bonnes pratiques

### 1️⃣ Structure correcte du projet

```
mon-app/
  src/
    components/
    pages/
  .env              ← Ne commiter JAMAIS!
  .env.example      ← Commiter avec placeholders
  .gitignore        ← Mettre .env dedans
  vite.config.js
  package.json
```

### 2️⃣ Fichier `.gitignore` complet

```
# Variables d'environnement
.env
.env.local
.env.*.local
.env.production

# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
```

### 3️⃣ Fichier `.env.example` pour la doc

```
# Copier ce fichier en .env et remplir les vraies valeurs
# cp .env.example .env

# OpenWeather API
VITE_API_KEY=your_openweather_api_key_here
VITE_API_URL=https://api.openweathermap.org/data/2.5/weather

# GitHub API
VITE_GITHUB_TOKEN=ghp_your_github_token_here

# Stripe
VITE_STRIPE_KEY=pk_your_stripe_key_here
```

### 4️⃣ Vérifier que les clés sont chargées

```javascript
// À faire une seule fois au démarrage
console.log('🔍 Variables d\'environnement:')
console.log('API_KEY:', import.meta.env.VITE_API_KEY ? '✅ Chargée' : '❌ Manquante')
console.log('GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN ? '✅ Chargée' : '❌ Manquante')
```

---

## ⚠️ PIÈGES COURANTS

### Piège 1️⃣: Oublier le prefix `VITE_`

```javascript
// ❌ MAUVAIS (Vite n'expose que les VITE_*)
const key = import.meta.env.API_KEY  // undefined!

// ✅ BON
const key = import.meta.env.VITE_API_KEY
```

### Piège 2️⃣: Mettre .env dans Git

```bash
# ❌ DANGER: Ne jamais faire ça!
git add .env
git commit -m "Add API keys"  # ❌ ❌ ❌

# ✅ BON: ignorer .env
# (ajouter à .gitignore)
echo ".env" >> .gitignore
```

### Piège 3️⃣: Commiter .env au lieu de .env.example

```bash
# ❌ MAUVAIS
git add .env           # Danger!
git add .gitignore

# ✅ BON
git add .env.example   # Sans les vraies clés!
git add .gitignore
```

### Piège 4️⃣: Oublier de redémarrer Vite après modifier .env

```bash
# Après modification de .env:
npm run dev

# ❌ Si les changements ne s'appliquent pas:
# Ctrl+C pour arrêter, puis redémarrer:
npm run dev
```

### Piège 5️⃣: Partager .env par chat/email

```
❌ DANGER: Ne jamais envoyer .env par Slack, Email, etc.
❌ Quelqu'un peut avoir accès aux clés
✅ SI besoin: partager les clés hachées ou via un système sécurisé
```

---

## 🎯 Checklist de sécurité

- ✅ Clés dans `.env` (pas dans le code)
- ✅ `.env` dans `.gitignore`
- ✅ `.env.example` créé (avec placeholders)
- ✅ Prefix `VITE_` utilisé pour toutes les clés
- ✅ Jamais commiter les vraies clés
- ✅ Vite restarté après changement de `.env`
- ✅ Clés utilisées dans les headers `Authorization` ou `X-API-Key`
- ✅ Ne pas logger les clés en production

---

## 📊 Où trouver les clés

| Service | Où trouver | Format |
|---------|-----------|--------|
| OpenWeather | https://openweathermap.org/api | `VITE_API_KEY` |
| GitHub | https://github.com/settings/tokens | `VITE_GITHUB_TOKEN` |
| Stripe | https://dashboard.stripe.com/apikeys | `VITE_STRIPE_KEY` |
| Firebase | Firebase Console | `VITE_FIREBASE_KEY` |
| Anthropic | https://console.anthropic.com | `VITE_CLAUDE_API_KEY` |

---

**Créée:** 2026-05-01  
**Version:** 1.0
