# Guide de Pagination

Ce guide explique comment implémenter une pagination simple et efficace pour les listes d'objets (Assets, Tickets, etc.) dans votre application React.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Pagination simple** | FOAssetsList.jsx | Afficher 10 assets par page |
| **Avec filtres** | FOAssetsList.jsx | Combiner filtres + pagination ensemble |
| **Boutons précédent/suivant** | BOTicketList.jsx | Naviguer entre pages de tickets |
| **Info items** | BOTicketList.jsx | Affichant 1-10 sur 47 items |
| **Désactiver boutons** | BOTicketList.jsx | Première/dernière page non cliquables |

**Exemple adapté pour FOAssetsList:** Tu utilises déjà les filtres! Ajoute juste `currentPage` state et `slice(startIndex, endIndex)` - remplace `assets` par `filteredAssets` et c'est identique au guide!

## Table des matières

1. [Logique de base](#logique-de-base)
2. [Composant complet](#composant-complet)
3. [CSS pour la pagination](#css-pour-la-pagination)
4. [Intégration avec filtres](#intégration-avec-filtres)

---

## Logique de base

### States nécessaires

```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // Nombre d'items par page
```

### Calculs essentiels

```javascript
// Nombre total de pages
const totalPages = Math.ceil(items.length / itemsPerPage);

// Index de début et fin pour la page actuelle
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Items à afficher sur la page actuelle
const itemsToDisplay = items.slice(startIndex, endIndex);
```

### Fonctions de navigation

```javascript
const goToPage = (pageNumber) => {
  const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
  setCurrentPage(pageNum);
};

const nextPage = () => {
  goToPage(currentPage + 1);
};

const prevPage = () => {
  goToPage(currentPage - 1);
};
```

---

## Composant complet

### Exemple: Liste d'Assets avec pagination

```javascript
import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import "../../css/pages/FO/FOAssetsList.css";

export default function FOAssetsList() {
  const [assets, setAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadAssets = async () => {
      const all = await Asset.getAll();
      setAssets(all);
    };
    loadAssets();
  }, []);

  // Calculs de pagination
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = assets.slice(startIndex, endIndex);

  // Fonctions de navigation
  const goToPage = (pageNumber) => {
    const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(pageNum);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return (
    <div className="fo-assets-list">
      <h1>Assets ({assets.length} total)</h1>

      {/* Grille d'assets */}
      <div className="fo-assets-grid">
        {itemsToDisplay.map((asset) => (
          <div key={asset.id} className="fo-assets-card">
            <h4>{asset.name}</h4>
            <p><strong>Type:</strong> {asset.itemType}</p>
            <p><strong>Manufacturer:</strong> {asset.manufacturer?.name || "-"}</p>
          </div>
        ))}
      </div>

      {/* Contrôles de pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Précédent
          </button>

          <div className="pagination-info">
            <span>Page {currentPage} sur {totalPages}</span>
            <span className="pagination-items">
              Affichant {startIndex + 1} à {Math.min(endIndex, assets.length)} 
              sur {assets.length} items
            </span>
          </div>

          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## CSS pour la pagination

Ajoute ce CSS à ton fichier de style (ex: `FOAssetsList.css`):

```css
/* ========================================
   PAGINATION
   ======================================== */

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border: 1px solid #999;
  border-radius: 8px;
  flex-wrap: wrap;
}

.pagination-btn {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #1a1a1a;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #555;
  min-width: 250px;
}

.pagination-info span {
  display: block;
}

.pagination-info .pagination-items {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .pagination {
    gap: 1rem;
    padding: 1rem;
  }

  .pagination-btn {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }

  .pagination-info {
    min-width: auto;
  }
}
```

---

## Intégration avec filtres

Si tu as des **filtres en plus de la pagination**, voici comment les combiner:

```javascript
import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import "../../css/pages/FO/FOAssetsList.css";

export default function FOAssetsList() {
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadAssets = async () => {
      const all = await Asset.getAll();
      setAssets(all);
    };
    loadAssets();
  }, []);

  // Appliquer les filtres
  const filteredAssets = assets.filter((asset) => {
    if (filters.type && asset.itemType !== filters.type) return false;
    if (filters.status && asset.status?.id !== filters.status) return false;
    return true;
  });

  // IMPORTANT: Réinitialiser la page quand les filtres changent
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // ← Retour à la page 1
  };

  // Calculs de pagination basés sur les assets FILTRÉS
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredAssets.slice(startIndex, endIndex);

  // Fonctions de navigation
  const goToPage = (pageNumber) => {
    const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(pageNum);
  };

  return (
    <div className="fo-assets-list">
      <h1>Assets ({filteredAssets.length})</h1>

      {/* Filtres */}
      <div className="filters">
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Computer">Computer</option>
          <option value="Monitor">Monitor</option>
        </select>
      </div>

      {/* Affichage des assets */}
      {itemsToDisplay.length === 0 ? (
        <p>Aucun asset à afficher</p>
      ) : (
        <>
          <div className="fo-assets-grid">
            {itemsToDisplay.map((asset) => (
              <div key={asset.id} className="fo-assets-card">
                <h4>{asset.name}</h4>
                <p>{asset.itemType}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Précédent
              </button>

              <div className="pagination-info">
                <span>Page {currentPage} / {totalPages}</span>
              </div>

              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## Points clés à retenir

### ✅ À faire:
- Réinitialiser `currentPage = 1` quand les filtres changent
- Utiliser `Math.max()` et `Math.min()` pour limiter le numéro de page
- Désactiver les boutons aux limites (première/dernière page)
- Afficher le nombre d'items pour aider l'utilisateur

### ❌ À éviter:
- Charger TOUS les items à la fois sans pagination (mauvaise perfo)
- Oublier de réinitialiser la page après filtrage
- Laisser le bouton "Suivant" actif si on est déjà à la dernière page

---

## Variations

### Pagination avec numéros de page

```javascript
{/* Afficher les numéros de page */}
<div className="pagination-numbers">
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => goToPage(page)}
      className={`page-btn ${currentPage === page ? 'active' : ''}`}
    >
      {page}
    </button>
  ))}
</div>
```

### Changer le nombre d'items par page

```javascript
const [itemsPerPage, setItemsPerPage] = useState(10);

<select value={itemsPerPage} onChange={(e) => {
  setItemsPerPage(Number(e.target.value));
  setCurrentPage(1);
}}>
  <option value={5}>5 par page</option>
  <option value={10}>10 par page</option>
  <option value={20}>20 par page</option>
</select>
```

---

## Exemple complet + tests

Copie-colle cet exemple dans l'un de tes composants pour tester:

```javascript
import { useState } from "react";

export default function PaginationDemo() {
  // Données de test
  const allItems = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const items = allItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pagination Demo ({allItems.length} items)</h2>
      
      {/* Afficher les items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* Pagination */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
```

---

## Questions courantes

**Q: Comment gérer la pagination côté backend?**
Si tu as un backend avec des milliers d'items, il est mieux de paginer côté serveur pour éviter de charger tout en mémoire.

**Q: Dois-je paginer ou utiliser "scroll infini"?**
- **Pagination**: meilleure pour les listes où on veut accéder à une page spécifique
- **Scroll infini**: mieux pour les feeds/réseaux sociaux

**Q: Quoi faire si les données changent?**
Réinitialise toujours `setCurrentPage(1)` quand les données ou filtres changent.

---

Besoin d'aide pour adapter ça à l'un de tes composants? 👍
