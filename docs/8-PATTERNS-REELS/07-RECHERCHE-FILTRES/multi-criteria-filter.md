# 🔍 PATTERN - Recherche Multi-Critères

> Filtrer avec plusieurs critères simultanés (AND, OR, NOT)

---

## 🎯 Problème

Besoin de filtrer avec **plusieurs conditions** :
- Tickets avec status = "EN_COURS" **ET** urgency = "HAUTE" **ET** assigned_to = 5
- Users avec department = "IT" **OU** role = "admin"
- Computers sauf ceux assignés (NOT assigned)

---

## 📋 Types de Filtrage

### 1️⃣ **Côté Client** (JavaScript pur)
- ✅ Rapide pour petits datasets
- ❌ Charge tout en mémoire
- Utilise : `.filter()`, `.every()`, `.some()`

### 2️⃣ **Côté Serveur** (API GLPI - RSQL)
- ✅ Performant pour gros datasets
- ✅ Charge seulement résultats filtrés
- Utilise : Syntaxe RSQL (`==`, `!=`, `=in=`, `=out=`, etc.)

---

## 🔵 FILTRAGE CÔTÉ CLIENT

### Pattern Simple - Critères Multiples (ET logique)

```javascript
const data = [
  { id: 1, status: 'OPEN', urgency: 'HIGH', assigned: 5 },
  { id: 2, status: 'OPEN', urgency: 'LOW', assigned: 3 },
  { id: 3, status: 'CLOSED', urgency: 'HIGH', assigned: 5 },
  { id: 4, status: 'OPEN', urgency: 'HIGH', assigned: 7 },
]

// Filtrer: status == OPEN ET urgency == HIGH
const filters = {
  status:   'OPEN',
  urgency:  'HIGH',
  assigned: 5,
}

const filtered = data.filter(item =>
  Object.entries(filters).every(([key, value]) =>
    item[key] === value
  )
)

// Résultat: [{ id: 1, ... }]
```

### Pattern Avancé - Stockage et Application

```javascript
// État des filtres
const [filters, setFilters] = useState({
  status:   '',      // vide = pas de filtre
  urgency:  '',
  assigned: null,
})

// Appliquer les filtres
const filtered = data.filter(item => {
  // Vérifier chaque critère actif
  if (filters.status && item.status !== filters.status) return false
  if (filters.urgency && item.urgency !== filters.urgency) return false
  if (filters.assigned && item.assigned !== filters.assigned) return false
  return true
})

// Mettre à jour un filtre
const handleFilterChange = (key, value) => {
  setFilters(prev => ({
    ...prev,
    [key]: value === '' ? '' : value,  // vide = reset
  }))
}
```

### Pattern Réutilisable - Hook Custom

```javascript
// hooks/useMultiFilter.js
import { useState } from 'react'

export const useMultiFilter = (data, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters)

  const filtered = data.filter(item => {
    // Pour chaque filtre actif, vérifier la condition
    return Object.entries(filters).every(([key, value]) => {
      // Si le filtre est vide, ignorer
      if (value === '' || value === null || value === undefined) return true
      
      // Si c'est un array (multiple), utiliser .includes()
      if (Array.isArray(value)) {
        return value.includes(item[key])
      }
      
      // Sinon, comparaison simple
      return item[key] === value
    })
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  const resetOne = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: initialFilters[key] ?? '',
    }))
  }

  return {
    filters,
    filtered,
    updateFilter,
    resetFilters,
    resetOne,
  }
}
```

### Utilisation du Hook

```jsx
import { useMultiFilter } from './hooks/useMultiFilter'

export default function TicketList() {
  const { filters, filtered, updateFilter, resetFilters } = useMultiFilter(tickets, {
    status: '',
    urgency: '',
    assigned: null,
  })

  return (
    <div>
      {/* Filtres */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">— Tous les status —</option>
          <option value="OPEN">Ouvert</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="CLOSED">Fermé</option>
        </select>

        <select
          value={filters.urgency}
          onChange={(e) => updateFilter('urgency', e.target.value)}
        >
          <option value="">— Toutes les urgences —</option>
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
        </select>

        <button onClick={resetFilters}>Réinitialiser</button>
      </div>

      {/* Résultats */}
      <ul>
        {filtered.map(ticket => (
          <li key={ticket.id}>{ticket.name} - {ticket.status}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🟢 FILTRAGE CÔTÉ SERVEUR (RSQL - API GLPI)

### Syntaxe RSQL

| Opérateur | Signification | Exemple |
|-----------|---------------|---------|
| `==` | Égal | `status=="OPEN"` |
| `!=` | Différent | `status!="CLOSED"` |
| `=in=` | Dans une liste | `status=in=("OPEN","IN_PROGRESS")` |
| `=out=` | Pas dans une liste | `status=out=("CLOSED","ARCHIVED")` |
| `>`, `<`, `>=`, `<=` | Comparaison numérique | `urgency>=3` |
| `;` | **ET logique** | `status=="OPEN";urgency=="HIGH"` |
| `,` | **OU logique** | `status=="OPEN",status=="CLOSED"` |

### Un Seul Critère

```javascript
// Tickets ouverts
const filter = 'status=="OPEN"'
const tickets = await new Ticket().getAll({ filter })
```

### Plusieurs Critères (AND - tous)

```javascript
// Tickets ouverts ET urgence haute
const filter = 'status=="OPEN";urgency=="HIGH"'
const tickets = await new Ticket().getAll({ filter })

