# 📊 GUIDE - Charts en React (Recharts)

> Guide complet pour créer des graphiques dans des composants React avec la librairie **Recharts**.
> Recharts est disponible dans ce projet : `import { ... } from "recharts"`

---

## Table des matières

1. [Installation & Import](#1-installation--import)
2. [BarChart — Barres](#2-barchart--barres)
3. [LineChart — Courbes](#3-linechart--courbes)
4. [PieChart — Camembert](#4-piechart--camembert)
5. [AreaChart — Aires](#5-areachart--aires)
6. [RadarChart — Radar](#6-radarchart--radar)
7. [Composants communs](#7-composants-communs)
8. [Données dynamiques](#8-données-dynamiques)
9. [Responsive](#9-responsive)
10. [Couleurs & Thème](#10-couleurs--thème)
11. [Cas pratiques projet](#11-cas-pratiques-projet)

---

## 1. Installation & Import

Recharts est déjà disponible dans ce projet (listé dans les librairies disponibles).

```jsx
npm install recharts

// Importer uniquement ce dont vous avez besoin
import {
    // Conteneurs
    BarChart, LineChart, PieChart, AreaChart, RadarChart,
    // Axes
    XAxis, YAxis, CartesianGrid,
    // Données
    Bar, Line, Pie, Cell, Area, Radar, PolarGrid, PolarAngleAxis,
    // UI
    Tooltip, Legend, ResponsiveContainer,
} from "recharts";
```

---

## 2. BarChart — Barres

### Structure minimale

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", value: 40 },
    { name: "Fév", value: 30 },
    { name: "Mar", value: 60 },
    { name: "Avr", value: 80 },
];

export default function MonBarChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#c0392b" />
            </BarChart>
        </ResponsiveContainer>
    );
}
```

### Barres multiples

```jsx
const data = [
    { name: "Jan", incidents: 10, demandes: 5 },
    { name: "Fév", incidents: 8,  demandes: 12 },
    { name: "Mar", incidents: 15, demandes: 7 },
];

<BarChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="incidents" fill="#c0392b" name="Incidents" />
    <Bar dataKey="demandes"  fill="#27ae60" name="Demandes"  />
</BarChart>
```

### Barres empilées

```jsx
<Bar dataKey="incidents" fill="#c0392b" stackId="a" />
<Bar dataKey="demandes"  fill="#27ae60" stackId="a" />
// stackId identique = empilées
```

### Props `<Bar>`

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `dataKey` | string | Clé dans les données | requis |
| `fill` | string | Couleur de remplissage | `"#8884d8"` |
| `stroke` | string | Couleur du contour | aucun |
| `strokeWidth` | number | Épaisseur du contour | `1` |
| `radius` | number \| array | Arrondi des coins | `0` |
| `stackId` | string | ID pour empiler | aucun |
| `name` | string | Label dans la légende | valeur de `dataKey` |
| `barSize` | number | Largeur fixe de la barre | auto |
| `opacity` | number | Opacité (0-1) | `1` |

---

## 3. LineChart — Courbes

### Structure minimale

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Lun", tickets: 4 },
    { name: "Mar", tickets: 7 },
    { name: "Mer", tickets: 3 },
    { name: "Jeu", tickets: 9 },
    { name: "Ven", tickets: 5 },
];

export default function MonLineChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#c0392b" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}
```

### Courbes multiples

```jsx
<Line type="monotone" dataKey="incidents" stroke="#c0392b" strokeWidth={2} />
<Line type="monotone" dataKey="demandes"  stroke="#27ae60" strokeWidth={2} />
```

### Props `<Line>`

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `dataKey` | string | Clé dans les données | requis |
| `type` | string | Interpolation : `"monotone"`, `"linear"`, `"step"`, `"basis"` | `"linear"` |
| `stroke` | string | Couleur de la ligne | `"#8884d8"` |
| `strokeWidth` | number | Épaisseur | `1` |
| `dot` | bool \| object | Afficher les points | `true` |
| `activeDot` | object | Style du point au survol | `{ r: 8 }` |
| `strokeDasharray` | string | Ligne pointillée ex: `"5 5"` | aucun |
| `name` | string | Label légende | valeur de `dataKey` |
| `connectNulls` | bool | Connecter les valeurs nulles | `false` |

---

## 4. PieChart — Camembert

### Structure minimale

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Incidents", value: 40 },
    { name: "Demandes",  value: 30 },
    { name: "Problèmes", value: 10 },
];

const COLORS = ["#c0392b", "#27ae60", "#f39c12"];

export default function MonPieChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
```

### Donut (anneau)

```jsx
<Pie
    data={data}
    dataKey="value"
    cx="50%"
    cy="50%"
    innerRadius={60}   // ← ajouter innerRadius pour le donut
    outerRadius={100}
    label
>
```

### Label personnalisé

```jsx
const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

<Pie
    data={data}
    dataKey="value"
    label={renderLabel}
    labelLine={true}
>
```

### Props `<Pie>`

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `data` | array | Données | requis |
| `dataKey` | string | Clé valeur numérique | requis |
| `nameKey` | string | Clé label | `"name"` |
| `cx` | string \| number | Centre horizontal | `"50%"` |
| `cy` | string \| number | Centre vertical | `"50%"` |
| `innerRadius` | number | Rayon intérieur (donut) | `0` |
| `outerRadius` | number | Rayon extérieur | `80` |
| `startAngle` | number | Angle de départ | `0` |
| `endAngle` | number | Angle de fin | `360` |
| `label` | bool \| func | Afficher labels | `false` |
| `labelLine` | bool | Ligne du label | `true` |
| `paddingAngle` | number | Espace entre les parts | `0` |

---

## 5. AreaChart — Aires

```jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", value: 20 },
    { name: "Fév", value: 45 },
    { name: "Mar", value: 30 },
];

export default function MonAreaChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    {/* Dégradé optionnel */}
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#c0392b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c0392b" stopOpacity={0}   />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#c0392b"
                    fill="url(#colorValue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
```

### Props `<Area>`

Mêmes props que `<Line>` plus :

| Prop | Type | Description |
|------|------|-------------|
| `fill` | string | Couleur de remplissage |
| `fillOpacity` | number | Opacité du remplissage |
| `stackId` | string | Empiler les aires |

---

## 6. RadarChart — Radar

```jsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { subject: "Computers",  count: 8 },
    { subject: "Monitors",   count: 3 },
    { subject: "Printers",   count: 5 },
    { subject: "Phones",     count: 2 },
];

export default function MonRadarChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                    dataKey="count"
                    stroke="#c0392b"
                    fill="#c0392b"
                    fillOpacity={0.3}
                />
                <Tooltip />
            </RadarChart>
        </ResponsiveContainer>
    );
}
```

---

## 7. Composants communs

### `<ResponsiveContainer>`

**Toujours envelopper** les charts dans un `ResponsiveContainer` pour qu'ils s'adaptent à la taille du parent.

```jsx
<ResponsiveContainer width="100%" height={300}>
    <BarChart ...>
```

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `width` | string \| number | Largeur | requis |
| `height` | string \| number | Hauteur | requis |
| `minWidth` | number | Largeur minimale | aucun |
| `minHeight` | number | Hauteur minimale | aucun |

---

### `<XAxis>` et `<YAxis>`

```jsx
<XAxis
    dataKey="name"          // Clé des données pour l'axe
    tick={{ fill: "#a8a29e", fontSize: 12 }}  // Style des labels
    axisLine={{ stroke: "#2a2a2a" }}          // Style de l'axe
    tickLine={false}        // Cacher les petits traits
    tickFormatter={(v) => `${v}h`}  // Formater les labels
/>

<YAxis
    tick={{ fill: "#a8a29e", fontSize: 12 }}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => `${v}€`}
    domain={[0, "auto"]}   // Min/max de l'axe
    width={50}             // Largeur réservée pour les labels
/>
```

---

### `<Tooltip>`

```jsx
// Tooltip par défaut
<Tooltip />

// Tooltip personnalisé
<Tooltip
    contentStyle={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: "4px",
        fontFamily: "monospace",
    }}
    labelStyle={{ color: "#f5f0eb" }}
    itemStyle={{ color: "#a8a29e" }}
    formatter={(value, name) => [`${value} tickets`, name]}
    labelFormatter={(label) => `Période : ${label}`}
/>
```

---

### `<Legend>`

```jsx
<Legend
    verticalAlign="bottom"    // "top" | "middle" | "bottom"
    align="center"            // "left" | "center" | "right"
    iconType="circle"         // "line" | "square" | "rect" | "circle" | "cross" | "diamond"
    wrapperStyle={{ fontSize: "12px", color: "#a8a29e" }}
/>
```

---

### `<CartesianGrid>`

```jsx
<CartesianGrid
    strokeDasharray="3 3"     // Pointillés
    stroke="#2a2a2a"          // Couleur des lignes
    horizontal={true}         // Lignes horizontales
    vertical={false}          // Pas de lignes verticales
/>
```

---

## 8. Données dynamiques

### Depuis un state React

```jsx
export default function TicketsChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const load = async () => {
            const tickets = await Ticket.getAll();

            // Grouper par type
            const grouped = TICKET_TYPE.map(type => ({
                name:  type.name,
                count: tickets.filter(t => t.type === type.id).length,
            }));

            setData(grouped);
        };
        load();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#c0392b" />
            </BarChart>
        </ResponsiveContainer>
    );
}
```

### Transformer des données pour les charts

```js
// tickets = [{ type: 1, priority: 3, ... }, ...]

