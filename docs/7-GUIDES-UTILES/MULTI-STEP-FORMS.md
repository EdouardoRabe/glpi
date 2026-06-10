# Guide Multi-Step Forms (Wizards)

Explique comment créer des formulaires en plusieurs étapes, gérer la navigation, et valider les étapes.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Multi-step** | BOImport.jsx (futur) | Étape 1: Sélectionner fichiers → Étape 2: Valider → Étape 3: Importer |
| **Wizard** | FOCreateTicket.jsx (futur) | Infos → Assets → Confirmation → Soumettre |
| **Validation étape** | BOImport.jsx | Vérifier fichiers avant de continuer |
| **Progress bar** | BODashboard.jsx (futur) | Montrer avancement de l'import |
| **Persistence** | FOCreateTicket.jsx | Garde les données en changeant d'étape |

**Exemple adapté pour toi:** BOImport est déjà un bon candidat! Divise en: Étape 1 (sélectionner fichiers), Étape 2 (aperçu), Étape 3 (upload). Utilise juste `currentStep` state et les fichiers comme `formData` - c'est exactement le pattern du guide!

## Table des matières

1. [Structure basique](#structure-basique)
2. [Validation par étape](#validation-par-étape)
3. [Navigation](#navigation)
4. [Gestion des données](#gestion-des-données)
5. [Exemples complets](#exemples-complets)

---

## Structure basique

### Wizard simple 3 étapes

```javascript
import { useState } from "react"

export default function SimpleWizard() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { title: "Infos personnelles", component: StepPersonal },
    { title: "Adresse", component: StepAddress },
    { title: "Confirmation", component: StepConfirm },
  ]

  const CurrentComponent = steps[currentStep].component

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="wizard">
      {/* Progress bar */}
      <div className="wizard-progress">
        <div
          className="progress-bar"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="wizard-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${
              index <= currentStep ? "active" : ""
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className="wizard-content">
        <CurrentComponent />
      </div>

      {/* Navigation buttons */}
      <div className="wizard-buttons">
        <button onClick={goPrev} disabled={currentStep === 0}>
          Précédent
        </button>
        <button
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

// Composants des étapes
function StepPersonal() {
  return <div><h3>Étape 1: Infos personnelles</h3></div>
}

function StepAddress() {
  return <div><h3>Étape 2: Adresse</h3></div>
}

function StepConfirm() {
  return <div><h3>Étape 3: Confirmation</h3></div>
}
```

### CSS pour wizard

```css
.wizard {
  max-width: 600px;
  margin: 2rem auto;
}

.wizard-progress {
  width: 100%;
  height: 4px;
  background-color: #ddd;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #000;
  transition: width 0.3s;
}

.wizard-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.step-indicator.active .step-number {
  background-color: #000;
  border-color: #000;
  color: #fff;
}

.step-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.step-indicator.active .step-title {
  color: #000;
  font-weight: 600;
}

.wizard-content {
  padding: 2rem;
  border: 1px solid #999;
  border-radius: 8px;
  margin-bottom: 2rem;
  min-height: 300px;
}

.wizard-buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.wizard-buttons button {
  flex: 1;
  padding: 0.75rem 1.5rem;
}

.wizard-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Validation par étape

### Valider avant de continuer

```javascript
const [currentStep, setCurrentStep] = useState(0)
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
})
const [errors, setErrors] = useState({})

const validateStep = (step) => {
  const newErrors = {}

  if (step === 0) {
    // Valider étape 1
    if (!formData.firstName) newErrors.firstName = "Prénom requis"
    if (!formData.lastName) newErrors.lastName = "Nom requis"
  }

  if (step === 1) {
    // Valider étape 2
    if (!formData.email) newErrors.email = "Email requis"
    else if (!formData.email.includes("@")) newErrors.email = "Email invalide"
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const goNext = () => {
  if (validateStep(currentStep)) {
    setCurrentStep(currentStep + 1)
  }
}

return (
  <div>
    {/* Afficher les erreurs */}
    {Object.keys(errors).map((key) => (
      <p key={key} className="error">{errors[key]}</p>
    ))}

    {/* Form inputs */}
    <input
      value={formData.firstName}
      onChange={(e) =>
        setFormData({ ...formData, firstName: e.target.value })
      }
    />

    <button onClick={goNext}>Suivant</button>
  </div>
)
```

---

## Navigation

### Navigation libre vs séquentielle

```javascript
// Mode séquentiel (défaut)
const goNext = () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1)
  }
}

// Mode libre (cliquer sur n'importe quelle étape)
const canAccessStep = (step) => {
  // Exemple: pouvoir accéder seulement aux étapes précédentes
  return step <= currentStep
}

const goToStep = (step) => {
  if (canAccessStep(step)) {
    setCurrentStep(step)
  }
}

// Affichage des étapes cliquables
<div className="wizard-steps">
  {steps.map((step, index) => (
    <button
      key={index}
      className={`step-indicator ${
        index <= currentStep ? "active" : "disabled"
      }`}
      onClick={() => goToStep(index)}
      disabled={!canAccessStep(index)}
    >
      {step.title}
    </button>
  ))}
</div>
```

---

## Gestion des données

### Persister les données à travers les étapes

```javascript
import { useState } from "react"

export default function WizardWithPersistence() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    step1: { firstName: "", lastName: "" },
    step2: { email: "", phone: "" },
    step3: { agree: false },
  })

  const updateStepData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  const handleSubmit = () => {
    console.log("Données complètes:", formData)
    // Envoyer à l'API
  }

  const steps = [
    {
      title: "Infos personnelles",
      render: () => (
        <div>
          <input
            placeholder="Prénom"
            value={formData.step1.firstName}
            onChange={(e) =>
              updateStepData("step1", { firstName: e.target.value })
            }
          />
          <input
            placeholder="Nom"
            value={formData.step1.lastName}
            onChange={(e) =>
              updateStepData("step1", { lastName: e.target.value })
            }
          />
        </div>
      ),
    },
    {
      title: "Contact",
      render: () => (
        <div>
          <input
            placeholder="Email"
            value={formData.step2.email}
            onChange={(e) =>
              updateStepData("step2", { email: e.target.value })
            }
          />
          <input
            placeholder="Téléphone"
            value={formData.step2.phone}
            onChange={(e) =>
              updateStepData("step2", { phone: e.target.value })
            }
          />
        </div>
      ),
    },
    {
      title: "Confirmation",
      render: () => (
        <div>
          <h3>Résumé</h3>
          <p>
            <strong>Nom:</strong> {formData.step1.firstName}{" "}
            {formData.step1.lastName}
          </p>
          <p>
            <strong>Email:</strong> {formData.step2.email}
          </p>
          <label>
            <input
              type="checkbox"
              checked={formData.step3.agree}
              onChange={(e) =>
                updateStepData("step3", { agree: e.target.checked })
              }
            />
            J'accepte les conditions
          </label>
        </div>
      ),
    },
  ]

  return (
    <div className="wizard">
      <div className="wizard-content">
        {steps[currentStep].render()}
      </div>

      <div className="wizard-buttons">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Précédent
        </button>

        {currentStep === steps.length - 1 ? (
          <button onClick={handleSubmit}>Soumettre</button>
        ) : (
          <button onClick={() => setCurrentStep(currentStep + 1)}>
            Suivant
          </button>
        )}
      </div>
    </div>
  )
}
```

---

## Exemples complets

### Wizard d'inscription complète

> ⚠️ **Cet exemple utilise `zod`** (librairie de validation). Si tu ne l'as pas, installe-la avec `npm install zod`. Sinon, remplace les `*.safeParse(formData)` par une validation manuelle (voir la section [Validation par étape](#validation-par-étape) plus haut).
>
> ⚠️ **CSS :** cet exemple utilise les classes `.wizard-progress`, `.wizard-steps`, `.step-indicator`, `.wizard-content`, `.wizard-buttons`. Réutilise le [CSS pour wizard](#css-pour-wizard) plus haut (la classe racine y est `.wizard` — garde le même nom de classe sur ta `<div>` racine ci-dessous).

```javascript
import { useState } from "react"
import { z } from "zod"   // npm install zod

const accountSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Min 8 caractères"),
})

const personalSchema = z.object({
  firstName: z.string().min(2, "Min 2 caractères"),
  lastName: z.string().min(2, "Min 2 caractères"),
})

const addressSchema = z.object({
  street: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
})

export default function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    {
      title: "Compte",
      validate: () => accountSchema.safeParse(formData),
      render: () => (
        <div className="step-content">
          <h3>Créer votre compte</h3>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={errors.email ? "error" : ""}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
          <div>
            <label>Mot de passe:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <p className="error-msg">{errors.password}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Infos personnelles",
      validate: () => personalSchema.safeParse(formData),
      render: () => (
        <div className="step-content">
          <h3>Vos informations</h3>
          <div>
            <label>Prénom:</label>
            <input
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className={errors.firstName ? "error" : ""}
            />
            {errors.firstName && (
              <p className="error-msg">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label>Nom:</label>
            <input
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className={errors.lastName ? "error" : ""}
            />
            {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
          </div>
        </div>
      ),
    },
    {
      title: "Adresse",
      validate: () => addressSchema.safeParse(formData),
      render: () => (
        <div className="step-content">
          <h3>Adresse de livraison</h3>
          <div>
            <label>Rue:</label>
            <input
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              className={errors.street ? "error" : ""}
            />
            {errors.street && <p className="error-msg">{errors.street}</p>}
          </div>
          <div>
            <label>Ville:</label>
            <input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={errors.city ? "error" : ""}
            />
            {errors.city && <p className="error-msg">{errors.city}</p>}
          </div>
        </div>
      ),
    },
    {
      title: "Confirmation",
      validate: () => ({ success: formData.agree }),
      render: () => (
        <div className="step-content">
          <h3>Résumé de l'inscription</h3>
          <div className="summary">
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Nom:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Adresse:</strong> {formData.street}, {formData.city}
            </p>
          </div>
          <label>
            <input
              type="checkbox"
              checked={formData.agree}
              onChange={(e) =>
                setFormData({ ...formData, agree: e.target.checked })
              }
            />
            J'accepte les conditions d'utilisation
          </label>
          {errors.agree && <p className="error-msg">{errors.agree}</p>}
        </div>
      ),
    },
  ]

  const validateStep = () => {
    const result = steps[currentStep].validate()
    if (!result.success) {
      const newErrors = {}
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      return false
    } else {
      setErrors({})
      return true
    }
  }

  const goNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      console.log("Inscription réussie!")
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="wizard">
      {/* Progress */}
      <div className="wizard-progress">
        <div
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Steps */}
      <div className="wizard-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${
              index <= currentStep ? "active" : ""
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="wizard-content">
        {steps[currentStep].render()}
      </div>

      {/* Buttons */}
      <div className="wizard-buttons">
        <button onClick={goPrev} disabled={currentStep === 0}>
          Précédent
        </button>

        {currentStep === steps.length - 1 ? (
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "S'inscrire"}
          </button>
        ) : (
          <button onClick={goNext}>Suivant</button>
        )}
      </div>
    </div>
  )
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Valider avant de continuer
- Persister les données
- Afficher une barre de progression
- Indiquer l'étape actuelle
- Permettre de revenir à l'étape précédente

❌ **À éviter:**
- Perdre les données en revenant en arrière
- Pas de validation
- Trop d'étapes (max 5-7)
- Interface confuse
- Pas de feedback utilisateur

---

Besoin d'aide pour adapter ça à ton projet? 👍
