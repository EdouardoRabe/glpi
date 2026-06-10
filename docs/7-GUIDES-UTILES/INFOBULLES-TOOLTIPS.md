# Guide Infobulles (Tooltips)

> 🔎 **Mots-clés de recherche :** tooltip, infobulle, bulle, survol, hover, aide, title, popover, astuce, message au survol, texte au passage de la souris

Petit message qui apparaît **au survol** d'un élément. Copie le JSX **et** le CSS ensemble.

## Table des matières

1. [Tooltip CSS pur (le plus simple)](#tooltip-css-pur-le-plus-simple)
2. [Tooltip réutilisable (composant)](#tooltip-réutilisable-composant)
3. [Tooltip dans 4 directions](#tooltip-dans-4-directions)
4. [Tooltip sur une icône d'aide](#tooltip-sur-une-icône-daide)

---

## Tooltip CSS pur (le plus simple)

Aucun JavaScript, aucun state. Juste du CSS. Parfait pour 90% des cas.

### Tooltip.jsx
```javascript
export default function Tooltip({ text, children }) {
    return (
        <span className="tooltip" data-tooltip={text}>
            {children}
        </span>
    );
}
```

### Tooltip.css
```css
.tooltip {
    position: relative;
    display: inline-block;
    cursor: help;
}

/* La bulle (cachée par défaut) */
.tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: white;
    padding: 0.4rem 0.7rem;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
}

/* La petite flèche */
.tooltip::before {
    content: "";
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    border: 5px solid transparent;
    border-top-color: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
}

/* Au survol → on montre la bulle */
.tooltip:hover::after,
.tooltip:hover::before {
    opacity: 1;
}
```

**Usage :**
```javascript
<Tooltip text="Supprimer le ticket">
    <button>🗑️</button>
</Tooltip>
```

> 💡 La bulle utilise `data-tooltip` (un attribut HTML) + `content: attr(data-tooltip)` en CSS. C'est ce qui permet d'afficher le texte sans JavaScript.

---

## Tooltip réutilisable (composant)

Même chose mais avec une vraie `<div>` pour la bulle (plus flexible si tu veux du contenu riche plus tard).

### HoverTooltip.jsx
```javascript
import { useState } from "react";

export default function HoverTooltip({ text, children }) {
    const [visible, setVisible] = useState(false);

    return (
        <span
            className="hover-tooltip"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && <span className="hover-tooltip-bubble">{text}</span>}
        </span>
    );
}
```

### HoverTooltip.css
```css
.hover-tooltip {
    position: relative;
    display: inline-block;
}

.hover-tooltip-bubble {
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: white;
    padding: 0.4rem 0.7rem;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    animation: tooltip-fade 0.2s ease;
}

@keyframes tooltip-fade {
    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

**Usage :**
```javascript
<HoverTooltip text="Modifier">
    <button>✏️</button>
</HoverTooltip>
```

---

## Tooltip dans 4 directions

Choisis où la bulle apparaît : haut, bas, gauche, droite.

### DirectionTooltip.jsx
```javascript
export default function DirectionTooltip({ text, position = "top", children }) {
    return (
        <span className={`dir-tooltip dir-tooltip-${position}`} data-tooltip={text}>
            {children}
        </span>
    );
}
```

### DirectionTooltip.css
```css
.dir-tooltip {
    position: relative;
    display: inline-block;
}

.dir-tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    background-color: #000;
    color: white;
    padding: 0.4rem 0.7rem;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
}

.dir-tooltip:hover::after {
    opacity: 1;
}

/* Haut */
.dir-tooltip-top::after {
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
}

/* Bas */
.dir-tooltip-bottom::after {
    top: 125%;
    left: 50%;
    transform: translateX(-50%);
}

/* Gauche */
.dir-tooltip-left::after {
    right: 125%;
    top: 50%;
    transform: translateY(-50%);
}

/* Droite */
.dir-tooltip-right::after {
    left: 125%;
    top: 50%;
    transform: translateY(-50%);
}
```

**Usage :**
```javascript
<DirectionTooltip text="En haut" position="top"><button>↑</button></DirectionTooltip>
<DirectionTooltip text="En bas" position="bottom"><button>↓</button></DirectionTooltip>
<DirectionTooltip text="À gauche" position="left"><button>←</button></DirectionTooltip>
<DirectionTooltip text="À droite" position="right"><button>→</button></DirectionTooltip>
```

---

## Tooltip sur une icône d'aide

Cas très courant : un petit "?" à côté d'un champ qui explique à quoi il sert.

### HelpIcon.jsx
```javascript
export default function HelpIcon({ text }) {
    return (
        <span className="help-icon" data-tooltip={text}>
            ?
        </span>
    );
}
```

### HelpIcon.css
```css
.help-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background-color: #999;
    color: white;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
    cursor: help;
    margin-left: 0.4rem;
}

.help-icon::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 150%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    width: 200px;
    white-space: normal;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
}

.help-icon:hover::after {
    opacity: 1;
}
```

**Usage (à côté d'un label) :**
```javascript
<label>
    Référence du ticket
    <HelpIcon text="Identifiant unique externe, ex: TK-001" />
</label>
```

> 💡 Ici `white-space: normal` + `width: 200px` permettent au texte d'aide de passer sur **plusieurs lignes** (contrairement aux autres tooltips qui sont sur une seule ligne).

---

## ⚠️ Piège courant : la bulle est coupée

Si ta tooltip est dans un conteneur avec `overflow: hidden` (comme une carte ou une colonne Kanban), **la bulle sera coupée**.

```css
/* ❌ La tooltip à l'intérieur sera coupée */
.ma-carte {
    overflow: hidden;
}

/* ✅ Solutions possibles : */
/* 1. Enlever overflow: hidden si possible */
/* 2. Ou utiliser overflow: visible sur le parent direct */
/* 3. Ou mettre la tooltip en dehors de la zone overflow */
```

---

## Résumé

| Composant | Quand l'utiliser |
|-----------|------------------|
| **Tooltip** | Le plus simple, CSS pur, 1 ligne de texte |
| **HoverTooltip** | Si tu veux du contrôle React (state) |
| **DirectionTooltip** | Choisir la direction (haut/bas/gauche/droite) |
| **HelpIcon** | Petit "?" d'aide avec texte sur plusieurs lignes |

✅ **Le plus simple gagne :** commence toujours par le `Tooltip` CSS pur (`data-tooltip` + `::after`). Passe au composant React seulement si tu as besoin de plus.
