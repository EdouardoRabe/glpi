# 🔍 PATTERN - Search avec Debounce

> Recherche en temps réel sans lag (attendre avant de chercher)

---

## 🎯 Problème
Si vous faites une requête API à chaque keystroke, c'est lent et lourd. Solution: attendre que l'utilisateur arrête de taper.

---

## 💡 Solution avec Debounce

```jsx
import { useState, useEffect, useRef } from 'react';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);  // Mémoriser le timer

  // Fetch quand query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Annuler ancien timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Lancer nouveau timer (500ms de délai)
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);  // ⚠️ Clé: Attendre 500ms

    // Cleanup: nettoyer timer quand composant démonte
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher utilisateurs..."
      />

      {loading && <p>⏳ Chargement...</p>}
      {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}

      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      {!loading && results.length === 0 && query && (
        <p>Aucun résultat</p>
      )}
    </div>
  );
}
```

---

## 🔧 Variante - Custom Hook

```jsx
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// Utilisation:
function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch API
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

---

## ⏱️ Timing Clé

- **100-200ms**: Pour les validations locales
- **300-500ms**: Recherche/autocomplete (sweet spot)
- **1000ms+**: Pour les recherches lourdes

---

## ⚠️ Points Clés

- ✅ `clearTimeout` avant nouveau timer
- ✅ Cleanup dans useEffect (return fonction)
- ✅ `useRef` pour mémoriser timer
- ✅ Vérifier `query.trim()` (pas vide)

---

## 🎯 Checklist

| Point | Done? |
|-------|-------|
| Timer lancé à keystroke | ✅ |
| Ancien timer annulé | ✅ |
| Cleanup function | ✅ |
| Loading state | ✅ |
| Error handling | ✅ |
| Empty results message | ✅ |

---

## 🔗 Navigation
← [Index Patterns](../README.md)
