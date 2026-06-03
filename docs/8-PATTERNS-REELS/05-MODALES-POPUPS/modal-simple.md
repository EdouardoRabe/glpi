# 🎬 PATTERN - Modal Simple / Popup Personnalisée

> Afficher une popup avec contenu personnalisée

---

## 💡 Solution Basique

```jsx
import { useState } from 'react';

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Ouvrir Modal</button>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
              <h2>Titre Modal</h2>
              <button onClick={() => setShowModal(false)} style={styles.close}>✕</button>
            </div>
            
            <div style={styles.body}>
              <p>Contenu de la modal</p>
            </div>
            
            <div style={styles.footer}>
              <button onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    width: '90%', maxWidth: '500px', overflow: 'hidden'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', borderBottom: '1px solid #eee'
  },
  close: {
    background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'
  },
  body: {
    padding: '1.5rem'
  },
  footer: {
    padding: '1rem', borderTop: '1px solid #eee', textAlign: 'right'
  }
};
```

---

## 🔧 Variante - Avec données

```jsx
const [showModal, setShowModal] = useState(false);
const [data, setData] = useState(null);

const openModal = (info) => {
  setData(info);
  setShowModal(true);
};

{items.map(item => (
  <button key={item.id} onClick={() => openModal(item)}>
    Voir détails
  </button>
))}

{showModal && (
  <div style={styles.modal}>
    <h2>Détails: {data?.name}</h2>
    <p>{data?.description}</p>
  </div>
)}
```

---

## 🔧 Amélioration - Avec Escape key

```jsx
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
    }
  };
  
  if (showModal) {
    window.addEventListener('keydown', handleEscape);
  }
  
  return () => window.removeEventListener('keydown', handleEscape);
}, [showModal]);
```

---

## 🎯 Checklist

- ✅ `onClick={e => e.stopPropagation()}` sur modal (évite fermer au click overlay)
- ✅ Bouton ✕ pour fermer
- ✅ Click overlay pour fermer
- ✅ Escape key pour fermer
- ✅ `fixed` position pour overlay (couvre tout)

---

## 🔗 Navigation
← [Index Patterns](../README.md)
