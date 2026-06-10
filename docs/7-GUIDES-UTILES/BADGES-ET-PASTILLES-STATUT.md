# Guide Badges et Pastilles de Statut

> 🔎 **Mots-clés de recherche :** badge, pastille, étiquette, tag, label, statut, status, priorité, priority, couleur, color, chip, pill, point coloré, indicateur

Petits éléments colorés pour afficher un **statut**, une **priorité** ou une **catégorie**. Copie le JSX **et** le CSS ensemble, c'est prêt.

## Table des matières

1. [Badge simple](#badge-simple)
2. [Badge coloré dynamique](#badge-coloré-dynamique)
3. [Pastille avec point](#pastille-avec-point)
4. [Badge de statut de ticket (GLPI)](#badge-de-statut-de-ticket-glpi)
5. [Badge de priorité](#badge-de-priorité)
6. [Badge avec compteur](#badge-avec-compteur)

---

## Badge simple

### Badge.jsx
```javascript
export default function Badge({ text }) {
    return <span className="badge">{text}</span>;
}
```

### Badge.css
```css
.badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: #000;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}
```

**Usage :**
```javascript
<Badge text="Nouveau" />
```

---

## Badge coloré dynamique

La couleur vient d'une **prop**. Utile quand chaque statut a sa couleur.

### ColorBadge.jsx
```javascript
export default function ColorBadge({ text, color = "#000" }) {
    return (
        <span className="color-badge" style={{ backgroundColor: color }}>
            {text}
        </span>
    );
}
```

### ColorBadge.css
```css
.color-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}
```

**Usage :**
```javascript
<ColorBadge text="Résolu" color="#27ae60" />
<ColorBadge text="En cours" color="#f39c12" />
```

---

## Pastille avec point

Un petit point coloré + un texte. Très lisible pour les statuts.

### DotBadge.jsx
```javascript
export default function DotBadge({ text, color = "#000" }) {
    return (
        <span className="dot-badge">
            <span className="dot-badge-point" style={{ backgroundColor: color }}></span>
            {text}
        </span>
    );
}
```

### DotBadge.css
```css
.dot-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #333;
}

.dot-badge-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
```

**Usage :**
```javascript
<DotBadge text="En ligne" color="#22c55e" />
<DotBadge text="Hors ligne" color="#999" />
```

---

## Badge de statut de ticket (GLPI)

Mappe l'**id de statut** GLPI vers un label + une couleur. Directement utilisable dans ta liste de tickets.

### TicketStatusBadge.jsx
```javascript
const STATUS_MAP = {
    1: { label: "Nouveau",    color: "#2980b9" },
    2: { label: "En cours",   color: "#f39c12" },
    3: { label: "Planifié",   color: "#9b59b6" },
    4: { label: "En attente", color: "#8e44ad" },
    5: { label: "Résolu",     color: "#27ae60" },
    6: { label: "Clos",       color: "#7f8c8d" },
};

export default function TicketStatusBadge({ statusId }) {
    const status = STATUS_MAP[statusId] ?? { label: "Inconnu", color: "#999" };

    return (
        <span className="ticket-status-badge" style={{ backgroundColor: status.color }}>
            {status.label}
        </span>
    );
}
```

### TicketStatusBadge.css
```css
.ticket-status-badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}
```

**Usage :**
```javascript
<TicketStatusBadge statusId={ticket.status?.id} />
```

---

## Badge de priorité

### PriorityBadge.jsx
```javascript
const PRIORITY_MAP = {
    1: { label: "Très basse", color: "#95a5a6" },
    2: { label: "Basse",      color: "#3498db" },
    3: { label: "Moyenne",    color: "#f39c12" },
    4: { label: "Haute",      color: "#e67e22" },
    5: { label: "Très haute", color: "#c0392b" },
};

export default function PriorityBadge({ priority }) {
    const p = PRIORITY_MAP[priority] ?? { label: "-", color: "#999" };

    return (
        <span className="priority-badge">
            <span className="priority-badge-bar" style={{ backgroundColor: p.color }}></span>
            <span className="priority-badge-text">{p.label}</span>
        </span>
    );
}
```

### PriorityBadge.css
```css
.priority-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 12px;
    color: #333;
    font-weight: 500;
}

.priority-badge-bar {
    width: 4px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
}
```

**Usage :**
```javascript
<PriorityBadge priority={ticket.priority} />
```

---

## Badge avec compteur

Pour afficher un nombre (notifications, tickets en attente, etc.).

### CountBadge.jsx
```javascript
export default function CountBadge({ count }) {
    if (!count || count <= 0) return null;

    return (
        <span className="count-badge">
            {count > 99 ? "99+" : count}
        </span>
    );
}
```

### CountBadge.css
```css
.count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: #c0392b;
    color: white;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
}
```

**Usage :**
```javascript
<button>
    Notifications <CountBadge count={5} />
</button>
```

---

## 🎯 Cas réel : badges dans une liste de tickets

> **La question :** « Comment j'utilise ces badges quand j'ai une vraie liste ? »
> **Réponse :** tu boucles sur tes tickets avec `.map()` et tu mets le badge **à l'intérieur** de chaque ligne. Le badge reçoit la valeur du ticket courant.

### TicketsListWithBadges.jsx
```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import TicketStatusBadge from "./TicketStatusBadge";
import PriorityBadge from "./PriorityBadge";
import "./TicketsListWithBadges.css";

export default function TicketsListWithBadges() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const load = async () => setTickets(await Ticket.getAll());
        load();
    }, []);

    return (
        <table className="tickets-table">
            <thead>
                <tr>
                    <th>Réf</th>
                    <th>Titre</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket) => (        // ← on boucle sur les tickets
                    <tr key={ticket.id}>
                        <td>#{ticket.external_id}</td>
                        <td>{ticket.name}</td>
                        <td>
                            {/* le badge reçoit le statut DE CE ticket */}
                            <TicketStatusBadge statusId={ticket.status?.id} />
                        </td>
                        <td>
                            <PriorityBadge priority={ticket.priority} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

### TicketsListWithBadges.css
```css
.tickets-table {
    width: 100%;
    border-collapse: collapse;
}

.tickets-table th {
    text-align: left;
    padding: 0.75rem 1rem;
    background-color: #000;
    color: white;
    font-size: 12px;
    text-transform: uppercase;
}

.tickets-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
}
```

> 💡 Le badge n'a **pas besoin de connaître la liste**. Il reçoit juste une valeur (`statusId`, `priority`) et affiche la bonne couleur. C'est la boucle `.map()` autour qui le répète pour chaque ticket.

---

## Résumé

| Composant | Quand l'utiliser |
|-----------|------------------|
| **Badge** | Étiquette simple noire |
| **ColorBadge** | Couleur dynamique via prop |
| **DotBadge** | Statut avec petit point (en ligne / hors ligne) |
| **TicketStatusBadge** | Statut de ticket GLPI (mapping id → couleur) |
| **PriorityBadge** | Priorité avec barre colorée |
| **CountBadge** | Compteur de notifications |

✅ **Astuce :** garde tes couleurs dans un seul objet `MAP` en haut du fichier — comme ça tu changes la couleur d'un statut à un seul endroit.
