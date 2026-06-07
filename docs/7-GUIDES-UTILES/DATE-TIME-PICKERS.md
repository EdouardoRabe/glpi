# Guide Date & Time Pickers

Explique comment gérer les dates et heures en React, créer des date/time pickers, et valider les entrées de date.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Date input** | FOCreateTicket.jsx | Sélectionner date du ticket |
| **Time input** | FOCreateTicket.jsx | Heure du ticket (09:00 à 17:00) |
| **Validation date** | FOCreateTicket.jsx | Date pas dans le futur |
| **Format date** | BOTicketList.jsx | Afficher dates au format lisible (7 juin 2024) |
| **Date range** | Recherche (futur) | Filtrer tickets entre deux dates |

**Exemple adapté FOCreateTicket:** Tu as déjà `date` et `heure` inputs! Ajoute juste `toDateInputFormat()` et `fromDateString()` helper - utilise les utilitaires du guide, remplace variables et c'est fini!

## Table des matières

1. [Input date native](#input-date-native)
2. [Input time](#input-time)
3. [Date range](#date-range)
4. [Gestion des dates](#gestion-des-dates)
5. [Validation de dates](#validation-de-dates)
6. [Exemples complets](#exemples-complets)

---

## Input date native

### Date input simple

```javascript
import { useState } from "react"

export default function DateInput() {
  const [date, setDate] = useState("")

  const handleChange = (e) => {
    setDate(e.target.value)
  }

  return (
    <div>
      <label htmlFor="date">Date:</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={handleChange}
      />
      {date && <p>Vous avez choisi: {date}</p>}
    </div>
  )
}
```

### Format de date pour input

```javascript
// L'input type="date" accepte: YYYY-MM-DD

const date = new Date()
const formatted = date.toISOString().split("T")[0] // "2024-06-07"

// Au contraire, convertir string en Date
const dateString = "2024-06-07"
const dateObj = new Date(dateString) // Date object

// Afficher dans un format lisible
const display = new Date(dateString).toLocaleDateString("fr-FR")
// "7 juin 2024"
```

### Input date avec min/max

```javascript
const today = new Date().toISOString().split("T")[0]
const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0]

return (
  <input
    type="date"
    min={today}
    max={nextMonth}
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
)
```

### Disabler certains jours

```javascript
const [date, setDate] = useState("")

const isWeekend = (dateString) => {
  const day = new Date(dateString).getDay()
  return day === 0 || day === 6 // 0 = dimanche, 6 = samedi
}

return (
  <input
    type="date"
    value={date}
    onChange={(e) => {
      if (!isWeekend(e.target.value)) {
        setDate(e.target.value)
      }
    }}
  />
)
```

---

## Input time

### Time input simple

```javascript
const [time, setTime] = useState("09:00")

return (
  <div>
    <label htmlFor="time">Heure:</label>
    <input
      id="time"
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
    />
    {time && <p>Heure sélectionnée: {time}</p>}
  </div>
)
```

### Time input avec plages

```javascript
// Accepter uniquement les heures entre 9h et 17h

return (
  <input
    type="time"
    min="09:00"
    max="17:00"
    value={time}
    onChange={(e) => setTime(e.target.value)}
  />
)
```

### Datetime local (date + heure combinées)

```javascript
const [datetime, setDatetime] = useState("")

// L'input accepte: 2024-06-07T14:30

return (
  <input
    type="datetime-local"
    value={datetime}
    onChange={(e) => setDatetime(e.target.value)}
  />
)
```

---

## Date range

### Date range simple

```javascript
import { useState } from "react"

export default function DateRange() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleStartChange = (e) => {
    setStartDate(e.target.value)
  }

  const handleEndChange = (e) => {
    // S'assurer que endDate >= startDate
    if (e.target.value >= startDate || !startDate) {
      setEndDate(e.target.value)
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="start">Début:</label>
        <input
          id="start"
          type="date"
          value={startDate}
          onChange={handleStartChange}
        />
      </div>

      <div>
        <label htmlFor="end">Fin:</label>
        <input
          id="end"
          type="date"
          value={endDate}
          onChange={handleEndChange}
          min={startDate} // Ne peut pas être avant startDate
        />
      </div>

      {startDate && endDate && (
        <p>Durée: {calculateDays(startDate, endDate)} jours</p>
      )}
    </div>
  )
}

const calculateDays = (start, end) => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
```

---

## Gestion des dates

### Utilitaires de date

```javascript
// Formater une date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
// formatDate("2024-06-07") → "7 juin 2024"

// Formater pour input
const toDateInputFormat = (date) => {
  return new Date(date).toISOString().split("T")[0]
}
// toDateInputFormat(new Date()) → "2024-06-07"

// Ajouter des jours
const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Obtenir la différence en jours
const daysDifference = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Vérifier si weekend
const isWeekend = (date) => {
  const day = new Date(date).getDay()
  return day === 0 || day === 6
}

// Obtenir le premier jour du mois
const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Obtenir le dernier jour du mois
const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
```

### Formater date et heure pour API

```javascript
// Format ISO pour API
const toISO = (date) => new Date(date).toISOString()
// "2024-06-07T12:34:56.789Z"

// Format Unix timestamp
const toUnix = (date) => Math.floor(new Date(date).getTime() / 1000)
// 1717767296

// Convertir depuis Unix
const fromUnix = (timestamp) => new Date(timestamp * 1000)

// Format personnalisé
const toCustomFormat = (date, format = "DD/MM/YYYY") => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()

  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year)
}
// toCustomFormat("2024-06-07") → "07/06/2024"
```

---

## Validation de dates

### Valider une date

```javascript
const isValidDate = (dateString) => {
  const d = new Date(dateString)
  return d instanceof Date && !isNaN(d)
}

// Valider que date est dans le futur
const isFutureDate = (dateString) => {
  return new Date(dateString) > new Date()
}

// Valider que date est dans le passé
const isPastDate = (dateString) => {
  return new Date(dateString) < new Date()
}

// Valider que date est aujourd'hui
const isToday = (dateString) => {
  const today = new Date().toISOString().split("T")[0]
  return dateString === today
}

// Valider l'âge
const isAtLeast = (dateString, years) => {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age >= years
}
// isAtLeast("2000-06-07", 18) → true
```

### Validation dans formulaire

```javascript
const [birthDate, setBirthDate] = useState("")
const [error, setError] = useState("")

const handleChange = (e) => {
  const date = e.target.value
  setBirthDate(date)
  setError("")

  // Validation 1: Date valide
  if (!isValidDate(date)) {
    setError("Date invalide")
    return
  }

  // Validation 2: Pas dans le futur
  if (isFutureDate(date)) {
    setError("La date ne peut pas être dans le futur")
    return
  }

  // Validation 3: Âge minimum
  if (!isAtLeast(date, 18)) {
    setError("Vous devez être majeur")
    return
  }
}
```

---

## Exemples complets

### Formulaire de réservation avec dates

```javascript
import { useState } from "react"

export default function ReservationForm() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = Math.abs(d2 - d1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculatePrice = () => {
    const nightsCount = calculateNights()
    return nightsCount * 100 * guests // 100€ par nuit par personne
  }

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value
    if (newCheckOut > checkIn || !checkIn) {
      setCheckOut(newCheckOut)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!checkIn || !checkOut) {
      setError("Veuillez sélectionner les dates")
      return
    }

    if (calculateNights() < 1) {
      setError("La durée doit être d'au moins 1 nuit")
      return
    }

    console.log("Réservation:", {
      checkIn,
      checkOut,
      nights: calculateNights(),
      guests,
      price: calculatePrice(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="check-in">Arrivée:</label>
        <input
          id="check-in"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={today}
        />
      </div>

      <div>
        <label htmlFor="check-out">Départ:</label>
        <input
          id="check-out"
          type="date"
          value={checkOut}
          onChange={handleCheckOutChange}
          min={checkIn || today}
        />
      </div>

      <div>
        <label htmlFor="guests">Nombres de clients:</label>
        <input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      {checkIn && checkOut && (
        <div className="summary">
          <p>Durée: {calculateNights()} nuit(s)</p>
          <p>Prix: {calculatePrice()}€</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button type="submit">Réserver</button>
    </form>
  )
}
```

### Date picker personnalisé

```javascript
import { useState } from "react"

export default function DatePicker({ label, value, onChange, min, max }) {
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState(new Date(value || Date.now()))

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDayClick = (day) => {
    const selected = new Date(month.getFullYear(), month.getMonth(), day)
    const formatted = selected.toISOString().split("T")[0]
    onChange(formatted)
    setIsOpen(false)
  }

  const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: getFirstDayOfMonth(month) })

  return (
    <div className="date-picker">
      <label>{label}</label>
      <input
        type="text"
        readOnly
        value={value ? new Date(value).toLocaleDateString("fr-FR") : ""}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Cliquez pour sélectionner"
      />

      {isOpen && (
        <div className="calendar">
          <div className="calendar-header">
            <button
              type="button"
              onClick={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1)
                )
              }
            >
              ←
            </button>
            <span>
              {month.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
              }
            >
              →
            </button>
          </div>

          <div className="calendar-grid">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}

            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                className="calendar-day"
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### CSS pour date picker

```css
.date-picker {
  position: relative;
  width: 200px;
}

.date-picker input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #999;
  border-radius: 4px;
  cursor: pointer;
}

.calendar {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day-name {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #666;
}

.calendar-day {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-day:hover {
  background-color: #f0f0f0;
}

.summary {
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #999;
  border-radius: 4px;
  margin: 1rem 0;
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Utiliser input type="date" quand possible (support natif)
- Valider les dates au blur/submit
- Empêcher les dates invalides (min/max)
- Afficher les erreurs clairement
- Formatter les dates pour l'affichage

❌ **À éviter:**
- Accepter les dates sans validation
- Inputs type="text" au lieu de type="date"
- Format ambigu pour les dates (préférer YYYY-MM-DD)
- Pas de limites (min/max)

---

Besoin d'aide pour adapter à ton projet? 👍
