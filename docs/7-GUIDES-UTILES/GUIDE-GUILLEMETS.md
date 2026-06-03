# 📝 GUIDE - Guillemets & Noms de fichiers

## Les trois types de guillemets

### 1. Guillemets simples `''` (string)

```jsx
const name = 'Alice'
const email = 'alice@example.com'
```

- Utilisé pour les **strings simples**
- Préféré par les standards React

### 2. Guillemets doubles `""` (string)

```jsx
const message = "Bonjour le monde"
const title = "Mon app"
```

- Equivalent aux simples
- Choix personnel

### 3. Backticks `` ` `` (template literals)

```jsx
const name = 'Alice'
const greeting = `Bonjour ${name}!`
const html = `
  <div>
    <h1>Titre</h1>
    <p>Contenu</p>
  </div>
`
```

- Permet **l'interpolation** avec `${}`
- Accepte les **retours à la ligne**

## Choisir le bon

| Cas | Guillemets | Exemple |
|-----|-----------|---------|
| String simple | `''` ou `""` | `'Hello'` |
| Avec variables | `` ` `` | `` `Hello ${name}` `` |
| HTML multi-ligne | `` ` `` | Voir ci-à-droite |
| Texte long | `` ` `` | Multi-ligne possible |

---

**[← Guides Principaux](GUIDE-IMPORTS.md)**