// 3 critères
const filter = 'status=="OPEN";urgency=="HIGH";assigned==5'
const tickets = await new Ticket().getAll({ filter })
```

### Plusieurs Valeurs pour un Critère (IN)

```javascript
// Status = OPEN ou IN_PROGRESS
const filter = 'status=in=("OPEN","IN_PROGRESS")'
const tickets = await new Ticket().getAll({ filter })
```

### Exclure Plusieurs Valeurs (NOT IN)

```javascript
// Tout sauf CLOSED et ARCHIVED
const filter = 'status=out=("CLOSED","ARCHIVED")'
const tickets = await new Ticket().getAll({ filter })
```

### OU Logique (OR - au moins un)

```javascript
// Status OPEN OU urgency HIGH
const filter = 'status=="OPEN",urgency=="HIGH"'
const tickets = await new Ticket().getAll({ filter })

// Plusieurs OU
const filter = 'status=="OPEN",status=="CLOSED",status=="ARCHIVED"'
// Équivalent à: status=in=("OPEN","CLOSED","ARCHIVED")
```

### Combinaisons Complexes

```javascript
// (status OPEN ou IN_PROGRESS) ET urgency >= 3
const filter = 'status=in=("OPEN","IN_PROGRESS");urgency>=3'

// Tous sauf assigné à l'utilisateur 5
const filter = 'assigned!=5'

// (status OPEN ET urgency HIGH) OU (status CLOSED ET assigned==NULL)
const filter = 'status=="OPEN";urgency=="HIGH",status=="CLOSED";assigned==null'
```

---

## 🟡 PATTERN COMPLET - REACT + RSQL

### Hook pour Filtres Dynamiques

```javascript
// hooks/useRemoteFilter.js
import { useState, useCallback } from 'react'

export const useRemoteFilter = (entityClass, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Construire la query RSQL
  const buildRsqlFilter = useCallback((filterObj) => {
    const parts = []

    Object.entries(filterObj).forEach(([key, value]) => {
      if (!value || value === '' || value === null) return

      // Array de valeurs → IN
      if (Array.isArray(value)) {
        const quoted = value.map(v => `"${v}"`).join(',')
        parts.push(`${key}=in=(${quoted})`)
      }
      // String
      else if (typeof value === 'string') {
        parts.push(`${key}=="${value}"`)
      }
      // Nombre
      else if (typeof value === 'number') {
        parts.push(`${key}==${value}`)
      }
    })

    // Joindre avec ET (;)
    return parts.join(';')
  }, [])

  // Fetch avec filtres
  const fetchFiltered = useCallback(async () => {
    if (!Object.values(filters).some(v => v)) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const rsqlFilter = buildRsqlFilter(filters)
      const data = await entityClass.getAll({ filter: rsqlFilter })
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters, entityClass, buildRsqlFilter])

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return {
    filters,
    results,
    loading,
    error,
    updateFilter,
    resetFilters,
    fetchFiltered,
  }
}
```

### Utilisation Complète

```jsx
import { useRemoteFilter } from './hooks/useRemoteFilter'
import { useState, useEffect } from 'react'
import Ticket from './entities/Ticket'

