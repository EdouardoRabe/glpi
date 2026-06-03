# ⏳ GUIDE - useEffect + Async/Await + Fetch

> Comment charger des données avec useEffect et gérer loading/erreur

---

## 🎯 Le Pattern Standard

```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Créer fonction async DANS useEffect (pas faire async useEffect)
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('API Error');
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();  // 2. Appeler la fonction
  }, []);  // 3. Dépendances vides = une seule fois au mount

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  return <p>Données: {JSON.stringify(data)}</p>;
}
```

### ⚠️ NE PAS FAIRE
```jsx
❌ useEffect(async () => {  // MAUVAIS!
  const data = await fetch('/api');
}, []);
```

**Pourquoi?** React attend une fonction de cleanup, pas une Promise.

---

## 🎯 Avec Paramètre d'URL

```jsx
import { useState, useEffect } from 'react';

function UserDetail({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const json = await response.json();
      setUser(json);
      setLoading(false);
    };
    
    fetchUser();
  }, [userId]);  // ✅ Re-fetch si userId change

  if (loading) return <p>...</p>;
  return <p>{user.name}</p>;
}
```

### 🔑 Point Clé
Quand `userId` change, useEffect relance la requête automatiquement.

---

## 🎯 Avec Cleanup (Éviter Race Conditions)

```jsx
useEffect(() => {
  let isMounted = true;  // Flag pour cleanup

  const fetchData = async () => {
    const response = await fetch(`/api/search?q=${query}`);
    const json = await response.json();
    
    if (isMounted) {  // ✅ Vérifier avant setState
      setData(json);
    }
  };

  fetchData();

  return () => {
    isMounted = false;  // Cleanup: marquer comme unmounted
  };
}, [query]);
```

### 🤔 Pourquoi?
Si l'utilisateur change le query **rapidement**, plusieurs requests en vol. La plus lente arrive en dernier et écrase les données. Avec `isMounted`, on ignore les réponses tardives.

---

## ❌ PROBLÈME: Infinite Loop

### ❌ BAD
```jsx
useEffect(() => {
  setData(data + 1);  // Cause re-render
});  // ⚠️ Pas de dépendances
// Loupe infini!
```

### ✅ GOOD
```jsx
useEffect(() => {
  // Charger données UNE FOIS
  console.log('Component mounted');
}, []);  // ✅ Dépendances vides
```

---

## ❌ PROBLÈME: setState dans Async (Stale Closure)

### ❌ BAD
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setTimeout(() => {
    console.log(count);  // ⚠️ Affiche TOUJOURS 0!
    setCount(count + 1);  // Count était 0 quand l'effect a lagé
  }, 1000);
}, []);
```

### ✅ GOOD - Ajouter dépendances
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setCount(prev => prev + 1);  // ✅ Fonction update
  }, 1000);
}, []);
```

Ou:
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    console.log(count);  // Affiche la bonne valeur
  }, 1000);
}, [count]);  // ✅ Re-run si count change
```

---

## 🎯 Exemple Complet: Fetch + Form

```jsx
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let isMounted = true;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${query}`);
        const json = await res.json();
        if (isMounted) setResults(json);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Debounce: attendre 500ms du dernier keystroke
    const timer = setTimeout(fetchResults, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </>
  );
}
```

### 🔑 Points clés
- `if (!query.trim()) return` – Pas chercher si vide
- Debounce avec `setTimeout` – Attendre avant chercher
- `isMounted` – Éviter memory leak
- `clearTimeout` – Cleanup

---

## 🎯 Avec try/catch/finally

```jsx
useEffect(() => {
  const init = async () => {
    try {
      // 1. Appel API
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      // 2. Parser JSON
      const json = await res.json();
      
      // 3. Valider données
      if (!json || json.length === 0) throw new Error('No data');
      
      // 4. Mettre à jour état
      setData(json);
      setError(null);
    } catch (err) {
      // Gérer TOUS les types d'erreurs
      setError(err.message);
      setData([]);
    } finally {
      // Toujours finir: arrêter loading
      setLoading(false);
    }
  };

  init();
}, []);
```

---

## 🎯 Cas Spécial: Refetch avec Bouton

```jsx
function DataWithRefresh() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();  // Fetch initial
  }, []);

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Rafraîchissement...' : 'Actualiser'}
      </button>
    </>
  );
}
```

---

## ⚠️ Pièges Courants

| Erreur | Cause | Correction |
|--------|-------|-----------|
| Infinite loop | Pas de [], fetch dans [] | Ajouter `[]` dépendances |
| Data null après fetch | Pas de setData | Appeler setData(json) |
| Component unmounted warning | isMounted pas vérifié | Ajouter flag cleanup |
| setState ne met à jour pas | Async stale closure | Utiliser `prev =>` callback |
| Fetch déclenché 2x | Strict Mode dev | Normal, vérifié une fois en prod |

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)  
→ [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)