// Par type
const byType = TICKET_TYPE.map(t => ({
    name:  t.name,
    count: tickets.filter(x => x.type === t.id).length,
}));

// Par priorité
const byPriority = TICKET_PRIORITY.map(p => ({
    name:  p.name,
    count: tickets.filter(x => x.priority === p.id).length,
}));

// Par statut
const byStatus = TICKET_STATUS.map(s => ({
    name:  s.name,
    count: tickets.filter(x => x.status?.id === s.id).length,
}));

// Par itemType des assets
const byItemType = ITEM_TYPES.map(type => ({
    name:  type,
    count: assets.filter(a => a.itemType === type).length,
})).filter(x => x.count > 0); // exclure les types vides
```

---

## 9. Responsive

```jsx
// ✅ Toujours utiliser ResponsiveContainer
<ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
        ...
    </BarChart>
</ResponsiveContainer>

// ✅ Pour un ratio au lieu d'une hauteur fixe
<ResponsiveContainer width="100%" aspect={2}>
    {/* aspect={2} = largeur / hauteur = 2 → hauteur = largeur/2 */}
```

---

## 10. Couleurs & Thème

### Palette projet (fond noir)

```js
const COLORS = {
    red:    "#c0392b",
    green:  "#27ae60",
    yellow: "#f39c12",
    blue:   "#2980b9",
    purple: "#8e44ad",
    grey:   "#5c5652",
    white:  "#f5f0eb",
};

