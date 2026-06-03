# 🌐 Appels API en React

> **Documentation complète** — Récupérer, afficher et gérer des données externes dans une application React avec Fetch et Axios.

---

## 📌 Sommaire

1. [Pourquoi React a besoin des APIs](#1-pourquoi-react-a-besoin-des-apis)
2. [Les outils disponibles](#2-les-outils-disponibles)
3. [Où et quand faire l'appel — useEffect](#3-où-et-quand-faire-lappel--useeffect)
4. [Les trois états incontournables](#4-les-trois-états-incontournables)
5. [Fetch API — syntaxe avec `.then()`](#5-fetch-api--syntaxe-avec-then)
6. [Fetch API — syntaxe avec `async/await`](#6-fetch-api--syntaxe-avec-asyncawait)
7. [Axios — installation et utilisation](#7-axios--installation-et-utilisation)
8. [Fetch vs Axios — comparaison détaillée](#8-fetch-vs-axios--comparaison-détaillée)
9. [Les méthodes HTTP — GET, POST, PUT, DELETE](#9-les-méthodes-http--get-post-put-delete)
10. [Gestion correcte des erreurs](#10-gestion-correcte-des-erreurs)
11. [Le nettoyage avec AbortController](#11-le-nettoyage-avec-abortcontroller)
12. [Le problème CORS](#12-le-problème-cors)
13. [Séparer la logique — le dossier `services/`](#13-séparer-la-logique--le-dossier-services)
14. [Les bibliothèques avancées — React Query et SWR](#14-les-bibliothèques-avancées--react-query-et-swr)
15. [Les erreurs fréquentes](#15-les-erreurs-fréquentes)
16. [Cheat Sheet — Aide-mémoire rapide](#16-cheat-sheet--aide-mémoire-rapide)

---

## 1. Pourquoi React a besoin des APIs

React est une **bibliothèque frontend**. Son rôle unique est de construire et gérer l'interface utilisateur (les vues). Il ne stocke pas de données, ne gère pas de base de données, et n'exécute pas de logique serveur.

Pour afficher des données dynamiques (utilisateurs, produits, articles...), React doit les **récupérer auprès d'une source externe** — c'est là qu'interviennent les appels API.

```
[ Serveur / API ]  ──(HTTP)──►  [ React ]  ──►  [ Affichage à l'écran ]
    (données)                   (interface)
```

Le flux est toujours le même :
1. Le composant se monte (s'affiche pour la première fois)
2. Un appel HTTP est envoyé vers une API
3. La réponse (souvent du JSON) est reçue
4. L'état du composant est mis à jour avec les données
5. React re-rend le composant avec les nouvelles données

---

## 2. Les outils disponibles

React ne dicte pas d'outil spécifique pour les appels API. Voici les options principales :

### Fetch API

Intégré nativement aux navigateurs modernes, **aucune installation requise**.

```jsx
fetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Axios

Bibliothèque tierce très populaire, basée sur les promesses. Elle simplifie et enrichit les appels par rapport à Fetch.

```bash
npm install axios
```

```jsx
import axios from 'axios';

axios.get('https://api.example.com/data')
  .then(response => console.log(response.data));
```

### XMLHttpRequest (ancien)

L'ancêtre d'AJAX, encore fonctionnel mais verbeux. À ne plus utiliser dans un projet React moderne — Fetch ou Axios font la même chose avec beaucoup moins de code.

### Tableau comparatif rapide

| Critère | Fetch | Axios |
| --- | --- | --- |
| Installation | Aucune (natif) | `npm install axios` |
| Parse JSON auto | ❌ (`.json()` manuel) | ✅ Automatique |
| Erreurs HTTP (4xx/5xx) | ❌ Ne throw pas | ✅ Throw automatiquement |
| Annulation | `AbortController` | `CancelToken` ou `AbortController` |
| Intercepteurs | ❌ | ✅ Natif |
| Support navigateur | Moderne uniquement | Tous navigateurs |

> ℹ️ Pour des projets simples : **Fetch** suffit. Pour des projets avec beaucoup d'appels, authentification, et gestion d'erreurs avancée : **Axios** est plus pratique.

---

## 3. Où et quand faire l'appel — `useEffect`

### Le problème

Si tu fais un appel API directement dans le corps du composant (hors `useEffect`), il s'exécutera **à chaque rendu**, créant des boucles infinies ou des appels répétés inutiles.

```jsx
// ❌ MAUVAIS — s'exécute à chaque rendu
function App() {
  fetch('https://api.example.com/data'); // Appelé en boucle !
  return <div>...</div>;
}
```

### La solution : `useEffect`

`useEffect` est le Hook qui permet d'exécuter du code **après le rendu**, et de contrôler quand ce code se répète.

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Ce code s'exécute APRÈS le rendu, pas pendant
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []); // ← Le tableau de dépendances

  return <div>...</div>;
}
```

### Le tableau de dépendances `[]` — crucial

Le deuxième argument de `useEffect` contrôle quand l'effet se relance :

| Tableau | Comportement |
| --- | --- |
| Absent (aucun 2e arg) | S'exécute après **chaque** rendu |
| `[]` tableau vide | S'exécute **une seule fois**, au montage du composant |
| `[valeur]` avec valeur | S'exécute au montage **et** à chaque fois que `valeur` change |
| `[id, filtre]` avec plusieurs | S'exécute si `id` **ou** `filtre` change |

```jsx
// S'exécute une seule fois au chargement
useEffect(() => {
  fetchAllUsers();
}, []);

// Se relance chaque fois que userId change (ex: navigation vers un autre profil)
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Se relance si la page ou le filtre change (ex: pagination)
useEffect(() => {
  fetchProducts(page, filter);
}, [page, filter]);
```

> ⚠️ Oublier le tableau de dépendances `[]` quand tu veux un seul appel est l'une des erreurs les plus fréquentes. Sans lui, l'appel se répète indéfiniment après chaque mise à jour d'état.

### Composants Classes (référence historique)

Dans les composants classes (ancienne syntaxe, moins utilisée aujourd'hui), l'appel se fait dans `componentDidMount` :

```jsx
class MyComponent extends React.Component {
  componentDidMount() {
    // Équivalent de useEffect(() => { ... }, [])
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }
}
```

> ℹ️ Aujourd'hui, **les composants fonctionnels avec Hooks sont la norme**. Les composants classes ne sont plus recommandés pour les nouveaux projets, mais tu peux les rencontrer dans du code existant.

---

## 4. Les trois états incontournables

Tout appel API a trois états possibles. Tu dois **toujours** les gérer dans ton composant pour une interface utilisateur correcte.

| État | Description | Ce qu'on affiche |
| --- | --- | --- |
| `isLoading` | La requête est en cours | Spinner, squelette, "Chargement..." |
| `error` | La requête a échoué | Message d'erreur, bouton "Réessayer" |
| `data` | La requête a réussi | Le contenu réel |

```jsx
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);       // Les données reçues
  const [isLoading, setIsLoading] = useState(true); // En cours ?
  const [error, setError] = useState(null);   // Une erreur ?

  useEffect(() => {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  // Gérer les états AVANT le rendu principal
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  // Rendu principal — données disponibles
  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

> ℹ️ Commencer `isLoading` à `true` est une bonne pratique : au premier rendu, les données ne sont pas encore là, donc on est forcément en train de charger.

---

## 5. Fetch API — syntaxe avec `.then()`

### Appel GET simple

```jsx
import { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(res => res.json())       // Étape 1 : convertir la réponse en JSON
      .then(data => {                // Étape 2 : utiliser les données
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {                // En cas d'erreur réseau
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Chargement des produits...</p>;
  if (error) return <p>Impossible de charger les produits.</p>;

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} — {product.price} €
        </li>
      ))}
    </ul>
  );
}
```

### La réponse JSON avec une structure imbriquée

Certaines APIs retournent les données dans un objet enveloppant. Il faut naviguer dans la structure :

```json
{
  "status": "success",
  "items": [
    { "id": 1, "name": "Pomme", "price": "2€" },
    { "id": 2, "name": "Pêche", "price": "5€" }
  ]
}
```

```jsx
fetch('https://api.example.com/items')
  .then(res => res.json())
  .then(data => {
    setItems(data.items); // ← Accéder à la propriété "items" de la réponse
  });
```

---

## 6. Fetch API — syntaxe avec `async/await`

La syntaxe `async/await` est **plus lisible** que les chaînes de `.then()`. Elle est préférée en milieu professionnel car elle ressemble à du code synchrone et est plus facile à déboguer.

### Règle importante avec `useEffect`

`useEffect` ne peut **pas** être une fonction `async` directement. Il faut créer une fonction `async` à l'intérieur et l'appeler.

```jsx
// ❌ Interdit — useEffect ne peut pas être async
useEffect(async () => {
  const res = await fetch('...');
}, []);

// ✅ Correct — fonction async déclarée à l'intérieur
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('...');
    const data = await res.json();
    setData(data);
  };

  fetchData(); // On appelle la fonction
}, []);
```

### Exemple complet avec async/await

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://api.example.com/users');

        // ⚠️ Fetch ne throw pas sur les erreurs HTTP — vérification manuelle obligatoire
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // S'exécute toujours, succès ou erreur
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}
```

> ℹ️ Le bloc `finally` s'exécute **toujours**, que la requête réussisse ou échoue. C'est l'endroit idéal pour appeler `setIsLoading(false)` et éviter la répétition.

---

## 7. Axios — installation et utilisation

### Installation

```bash
npm install axios
```

### Importer Axios dans ton composant

```jsx
import axios from 'axios';
```

### Appel GET avec Axios et `.then()`

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://api.example.com/data')
      .then(response => {
        // Avec Axios, les données sont dans response.data (JSON déjà parsé)
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return <div>{data?.nom}</div>;
}
```

### Appel GET avec Axios et `async/await`

```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.example.com/data');
      setData(response.data); // Axios parse le JSON automatiquement
    } catch (error) {
      // Axios throw automatiquement sur les erreurs HTTP (4xx, 5xx)
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

### Configurer une instance Axios (base URL, headers)

Pour éviter de répéter l'URL de base dans chaque appel, on crée une instance configurée :

```jsx
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000, // Timeout en millisecondes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

```jsx
// Dans un composant
import api from '../api/axiosInstance';

const response = await api.get('/users');    // GET https://api.example.com/users
const response = await api.post('/users', { name: 'Anarana' });
```

---

## 8. Fetch vs Axios — comparaison détaillée

### Différence clé sur les erreurs HTTP

C'est la différence la plus importante et la plus source de bugs :

```jsx
// ─── Avec FETCH ───────────────────────────────────────────
// Fetch ne rejette la promesse QUE pour les erreurs réseau
// (pas de connexion, serveur inaccessible).
// Une erreur 404 ou 500 est considérée comme un "succès" par Fetch !

fetch('https://api.example.com/users/999')
  .then(res => {
    console.log(res.ok);     // false (si 404)
    console.log(res.status); // 404
    // ⚠️ On arrive ici même si le serveur répond 404 !
    return res.json();
  });

// ✅ Il faut vérifier res.ok manuellement
fetch('https://api.example.com/users/999')
  .then(res => {
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json();
  });

// ─── Avec AXIOS ──────────────────────────────────────────
// Axios throw automatiquement pour tout code >= 400
axios.get('https://api.example.com/users/999')
  .catch(error => {
    console.log(error.response.status); // 404
    // Le .catch() est appelé automatiquement — plus simple !
  });
```

### Différence sur le JSON

```jsx
// ─── Avec FETCH ─────────────────────
const response = await fetch('https://api.example.com/data');
const data = await response.json(); // ← Étape manuelle obligatoire

// ─── Avec AXIOS ─────────────────────
const response = await axios.get('https://api.example.com/data');
const data = response.data; // ← Déjà parsé automatiquement
```

---

## 9. Les méthodes HTTP — GET, POST, PUT, DELETE

### GET — Récupérer des données

```jsx
// Fetch
const response = await fetch('https://api.example.com/users');
const users = await response.json();

// Axios
const response = await axios.get('https://api.example.com/users');
const users = response.data;
```

### POST — Créer une ressource

```jsx
// Fetch — il faut configurer method, headers et body manuellement
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // ← Indique qu'on envoie du JSON
  },
  body: JSON.stringify({                 // ← Convertir l'objet en chaîne JSON
    name: 'Anarana',
    email: 'ny@example.com',
  }),
});
const newUser = await response.json();

// Axios — syntaxe plus courte
const response = await axios.post('https://api.example.com/users', {
  name: 'Anarana',
  email: 'ny@example.com',
  // Axios sérialise l'objet et ajoute Content-Type automatiquement
});
const newUser = response.data;
```

### PUT — Remplacer une ressource entière

```jsx
// Fetch
await fetch(`https://api.example.com/users/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Nouveau Nom', email: 'nouveau@example.com' }),
});

// Axios
await axios.put(`https://api.example.com/users/${id}`, {
  name: 'Nouveau Nom',
  email: 'nouveau@example.com',
});
```

### PATCH — Modifier partiellement une ressource

```jsx
// Fetch
await fetch(`https://api.example.com/users/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Nouveau Nom' }), // Seulement le champ modifié
});

// Axios
await axios.patch(`https://api.example.com/users/${id}`, { name: 'Nouveau Nom' });
```

### DELETE — Supprimer une ressource

```jsx
// Fetch
await fetch(`https://api.example.com/users/${id}`, {
  method: 'DELETE',
});

// Axios
await axios.delete(`https://api.example.com/users/${id}`);
```

### Envoyer des headers d'authentification (token Bearer)

La plupart des APIs protégées exigent un token dans les headers :

```jsx
const token = localStorage.getItem('authToken');

// Fetch
const response = await fetch('https://api.example.com/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Axios
const response = await axios.get('https://api.example.com/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

## 10. Gestion correcte des erreurs

### Les deux types d'erreurs à distinguer

| Type | Quand | Exemple |
| --- | --- | --- |
| **Erreur réseau** | Pas de connexion, serveur inaccessible | `TypeError: Failed to fetch` |
| **Erreur HTTP** | Serveur répond mais avec un code d'erreur | `404 Not Found`, `500 Internal Server Error` |

`fetch` ne throw que sur les erreurs réseau. Pour les erreurs HTTP, il faut vérifier `response.ok`.

### Pattern complet de gestion d'erreurs avec Fetch

```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');

      // Vérifier l'erreur HTTP
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);

    } catch (err) {
      // Gère à la fois les erreurs réseau ET les erreurs HTTP
      if (err.name === 'TypeError') {
        setError('Impossible de se connecter au serveur. Vérifie ta connexion.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

### Afficher l'erreur avec un bouton "Réessayer"

```jsx
function DataComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null); // Réinitialiser l'erreur avant chaque tentative
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <p>Chargement...</p>;

  if (error) return (
    <div>
      <p>Erreur : {error}</p>
      <button onClick={fetchData}>Réessayer</button>
    </div>
  );

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## 11. Le nettoyage avec `AbortController`

### Le problème

Si un utilisateur **quitte la page** avant que l'appel API ne se termine, le composant est **démonté**. Mais la requête HTTP continue en arrière-plan. Quand elle finit, elle tente de mettre à jour l'état d'un composant qui n'existe plus — ce qui génère un avertissement et peut causer des **fuites de mémoire**.

```
Warning: Can't perform a React state update on an unmounted component.
```

### La solution : `AbortController`

`AbortController` permet d'**annuler une requête Fetch** en cours. On le branche au mécanisme de nettoyage de `useEffect` (la fonction `return`).

```jsx
useEffect(() => {
  const controller = new AbortController(); // Créer un contrôleur

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data', {
        signal: controller.signal, // Lier le signal à la requête
      });

      if (!response.ok) throw new Error(`Erreur ${response.status}`);

      const data = await response.json();
      setData(data);
    } catch (err) {
      // AbortError est normal (composant démonté) — ne pas le traiter comme une erreur
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();

  // Fonction de nettoyage — appelée quand le composant est démonté
  return () => {
    controller.abort(); // Annuler la requête en cours
  };
}, []);
```

### Avec Axios

Axios supporte aussi `AbortController` depuis la version 0.22 :

```jsx
useEffect(() => {
  const controller = new AbortController();

  axios.get('https://api.example.com/data', {
    signal: controller.signal,
  })
  .then(res => setData(res.data))
  .catch(err => {
    if (axios.isCancel(err)) return; // Ignorer les annulations
    setError(err.message);
  });

  return () => controller.abort();
}, []);
```

---

## 12. Le problème CORS

### Qu'est-ce que CORS ?

CORS (Cross-Origin Resource Sharing) est une politique de sécurité des navigateurs. Elle **bloque les requêtes HTTP** d'une origine vers une autre si le serveur ne l'autorise pas explicitement.

Deux origines sont différentes si l'une de ces trois choses diffère :
- Le protocole (`http` vs `https`)
- Le domaine (`localhost` vs `monapi.com`)
- Le port (`3000` vs `8080`)

```
React (localhost:3000) ──► API (localhost:8080)
                               ↑
                         Origines différentes → CORS bloqué !
```

### Qui configure CORS ?

**C'est le serveur (l'API) qui doit autoriser les requêtes cross-origin** — pas React. Si tu obtiens l'erreur suivante, c'est ton backend qui doit agir :

```
Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

### Ce que le backend doit faire

Le serveur doit ajouter un header dans ses réponses :

```
Access-Control-Allow-Origin: http://localhost:3000
# ou pour tout autoriser (déconseillé en production) :
Access-Control-Allow-Origin: *
```

### Contourner CORS en développement avec un proxy

Si tu ne contrôles pas le backend, tu peux configurer un **proxy** dans ton projet React pour éviter les problèmes CORS en développement.

Avec Create React App, ajoute dans `package.json` :

```json
{
  "proxy": "https://api.example.com"
}
```

Avec Vite, dans `vite.config.js` :

```js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
```

> ⚠️ Le proxy ne fonctionne qu'en **développement local**. En production, il faut que le serveur configure correctement ses headers CORS.

---

## 13. Séparer la logique — le dossier `services/`

### Pourquoi séparer ?

Mettre toute la logique d'appel API directement dans les composants crée du code difficile à maintenir, tester et réutiliser. Si l'URL de l'API change, tu dois modifier chaque composant.

**Bonne pratique** : centraliser tous les appels dans un dossier `services/` (ou `api/`). Les composants ne savent pas *comment* l'API est configurée — ils appellent juste une fonction.

### Structure recommandée

```
src/
├── components/
│   ├── UserList.jsx
│   └── ProductCard.jsx
├── services/          ← Toute la logique API ici
│   ├── userService.js
│   ├── productService.js
│   └── api.js         ← Instance Axios partagée
└── App.jsx
```

### Exemple concret

```js
// src/services/api.js — Instance Axios partagée
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
```

```js
// src/services/userService.js — Fonctions d'appel pour les utilisateurs
import api from './api';

export async function getUsers() {
  const response = await api.get('/users');
  return response.data;
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
```

```jsx
// src/components/UserList.jsx — Composant propre, sans logique API
import { useState, useEffect } from 'react';
import { getUsers } from '../services/userService';

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()                    // Simple appel de fonction
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

export default UserList;
```

### Avantages de cette approche

- **Un seul endroit** à modifier si l'URL de l'API change
- **Réutilisable** : plusieurs composants appellent `getUsers()` sans dupliquer le code
- **Testable** : on peut mocker `userService` dans les tests sans toucher aux composants
- **Lisible** : le composant ne contient que de la logique d'affichage

### Exemple complet — Fetch natif avec signal

Si tu n'utilises pas Axios, voici comment structurer un service avec Fetch en passant le signal `AbortController` depuis le composant.

**Étape 1 — Créer le service (`src/services/api.js`)**

```js
// src/services/api.js
const BASE_URL = 'https://api.example.com';

// La fonction reçoit `signal` en paramètre pour pouvoir être annulée depuis le composant
export const fetchItems = async (signal) => {
  const response = await fetch(`${BASE_URL}/items`, { signal });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  return await response.json();
};

export const fetchItemById = async (id, signal) => {
  const response = await fetch(`${BASE_URL}/items/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  return await response.json();
};

export const createItem = async (itemData) => {
  const response = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  return await response.json();
};
```

**Étape 2 — Utiliser le service dans le composant (`src/components/ItemList.jsx`)**

Le composant devient très lisible : il crée l'`AbortController`, passe son signal au service, et gère uniquement l'affichage.

```jsx
// src/components/ItemList.jsx
import { useState, useEffect } from 'react';
import { fetchItems } from '../services/api';

function ItemList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    // On passe controller.signal au service — le service n'a pas besoin de créer le sien
    fetchItems(controller.signal)
      .then(data => setItems(data))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setIsLoading(false));

    // Nettoyage : annuler la requête si le composant est démonté avant la fin
    return () => controller.abort();
  }, []);

  if (isLoading) return <p>Chargement des articles...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name} — {item.price} €
        </li>
      ))}
    </ul>
  );
}

export default ItemList;
```

**Ce que cette architecture accomplit :**

```
[ services/api.js ]              [ ItemList.jsx ]
       ↑                               ↑
  Sait COMMENT appeler l'API     Sait QUOI afficher
  (URL, headers, res.ok...)      (JSX, états loading/error)

  Les deux s'ignorent mutuellement — couplage minimal
```

> ℹ️ Passer `signal` en paramètre est la convention standard. Elle permet au composant de rester maître de l'annulation, sans que le service ait besoin de créer son propre `AbortController`.

### Exemple avec un appel déclenché par une action utilisateur

Parfois l'appel API ne se fait pas au chargement mais suite à un clic, une soumission de formulaire, etc. Dans ce cas, on n'utilise **pas** `useEffect` — la logique va directement dans le gestionnaire d'événement.

```jsx
// src/components/CreateItemForm.jsx
import { useState } from 'react';
import { createItem } from '../services/api';

function CreateItemForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await createItem({ name, price: Number(price) });
      setSuccess(true);
      setName('');   // Réinitialiser le formulaire après succès
      setPrice('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nom de l'article"
        required
      />
      <input
        type="number"
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Prix"
        required
      />
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Enregistrement...' : 'Créer'}
      </button>

      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
      {success && <p style={{ color: 'green' }}>Article créé avec succès !</p>}
    </form>
  );
}

export default CreateItemForm;
```

> ℹ️ La règle est simple : **`useEffect`** pour les effets déclenchés par le rendu (chargement initial, réaction à un changement de props). **Gestionnaire d'événement** pour les actions déclenchées par l'utilisateur (clic, soumission...).

---

## 14. Les bibliothèques avancées — React Query et SWR

### Pourquoi aller plus loin que `useEffect` ?

Gérer les appels API avec `useEffect` + `useState` a des limites :

- **Pas de cache** : si tu navigues entre deux pages, les données sont re-fetched à chaque fois
- **Pas de synchronisation automatique** : les données peuvent devenir périmées
- **Doublons** : si deux composants font le même appel, deux requêtes sont envoyées
- **Gestion d'état répétitive** : les trois états (data, loading, error) dans chaque composant

Les bibliothèques de data fetching résolvent tous ces problèmes automatiquement.

### TanStack Query (anciennement React Query)

C'est la solution la plus populaire aujourd'hui. Elle gère le cache, le rechargement automatique, la déduplication et la synchronisation.

```bash
npm install @tanstack/react-query
```

```jsx
// src/main.jsx — Configurer le QueryClient
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root')
);
```

```jsx
// Dans un composant — plus besoin de useState + useEffect !
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/userService';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],    // Clé de cache unique
    queryFn: getUsers,      // La fonction qui fetch
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

React Query s'occupe **automatiquement** de :
- Mettre les données en cache
- Re-fetcher quand la fenêtre regagne le focus
- Ne pas envoyer deux fois la même requête
- Gérer les états loading, error, success

### SWR (de Vercel)

Alternative plus légère à React Query, avec une philosophie similaire.

```bash
npm install swr
```

```jsx
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

function UserList() {
  const { data, error, isLoading } = useSWR('https://api.example.com/users', fetcher);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur.</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Quand choisir quoi ?

| Situation | Recommandation |
| --- | --- |
| Apprentissage, projet simple | `useEffect` + `fetch` ou `axios` |
| Projet moyen, quelques appels | `axios` + dossier `services/` |
| Projet complexe, nombreux appels | **TanStack Query** |
| Projet Next.js / Vercel | **SWR** |

---

## 15. Les erreurs fréquentes

### ❌ Boucle infinie — tableau de dépendances manquant

```jsx
// ❌ Problème : sans [], useEffect tourne à chaque rendu
// setData déclenche un rendu → useEffect se relance → boucle infinie
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => setData(data));
}); // ← Pas de []

// ✅ Solution
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []); // ← [] = une seule exécution
```

### ❌ Fetch ne détecte pas les erreurs HTTP

```jsx
// ❌ Problème : le .catch() n'est jamais appelé si le serveur répond 404
fetch('https://api.example.com/users/999')
  .then(res => res.json()) // S'exécute même en cas de 404 !
  .catch(err => console.error(err)); // Jamais appelé pour les erreurs HTTP

// ✅ Solution : toujours vérifier response.ok
fetch('https://api.example.com/users/999')
  .then(res => {
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json();
  })
  .catch(err => console.error(err));
```

### ❌ Mettre à jour l'état d'un composant démonté

```
Warning: Can't perform a React state update on an unmounted component.
```

```jsx
// ❌ Problème : si l'utilisateur quitte la page avant la fin de la requête
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => setData(data)); // Composant peut être démonté ici !
}, []);

// ✅ Solution : AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch('https://api.example.com/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => { if (err.name !== 'AbortError') setError(err.message); });
  return () => controller.abort();
}, []);
```

### ❌ `async` directement sur `useEffect`

```jsx
// ❌ Interdit — useEffect ne peut pas retourner une promesse
useEffect(async () => {
  const data = await fetch('...');
}, []);

// ✅ Solution : fonction async interne
useEffect(() => {
  const load = async () => {
    const data = await fetch('...');
  };
  load();
}, []);
```

### ❌ Oublier `JSON.stringify` dans le body d'un POST avec Fetch

```jsx
// ❌ Problème : le body est un objet — le serveur reçoit "[object Object]"
fetch('https://api.example.com/users', {
  method: 'POST',
  body: { name: 'Anarana' }, // ← Objet brut, non sérialisé
});

// ✅ Solution : JSON.stringify + Content-Type
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Anarana' }), // ← Convertir en JSON
});
```

### ❌ Afficher un objet directement dans JSX

```jsx
// ❌ Erreur : "Objects are not valid as a React child"
const [user, setUser] = useState(null);
return <p>{user}</p>; // user est un objet

// ✅ Solution : afficher les propriétés, ou vérifier avant l'affichage
return <p>{user?.name}</p>;
// ou
if (!user) return null;
return <p>{user.name}</p>;
```

---

## 16. Cheat Sheet — Aide-mémoire rapide

### Structure type d'un composant avec appel API

```jsx
import { useState, useEffect } from 'react';

function MonComposant() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch('https://api.example.com/endpoint', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```

### Comparaison des syntaxes

| Action | Fetch | Axios |
| --- | --- | --- |
| GET | `fetch(url)` | `axios.get(url)` |
| POST | `fetch(url, { method: 'POST', headers: {...}, body: JSON.stringify(data) })` | `axios.post(url, data)` |
| PUT | `fetch(url, { method: 'PUT', ... })` | `axios.put(url, data)` |
| DELETE | `fetch(url, { method: 'DELETE' })` | `axios.delete(url)` |
| Lire la réponse | `await res.json()` | `response.data` (déjà parsé) |
| Erreur HTTP | ❌ Vérifier `res.ok` manuellement | ✅ Throw automatiquement |
| Annulation | `AbortController` + `signal` | `AbortController` + `signal` |

### Pièges à retenir

| Piège | Règle |
| --- | --- |
| Boucle infinie | Toujours mettre `[]` dans `useEffect` si une seule exécution |
| Fetch et 404 | Vérifier `if (!response.ok)` — Fetch ne throw pas sur HTTP errors |
| `useEffect` async | Jamais `async` directement — créer une fonction interne |
| Body en POST | Toujours `JSON.stringify()` + header `Content-Type: application/json` |
| Composant démonté | Utiliser `AbortController` et ignorer `AbortError` |
| Objet dans JSX | Afficher `objet.propriete`, pas l'objet directement |
