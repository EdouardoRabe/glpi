# 📝 GUIDE - Formulaire: Input, Checkbox, Radio, Select

> Comment gérer les éléments de formulaire en React

---

## 🎯 Input Text (Controlled Component)

### Problème
Vous voulez récupérer la valeur d'un input et l'afficher/l'utiliser.

### Solution
```jsx
import { useState } from 'react';

function FormExample() {
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);  // À CHAQUE keystroke!
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nom saisi:', name);
    setName('');  // Vider
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={name}  // ⚠️ CONTRÔLÉ par React
        onChange={handleChange}
        placeholder="Votre nom"
      />
      <button type="submit">Valider</button>
      <p>Vous avez écrit: {name}</p>
    </form>
  );
}
```

### ⚠️ Erreurs Courantes
❌ **Pas de `value`** – L'input n'affiche pas ce que vous tapez  
❌ **Pas de `onChange`** – React ne sait pas que ça change  
❌ **Oublier `e.preventDefault()`** – La page recharge

---

## ✅ Checkbox (Single)

### Problème
Vous voulez une checkbox qui se coche/décoche.

### Solution
```jsx
const [agreed, setAgreed] = useState(false);

return (
  <label>
    <input 
      type="checkbox"
      checked={agreed}  // ⚠️ "checked" pour checkbox, pas "value"
      onChange={(e) => setAgreed(e.target.checked)}  // e.target.checked!
    />
    J'accepte les conditions
  </label>
);
```

### ✨ Raccourci
```jsx
onChange={(e) => setAgreed(e.target.checked)}
// Remplacer par:
onChange={setAgreed}  // Oui, ça marche! e.target.checked est directement passé
```

---

## ✅ Checkbox Multiple (Array)

### Problème
Vous voulez plusieurs checkboxes (ex: liste de permissions).

### Solution
```jsx
const [permissions, setPermissions] = useState([]);

const handleCheckbox = (value) => {
  setPermissions(prev => 
    prev.includes(value)
      ? prev.filter(p => p !== value)  // Décocher = supprimer
      : [...prev, value]  // Cocher = ajouter
  );
};

return (
  <>
    {['read', 'write', 'delete'].map(perm => (
      <label key={perm}>
        <input 
          type="checkbox"
          checked={permissions.includes(perm)}
          onChange={() => handleCheckbox(perm)}
        />
        {perm}
      </label>
    ))}
    <p>Permissions: {permissions.join(', ')}</p>
  </>
);
```

### 🔑 Points clés
- **includes()** – Vérifier si c'est coché
- **filter()** – Retirer si décoché
- **spread [...]** – Ajouter si coché

---

## ✅ Radio Buttons (Group)

### Problème
Vous voulez un groupe de radios (une seule sélection).

### Solution
```jsx
const [gender, setGender] = useState('');

return (
  <fieldset>
    <legend>Genre</legend>
    {['male', 'female', 'other'].map(option => (
      <label key={option}>
        <input 
          type="radio"
          name="gender"  // ⚠️ MANDATORY pour group
          value={option}
          checked={gender === option}
          onChange={(e) => setGender(e.target.value)}
        />
        {option}
      </label>
    ))}
    <p>Sélectionné: {gender}</p>
  </fieldset>
);
```

### ✨ Points clés
- **`name`** attribute obligatoire (= radio group)
- **`value`** = ce qui sera sauvegardé
- **`checked={gender === option}`** – Vérifier l'égalité

---

## ✅ Select Dropdown

### Problème
Vous voulez une liste déroulante.

### Solution
```jsx
const [country, setCountry] = useState('');

return (
  <select 
    value={country}
    onChange={(e) => setCountry(e.target.value)}
  >
    <option value="">-- Sélectionner --</option>
    <option value="fr">France</option>
    <option value="be">Belgique</option>
    <option value="ch">Suisse</option>
  </select>
);
```

### ✨ Avec Object/Array
```jsx
const countries = [
  { code: 'fr', name: 'France' },
  { code: 'be', name: 'Belgique' },
];

return (
  <select value={country} onChange={(e) => setCountry(e.target.value)}>
    <option value="">-- Sélectionner --</option>
    {countries.map(c => (
      <option key={c.code} value={c.code}>{c.name}</option>
    ))}
  </select>
);
```

---

## ✅ Textarea

### Problème
Vous voulez un champ multi-ligne.

### Solution
```jsx
const [message, setMessage] = useState('');

return (
  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    rows="5"
    placeholder="Votre message"
  />
);
```

---

## 🎯 Formulaire Complet (Tous les éléments)

```jsx
import { useState } from 'react';

function CompleteForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    agree: false,
    role: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', form);
    setForm({ name: '', email: '', agree: false, role: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" />
      
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="">Rôle</option>
        <option value="user">Utilisateur</option>
        <option value="admin">Admin</option>
      </select>
      
      <label>
        <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />
        J'accepte
      </label>
      
      <textarea name="message" value={form.message} onChange={handleChange} rows="3" />
      
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

## ⚠️ Pièges Courants

| Erreur | Cause | Correction |
|--------|-------|-----------|
| Checkbox ne change pas | `checked={value}` au lieu de `checked={checked}` | Utiliser `e.target.checked` |
| Input vide reste vide | Pas de `value` ou `value=""` | Ajouter `value={state}` |
| Radio ne fonctionne pas | Pas de `name` identique | Ajouter `name="groupName"` |
| Select ne se vide pas | `value=""` non contrôlé | Utiliser `value={state}` |
| Form recharge la page | Pas de `e.preventDefault()` | Ajouter dans `onSubmit` |

---

## 🔗 Navigation
← [INDEX](./INDEX-RECHERCHE.md)  
↓ Voir aussi: [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)
