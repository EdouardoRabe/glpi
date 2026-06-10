# Guide Cartes et Grilles

> 🔎 **Mots-clés de recherche :** carte, card, grille, grid, liste, layout, colonnes, columns, responsive, flex, grid-template, dashboard, statistiques, stats, vignette, tuile

Comment afficher une **liste d'éléments sous forme de cartes** dans une grille qui s'adapte à l'écran. Copie le JSX **et** le CSS ensemble.

## Table des matières

1. [Carte simple](#carte-simple)
2. [Grille de cartes responsive](#grille-de-cartes-responsive)
3. [Carte d'asset (GLPI)](#carte-dasset-glpi)
4. [Cartes de statistiques (dashboard)](#cartes-de-statistiques-dashboard)
5. [Carte cliquable](#carte-cliquable)

---

## Carte simple

### Card.jsx
```javascript
export default function Card({ title, children }) {
    return (
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <div className="card-body">{children}</div>
        </div>
    );
}
```

### Card.css
```css
.card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
    margin: 0 0 1rem 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.card-body {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
}
```

**Usage :**
```javascript
<Card title="Mon titre">
    <p>Contenu de la carte</p>
</Card>
```

---

## Grille de cartes responsive

La grille met **autant de cartes que possible par ligne**, et passe automatiquement à la ligne sur petit écran. C'est le `auto-fill` + `minmax` qui fait la magie — **aucun media query nécessaire**.

### CardGrid.jsx
```javascript
export default function CardGrid({ items }) {
    return (
        <div className="card-grid">
            {items.map((item) => (
                <div key={item.id} className="grid-card">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
}
```

### CardGrid.css
```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
}

.grid-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s, transform 0.2s;
}

.grid-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.grid-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 15px;
    color: #333;
}

.grid-card p {
    margin: 0;
    font-size: 13px;
    color: #666;
}
```

> 💡 **`minmax(250px, 1fr)`** = chaque carte fait minimum 250px, et se partage l'espace restant équitablement (`1fr`). Change `250px` pour des cartes plus grandes ou plus petites.

---

## Carte d'asset (GLPI)

Directement utilisable dans `FOAssetsList`.

### AssetCard.jsx
```javascript
export default function AssetCard({ asset }) {
    return (
        <div className="asset-card">
            <div className="asset-card-header">
                <h4 className="asset-card-name">{asset.name}</h4>
                <span className="asset-card-type">{asset.itemType}</span>
            </div>
            <div className="asset-card-info">
                <p><strong>Fabricant :</strong> {asset.manufacturer?.name ?? "-"}</p>
                <p><strong>Numéro de série :</strong> {asset.serial ?? "-"}</p>
                <p><strong>Localisation :</strong> {asset.location?.name ?? "-"}</p>
            </div>
        </div>
    );
}
```

### AssetCard.css
```css
.asset-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.25rem;
    transition: box-shadow 0.2s;
}

.asset-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.asset-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
}

.asset-card-name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.asset-card-type {
    font-size: 11px;
    color: #999;
    background-color: #f5f5f5;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
    white-space: nowrap;
}

.asset-card-info p {
    margin: 0.4rem 0;
    font-size: 13px;
    color: #666;
}

.asset-card-info strong {
    color: #333;
}
```

**Usage (avec grille) :**
```javascript
<div className="card-grid">
    {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
    ))}
</div>
```

---

## Cartes de statistiques (dashboard)

Pour afficher des chiffres clés (nombre de tickets, d'assets, etc.).

### StatCard.jsx
```javascript
export default function StatCard({ label, value, color = "#000" }) {
    return (
        <div className="stat-card">
            <div className="stat-card-bar" style={{ backgroundColor: color }}></div>
            <div className="stat-card-content">
                <p className="stat-card-label">{label}</p>
                <p className="stat-card-value">{value}</p>
            </div>
        </div>
    );
}
```

### StatCard.css
```css
.stat-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    display: flex;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.stat-card-bar {
    width: 5px;
    flex-shrink: 0;
}

.stat-card-content {
    padding: 1.25rem;
    flex: 1;
}

.stat-card-label {
    margin: 0 0 0.5rem 0;
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-card-value {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #000;
}
```

**Usage :**
```javascript
<div className="stat-card-grid">
    <StatCard label="Tickets ouverts" value={42} color="#2980b9" />
    <StatCard label="Résolus" value={128} color="#27ae60" />
    <StatCard label="En attente" value={7} color="#f39c12" />
</div>
```

---

## Carte cliquable

Une carte entière qui réagit au clic (ouvre un détail, navigue, etc.).

### ClickableCard.jsx
```javascript
export default function ClickableCard({ title, subtitle, onClick }) {
    return (
        <div
            className="clickable-card"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
        >
            <h4>{title}</h4>
            <p>{subtitle}</p>
            <span className="clickable-card-arrow">→</span>
        </div>
    );
}
```

### ClickableCard.css
```css
.clickable-card {
    position: relative;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.clickable-card:hover {
    border-color: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.clickable-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 15px;
    color: #333;
}

.clickable-card p {
    margin: 0;
    font-size: 13px;
    color: #666;
}

.clickable-card-arrow {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-size: 18px;
    color: #999;
    transition: transform 0.2s;
}

.clickable-card:hover .clickable-card-arrow {
    transform: translateX(4px);
    color: #000;
}
```

**Usage :**
```javascript
<ClickableCard
    title="Voir les tickets"
    subtitle="42 tickets ouverts"
    onClick={() => navigate("/tickets")}
/>
```

---

## Résumé

| Composant | Quand l'utiliser |
|-----------|------------------|
| **Card** | Bloc de contenu simple |
| **CardGrid** | Liste de cartes en grille responsive |
| **AssetCard** | Afficher un asset GLPI |
| **StatCard** | Chiffre clé sur un dashboard |
| **ClickableCard** | Carte entière cliquable |

✅ **La clé d'une grille responsive :** `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))` — pas besoin de media query, ça s'adapte tout seul.
