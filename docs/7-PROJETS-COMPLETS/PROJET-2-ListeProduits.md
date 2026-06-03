# 🚀 Projet 2 - Liste de Produits

## Objectifs

- Fetch d'API
- Affichage de listes
- États loading/error
- Filtrage

## Code exemple

```jsx
import { useState, useEffect } from 'react'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) return <p>Chargement...</p>

  return (
    <div>
      <input
        placeholder="Chercher..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filtered.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>Prix: {p.price}€</p>
        </div>
      ))}
    </div>
  )
}

export default ProductList
```

---

**[← Retour aux projets](PROJET-1-TodoApp-Simple.md)**
