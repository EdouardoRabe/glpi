# Guide: Inputs avec Bouton "+" pour Ajouter des Lignes

Ce guide explique comment créer un formulaire dynamique où tu peux ajouter plusieurs lignes d'inputs avec un bouton "+".

## Table des matières

1. [Concept](#concept)
2. [Exemple Simple (Un Input)](#exemple-simple)
3. [Exemple Multiple (Plusieurs Inputs)](#exemple-multiple)
4. [Gestion du State](#gestion-du-state)
5. [Suppression de Lignes](#suppression-de-lignes)
6. [CSS Styling](#css-styling)
7. [Cas d'Usage Réels](#cas-dusage-réels)

---

## Concept

**Pattern général:**
```
État: Array d'objets
  ↓
Map sur le array → Affiche inputs pour chaque item
  ↓
Bouton "+" ajoute un nouvel objet au array
  ↓
Bouton "Remove" supprime un item du array
```

---

## Exemple Simple

### Un seul input par ligne (tags, emails, etc.)

```javascript
import { useState } from 'react';

export default function TagsInput() {
    const [tags, setTags] = useState(['']);

    const addTag = () => {
        setTags([...tags, '']);
    };

    const updateTag = (index, value) => {
        const updated = [...tags];
        updated[index] = value;
        setTags(updated);
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label>Tags</label>
            {tags.map((tag, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Enter tag"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                    />
                    <button onClick={() => removeTag(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addTag}>+ Add Tag</button>
        </div>
    );
}
```

---

## Exemple Multiple

### Plusieurs inputs par ligne (costs: duration, cost_time, cost_fixed)

```javascript
import { useState } from 'react';

export default function CostsInput() {
    const [costs, setCosts] = useState([
        { duration: 0, cost_time: 0, cost_fixed: 0 }
    ]);

    const addCost = () => {
        setCosts([...costs, { duration: 0, cost_time: 0, cost_fixed: 0 }]);
    };

    const updateCost = (index, field, value) => {
        const updated = [...costs];
        updated[index][field] = Number(value);
        setCosts(updated);
    };

    const removeCost = (index) => {
        setCosts(costs.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label>Costs</label>
            {costs.map((cost, index) => (
                <div key={index} className="cost-row">
                    <input
                        type="number"
                        placeholder="Duration (s)"
                        value={cost.duration}
                        onChange={(e) => updateCost(index, 'duration', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Time Cost"
                        value={cost.cost_time}
                        onChange={(e) => updateCost(index, 'cost_time', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Fixed Cost"
                        value={cost.cost_fixed}
                        onChange={(e) => updateCost(index, 'cost_fixed', e.target.value)}
                    />
                    <button onClick={() => removeCost(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addCost}>+ Add Cost</button>
        </div>
    );
}
```

---

## Gestion du State

### Pattern 1: Array de strings (simple)

```javascript
const [items, setItems] = useState(['']);

// Ajouter
setItems([...items, '']);

// Modifier
const updated = [...items];
updated[index] = newValue;
setItems(updated);

// Supprimer
setItems(items.filter((_, i) => i !== index));
```

### Pattern 2: Array d'objets (complexe)

```javascript
const [items, setItems] = useState([
    { id: 1, name: '', email: '' }
]);

// Ajouter
setItems([...items, { id: Date.now(), name: '', email: '' }]);

// Modifier un champ
const updated = [...items];
updated[index].name = newValue;
setItems(updated);

// Supprimer
setItems(items.filter((_, i) => i !== index));
```

---

## Suppression de Lignes

### Avec confirmation (optionnel)

```javascript
const removeItem = (index) => {
    if (window.confirm('Supprimer cette ligne?')) {
        setItems(items.filter((_, i) => i !== index));
    }
};
```

### Avec icône "X" au lieu de bouton

```javascript
<button 
    onClick={() => removeItem(index)}
    style={{ 
        background: 'none', 
        border: 'none', 
        color: 'red',
        fontSize: '1.2rem',
        cursor: 'pointer'
    }}
>
    ×
</button>
```

---

## CSS Styling

### Flex layout côte à côte

```css
.item-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    align-items: flex-end;
}

.item-row input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #999;
    border-radius: 4px;
}

.item-row button {
    padding: 0.75rem 1rem;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.item-row button:hover {
    background-color: #c82333;
}
```

### Responsive (mobile)

```css
@media (max-width: 768px) {
    .item-row {
        flex-direction: column;
        align-items: stretch;
    }

    .item-row button {
        width: 100%;
    }
}
```

---

## Cas d'Utilisation Réels

### 1. Liste d'emails (formulaire de contact)

```javascript
export default function EmailListForm() {
    const [emails, setEmails] = useState(['']);

    const addEmail = () => setEmails([...emails, '']);

    const updateEmail = (index, value) => {
        const updated = [...emails];
        updated[index] = value;
        setEmails(updated);
    };

    const removeEmail = (index) => {
        setEmails(emails.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h3>Recipients</h3>
            {emails.map((email, index) => (
                <div key={index} className="email-row">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                    />
                    {emails.length > 1 && (
                        <button onClick={() => removeEmail(index)}>Remove</button>
                    )}
                </div>
            ))}
            <button onClick={addEmail}>+ Add Email</button>
        </div>
    );
}
```

### 2. Formulaire d'adresses

```javascript
export default function AddressForm() {
    const [addresses, setAddresses] = useState([
        { street: '', city: '', zip: '' }
    ]);

    const addAddress = () => {
        setAddresses([
            ...addresses,
            { street: '', city: '', zip: '' }
        ]);
    };

    const updateField = (index, field, value) => {
        const updated = [...addresses];
        updated[index][field] = value;
        setAddresses(updated);
    };

    const removeAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h3>Addresses</h3>
            {addresses.map((addr, index) => (
                <div key={index} className="address-row">
                    <input
                        placeholder="Street"
                        value={addr.street}
                        onChange={(e) => updateField(index, 'street', e.target.value)}
                    />
                    <input
                        placeholder="City"
                        value={addr.city}
                        onChange={(e) => updateField(index, 'city', e.target.value)}
                    />
                    <input
                        placeholder="ZIP"
                        value={addr.zip}
                        onChange={(e) => updateField(index, 'zip', e.target.value)}
                    />
                    <button onClick={() => removeAddress(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addAddress}>+ Add Address</button>
        </div>
    );
}
```

### 3. Liste d'items avec sélecteur (comme les costs du ticket)

```javascript
export default function ItemsWithSelector() {
    const [items, setItems] = useState([
        { type: 'Computer', quantity: 1 }
    ]);

    const addItem = () => {
        setItems([...items, { type: 'Computer', quantity: 1 }]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = field === 'quantity' ? Number(value) : value;
        setItems(updated);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h3>Inventory Items</h3>
            {items.map((item, index) => (
                <div key={index} className="item-row">
                    <select
                        value={item.type}
                        onChange={(e) => updateItem(index, 'type', e.target.value)}
                    >
                        <option>Computer</option>
                        <option>Printer</option>
                        <option>Phone</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                    <button onClick={() => removeItem(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addItem}>+ Add Item</button>
        </div>
    );
}
```

---

## Bonnes Pratiques

| ✅ À faire | ❌ À éviter |
|-----------|-----------|
| Utiliser `key={index}` pour la boucle | Ne pas avoir de clé (bugs de rendu) |
| Créer une copie du array avant de modifier | Modifier l'array directement |
| Vérifier la longueur avant suppression | Supprimer si length === 1 (cas vide) |
| Initialiser avec au moins un item vide | Initialiser avec un array vide `[]` |
| Donner des placeholders clairs | Laisser les inputs vides sans contexte |

---

## Résumé

1. **State:** Array d'objets ou strings
2. **Map:** Affiche un input par item
3. **Add:** `[...array, newItem]`
4. **Update:** Copie l'array, modifie, puis setState
5. **Remove:** Filter out par index
6. **CSS:** Flexbox pour aligner côte à côte
7. **UX:** Bouton "+ Add", bouton "Remove" par ligne

👍 Réutilise ce pattern pour n'importe quel formulaire dynamique!
