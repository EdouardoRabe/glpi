# Guide Radio Buttons, Toggles & Switch

Explique comment implémenter les éléments de formulaire essentiels: radio buttons, checkboxes avancées, toggles/switches, et select avancés.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Radio buttons** | BOReset.jsx | Sélectionner les catégories à réinitialiser (une seule) |
| **Checkboxes** | BOTicketList.jsx | Sélectionner plusieurs articles dans les détails |
| **Toggle/Switch** | FOCreateTicket.jsx | Activer/désactiver les notifications |
| **Select** | FOAssetsList.jsx | Filtrer par type, localisation, utilisateur |
| **Multi-select** | FOCreateTicket.jsx | Sélectionner plusieurs assets associés au ticket |

**Exemple adapté BOTicketList:** remplace `interests` par `selectedArticles` et `options.map` par `details.map` - c'est tout!

## Table des matières

1. [Radio Buttons](#radio-buttons)
2. [Checkboxes](#checkboxes)
3. [Toggle/Switch](#toggleswitch)
4. [Select Avancé](#select-avancé)
5. [Exemples complets](#exemples-complets)

---

## Radio Buttons

### Basique

```javascript
import { useState } from "react"

export default function RadioBasic() {
  const [selected, setSelected] = useState("option1")

  return (
    <div>
      <label>
        <input
          type="radio"
          name="choice"
          value="option1"
          checked={selected === "option1"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Option 1
      </label>
      
      <label>
        <input
          type="radio"
          name="choice"
          value="option2"
          checked={selected === "option2"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Option 2
      </label>
      
      <label>
        <input
          type="radio"
          name="choice"
          value="option3"
          checked={selected === "option3"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Option 3
      </label>

      <p>Sélectionné: {selected}</p>
    </div>
  )
}
```

### Avec groupe

```javascript
const [priority, setPriority] = useState("medium")

const priorities = [
  { value: "low", label: "Basse priorité" },
  { value: "medium", label: "Priorité moyenne" },
  { value: "high", label: "Haute priorité" },
]

return (
  <fieldset>
    <legend>Priorité</legend>
    {priorities.map((p) => (
      <label key={p.value}>
        <input
          type="radio"
          name="priority"
          value={p.value}
          checked={priority === p.value}
          onChange={(e) => setPriority(e.target.value)}
        />
        {p.label}
      </label>
    ))}
  </fieldset>
)
```

### CSS pour Radio Buttons

```css
/* Style personnalisé pour radio buttons */
.radio-group {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.radio-group input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

/* Radio button personnalisé (sans input visible) */
.radio-custom input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #999;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-custom input[type="radio"]:checked {
  border-color: #000;
  box-shadow: inset 0 0 0 5px #000;
}

.radio-custom input[type="radio"]:hover {
  border-color: #000;
}
```

---

## Checkboxes

### Basique

```javascript
import { useState } from "react"

export default function CheckboxBasic() {
  const [agree, setAgree] = useState(false)

  return (
    <label>
      <input
        type="checkbox"
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
      />
      J'accepte les conditions d'utilisation
    </label>
  )
}
```

### Groupe de checkboxes

```javascript
const [interests, setInterests] = useState([])

const options = ["JavaScript", "React", "Node.js", "Python"]

const handleToggle = (value) => {
  setInterests((prev) =>
    prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value]
  )
}

return (
  <div>
    <p>Intérêts:</p>
    {options.map((option) => (
      <label key={option}>
        <input
          type="checkbox"
          checked={interests.includes(option)}
          onChange={() => handleToggle(option)}
        />
        {option}
      </label>
    ))}
    <p>Sélectionnés: {interests.join(", ")}</p>
  </div>
)
```

### Checkbox avec indéterminé

```javascript
const [items, setItems] = useState([
  { id: 1, name: "Item 1", checked: false },
  { id: 2, name: "Item 2", checked: false },
  { id: 3, name: "Item 3", checked: false },
])

const allChecked = items.every((item) => item.checked)
const someChecked = items.some((item) => item.checked)

const handleCheckAll = () => {
  setItems((prev) =>
    prev.map((item) => ({ ...item, checked: !allChecked }))
  )
}

const handleCheckItem = (id) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
  )
}

return (
  <div>
    <label>
      <input
        type="checkbox"
        checked={allChecked}
        indeterminate={someChecked && !allChecked}
        onChange={handleCheckAll}
      />
      Tout sélectionner
    </label>

    {items.map((item) => (
      <label key={item.id}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => handleCheckItem(item.id)}
        />
        {item.name}
      </label>
    ))}
  </div>
)
```

---

## Toggle/Switch

### Simple Toggle

```javascript
import { useState } from "react"

export default function Toggle() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
      <p>État: {enabled ? "Activé" : "Désactivé"}</p>
    </div>
  )
}
```

### CSS pour Toggle

```css
.toggle-switch {
  display: inline-block;
  position: relative;
  width: 50px;
  height: 28px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-switch .slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .slider {
  background-color: #2196f3;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(22px);
}
```

### Toggle avec Label

```javascript
const [notifications, setNotifications] = useState({
  email: true,
  sms: false,
  push: true,
})

const handleToggle = (key) => {
  setNotifications((prev) => ({
    ...prev,
    [key]: !prev[key],
  }))
}

return (
  <div className="toggles-container">
    {Object.entries(notifications).map(([key, value]) => (
      <div key={key} className="toggle-item">
        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={value}
            onChange={() => handleToggle(key)}
          />
          <span className="slider"></span>
        </label>
      </div>
    ))}
  </div>
)
```

---

## Select Avancé

### Select simple

```javascript
const [country, setCountry] = useState("")

const countries = ["France", "Belgique", "Suisse", "Canada"]

return (
  <select value={country} onChange={(e) => setCountry(e.target.value)}>
    <option value="">-- Sélectionner un pays --</option>
    {countries.map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  </select>
)
```

### Select multi-sélection

```javascript
const [selected, setSelected] = useState([])

const options = ["Apple", "Banana", "Orange", "Grape"]

const handleChange = (e) => {
  const values = Array.from(e.target.selectedOptions, (option) => option.value)
  setSelected(values)
}

return (
  <div>
    <select multiple value={selected} onChange={handleChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <p>Sélectionnés: {selected.join(", ")}</p>
  </div>
)
```

### Select avec groupes

```javascript
return (
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="">-- Catégorie --</option>
    
    <optgroup label="Fruits">
      <option value="apple">Pomme</option>
      <option value="banana">Banane</option>
    </optgroup>
    
    <optgroup label="Légumes">
      <option value="carrot">Carotte</option>
      <option value="tomato">Tomate</option>
    </optgroup>
  </select>
)
```

---

## Exemples complets

### Formulaire complet avec tous les éléments

```javascript
import { useState } from "react"

export default function CompleteForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "other",
    interests: [],
    agree: false,
    notifications: true,
    country: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form Data:", formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Texte */}
      <div>
        <label htmlFor="name">Nom:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* Radio Buttons */}
      <div>
        <legend>Genre:</legend>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          Homme
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          Femme
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="other"
            checked={formData.gender === "other"}
            onChange={handleChange}
          />
          Autre
        </label>
      </div>

      {/* Checkboxes */}
      <div>
        <legend>Intérêts:</legend>
        {["JavaScript", "React", "Node.js"].map((interest) => (
          <label key={interest}>
            <input
              type="checkbox"
              checked={formData.interests.includes(interest)}
              onChange={() => handleInterestChange(interest)}
            />
            {interest}
          </label>
        ))}
      </div>

      {/* Select */}
      <div>
        <label htmlFor="country">Pays:</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner --</option>
          <option value="france">France</option>
          <option value="belgium">Belgique</option>
        </select>
      </div>

      {/* Toggle */}
      <div>
        <label>
          Recevoir les notifications
          <input
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Checkbox acceptation */}
      <div>
        <label>
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          J'accepte les conditions
        </label>
      </div>

      <button type="submit" disabled={!formData.agree}>
        Soumettre
      </button>
    </form>
  )
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Toujours utiliser `name` pour grouper les radio buttons
- Utiliser `fieldset` et `legend` pour l'accessibilité
- Mettre les `<label>` en rapport avec les inputs
- Utiliser `htmlFor` sur les labels

❌ **À éviter:**
- Oublier le `name` sur les radio buttons
- Mélanger différents types d'inputs sans groupes clairs
- Inputs sans labels (mauvaise accessibilité)

---

Besoin d'aide pour adapter ça à ton projet? 👍
