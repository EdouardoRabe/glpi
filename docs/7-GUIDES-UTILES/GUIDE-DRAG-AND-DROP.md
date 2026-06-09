# 🖱️ GUIDE - Drag & Drop en React (HTML natif)

> Guide complet pour apprendre le drag and drop sans librairie externe.
> Du concept de base jusqu'à un Kanban complet avec tickets.

---

## Table des matières

1. [Les événements drag & drop](#1-les-événements-drag--drop)
2. [Exemple minimal — déplacer une div](#2-exemple-minimal--déplacer-une-div)
3. [Transférer des données entre éléments](#3-transférer-des-données-entre-éléments)
4. [Drag entre deux listes](#4-drag-entre-deux-listes)
5. [Kanban complet — tickets GLPI](#5-kanban-complet--tickets-glpi)
6. [Feedback visuel](#6-feedback-visuel)
7. [Pièges courants](#7-pièges-courants)

---

## 1. Les événements drag & drop

Voici **tous** les événements disponibles — du plus important au moins :

### Sur l'élément qu'on DÉPLACE (`draggable`)

| Événement | Quand ? | Utilisation typique |
|-----------|---------|---------------------|
| `onDragStart` | Au début du drag | Sauvegarder ce qu'on déplace |
| `onDrag` | Pendant le déplacement | Rarement utilisé |
| `onDragEnd` | Quand on relâche | Nettoyer l'état |

### Sur la ZONE où on dépose (`drop zone`)

| Événement | Quand ? | Utilisation typique |
|-----------|---------|---------------------|
| `onDragOver` | Survol de la zone | **Obligatoire** — `e.preventDefault()` |
| `onDragEnter` | Entrée dans la zone | Highlight visuel |
| `onDragLeave` | Sortie de la zone | Retirer le highlight |
| `onDrop` | Relâchement dans la zone | Mettre à jour les données |

### Résumé du flow

```
Utilisateur clique et glisse →  onDragStart  (qu'est-ce qu'on déplace ?)
Survol d'une zone           →  onDragEnter  (highlight la zone)
                               onDragOver   (OBLIGATOIRE preventDefault)
Sort de la zone             →  onDragLeave  (retirer highlight)
Relâche dans la zone        →  onDrop       (faire l'action)
Fin du drag                 →  onDragEnd    (nettoyer)
```

---

## 2. Exemple minimal — déplacer une div

```jsx
import { useState } from "react";

export default function DragMinimal() {
    const [position, setPosition] = useState("gauche");

    return (
        <div style={{ display: "flex", gap: 40 }}>

            {/* Zone gauche */}
            <div
                style={{ width: 200, height: 200, background: "#161616", border: "1px solid #2a2a2a", padding: 16 }}
                onDragOver={(e) => e.preventDefault()}   // ← OBLIGATOIRE sinon onDrop ne se déclenche pas
                onDrop={() => setPosition("gauche")}
            >
                <p style={{ color: "#5c5652", fontSize: 12 }}>Zone gauche</p>

                {position === "gauche" && (
                    <div
                        draggable                              // ← rend l'élément draggable
                        onDragStart={() => console.log("drag commencé")}
                        style={{ background: "#c0392b", padding: 12, cursor: "grab", borderRadius: 4 }}
                    >
                        Glisse-moi !
                    </div>
                )}
            </div>

            {/* Zone droite */}
            <div
                style={{ width: 200, height: 200, background: "#161616", border: "1px solid #2a2a2a", padding: 16 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => setPosition("droite")}
            >
                <p style={{ color: "#5c5652", fontSize: 12 }}>Zone droite</p>

                {position === "droite" && (
                    <div
                        draggable
                        onDragStart={() => console.log("drag commencé")}
                        style={{ background: "#c0392b", padding: 12, cursor: "grab", borderRadius: 4 }}
                    >
                        Glisse-moi !
                    </div>
                )}
            </div>

        </div>
    );
}
```

### Points clés
- `draggable` sur l'élément à déplacer — **sans ça, rien ne fonctionne**
- `onDragOver` avec `e.preventDefault()` sur la zone de drop — **sans ça, `onDrop` ne se déclenche jamais**
- `onDrop` met à jour le state — React re-render et l'élément apparaît dans la bonne zone

---

## 3. Transférer des données entre éléments

Le problème : quand on a plusieurs éléments draggables, comment savoir **lequel** on est en train de déplacer dans `onDrop` ?

### Solution 1 — State React (recommandé)

```jsx
import { useState } from "react";

export default function DragAvecId() {
    const [draggedId, setDraggedId] = useState(null);  // ← stocker l'ID en cours de drag
    const [items, setItems] = useState({
        gauche: [{ id: 1, name: "Item A" }, { id: 2, name: "Item B" }],
        droite: [],
    });

    const handleDragStart = (id) => {
        setDraggedId(id);  // ← on sauvegarde QUI on déplace
    };

    const handleDrop = (zone) => {
        if (draggedId === null) return;

        // Trouver dans quelle zone est l'item actuellement
        const fromZone = Object.keys(items).find(z =>
            items[z].some(item => item.id === draggedId)
        );

        if (fromZone === zone) return; // Déposé dans la même zone → rien faire

        const item = items[fromZone].find(i => i.id === draggedId);

        setItems(prev => ({
            ...prev,
            [fromZone]: prev[fromZone].filter(i => i.id !== draggedId),  // retirer de l'ancienne zone
            [zone]:     [...prev[zone], item],                            // ajouter dans la nouvelle
        }));

        setDraggedId(null);  // ← nettoyer
    };

    return (
        <div style={{ display: "flex", gap: 24 }}>
            {["gauche", "droite"].map(zone => (
                <div
                    key={zone}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(zone)}
                    style={{ width: 200, minHeight: 200, background: "#161616", border: "1px solid #2a2a2a", padding: 12 }}
                >
                    <p style={{ color: "#5c5652", fontSize: 11, marginBottom: 8 }}>{zone}</p>
                    {items[zone].map(item => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item.id)}
                            style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", padding: 10, marginBottom: 6, cursor: "grab", borderRadius: 4 }}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
```

### Solution 2 — dataTransfer (API native)

```jsx
// Alternative : utiliser dataTransfer pour passer des données
onDragStart={(e) => {
    e.dataTransfer.setData("id", String(item.id));  // stocker dans l'événement
}}

onDrop={(e) => {
    const id = Number(e.dataTransfer.getData("id")); // récupérer depuis l'événement
    // utiliser id...
}}
```

> La Solution 1 (state React) est plus simple et plus fiable — préférez-la.

---

## 4. Drag entre deux listes

```jsx
import { useState } from "react";

const INITIAL = {
    todo:  ["Configurer réseau", "Installer logiciel", "Vérifier backup"],
    done:  ["Changer mot de passe"],
};

export default function DeuxListes() {
    const [lists, setLists]     = useState(INITIAL);
    const [dragged, setDragged] = useState(null);  // { item: string, from: string }
    const [overZone, setOverZone] = useState(null); // pour le highlight

    const handleDragStart = (item, from) => {
        setDragged({ item, from });
    };

    const handleDragEnd = () => {
        setDragged(null);
        setOverZone(null);
    };

    const handleDragEnter = (zone) => {
        setOverZone(zone);  // ← pour le highlight visuel
    };

    const handleDragLeave = () => {
        setOverZone(null);
    };

    const handleDrop = (toZone) => {
        if (!dragged || dragged.from === toZone) return;

        setLists(prev => ({
            ...prev,
            [dragged.from]: prev[dragged.from].filter(i => i !== dragged.item),
            [toZone]:       [...prev[toZone], dragged.item],
        }));

        setDragged(null);
        setOverZone(null);
    };

    return (
        <div style={{ display: "flex", gap: 24 }}>
            {Object.entries(lists).map(([zone, items]) => (
                <div
                    key={zone}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => handleDragEnter(zone)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(zone)}
                    style={{
                        width: 220,
                        minHeight: 200,
                        padding: 12,
                        borderRadius: 6,
                        background: overZone === zone ? "#1e1e1e" : "#161616",  // ← highlight
                        border: overZone === zone
                            ? "1px solid #a8a29e"   // ← bordure active
                            : "1px solid #2a2a2a",
                        transition: "all 150ms ease",
                    }}
                >
                    <p style={{ color: "#5c5652", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {zone} ({items.length})
                    </p>
                    {items.map(item => (
                        <div
                            key={item}
                            draggable
                            onDragStart={() => handleDragStart(item, zone)}
                            onDragEnd={handleDragEnd}
                            style={{
                                padding: "10px 12px",
                                marginBottom: 6,
                                background: dragged?.item === item ? "#0a0a0a" : "#111111",
                                border: "1px solid #2a2a2a",
                                borderRadius: 4,
                                cursor: "grab",
                                fontSize: 13,
                                color: dragged?.item === item ? "#5c5652" : "#f5f0eb",
                                opacity: dragged?.item === item ? 0.5 : 1,  // ← fade l'élément draggé
                                transition: "all 150ms ease",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
```

---

## 5. Kanban complet — tickets GLPI

Exemple complet avec les vrais statuts GLPI, drag entre colonnes, compteurs, et feedback visuel.

```jsx
import { useState } from "react";

// ── Données ──────────────────────────────────────────────────────────────────

const COLUMNS = [
    { id: 1, label: "Nouveau",          color: "#2980b9" },
    { id: 2, label: "En cours",         color: "#f39c12" },
    { id: 4, label: "En attente",       color: "#8e44ad" },
    { id: 5, label: "Résolu",           color: "#27ae60" },
    { id: 6, label: "Clos",             color: "#5c5652" },
];

const PRIORITY_COLORS = {
    1: "#5c5652",  // Very Low
    2: "#a8a29e",  // Low
    3: "#f39c12",  // Medium
    4: "#c0392b",  // High
    5: "#922b21",  // Very High
};

const PRIORITY_LABELS = {
    1: "Très basse", 2: "Basse", 3: "Moyenne", 4: "Haute", 5: "Très haute",
};

// Données de test — en vrai, vient de Ticket.getAllComplete()
const INITIAL_TICKETS = [
    { id: 1,  name: "PC-ADM-001 ne démarre pas",    status: 1, priority: 4, type: 1 },
    { id: 2,  name: "Imprimante hors ligne",         status: 1, priority: 2, type: 1 },
    { id: 3,  name: "Installation logiciel compta",  status: 2, priority: 3, type: 2 },
    { id: 4,  name: "Accès réseau lent",             status: 2, priority: 3, type: 1 },
    { id: 5,  name: "Sauvegarde échouée",            status: 4, priority: 5, type: 1 },
    { id: 6,  name: "Mise à jour antivirus",         status: 5, priority: 1, type: 2 },
    { id: 7,  name: "Écran noir PC-LAB-002",         status: 1, priority: 4, type: 1 },
];

// ── Composant carte ticket ────────────────────────────────────────────────────

function TicketCard({ ticket, isDragging, onDragStart, onDragEnd }) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(ticket)}
            onDragEnd={onDragEnd}
            style={{
                padding: "10px 12px",
                marginBottom: 6,
                background: isDragging ? "#0a0a0a" : "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 4,
                cursor: "grab",
                opacity: isDragging ? 0.4 : 1,
                transition: "opacity 150ms ease",
                userSelect: "none",  // ← évite la sélection de texte pendant le drag
            }}
        >
            {/* ID + type */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#c0392b", fontWeight: 600 }}>
                    #{ticket.id}
                </span>
                <span style={{ fontSize: 10, color: "#5c5652", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {ticket.type === 1 ? "Incident" : "Demande"}
                </span>
            </div>

            {/* Titre */}
            <p style={{ fontSize: 12, color: "#f5f0eb", lineHeight: 1.4, marginBottom: 8 }}>
                {ticket.name}
            </p>

            {/* Priorité */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: PRIORITY_COLORS[ticket.priority] ?? "#5c5652",
                    flexShrink: 0,
                }} />
                <span style={{ fontSize: 10, color: "#a8a29e" }}>
                    {PRIORITY_LABELS[ticket.priority]}
                </span>
            </div>
        </div>
    );
}

// ── Composant colonne ─────────────────────────────────────────────────────────

function KanbanColumn({ column, tickets, draggedTicket, onDragStart, onDragEnd, onDrop }) {
    const [isOver, setIsOver] = useState(false);

    const isDropTarget = isOver && draggedTicket && draggedTicket.status !== column.id;

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: 220, minWidth: 220 }}
            onDragOver={(e) => e.preventDefault()}   // ← OBLIGATOIRE
            onDragEnter={() => setIsOver(true)}
            onDragLeave={() => setIsOver(false)}
            onDrop={() => {
                setIsOver(false);
                onDrop(column.id);
            }}
        >
            {/* Header colonne */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                marginBottom: 8,
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: 4,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: column.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#f5f0eb", letterSpacing: "0.04em" }}>
                        {column.label}
                    </span>
                </div>
                <span style={{
                    fontSize: 11, fontWeight: 600, color: column.color,
                    background: `${column.color}22`,
                    padding: "1px 7px", borderRadius: 10,
                }}>
                    {tickets.length}
                </span>
            </div>

            {/* Corps de la colonne */}
            <div style={{
                flex: 1,
                minHeight: 120,
                padding: 8,
                background: isDropTarget ? "#1a1a1a" : "#0f0f0f",
                border: isDropTarget
                    ? `1px dashed ${column.color}`
                    : "1px solid #1a1a1a",
                borderRadius: 6,
                transition: "all 150ms ease",
            }}>
                {/* Message drop */}
                {isDropTarget && (
                    <div style={{
                        textAlign: "center",
                        padding: "12px 0",
                        fontSize: 11,
                        color: column.color,
                        letterSpacing: "0.06em",
                        marginBottom: 8,
                    }}>
                        ↓ Déposer ici
                    </div>
                )}

                {/* Cartes */}
                {tickets.map(ticket => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        isDragging={draggedTicket?.id === ticket.id}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    />
                ))}

                {/* Colonne vide */}
                {tickets.length === 0 && !isDropTarget && (
                    <div style={{ textAlign: "center", padding: "20px 0", fontSize: 11, color: "#2a2a2a" }}>
                        Aucun ticket
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Kanban principal ──────────────────────────────────────────────────────────

export default function KanbanTickets() {
    const [tickets, setTickets]             = useState(INITIAL_TICKETS);
    const [draggedTicket, setDraggedTicket] = useState(null);

    // Grouper les tickets par statut
    const ticketsByStatus = COLUMNS.reduce((acc, col) => {
        acc[col.id] = tickets.filter(t => t.status === col.id);
        return acc;
    }, {});

    const handleDragStart = (ticket) => {
        setDraggedTicket(ticket);   // ← sauvegarder le ticket en cours de drag
    };

    const handleDragEnd = () => {
        setDraggedTicket(null);     // ← toujours nettoyer à la fin
    };

    const handleDrop = (newStatus) => {
        if (!draggedTicket) return;
        if (draggedTicket.status === newStatus) return;  // même colonne → rien faire

        // Mettre à jour le statut du ticket
        setTickets(prev =>
            prev.map(t =>
                t.id === draggedTicket.id
                    ? { ...t, status: newStatus }   // ← changer le statut
                    : t
            )
        );

        // En vrai, appeler l'API ici :
        // await ticket.update({ status: newStatus });

        setDraggedTicket(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: "1.25rem", color: "#f5f0eb", marginBottom: 4 }}>Kanban Tickets</h1>
                <p style={{ fontSize: 12, color: "#5c5652" }}>
                    {tickets.length} tickets — glisser pour changer le statut
                </p>
            </div>

            {/* Board */}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16 }}>
                {COLUMNS.map(column => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        tickets={ticketsByStatus[column.id] ?? []}
                        draggedTicket={draggedTicket}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
}
```

---

## 6. Feedback visuel

### Ce que tu dois toujours faire

```jsx
// 1. Opacité sur l'élément draggé
opacity: isDragging ? 0.4 : 1,

// 2. Curseur
cursor: "grab",          // au repos
cursor: "grabbing",      // pendant le drag (via CSS)

// 3. Highlight de la zone de drop
background: isOver ? "#1a1a1a" : "#0f0f0f",
border: isOver ? "1px dashed #a8a29e" : "1px solid #2a2a2a",

// 4. userSelect pour éviter la sélection de texte
userSelect: "none",
```

### CSS pour le curseur grabbing

```css
[draggable]:active {
    cursor: grabbing;
}
```

---

## 7. Pièges courants

### ❌ Oublier `e.preventDefault()` dans `onDragOver`

```jsx
// ❌ onDrop ne se déclenche JAMAIS sans ça
<div onDrop={handleDrop}>

// ✅ Toujours ajouter onDragOver avec preventDefault
<div
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDrop}
>
```

---

### ❌ Oublier `draggable` sur l'élément

```jsx
// ❌ L'élément n'est pas draggable
<div onDragStart={handleDragStart}>

// ✅
<div draggable onDragStart={handleDragStart}>
```

---

### ❌ Ne pas nettoyer l'état dans `onDragEnd`

```jsx
// ❌ Si le drag est annulé (Echap), onDrop n'est pas appelé
// → draggedTicket reste défini → bugs visuels

// ✅ Toujours nettoyer dans onDragEnd
const handleDragEnd = () => {
    setDraggedTicket(null);
    setOverZone(null);
};
```

---

### ❌ `onDragLeave` se déclenche sur les enfants

```jsx
// Problème : onDragLeave se déclenche quand on survole un enfant de la zone
// → le highlight clignote

// ✅ Fix : utiliser onDragEnter avec un compteur ou pointer-events
const [enterCount, setEnterCount] = useState(0);

onDragEnter={() => setEnterCount(c => c + 1)}
onDragLeave={() => setEnterCount(c => c - 1)}
// isOver = enterCount > 0
```

---

### ❌ Muter le state directement

```jsx
// ❌
tickets[index].status = newStatus;
setTickets(tickets);

// ✅ Créer un nouveau tableau
setTickets(prev => prev.map(t =>
    t.id === id ? { ...t, status: newStatus } : t
));
```

---

## Récapitulatif des événements

```jsx
// Sur l'élément DRAGGABLE
<div
    draggable
    onDragStart={(e) => { /* sauvegarder ce qu'on déplace */ }}
    onDragEnd={() => { /* nettoyer */ }}
>

// Sur la ZONE DE DROP
<div
    onDragOver={(e) => e.preventDefault()}   // ← TOUJOURS
    onDragEnter={() => { /* highlight ON */ }}
    onDragLeave={() => { /* highlight OFF */ }}
    onDrop={(e) => { /* faire l'action */ }}
>
```

---

## Intégration avec l'API GLPI

```jsx
const handleDrop = async (newStatus) => {
    if (!draggedTicket || draggedTicket.status === newStatus) return;

    // 1. Mise à jour optimiste — UI immédiate
    setTickets(prev =>
        prev.map(t => t.id === draggedTicket.id ? { ...t, status: newStatus } : t)
    );

    // 2. Appel API en arrière-plan
    try {
        const ticket = new Ticket({ id: draggedTicket.id });
        await ticket.update({ status: newStatus });
    } catch (err) {
        // 3. Rollback si erreur
        console.error("Erreur mise à jour statut :", err);
        setTickets(prev =>
            prev.map(t => t.id === draggedTicket.id ? { ...t, status: draggedTicket.status } : t)
        );
    }

    setDraggedTicket(null);
};
```

> **Mise à jour optimiste** = mettre à jour l'UI immédiatement sans attendre l'API, puis rollback si ça échoue. Donne une sensation de rapidité.
