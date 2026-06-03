# ⏳ PATTERN - Button with Loading State

> Bouton qui affiche "Chargement..." quand API en cours

---

## 💡 Solution

```jsx
import { useState } from 'react';

export default function SubmitButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submit', { method: 'POST' });
      if (!response.ok) throw new Error('Erreur API');
      
      setSuccess(true);
      setLoading(false);
      
      // Reset après 2 secondes
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Chargement...' : success ? '✅ Envoyé!' : 'Envoyer'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 🔧 Variante - Avec icône spinner

```jsx
{loading ? (
  <>
    <span>⏳ Chargement</span>
    {/* Ou spinner SVG/CSS */}
  </>
) : (
  'Envoyer'
)}
```

---

## ⚠️ Points Clés

- ✅ `disabled={loading}` – empêcher double-click
- ✅ Montrer texte "Chargement..." visuellement
- ✅ Gérer erreurs
- ✅ Message succès temporaire

---

## 🔗 Navigation
← [Index Patterns](../README.md)