export default function AdvancedTicketSearch() {
  const { filters, results, loading, error, updateFilter, fetchFiltered, resetFilters } 
    = useRemoteFilter(new Ticket(), {
      status: '',
      urgency: '',
      assigned: null,
    })

  // Fetch quand filtres changent (debounce)
  useEffect(() => {
    const timer = setTimeout(fetchFiltered, 500)
    return () => clearTimeout(timer)
  }, [filters, fetchFiltered])

  return (
    <div>
      <h2>Recherche Avancée de Tickets</h2>

      {/* Filtres */}
      <div className="filter-group">
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">— Tous —</option>
          <option value="OPEN">Ouvert</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="CLOSED">Fermé</option>
        </select>

        <label>Urgence:</label>
        <select
          value={filters.urgency}
          onChange={(e) => updateFilter('urgency', e.target.value)}
        >
          <option value="">— Tous —</option>
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
        </select>

        <label>Assigné à:</label>
        <input
          type="number"
          value={filters.assigned ?? ''}
          onChange={(e) => updateFilter('assigned', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="ID utilisateur"
        />

        <button onClick={resetFilters}>Réinitialiser</button>
      </div>

      {/* Résultats */}
      {loading && <p>⏳ Chargement...</p>}
      {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}
      {!loading && results.length === 0 && <p>Aucun résultat</p>}

      <ul>
        {results.map(ticket => (
          <li key={ticket.id}>
            [{ticket.status}] {ticket.name} (Urgence: {ticket.urgency})
          </li>
        ))}
      </ul>

      <p>Résultats: {results.length}</p>
    </div>
  )
}
```

---

## 🟣 CAS D'USAGE RÉELS

### Filtrer avec Checkboxes (Sélection Multiple)

```jsx
const [selectedStatuses, setSelectedStatuses] = useState([])

const handleStatusToggle = (status) => {
  setSelectedStatuses(prev =>
    prev.includes(status)
      ? prev.filter(s => s !== status)  // Décocher
      : [...prev, status]               // Cocher
  )
}

// RSQL
const filter = selectedStatuses.length > 0
  ? `status=in=(${selectedStatuses.map(s => `"${s}"`).join(',')})`
  : ''

// Render
<div>
  <label>
    <input
      type="checkbox"
      checked={selectedStatuses.includes('OPEN')}
      onChange={() => handleStatusToggle('OPEN')}
    />
    Ouvert
  </label>
  <label>
    <input
      type="checkbox"
      checked={selectedStatuses.includes('IN_PROGRESS')}
      onChange={() => handleStatusToggle('IN_PROGRESS')}
    />
    En cours
  </label>
</div>
```

### Filtrer avec Plage de Dates

```jsx
const [filters, setFilters] = useState({
  dateStart: '',
  dateEnd: '',
  status: '',
})

// RSQL pour dates
const filter = [
  filters.status ? `status=="${filters.status}"` : '',
  filters.dateStart ? `date_creation>="${filters.dateStart}"` : '',
  filters.dateEnd ? `date_creation<="${filters.dateEnd}"` : '',
]
  .filter(Boolean)
  .join(';')

// Render
<input
  type="date"
  value={filters.dateStart}
  onChange={(e) => setFilters(prev => ({ ...prev, dateStart: e.target.value }))}
  placeholder="À partir du..."
/>
```

### Filtrer avec Recherche Textuelle

```jsx
const [searchQuery, setSearchQuery] = useState('')

// RSQL: contient la chaîne (approx match)
const filter = searchQuery
  ? `name~"${searchQuery}"`
  : ''

// OU plusieurs champs
const filter = searchQuery
  ? `name~"${searchQuery}",content~"${searchQuery}"`
  : ''
```

---

## ⚡ PIÈGES ET PERFORMANCE

### ❌ Problème : Trop de Requêtes API

```javascript
// ❌ MAUVAIS: Fetch à chaque changement
const handleFilterChange = async (key, value) => {
  setFilters(prev => ({ ...prev, [key]: value }))
  // Requête immédiate!
  const filtered = await entityClass.getAll({ /* ... */ })
}

// ✅ BON: Debounce de 500ms
const handleFilterChange = (key, value) => {
  setFilters(prev => ({ ...prev, [key]: value }))
  // Fetch dans useEffect avec debounce
}

useEffect(() => {
  const timer = setTimeout(() => {
    fetchFiltered()
  }, 500)
  return () => clearTimeout(timer)
}, [filters])
```

### ❌ Problème : Filtrer tout localement

```javascript
// ❌ MAUVAIS: 10 000 items en mémoire
const allTickets = await new Ticket().getAll()
const filtered = allTickets.filter(t => t.status === 'OPEN')

// ✅ BON: Laisser le serveur filtrer
const filtered = await new Ticket().getAll({ filter: 'status=="OPEN"' })
```

### ✅ Bonne Pratique : Débounce + Pagination

```jsx
const [page, setPage] = useState(1)

const handleFilterChange = (key, value) => {
  setFilters(prev => ({ ...prev, [key]: value }))
  setPage(1)  // Retour page 1
}

useEffect(() => {
  const timer = setTimeout(() => {
    fetchFiltered()
  }, 500)
  return () => clearTimeout(timer)
}, [filters, page])

// Fetch
await entityClass.getAll({
  filter: buildFilter(filters),
  limit: 20,
  start: (page - 1) * 20,
})
```

---

## 📖 RÉSUMÉ RAPIDE

### Côté Client (`.filter()`)
```javascript
const filtered = data.filter(item =>
  (!filters.status || item.status === filters.status) &&
  (!filters.urgency || item.urgency === filters.urgency) &&
  (!filters.assigned || item.assigned === filters.assigned)
)
```

### Côté Serveur (RSQL)
```javascript
const filter = 'status=="OPEN";urgency=="HIGH";assigned==5'
const results = await new Ticket().getAll({ filter })
```

### React Hook Complet
```javascript
const { filters, results, updateFilter, fetchFiltered } = useRemoteFilter(Ticket, {
  status: '',
  urgency: '',
})
```

---

## 🔗 Voir aussi

- [GUIDE-ARRAY-MAP-SET.md](../../7-GUIDES-UTILES/GUIDE-ARRAY-MAP-SET.md) - `.filter()`, combinaisons
- [search-debounce.md](./search-debounce.md) - Optimiser les requêtes
- [guide-creer-entite-glpi.md](../../10-GLPI/guide-creer-entite-glpi.md) - `.getByApi()` avec filtres
