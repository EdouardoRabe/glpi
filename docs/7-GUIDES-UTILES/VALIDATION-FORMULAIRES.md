# Guide Validation de Formulaires

Explique comment valider les formulaires en React, afficher les messages d'erreur, et gérer l'état de validation.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Validation email** | BOLogin.jsx | Vérifier format email avant connexion |
| **Validation longueur** | FOCreateTicket.jsx | Titre requis, description min X caractères |
| **Validation type** | FOCreateTicket.jsx | Type/Priorité/Status sélectionnés (required) |
| **Validation date** | FOCreateTicket.jsx | Date pas dans le passé, heure correcte |
| **Validation dépendante** | BODashboard.jsx | Affichage basé sur données chargées |

**Exemple adapté FOCreateTicket:** Valider tous les champs avant `handleSubmit()`. Remplace `email/password` par `title/description/date` et les patterns de validation - c'est plug-and-play!

## Table des matières

1. [Validation simple](#validation-simple)
2. [Validation complexe](#validation-complexe)
3. [Schémas Zod](#schémas-zod)
4. [Affichage des erreurs](#affichage-des-erreurs)
5. [Exemples complets](#exemples-complets)

---

## Validation simple

### Validation au blur (au départ du champ)

```javascript
import { useState } from "react"

export default function SimpleValidation() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleBlur = (field) => {
    const newErrors = { ...errors }

    if (field === "email") {
      if (!formData.email) {
        newErrors.email = "L'email est requis"
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Email invalide"
      } else {
        delete newErrors.email
      }
    }

    if (field === "password") {
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis"
      } else if (formData.password.length < 8) {
        newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
      } else {
        delete newErrors.password
      }
    }

    setErrors(newErrors)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Valider tous les champs avant submit
    let newErrors = {}
    if (!formData.email) newErrors.email = "Email requis"
    if (!formData.password) newErrors.password = "Mot de passe requis"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Formulaire valide:", formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit">Connexion</button>
    </form>
  )
}
```

### CSS pour les erreurs

```css
.input-error {
  border-color: #dc3545 !important;
  background-color: #fef5f5;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  display: block;
  margin-top: 0.25rem;
}

.success-message {
  color: #28a745;
  font-size: 12px;
  display: block;
  margin-top: 0.25rem;
}
```

---

## Validation complexe

### Validation dépendante (un champ dépend d'un autre)

```javascript
const [formData, setFormData] = useState({
  password: "",
  confirmPassword: "",
})
const [errors, setErrors] = useState({})

const validatePasswords = () => {
  const newErrors = {}

  if (formData.password.length < 8) {
    newErrors.password = "Au moins 8 caractères"
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = (e) => {
  e.preventDefault()
  if (validatePasswords()) {
    console.log("Formulaire valide")
  }
}
```

### Validation asynchrone (vérification serveur)

```javascript
const [formData, setFormData] = useState({ username: "" })
const [errors, setErrors] = useState({})
const [checking, setChecking] = useState(false)

const checkUsernameAvailability = async (username) => {
  if (!username) return true

  setChecking(true)
  try {
    const response = await fetch(`/api/check-username?username=${username}`)
    const { available } = await response.json()

    if (!available) {
      setErrors((prev) => ({
        ...prev,
        username: "Ce nom d'utilisateur est déjà pris",
      }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.username
        return newErrors
      })
    }
  } finally {
    setChecking(false)
  }
}

return (
  <div>
    <input
      name="username"
      value={formData.username}
      onChange={(e) => setFormData({ username: e.target.value })}
      onBlur={() => checkUsernameAvailability(formData.username)}
    />
    {checking && <span>Vérification...</span>}
    {errors.username && <span className="error-message">{errors.username}</span>}
  </div>
)
```

---

## Schémas Zod

### Installation

```bash
npm install zod
```

### Utilisation simple

```javascript
import { z } from "zod"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Min 8 caractères"),
})

export default function FormWithZod() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      const validated = loginSchema.parse(formData)
      console.log("Données valides:", validated)
      setErrors({})
    } catch (error) {
      // Zod retourne une liste d'erreurs
      const newErrors = {}
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit">Soumettre</button>
    </form>
  )
}
```

### Schéma complexe avec Zod

```javascript
const userSchema = z.object({
  name: z.string().min(2, "Min 2 caractères").max(50, "Max 50 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Min 8 caractères")
    .regex(/[A-Z]/, "Une majuscule requise")
    .regex(/[0-9]/, "Un chiffre requis"),
  confirmPassword: z.string(),
  age: z.number().min(18, "Doit être majeur"),
  agree: z.boolean().refine((val) => val === true, "Acceptation requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})
```

---

## Affichage des erreurs

### Message d'erreur inline

```javascript
{errors.email && (
  <div className="form-error">
    ⚠️ {errors.email}
  </div>
)}
```

### Tous les erreurs au sommet

```javascript
{Object.keys(errors).length > 0 && (
  <div className="form-errors-summary">
    <h3>Veuillez corriger les erreurs suivantes:</h3>
    <ul>
      {Object.entries(errors).map(([field, message]) => (
        <li key={field}>
          <strong>{field}:</strong> {message}
        </li>
      ))}
    </ul>
  </div>
)}
```

### Indicateur visuel sur le champ

```javascript
<div className={`form-group ${errors.email ? "has-error" : "has-success"}`}>
  <input name="email" value={formData.email} onChange={handleChange} />
  {errors.email && <span className="error-icon">✗</span>}
  {!errors.email && formData.email && <span className="success-icon">✓</span>}
</div>
```

### CSS pour les erreurs

```css
.form-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-group.has-error input {
  border-color: #dc3545;
  background-color: #fef5f5;
}

.form-group.has-success input {
  border-color: #28a745;
  background-color: #f0f8f4;
}

.error-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #dc3545;
  font-weight: bold;
}

.success-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #28a745;
  font-weight: bold;
}

.form-errors-summary {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fef5f5;
  border: 1px solid #dc3545;
  border-radius: 4px;
  color: #721c24;
}

.form-errors-summary ul {
  margin: 0.5rem 0 0 1.5rem;
}

.form-errors-summary li {
  margin-bottom: 0.25rem;
}
```

---

## Exemples complets

### Formulaire d'inscription avec validation complète

```javascript
import { useState } from "react"
import { z } from "zod"

const signupSchema = z
  .object({
    name: z.string().min(2, "Au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Au moins 8 caractères"),
    confirmPassword: z.string(),
    age: z.coerce.number().min(18, "Doit être majeur"),
    agree: z.boolean().refine((val) => val === true, "Acceptation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      const validated = signupSchema.parse(formData)
      console.log("Inscription réussie:", validated)
      setErrors({})
      setSubmitted(true)

      // Réinitialiser le formulaire
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          age: "",
          agree: false,
        })
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      const newErrors = {}
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
    }
  }

  return (
    <div className="signup-form">
      {submitted && (
        <div className="success-message">
          ✓ Inscription réussie!
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="form-errors-summary">
          <h3>Erreurs:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.name ? "has-error" : ""}`}>
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className={`form-group ${errors.email ? "has-error" : ""}`}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className={`form-group ${errors.password ? "has-error" : ""}`}>
          <label htmlFor="password">Mot de passe:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div
          className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}
        >
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className={`form-group ${errors.age ? "has-error" : ""}`}>
          <label htmlFor="age">Âge:</label>
          <input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className={`form-group ${errors.agree ? "has-error" : ""}`}>
          <label>
            <input
              name="agree"
              type="checkbox"
              checked={formData.agree}
              onChange={handleChange}
            />
            J'accepte les conditions
          </label>
          {errors.agree && <span className="error-message">{errors.agree}</span>}
        </div>

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Valider au blur (départ du champ)
- Valider au submit (formulaire entier)
- Afficher les erreurs clairement
- Utiliser des schémas Zod/Yup pour la complexité
- Indiquer visuellement les champs avec erreurs

❌ **À éviter:**
- Valider à chaque keystroke (trop de bruit)
- Afficher trop d'erreurs à la fois
- Messages d'erreur génériques
- Oublier d'indiquer les champs requis

---

Besoin d'aide pour adapter ça à ton formulaire? 👍
