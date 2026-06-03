# 🔔 PATTERN - Toast Notification (Popup Temporaire)

> Message qui s'affiche 3 secondes puis disparait (success/error/info)

---

## 💡 Solution Simple

```jsx
import { useState, useEffect } from 'react';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    
    // Auto-hide après 3 secondes
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <button onClick={() => showToast('✅ Succès!', 'success')}>Success</button>
      <button onClick={() => showToast('❌ Erreur!', 'error')}>Error</button>
      <button onClick={() => showToast('ℹ️ Information', 'info')}>Info</button>

      {toast && (
        <div style={{
          ...styles.toast,
          ...styles[toast.type]
        }}>
          {toast.message}
          <button onClick={() => setToast(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '1rem',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '250px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease-in-out'
  },
  success: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  error: {
    backgroundColor: '#dc3545',
    color: 'white'
  },
  info: {
    backgroundColor: '#17a2b8',
    color: 'white'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1rem',
    cursor: 'pointer',
    marginLeft: '1rem'
  }
};
```

---

## 🔧 Variante - Custom Hook

```jsx
const useToast = () => {
  const [toast, setToast] = useState(null);

  const show = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  return { toast, showToast: show };
};

// Utilisation:
function Component() {
  const { toast, showToast } = useToast();
  
  const handleSubmit = async () => {
    try {
      await fetch('/api');
      showToast('Succès!', 'success');
    } catch (err) {
      showToast('Erreur!', 'error');
    }
  };
}
```

---

## ⚠️ Points Clés

- ✅ Auto-hide avec setTimeout
- ✅ Bouton fermer manuel
- ✅ Position fixe (coin bas-droit)
- ✅ z-index élevé (2000)
- ✅ Types: success/error/info

---

## 🔗 Navigation
← [Index Patterns](../README.md)
