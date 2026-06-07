# Guide Tabs, Accordion & Collapse

Explique comment créer des composants d'organisation du contenu: onglets, accordéons, et sections repliables.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Accordion** | BOTicketList.jsx | Détails du ticket (affichage/masquage) |
| **Collapse** | BODashboard.jsx | Affichages conditionnels des statistiques |
| **Tabs** | FOAssetsList.jsx (futur) | Onglets: Tous / Ordinateurs / Moniteurs |
| **Accordion avancé** | BOReset.jsx | Groupes de catégories à réinitialiser |
| **Multi-ouverture** | BOImport.jsx (futur) | Plusieurs étapes visibles simultanément |

**Exemple adapté BOTicketList:** Tu utilises déjà un dialog! Convertis-le en accordion avec `openIndex` state. Remplace `ticket` par `detail` et `openIndex === index` - identique au guide!

## Table des matières

1. [Tabs (Onglets)](#tabs-onglets)
2. [Accordion](#accordion)
3. [Collapse (Collapsible)](#collapse-collapsible)
4. [Exemples avancés](#exemples-avancés)

---

## Tabs (Onglets)

### Tabs simple

```javascript
import { useState } from "react"

export default function SimpleTabs() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: "Accueil", content: "Bienvenue!" },
    { label: "Profil", content: "Mon profil" },
    { label: "Paramètres", content: "Mes paramètres" },
  ]

  return (
    <div className="tabs">
      {/* Tab buttons */}
      <div className="tabs-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-btn ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tabs-content">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}
```

### Tabs avec icônes

```javascript
const [activeTab, setActiveTab] = useState("home")

const tabs = [
  { id: "home", label: "Accueil", icon: "🏠", content: "..." },
  { id: "user", label: "Profil", icon: "👤", content: "..." },
  { id: "settings", label: "Paramètres", icon: "⚙️", content: "..." },
]

return (
  <div className="tabs">
    <div className="tabs-buttons">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>

    <div className="tabs-content">
      {tabs.find((t) => t.id === activeTab)?.content}
    </div>
  </div>
)
```

### CSS pour tabs

```css
.tabs-buttons {
  display: flex;
  border-bottom: 2px solid #999;
  gap: 0;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: #000;
  background-color: #f9f9f9;
}

.tab-btn.active {
  color: #000;
  border-bottom-color: #000;
}

.tabs-content {
  padding: 1.5rem;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## Accordion

### Accordion simple

```javascript
import { useState } from "react"

export default function SimpleAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  const items = [
    { title: "Section 1", content: "Contenu 1" },
    { title: "Section 2", content: "Contenu 2" },
    { title: "Section 3", content: "Contenu 3" },
  ]

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className={`accordion-button ${
              openIndex === index ? "active" : ""
            }`}
            onClick={() => toggleItem(index)}
          >
            <span>{item.title}</span>
            <span className="accordion-icon">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>

          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Accordion avec plusieurs ouverts

```javascript
const [openItems, setOpenItems] = useState(new Set())

const toggleItem = (index) => {
  const newOpen = new Set(openItems)
  if (newOpen.has(index)) {
    newOpen.delete(index)
  } else {
    newOpen.add(index)
  }
  setOpenItems(newOpen)
}

return (
  <div className="accordion">
    {items.map((item, index) => (
      <div key={index} className="accordion-item">
        <button
          className={`accordion-button ${
            openItems.has(index) ? "active" : ""
          }`}
          onClick={() => toggleItem(index)}
        >
          {item.title}
        </button>

        {openItems.has(index) && (
          <div className="accordion-content">
            {item.content}
          </div>
        )}
      </div>
    ))}
  </div>
)
```

### CSS pour accordion

```css
.accordion {
  border: 1px solid #999;
  border-radius: 8px;
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid #999;
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.accordion-button:hover {
  background-color: #f0f0f0;
}

.accordion-button.active {
  background-color: #f0f0f0;
  font-weight: 600;
}

.accordion-icon {
  font-size: 20px;
  font-weight: bold;
  transition: transform 0.2s;
}

.accordion-button.active .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 1rem 1.5rem;
  background-color: #fff;
  border-top: 1px solid #ddd;
  animation: slideDown 0.2s;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}
```

---

## Collapse (Collapsible)

### Collapse simple

```javascript
import { useState } from "react"

export default function Collapse({ title, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="collapse">
      <button
        className={`collapse-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="collapse-icon">▾</span>
      </button>

      {isOpen && (
        <div className="collapse-content">
          {children}
        </div>
      )}
    </div>
  )
}

// Utilisation
export default function App() {
  return (
    <div>
      <Collapse title="Plus d'infos">
        <p>Voici les détails cachés</p>
      </Collapse>

      <Collapse title="Paramètres avancés">
        <p>Configuration avancée ici</p>
      </Collapse>
    </div>
  )
}
```

### Collapse avec animation smooth

```javascript
import { useState, useRef } from "react"

export default function SmoothCollapse({ title, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)

  return (
    <div className="collapse">
      <button
        className={`collapse-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title}
      </button>

      <div
        className={`collapse-content ${isOpen ? "open" : ""}`}
        ref={contentRef}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className="collapse-inner">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### CSS pour collapse

```css
.collapse-button {
  width: 100%;
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #999;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.collapse-button:hover {
  background-color: #f0f0f0;
}

.collapse-button.open {
  border-radius: 4px 4px 0 0;
}

.collapse-icon {
  transition: transform 0.3s;
}

.collapse-button.open .collapse-icon {
  transform: rotate(180deg);
}

.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  border: 1px solid #999;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.collapse-content.open {
  max-height: 1000px;
}

.collapse-inner {
  padding: 1rem;
  background-color: #fff;
}
```

---

## Exemples avancés

### FAQ avec accordion

```javascript
import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "Comment créer un compte?",
      answer: "Cliquez sur S'inscrire et remplissez le formulaire.",
    },
    {
      question: "Que faire si j'oublie mon mot de passe?",
      answer: "Utilisez le lien 'Mot de passe oublié' sur la page de connexion.",
    },
    {
      question: "Comment supprimer mon compte?",
      answer: "Allez dans Paramètres > Sécurité > Supprimer le compte.",
    },
  ]

  return (
    <div className="faq">
      <h2>Foire Aux Questions</h2>
      <div className="accordion">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className={`faq-question ${openIndex === index ? "active" : ""}`}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              {faq.question}
              <span className="faq-icon">?</span>
            </button>

            {openIndex === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Sections développables pour formulaire

```javascript
import { useState } from "react"

export default function FormSections() {
  const [expandedSections, setExpandedSections] = useState(new Set([0]))

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  const sections = [
    {
      title: "Informations personnelles",
      fields: [
        { label: "Nom", type: "text" },
        { label: "Email", type: "email" },
      ],
    },
    {
      title: "Adresse",
      fields: [
        { label: "Rue", type: "text" },
        { label: "Ville", type: "text" },
      ],
    },
    {
      title: "Paramètres de notification",
      fields: [
        { label: "Email", type: "checkbox" },
        { label: "SMS", type: "checkbox" },
      ],
    },
  ]

  return (
    <form className="form-sections">
      {sections.map((section, index) => (
        <div key={index} className="form-section">
          <button
            type="button"
            className={`section-header ${
              expandedSections.has(index) ? "expanded" : ""
            }`}
            onClick={() => toggleSection(index)}
          >
            <h3>{section.title}</h3>
            <span className="section-icon">▼</span>
          </button>

          {expandedSections.has(index) && (
            <div className="section-content">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="form-group">
                  <label>{field.label}</label>
                  <input type={field.type} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button type="submit">Soumettre</button>
    </form>
  )
}
```

### Tabs avec Lazy Loading

```javascript
import { useState, useEffect } from "react"

export default function TabsWithLazyLoad() {
  const [activeTab, setActiveTab] = useState(0)
  const [tabData, setTabData] = useState({})
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 0, label: "Tab 1" },
    { id: 1, label: "Tab 2" },
    { id: 2, label: "Tab 3" },
  ]

  useEffect(() => {
    // Charger les données du tab actif
    if (!tabData[activeTab]) {
      setLoading(true)
      setTimeout(() => {
        setTabData((prev) => ({
          ...prev,
          [activeTab]: `Contenu du tab ${activeTab + 1}`,
        }))
        setLoading(false)
      }, 500)
    }
  }, [activeTab])

  return (
    <div className="tabs">
      <div className="tabs-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          tabData[activeTab] || "..."
        )}
      </div>
    </div>
  )
}
```

---

## Comparaison

| Composant | Cas d'usage | Plusieurs ouverts |
|-----------|------------|-------------------|
| **Tabs** | Navigation entre sections | Non, une seule active |
| **Accordion** | FAQ, listes de contenu | Non, une seule ouverte |
| **Collapse** | Détails optionnels | Oui, plusieurs possibles |

---

## Bonnes pratiques

✅ **À faire:**
- Utiliser des classes CSS claires et cohérentes
- Ajouter des animations de transition
- Supporter l'accessibilité (aria-expanded)
- Indiquer visuellement l'état actif/ouvert
- Animer les icônes de direction

❌ **À éviter:**
- Trop d'animations qui ralentissent l'app
- Mélanger tabs et accordion
- Pas d'indicateur visuel de l'état
- Contenu trop long sans scroll interne

---

Besoin d'aide pour adapter ça à ton projet? 👍
