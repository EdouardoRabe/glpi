# Guide Material React Table avec Row Details

Ce guide explique comment utiliser **Material React Table** avec des **row details** (expansion de lignes) pour afficher des informations détaillées, des sous-listes, des formulaires, etc.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Row details** | BOTicketList.jsx | Afficher détails complets du ticket quand on clique |
| **Sous-liste** | FOOderRow.jsx | Afficher les articles d'une commande |
| **Checkboxes** | FOOderRow.jsx | Sélectionner plusieurs articles dans les détails |
| **Multiplicateurs** | FOOderRow.jsx | Ajouter un champ "quantité" dans les détails |
| **Boutons actions** | FOOderRow.jsx | Dupliquer, modifier, supprimer dans le panel |

**Exemple adapté BOTicketList:** Tu as déjà le dialog! Convertis-le en `renderDetailPanel` Material React Table. Utilise `row.original.ticket` au lieu d'accéder à `selectedTicket` - c'est une substitution directe, rien de plus!

## Table des matières

1. [Installation & Setup](#installation--setup)
2. [Configuration basique](#configuration-basique)
3. [Ajouter les row details](#ajouter-les-row-details)
4. [Gestion des états](#gestion-des-états)
5. [Exemple complet avec détails](#exemple-complet-avec-détails)
6. [Cas d'usage courants](#cas-dusage-courants)

---

## Installation & Setup

### 1. Installation

```bash
npm install material-react-table @mui/material @emotion/react @emotion/styled
```

### 2. Import basique

```javascript
import { MaterialReactTable, useMaterialReactTable } from "material-react-table"
```

---

## Configuration basique

### Structure minimale

```javascript
import { useMaterialReactTable, MaterialReactTable } from "material-react-table"
import { useMemo } from "react"

export default function SimpleTable({ data }) {
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 50 },
      { header: "Name", accessorKey: "name", size: 200 },
      { header: "Email", accessorKey: "email", size: 250 },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data,
  })

  return <MaterialReactTable table={table} />
}
```

---

## Ajouter les row details

### Étape 1: Activer les row details

```javascript
const table = useMaterialReactTable({
  columns,
  data,
  enableRowDetail: true, // ← Activer l'expansion
  renderDetailPanel: ({ row }) => (
    <div>
      Détails pour {row.original.name}
    </div>
  ),
})
```

### Étape 2: Contenu du detail panel

```javascript
renderDetailPanel: ({ row }) => {
  const order = row.original
  
  return (
    <div className="detail-panel">
      <h4>Détails de la commande #{order.id}</h4>
      <p><strong>Client:</strong> {order.customerName}</p>
      <p><strong>Total:</strong> {order.total}€</p>
      
      {/* Sous-liste des articles */}
      <h5>Articles:</h5>
      <ul>
        {order.items?.map((item) => (
          <li key={item.id}>{item.name} x{item.qty}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Gestion des états

### État des details ouvertes

```javascript
import { useState, useMemo } from "react"

export default function TableWithDetails({ data }) {
  // Tracker quels details sont ouverts
  const [expandedRows, setExpandedRows] = useState({})

  const toggleRowDetail = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }

  // Passer au rendu si tu veux contrôler
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowDetail: true,
    renderDetailPanel: ({ row }) => {
      if (!expandedRows[row.original.id]) return null
      // Afficher le contenu
    },
  })
}
```

### État des données dans les details

```javascript
const [detailsMap, setDetailsMap] = useState(() => new Map())
const [loadingDetails, setLoadingDetails] = useState(() => new Set())

const fetchDetails = async (rowId) => {
  if (detailsMap.has(rowId)) return detailsMap.get(rowId)
  if (loadingDetails.has(rowId)) return null

  setLoadingDetails((prev) => new Set(prev).add(rowId))
  try {
    const response = await fetch(`/api/details/${rowId}`)
    const details = await response.json()
    
    setDetailsMap((prev) => {
      const next = new Map(prev)
      next.set(rowId, details)
      return next
    })
    return details
  } finally {
    setLoadingDetails((prev) => {
      const next = new Set(prev)
      next.delete(rowId)
      return next
    })
  }
}
```

---

## Exemple complet avec détails

### Composant principal

```javascript
import { useMemo, useState } from "react"
import { MaterialReactTable, useMaterialReactTable } from "material-react-table"

export default function OrderTable({ orders = [] }) {
  const [detailsMap, setDetailsMap] = useState(() => new Map())
  const [loadingDetails, setLoadingDetails] = useState(() => new Set())
  const [checkedDetails, setCheckedDetails] = useState({})

  // Charger les détails d'une commande
  const fetchOrderDetails = async (orderId) => {
    if (detailsMap.has(orderId)) return detailsMap.get(orderId)
    if (loadingDetails.has(orderId)) return null

    setLoadingDetails((prev) => new Set(prev).add(orderId))
    try {
      const response = await fetch(`/api/orders/${orderId}/details`)
      const dto = await response.json()
      
      setDetailsMap((prev) => {
        const next = new Map(prev)
        next.set(orderId, dto)
        return next
      })
      return dto
    } finally {
      setLoadingDetails((prev) => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  // Gérer la sélection des articles
  const handleToggleDetail = (orderId, detailObj) => {
    setCheckedDetails((prev) => {
      const current = prev[orderId] ?? []
      const exists = current.some((d) => d.id === detailObj.id)
      
      return {
        ...prev,
        [orderId]: exists
          ? current.filter((d) => d.id !== detailObj.id)
          : [...current, { ...detailObj, multiplicateur: 1 }],
      }
    })
  }

  const columns = useMemo(
    () => [
      { header: "Ref.", accessorKey: "id", size: 80 },
      { header: "Client", accessorKey: "customerName", size: 200 },
      { header: "Date", accessorKey: "dateAdd", size: 150 },
      { header: "Total", accessorKey: "total", size: 100 },
      { header: "État", accessorKey: "orderStateName", size: 200 },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data: orders,
    enableRowDetail: true,
    
    // Rendu du panel de détails
    renderDetailPanel: ({ row }) => {
      const orderId = row.original.id
      const dto = detailsMap.get(orderId)

      if (!dto) {
        // Charger si pas encore chargé
        fetchOrderDetails(orderId).catch(() => {})
        return <div>Chargement des détails...</div>
      }

      return (
        <OrderDetailsPanel
          orderId={orderId}
          orderWithDetails={dto}
          checkedDetails={checkedDetails[orderId] ?? []}
          onToggleDetail={(detail) => handleToggleDetail(orderId, detail)}
        />
      )
    },

    enablePagination: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return <MaterialReactTable table={table} />
}
```

### Composant de détails (sous-composant)

```javascript
function OrderDetailsPanel({ orderId, orderWithDetails, checkedDetails, onToggleDetail }) {
  const details = orderWithDetails?.orderDetails || []

  if (details.length === 0) {
    return <div>Aucun détail pour cette commande</div>
  }

  return (
    <div className="order-details">
      <h4>Articles de la commande #{orderId}</h4>
      
      <div className="details-header">
        <span>☑️</span>
        <span>Produit</span>
        <span>Qté</span>
        <span>Prix</span>
        <span>Total</span>
      </div>

      <div className="details-list">
        {details.map((detail) => {
          const isChecked = checkedDetails.some((d) => d.id === detail.id)

          return (
            <div key={detail.id} className="detail-row">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleDetail(detail)}
              />
              <span>{detail.productName}</span>
              <span>{detail.quantity}</span>
              <span>{detail.unitPrice}€</span>
              <span>{detail.totalPrice}€</span>
            </div>
          )
        })}
      </div>

      {checkedDetails.length > 0 && (
        <button onClick={() => alert(`Dupliquer ${checkedDetails.length} articles`)}>
          Dupliquer ({checkedDetails.length})
        </button>
      )}
    </div>
  )
}
```

---

## Cas d'usage courants

### 1. Afficher une sous-liste dans les détails

```javascript
renderDetailPanel: ({ row }) => (
  <div>
    <h5>Articles:</h5>
    <ul>
      {row.original.items?.map((item) => (
        <li key={item.id}>{item.name} - {item.price}€</li>
      ))}
    </ul>
  </div>
)
```

### 2. Charger les détails au clic

```javascript
const [expandedRows, setExpandedRows] = useState({})
const [details, setDetails] = useState({})

const handleExpandRow = async (rowId) => {
  if (!details[rowId]) {
    // Charger les données
    const data = await fetch(`/api/${rowId}`).then(r => r.json())
    setDetails(prev => ({ ...prev, [rowId]: data }))
  }
  
  setExpandedRows(prev => ({
    ...prev,
    [rowId]: !prev[rowId]
  }))
}

// Utiliser dans renderDetailPanel
renderDetailPanel: ({ row }) => {
  if (!expandedRows[row.original.id]) return null
  
  const data = details[row.original.id]
  return <div>{/* Afficher data */}</div>
}
```

### 3. Formulaire dans les détails

```javascript
renderDetailPanel: ({ row }) => {
  const [formData, setFormData] = useState(row.original)

  const handleSubmit = async () => {
    await fetch(`/api/update/${row.original.id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))}
      />
      <button type="submit">Mettre à jour</button>
    </form>
  )
}
```

### 4. Contrôles (boutons, inputs) dans les détails

```javascript
renderDetailPanel: ({ row }) => {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="controls">
      <div className="quantity-control">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      
      <button onClick={() => alert(`Commander ${quantity}x`)}>
        Commander
      </button>
    </div>
  )
}
```

### 5. Checkboxes et sélection multiple

```javascript
const [selectedDetails, setSelectedDetails] = useState({})

const toggleDetail = (rowId, detailId) => {
  setSelectedDetails(prev => {
    const current = prev[rowId] ?? []
    const exists = current.includes(detailId)
    
    return {
      ...prev,
      [rowId]: exists
        ? current.filter(id => id !== detailId)
        : [...current, detailId]
    }
  })
}

renderDetailPanel: ({ row }) => (
  <div>
    {row.original.items?.map((item) => (
      <label key={item.id}>
        <input
          type="checkbox"
          checked={selectedDetails[row.original.id]?.includes(item.id) ?? false}
          onChange={() => toggleDetail(row.original.id, item.id)}
        />
        {item.name}
      </label>
    ))}
  </div>
)
```

---

## Propriétés utiles

### Configuration de la table

```javascript
const table = useMaterialReactTable({
  columns,
  data,
  
  // Row details
  enableRowDetail: true,
  renderDetailPanel: ({ row }) => { /* ... */ },
  
  // Pagination
  enablePagination: true,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 10 },
  },
  
  // Sélection
  enableRowSelection: true,
  
  // Colonnes
  enableColumnResizing: true,
  columnSizingMode: 'onChange',
  
  // Tri et filtrage
  enableSorting: true,
  enableColumnFilters: true,
  
  // Style
  muiTablePaperProps: {
    sx: { width: '100%' }
  },
  muiTableContainerProps: {
    sx: { overflowX: 'auto' }
  },
  muiTableBodyRowProps: ({ row }) => ({
    sx: {
      backgroundColor: row.index % 2 === 0 ? '#fafafa' : '#ffffff',
    }
  }),
})
```

---

## Optimisation des performances

### Utiliser useMemo pour les columns

```javascript
const columns = useMemo(() => [
  // Définition des colonnes
], []) // Dépendances
```

### Utiliser Map pour les données chargées

```javascript
const [detailsMap, setDetailsMap] = useState(() => new Map())

// Vérifier avant de charger
if (detailsMap.has(id)) {
  return detailsMap.get(id)
}

// Ajouter à la map
setDetailsMap(prev => {
  const next = new Map(prev)
  next.set(id, data)
  return next
})
```

### Utiliser Set pour le loading state

```javascript
const [loadingDetails, setLoadingDetails] = useState(() => new Set())

// Vérifier si en cours de chargement
if (loadingDetails.has(id)) return null

// Ajouter au set
setLoadingDetails(prev => new Set(prev).add(id))
```

---

## Dépannage courant

### Q: Les details ne s'ouvrent pas
**A:** Vérifiez que `enableRowDetail: true` est défini

### Q: Le rendu ne se met pas à jour
**A:** Utilisez un callback pour refetchquer les données (ne pas modifier directement l'objet)

### Q: Performance lente avec beaucoup de lignes
**A:** 
- Utilisez la pagination
- Chargez les détails à la demande
- Utilisez useMemo pour les colonnes

### Q: Comment contrôler l'expansion programmatiquement?
**A:** Suivez le state des expanded rows et contrôlez le rendu du detail panel

---

## Ressources

- [Material React Table Docs](https://www.material-react-table.com/)
- [MUI Documentation](https://mui.com/)
- [React Hooks Guide](https://react.dev/reference/react)

Besoin d'aide pour adapter ça à ton cas spécifique? 👍
