# CSS avec React — Guide Complet

> Tout ce qu'il faut savoir pour styliser des applications React, des bases aux approches avancées.

---

## Table des matières

1. [CSS Global (fichiers .css classiques)](#1-css-global)
2. [Inline Styles](#2-inline-styles)
3. [CSS Modules](#3-css-modules)
4. [CSS-in-JS — styled-components](#4-css-in-js--styled-components)
5. [CSS-in-JS — Emotion](#5-css-in-js--emotion)
6. [Utility-first — Tailwind CSS](#6-utility-first--tailwind-css)
7. [Classes conditionnelles](#7-classes-conditionnelles)
8. [Variables CSS & Theming](#8-variables-css--theming)
9. [Animations & Transitions](#9-animations--transitions)
10. [Responsive Design dans React](#10-responsive-design-dans-react)
11. [Comparatif des approches](#11-comparatif-des-approches)
12. [Bonnes pratiques](#12-bonnes-pratiques)

---

## 1. CSS Global

### Principe

Le fichier CSS classique est importé directement dans un composant ou dans `index.js`. Les styles sont **globaux** : ils s'appliquent à toute l'application.

### Syntaxe

```css
/* styles.css */
.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.button:hover {
  background-color: darkblue;
}
```

```jsx
// App.jsx
import './styles.css';

function App() {
  return <button className="button">Cliquer ici</button>;
}
```

> ⚠️ En React, on utilise `className` et non `class` (car `class` est un mot réservé en JavaScript).

### À savoir

- Les styles peuvent entrer en **conflit** si deux composants utilisent le même nom de classe.
- Convient pour les styles de base (reset CSS, typographie globale, variables).
- Importé dans `index.js` → disponible partout dans l'app.

---

## 2. Inline Styles

### Principe

Les styles sont définis directement dans le JSX via la prop `style`, sous forme d'un **objet JavaScript**.

### Syntaxe

```jsx
function Button() {
  const style = {
    backgroundColor: 'blue',   // camelCase (pas background-color)
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',       // les nombres sont des strings ou des px
    fontSize: 16,              // px implicite pour les nombres
  };

  return <button style={style}>Cliquer ici</button>;
}

// Ou directement en ligne :
function Title() {
  return <h1 style={{ color: 'red', fontWeight: 'bold' }}>Titre</h1>;
}
```

### Règles importantes

| CSS standard       | Inline style React   |
|--------------------|----------------------|
| `background-color` | `backgroundColor`    |
| `font-size`        | `fontSize`           |
| `border-radius`    | `borderRadius`       |
| `z-index`          | `zIndex`             |
| `margin-top`       | `marginTop`          |

### Avantages / Limites

✅ Styles dynamiques faciles (basés sur des variables ou du state)  
❌ Pas de pseudo-classes (`:hover`, `:focus`) ni de media queries  
❌ Pas de réutilisabilité  
❌ Difficile à maintenir sur de gros projets

---

## 3. CSS Modules

### Principe

Les CSS Modules permettent d'avoir des styles **locaux** à un composant. React génère automatiquement des noms de classes uniques pour éviter les conflits.

### Configuration

Disponible nativement avec **Create React App** et **Vite**. Le fichier doit être nommé `*.module.css`.

### Syntaxe

```css
/* Button.module.css */
.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
}

.button:hover {
  background-color: darkblue;
}

.primary {
  background-color: green;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ primary }) {
  return (
    <button className={`${styles.button} ${primary ? styles.primary : ''}`}>
      Cliquer ici
    </button>
  );
}
```

### Ce qui se passe en coulisses

Le nom de classe `button` devient quelque chose comme `Button_button__3aR7k` dans le DOM → **aucun conflit possible**.

### Classes globales dans un module

```css
/* Pour forcer un style global depuis un module */
:global(.reset) {
  margin: 0;
  padding: 0;
}
```

### Avantages / Limites

✅ Isolation des styles par composant  
✅ Supporte toute la syntaxe CSS (pseudo-classes, media queries)  
✅ Aucune dépendance externe  
❌ Pas de styles dynamiques basés sur les props sans `style` inline en complément

---

## 4. CSS-in-JS — styled-components

### Installation

```bash
npm install styled-components
```

### Principe

On crée des **composants stylisés** directement en JavaScript grâce aux template literals.

### Syntaxe de base

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;

  &:hover {
    background-color: darkblue;
  }
`;

function App() {
  return <Button>Cliquer ici</Button>;
}
```

### Styles dynamiques avec les props

```jsx
const Button = styled.button`
  background-color: ${(props) => (props.primary ? 'blue' : 'gray')};
  color: white;
  font-size: ${(props) => props.size || '16px'};
`;

function App() {
  return (
    <>
      <Button primary>Bouton principal</Button>
      <Button size="20px">Bouton secondaire</Button>
    </>
  );
}
```

### Héritage de styles

```jsx
const BaseButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
`;

// Étend BaseButton et ajoute des styles
const DangerButton = styled(BaseButton)`
  background-color: red;
  color: white;
`;
```

### Theming avec ThemeProvider

```jsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: 'blue',
    danger: 'red',
  },
  spacing: {
    sm: '8px',
    md: '16px',
  },
};

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.md};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>Bouton</Button>
    </ThemeProvider>
  );
}
```

### Avantages / Limites

✅ Styles 100% dynamiques avec les props  
✅ Theming puissant  
✅ Pas de conflits de noms  
❌ Légère surcharge de performance au runtime  
❌ Bundle plus lourd  

---

## 5. CSS-in-JS — Emotion

### Installation

```bash
npm install @emotion/react @emotion/styled
```

### Syntaxe avec `css` prop

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background-color: blue;
  color: white;
  padding: 8px 16px;
`;

function Button() {
  return <button css={buttonStyle}>Cliquer ici</button>;
}
```

### Syntaxe avec `styled` (similaire à styled-components)

```jsx
import styled from '@emotion/styled';

const Button = styled.button`
  background-color: ${(props) => (props.primary ? 'blue' : 'gray')};
  color: white;
`;
```

### Différence clé avec styled-components

Emotion est généralement **plus performant** car il peut générer les styles à la compilation (avec Babel). Il est aussi souvent utilisé avec **MUI (Material UI)**.

---

## 6. Utility-first — Tailwind CSS

### Installation (avec Vite)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Principe

On applique des **classes utilitaires prédéfinies** directement dans le JSX. Pas besoin d'écrire de CSS manuellement.

### Syntaxe

```jsx
function Button({ primary }) {
  return (
    <button
      className={`px-4 py-2 rounded text-white ${
        primary ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'
      }`}
    >
      Cliquer ici
    </button>
  );
}
```

### Classes utilitaires courantes

| Catégorie      | Exemples de classes                              |
|----------------|--------------------------------------------------|
| Spacing        | `p-4`, `px-2`, `my-8`, `mt-4`                   |
| Couleurs       | `bg-blue-500`, `text-red-600`, `border-gray-300` |
| Flexbox        | `flex`, `items-center`, `justify-between`        |
| Grid           | `grid`, `grid-cols-3`, `gap-4`                   |
| Typographie    | `text-xl`, `font-bold`, `leading-6`              |
| Responsive     | `md:flex`, `lg:text-2xl`, `sm:hidden`            |
| Hover/Focus    | `hover:bg-blue-700`, `focus:ring-2`              |

### Classes personnalisées avec `@apply`

```css
/* Dans un fichier .css */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
```

### Avantages / Limites

✅ Très rapide à écrire  
✅ CSS purgé automatiquement → bundle minimal en production  
✅ Responsive et dark mode intégrés  
❌ Classes parfois très longues dans le JSX  
❌ Courbe d'apprentissage initiale  

---

## 7. Classes conditionnelles

### Avec des template literals

```jsx
function Alert({ type }) {
  return (
    <div className={`alert ${type === 'error' ? 'alert-error' : 'alert-success'}`}>
      Message
    </div>
  );
}
```

### Avec la librairie `clsx` (recommandé)

```bash
npm install clsx
```

```jsx
import clsx from 'clsx';

function Button({ primary, disabled, large }) {
  return (
    <button
      className={clsx(
        'btn',
        primary && 'btn-primary',
        disabled && 'btn-disabled',
        large ? 'btn-lg' : 'btn-sm'
      )}
    >
      Cliquer
    </button>
  );
}
```

### Avec `classnames` (équivalent à clsx)

```bash
npm install classnames
```

```jsx
import classNames from 'classnames';

const classes = classNames({
  'btn': true,
  'btn-primary': isPrimary,
  'btn-disabled': isDisabled,
});
```

---

## 8. Variables CSS & Theming

### Définir des variables CSS globales

```css
/* index.css */
:root {
  --color-primary: #3b82f6;
  --color-danger: #ef4444;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --font-size-base: 16px;
  --border-radius: 4px;
}
```

### Utiliser les variables dans les composants

```css
/* Button.module.css */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
}
```

### Dark Mode avec les variables CSS

```css
:root {
  --bg-color: #ffffff;
  --text-color: #111111;
}

[data-theme='dark'] {
  --bg-color: #111111;
  --text-color: #ffffff;
}
```

```jsx
function App() {
  const [dark, setDark] = useState(false);

  return (
    <div data-theme={dark ? 'dark' : 'light'} style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <button onClick={() => setDark(!dark)}>Toggle Dark Mode</button>
    </div>
  );
}
```

---

## 9. Animations & Transitions

### Avec CSS classique

```css
/* styles.css */
.button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background-color: darkblue;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal {
  animation: fadeIn 0.3s ease forwards;
}
```

### Avec styled-components et keyframes

```jsx
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Box = styled.div`
  animation: ${fadeIn} 0.5s ease;
`;
```

### Avec la librairie Framer Motion (recommandé)

```bash
npm install framer-motion
```

```jsx
import { motion } from 'framer-motion';

function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      Contenu de la carte
    </motion.div>
  );
}
```

---

## 10. Responsive Design dans React

### Media queries en CSS classique

```css
.container {
  width: 100%;
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    max-width: 960px;
    margin: 0 auto;
  }
}
```

### Avec styled-components

```jsx
const Container = styled.div`
  width: 100%;
  padding: 16px;

  @media (min-width: 768px) {
    max-width: 960px;
    margin: 0 auto;
  }
`;
```

### Avec un hook custom `useMediaQuery`

```jsx
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Utilisation
function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  );
}
```

---

## 11. Comparatif des approches

| Approche             | Isolation | Dynamisme | Perf | Complexité | Cas d'usage              |
|----------------------|-----------|-----------|------|------------|--------------------------|
| CSS Global           | ❌        | ❌        | ✅✅  | Faible     | Styles de base, reset    |
| Inline Styles        | ✅        | ✅✅       | ✅   | Faible     | Styles 100% dynamiques   |
| CSS Modules          | ✅✅       | ⚠️        | ✅✅  | Faible     | Composants réutilisables |
| styled-components    | ✅✅       | ✅✅       | ✅   | Moyenne    | Design system, theming   |
| Emotion              | ✅✅       | ✅✅       | ✅✅  | Moyenne    | Perf + CSS-in-JS         |
| Tailwind CSS         | ✅        | ✅        | ✅✅  | Moyenne    | Prototypage rapide       |

---

## 12. Bonnes pratiques

### Organisation des fichiers

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css   ← style local
│   │   └── index.js
├── styles/
│   ├── globals.css             ← reset, variables CSS
│   └── typography.css          ← styles de texte globaux
```

### Règles à retenir

1. **Éviter les styles globaux** pour tout ce qui est spécifique à un composant.
2. **Utiliser des variables CSS** (`:root`) pour les couleurs, espacements et fonts.
3. **Préférer `className`** à `style` pour les styles statiques (meilleures perfs).
4. **Utiliser `clsx`** pour gérer les classes conditionnelles proprement.
5. **Ne pas mélanger** trop d'approches dans un même projet — choisir une et s'y tenir.
6. **Nommer les classes** de manière descriptive : `.card-header`, pas `.ch`.
7. **Eviter les `!important`** — signe d'un problème d'architecture CSS.

### Ordre de recommandation selon le projet

- **Petit projet / prototype** → CSS Modules ou Tailwind
- **Design system / librairie de composants** → styled-components ou Emotion
- **Application d'entreprise** → CSS Modules + variables CSS
- **Performance critique** → Tailwind (CSS purgé) ou Emotion (compilation Babel)

---

*Documentation rédigée pour React 18+ — Compatibilité : Create React App, Vite, Next.js*
