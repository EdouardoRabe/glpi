# ✅ PATTERN - Form Success Popup

> Afficher popup succès après soumission formulaire

---

## 💡 Solution Complete

```jsx
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      // Succès!
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Fermer popup après 3 secondes
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!showSuccess ? (
        <form onSubmit={handleSubmit}>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Votre nom"
            required
          />
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleChange}
            placeholder="Votre email"
            required
          />
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange}
            placeholder="Message"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      ) : null}

      {/* Success Popup */}
      {showSuccess && (
        <div style={styles.successBox}>
          <h2>✅ Envoyé avec succès!</h2>
          <p>Merci, nous vous répondrons bientôt.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  successBox: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #c3e6cb'
  }
};
```

---

## 🔧 Variante - Avec Modal

```jsx
{showSuccess && (
  <div style={styles.overlay}>
    <div style={styles.modal}>
      <h2>✅ Succès!</h2>
      <p>Votre message a été envoyé.</p>
      <button onClick={() => setShowSuccess(false)}>Fermer</button>
    </div>
  </div>
)}
```

---

## ⚠️ Points Clés

- ✅ Form vide après envoi
- ✅ Loader pendant fetch
- ✅ Auto-hide success (setTimeout)
- ✅ Gestion erreurs try/catch

---

## 🔗 Navigation
← [Index Patterns](../README.md)