// Pour PieChart avec Cell
const PIE_COLORS = ["#c0392b", "#27ae60", "#f39c12", "#2980b9", "#8e44ad"];
```

### Style axes/grille pour fond noir

```jsx
<CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
<XAxis tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={{ stroke: "#2a2a2a" }} tickLine={false} />
<YAxis tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={false} tickLine={false} />
<Tooltip
    contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px" }}
    labelStyle={{ color: "#f5f0eb", fontFamily: "monospace" }}
    itemStyle={{ color: "#a8a29e", fontFamily: "monospace" }}
/>
<Legend wrapperStyle={{ fontSize: "11px", color: "#a8a29e" }} />
```

---

## 11. Cas pratiques projet

### Tickets par type (BarChart)

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TICKET_TYPE } from "../../backend/utils/utils";

const COLORS = ["#c0392b", "#27ae60", "#f39c12", "#2980b9"];

export default function TicketsByTypeChart({ tickets }) {
    const data = TICKET_TYPE.map(t => ({
        name:  t.name,
        count: tickets.filter(x => x.type === t.id).length,
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px" }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
```

---

### Assets par type (PieChart donut)

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ITEM_TYPES } from "../../backend/utils/type";

const COLORS = ["#c0392b", "#27ae60", "#f39c12", "#2980b9", "#8e44ad", "#5c5652"];

export default function AssetsByTypeChart({ assets }) {
    const data = ITEM_TYPES
        .map(type => ({
            name:  type,
            value: assets.filter(a => a.itemType === type).length,
        }))
        .filter(x => x.value > 0);

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                >
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#a8a29e" }} />
            </PieChart>
        </ResponsiveContainer>
    );
}
```

---

### Tickets par priorité (LineChart)

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// data = [{ date: "2026-06", incidents: 5, demandes: 3 }, ...]
export default function TicketsTrendChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#a8a29e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#a8a29e" }} />
                <Line type="monotone" dataKey="incidents" stroke="#c0392b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="demandes"  stroke="#27ae60" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
```

---

## Récapitulatif rapide

| Chart | Usage | Composant principal |
|-------|-------|---------------------|
| Barres | Comparer des catégories | `<BarChart>` + `<Bar>` |
| Courbes | Tendances dans le temps | `<LineChart>` + `<Line>` |
| Camembert | Répartition en % | `<PieChart>` + `<Pie>` + `<Cell>` |
| Aires | Volumes dans le temps | `<AreaChart>` + `<Area>` |
| Radar | Comparaison multi-axes | `<RadarChart>` + `<Radar>` |

**Toujours** envelopper dans `<ResponsiveContainer width="100%" height={N}>`.