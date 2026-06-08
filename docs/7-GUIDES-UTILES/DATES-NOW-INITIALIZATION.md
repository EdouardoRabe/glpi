# Guide Initialisation des Dates à "NOW"

Ce guide explique comment initialiser les champs de date/heure à la valeur actuelle (NOW) en utilisant les fonctions utilitaires réutilisables.

## Fonctions Utilitaires Disponibles

Toutes les fonctions sont dans `src/backend/utils/dateUtils.js`:

### getNowDate()
Retourne la date actuelle au format `YYYY-MM-DD` (pour `input type="date"`).

```javascript
import { getNowDate } from "../../backend/utils/dateUtils";

const dateStr = getNowDate();
// Retourne: "2026-06-08"
```

### getNowTime()
Retourne l'heure actuelle au format `HH:MM` (pour `input type="time"`).

```javascript
import { getNowTime } from "../../backend/utils/dateUtils";

const timeStr = getNowTime();
// Retourne: "14:35"
```

### getNowDateTime()
Retourne la date et heure actuelle au format `YYYY-MM-DDTHH:MM` (pour `input type="datetime-local"`).

```javascript
import { getNowDateTime } from "../../backend/utils/dateUtils";

const dateTimeStr = getNowDateTime();
// Retourne: "2026-06-08T14:35"
```

---

## Utilisation dans React

### Exemple 1: Date et Heure Séparées

```javascript
import { useState } from 'react';
import { getNowDate, getNowTime } from "../../backend/utils/dateUtils";

export default function TicketForm() {
    const [date, setDate] = useState(getNowDate());
    const [time, setTime] = useState(getNowTime());
    const [title, setTitle] = useState("");

    return (
        <div>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
            />
            <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
            />
            <button>Submit</button>
        </div>
    );
}
```

### Exemple 2: DateTime Combiné

```javascript
import { useState } from 'react';
import { getNowDateTime } from "../../backend/utils/dateUtils";

export default function ReportForm() {
    const [reportTime, setReportTime] = useState(getNowDateTime());
    const [description, setDescription] = useState("");

    return (
        <div>
            <input 
                type="datetime-local" 
                value={reportTime} 
                onChange={(e) => setReportTime(e.target.value)} 
            />
            <textarea 
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
            />
            <button>Submit</button>
        </div>
    );
}
```

### Exemple 3: Réinitialiser à NOW après soumission

```javascript
import { useState } from 'react';
import { getNowDate, getNowTime } from "../../backend/utils/dateUtils";

export default function LogForm() {
    const [date, setDate] = useState(getNowDate());
    const [time, setTime] = useState(getNowTime());
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        try {
            // Soumettre les données...
            console.log(`Log: ${date} ${time} - ${message}`);
            
            // Réinitialiser à NOW
            setDate(getNowDate());
            setTime(getNowTime());
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <input 
                type="text" 
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
```

---

## Cas Réels dans le Projet

### FOCreateTicket.jsx

```javascript
import { getNowDate, getNowTime } from "../../backend/utils/dateUtils";

export default function FOCreateTicket() {
    const [date, setDate] = useState(getNowDate());      // ← Date = aujourd'hui
    const [heure, setHeure] = useState(getNowTime());    // ← Heure = maintenant
    // ... autres states ...
}
```

Les tickets sont créés avec la date/heure actuelle par défaut! ✅

---

## Format Explicité

| Fonction | Format | Exemple | Input HTML |
|----------|--------|---------|-----------|
| `getNowDate()` | YYYY-MM-DD | 2026-06-08 | `type="date"` |
| `getNowTime()` | HH:MM | 14:35 | `type="time"` |
| `getNowDateTime()` | YYYY-MM-DDTHH:MM | 2026-06-08T14:35 | `type="datetime-local"` |

---

## Avantages de Cette Approche

✅ **Réutilisable** — Importez depuis `dateUtils.js` n'importe où  
✅ **Facile à maintenir** — Un seul endroit pour mettre à jour la logique  
✅ **Cohérent** — Même format partout dans l'app  
✅ **Performant** — Pas de re-calculs inutiles (appelé une seule fois au `useState`)  

---

Besoin d'adapter ça à un autre composant? Importez les fonctions et utilisez-les dans `useState`! 👍
