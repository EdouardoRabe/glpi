# Guide Chargement (Squelette) et Écran Vide

> 🔎 **Mots-clés de recherche :** skeleton, squelette, loading, chargement, placeholder, shimmer, empty state, écran vide, aucune donnée, no data, liste vide, spinner, état de chargement

Quoi afficher **pendant** qu'on charge des données (squelette animé) et **quand il n'y a rien** à afficher (écran vide). Copie le JSX **et** le CSS ensemble.

## Table des matières

1. [Squelette de chargement (skeleton)](#squelette-de-chargement-skeleton)
2. [Squelette de carte](#squelette-de-carte)
3. [Squelette de tableau](#squelette-de-tableau)
4. [Écran vide (aucune donnée)](#écran-vide-aucune-donnée)
5. [Tout combiner : loading → vide → données](#tout-combiner--loading--vide--données)

---

## Squelette de chargement (skeleton)

Un squelette = une **forme grise animée** qui imite le contenu pendant le chargement. Plus agréable qu'un simple "Chargement...".

### Skeleton.jsx
```javascript
export default function Skeleton({ width = "100%", height = "16px" }) {
    return <div className="skeleton" style={{ width, height }}></div>;
}
```

### Skeleton.css
```css
.skeleton {
    background: linear-gradient(
        90deg,
        #e0e0e0 25%,
        #f0f0f0 50%,
        #e0e0e0 75%
    );
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

**Usage :**
```javascript
<Skeleton width="60%" height="20px" />
<Skeleton width="100%" height="14px" />
```

---

## Squelette de carte

Imite une carte complète pendant le chargement.

### SkeletonCard.jsx
```javascript
export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-line"></div>
            <div className="skeleton skeleton-line"></div>
            <div className="skeleton skeleton-line short"></div>
        </div>
    );
}
```

### SkeletonCard.css
```css
.skeleton {
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
}

.skeleton-title {
    height: 20px;
    width: 60%;
    margin-bottom: 1rem;
}

.skeleton-line {
    height: 14px;
    width: 100%;
    margin-bottom: 0.6rem;
}

.skeleton-line.short {
    width: 40%;
}
```

**Usage (afficher 3 squelettes) :**
```javascript
{loading && (
    <div className="card-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </div>
)}
```

---

## Squelette de tableau

### SkeletonTable.jsx
```javascript
export default function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <table className="skeleton-table">
            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <td key={colIndex}>
                                <div className="skeleton skeleton-cell"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

### SkeletonTable.css
```css
.skeleton {
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-table {
    width: 100%;
    border-collapse: collapse;
}

.skeleton-table td {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
}

.skeleton-cell {
    height: 14px;
    width: 100%;
}
```

**Usage :**
```javascript
{loading && <SkeletonTable rows={6} cols={5} />}
```

---

## Écran vide (aucune donnée)

À afficher quand la liste est vide (après chargement). Bien plus clair qu'une page blanche.

### EmptyState.jsx
```javascript
export default function EmptyState({ icon = "📭", title, message, actionLabel, onAction }) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">{icon}</div>
            <h3 className="empty-state-title">{title}</h3>
            {message && <p className="empty-state-message">{message}</p>}
            {actionLabel && (
                <button className="empty-state-button" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
```

### EmptyState.css
```css
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
    background-color: #f9f9f9;
    border: 2px dashed #ddd;
    border-radius: 8px;
}

.empty-state-icon {
    font-size: 48px;
    margin-bottom: 1rem;
}

.empty-state-title {
    margin: 0 0 0.5rem 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.empty-state-message {
    margin: 0 0 1.5rem 0;
    font-size: 14px;
    color: #999;
    max-width: 400px;
}

.empty-state-button {
    padding: 0.75rem 1.5rem;
    background-color: #000;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;
}

.empty-state-button:hover {
    background-color: #333;
}
```

**Usage :**
```javascript
<EmptyState
    icon="🎫"
    title="Aucun ticket"
    message="Tu n'as pas encore créé de ticket. Commence dès maintenant !"
    actionLabel="Créer un ticket"
    onAction={() => navigate("/create-ticket")}
/>
```

---

## Tout combiner : loading → vide → données

Le pattern complet à utiliser dans **toutes** tes listes : on affiche le squelette pendant le chargement, l'écran vide si rien, sinon les données.

### TicketsList.jsx
```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";
import "./TicketsList.css";

export default function TicketsList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await Ticket.getAll();
                setTickets(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // 1. Chargement → squelettes
    if (loading) {
        return (
            <div className="card-grid">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    // 2. Vide → écran vide
    if (tickets.length === 0) {
        return (
            <EmptyState
                icon="🎫"
                title="Aucun ticket"
                message="Aucun ticket à afficher pour le moment."
            />
        );
    }

    // 3. Données → liste
    return (
        <div className="card-grid">
            {tickets.map((ticket) => (
                <div key={ticket.id} className="grid-card">
                    <h4>#{ticket.external_id}</h4>
                    <p>{ticket.name}</p>
                </div>
            ))}
        </div>
    );
}
```

> 💡 L'ordre est important : **loading d'abord**, **vide ensuite**, **données en dernier**. Sinon tu risques d'afficher "Aucun ticket" pendant le chargement.

---

## Résumé

| Composant | Quand l'afficher |
|-----------|------------------|
| **Skeleton** | Brique de base (forme grise animée) |
| **SkeletonCard** | Pendant le chargement d'une grille de cartes |
| **SkeletonTable** | Pendant le chargement d'un tableau |
| **EmptyState** | Quand la liste est vide après chargement |

✅ **Règle d'or :** teste toujours tes 3 états → en chargement, vide, et avec données. Une liste qui ne gère que le cas "avec données" semble cassée quand elle charge ou quand elle est vide.
