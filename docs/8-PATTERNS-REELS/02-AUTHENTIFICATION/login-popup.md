# 🔐 PATTERN - Login Modal Popup

> Formulaire login dans une modal avec validation

---

## 💡 Solution Complete

```jsx
import { useState } from 'react';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('Email et password requis');
      }

      // API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login échoué');
      }

      // Succès
      setIsLoggedIn(true);
      setShowLogin(false);
      setFormData({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ email: '', password: '' });
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>✅ Connecté!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => setShowLogin(true)}>Login</button>
      )}

      {/* Modal Login */}
      {showLogin && (
        <div style={styles.overlay} onClick={() => !loading && setShowLogin(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Connexion</h2>
            
            {error && <p style={styles.error}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
              />
              
              <button type="submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            
            <button 
              onClick={() => setShowLogin(false)}
              disabled={loading}
              style={styles.cancelBtn}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
  },
  error: {
    color: '#dc3545',
    marginBottom: '1rem',
    borderLeft: '3px solid #dc3545',
    paddingLeft: '0.5rem'
  },
  cancelBtn: {
    marginTop: '1rem',
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }
};
```

---

## 🔧 Améliorations

- Ajouter "Mot de passe oublié?"
- Ajouter valeur persisted (localStorage)
- Protection routes après login
- Refresh token handling

---

## ⚠️ Points Clés

- ✅ Validation avant envoi
- ✅ Message erreur personnalisé
- ✅ Disable form pendant loading
- ✅ Gestion succès/erreur

---

## 🔗 Navigation
← [Index Patterns](../README.md)
