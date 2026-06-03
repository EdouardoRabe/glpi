# 📝 PATTERN - Modal Confirmation (Suppression)

> Afficher une popup avant de supprimer

---

## 🎯 Cas d'Usage
Vous avez une liste, vous cliquez "Supprimer", une popup confirme "Êtes-vous sûr?".

---

## 💡 Solution Simple

```jsx
import { useState } from 'react';

function ItemList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = (id) => {
    setSelectedId(id);  // Mémoriser quel item
    setShowModal(true);  // Afficher modal
  };

  const confirmDelete = () => {
    setItems(items.filter(i => i.id !== selectedId));
    setShowModal(false);
    setSelectedId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleDelete(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Confirmer suppression</h2>
            <p>Êtes-vous sûr?</p>
            <div style={styles.buttons}>
              <button onClick={confirmDelete} style={styles.dangerBtn}>
                Supprimer
              </button>
              <button onClick={cancelDelete} style={styles.cancelBtn}>
                Annuler
              </button>
            </div>
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
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '300px'
  },
  buttons: {
    display: 'flex', gap: '1rem', marginTop: '1rem'
  },
  dangerBtn: {
    backgroundColor: '#dc3545', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer'
  },
  cancelBtn: {
    backgroundColor: '#6c757d', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer'
  }
};

export default ItemList;
```

---

## ⚠️ Pièges Courants

| Erreur | Cause | Fix |
|--------|-------|-----|
| Modal ne s'affiche pas | showModal pas défini | Initialiser state |
| Clique sur Supprimer supprime tout | Pas de selectedId | Mémoriser l'ID avant modal |
| Fond noir clickable | Pas de preventDefault | Ajouter onClick sur overlay → cancelDelete |
| Layout cassé | Z-index trop bas | Mettre `zIndex: 1000` |

---

## 🔧 Variante - Avec API

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const confirmDelete = async () => {
  setLoading(true);
  try {
    await fetch(`/api/items/${selectedId}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== selectedId));
    setShowModal(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Dans le bouton:
<button onClick={confirmDelete} disabled={loading}>
  {loading ? 'Suppression...' : 'Supprimer'}
</button>
```

---

## 🎯 Améliorations

- Ajouter message succès après suppression
- Ajouter animation (fade in/out)
- Utiliser librairie modal (React Modal, Headless UI)
- Ajouter keyboard navigation (Escape pour fermer)

---

## 🔗 Navigation
← [Index Patterns](../README.md)  
→ [Session Gestion](./session-gestion.md)
