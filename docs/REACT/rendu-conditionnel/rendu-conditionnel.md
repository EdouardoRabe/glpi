# Rendu Conditionnel (JavaScript + React)

Ce guide explique des facons pratiques d afficher ou masquer une interface selon des conditions. Il inclut des exemples prets a l emploi que vous pouvez copier.

## Sommaire
- [1) If/Else avec une fonction helper (React)](#1-ifelse-avec-une-fonction-helper-react)
- [2) Operateur ternaire (React)](#2-operateur-ternaire-react)
- [3) ET logique (React)](#3-et-logique-react)
- [4) Switch (React)](#4-switch-react)
- [5) Retours anticipes (React)](#5-retours-anticipes-react)
- [6) Ne rien rendre (React)](#6-ne-rien-rendre-react)
- [7) Classes CSS conditionnelles](#7-classes-css-conditionnelles)
- [8) Rendu conditionnel en JavaScript (DOM)](#8-rendu-conditionnel-en-javascript-dom)
- [9) Eviter les pieges courants](#9-eviter-les-pieges-courants)
- [10) Mini exemple: liste de produits (React)](#10-mini-exemple-liste-de-produits-react)

## 1) If/Else avec une fonction helper (React)
Utilisez une fonction helper pour garder le JSX propre quand la logique grossit.

Syntaxe:

```jsx
const renderContent = () => {
  if (conditionA) return <A />;
  if (conditionB) return <B />;
  return <C />;
};
```

```jsx
function StatusBanner({ status }) {
  const renderContent = () => {
    if (status === "loading") return <p>Loading...</p>;
    if (status === "error") return <p>Something went wrong.</p>;
    return <p>All good!</p>;
  };

  return <div className="banner">{renderContent()}</div>;
}
```

## 2) Operateur ternaire (React)
Parfait pour des conditions simples sur une ligne.

Syntaxe:

```jsx
condition ? <A /> : <B />
```

```jsx
function LoginGate({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}
```

## 3) ET logique (React)
Affiche uniquement quand la condition est vraie.

Syntaxe:

```jsx
condition && <A />
```

```jsx
function Notifications({ count }) {
  return (
    <div>
      <p>Inbox</p>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
```

## 4) Switch (React)
Utile quand vous avez plusieurs cas.

Syntaxe:

```jsx
switch (value) {
  case "a":
    return <A />;
  default:
    return <B />;
}
```

```jsx
function PaymentStatus({ state }) {
  switch (state) {
    case "pending":
      return <p>Pending payment...</p>;
    case "paid":
      return <p>Payment received.</p>;
    case "failed":
      return <p>Payment failed.</p>;
    default:
      return <p>Unknown status.</p>;
  }
}
```

## 5) Retours anticipes (React)
Evitez les conditions imbriquees en retournant tot.

Syntaxe:

```jsx
if (!condition) return <Fallback />;
return <Main />;
```

```jsx
function Profile({ user }) {
  if (!user) return <p>Please sign in.</p>;
  if (!user.isActive) return <p>Your account is inactive.</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## 6) Ne rien rendre (React)
Retournez `null` pour ne rien afficher.

Syntaxe:

```jsx
if (!show) return null;
return <A />;
```

```jsx
function Warning({ show }) {
  if (!show) return null;
  return <div className="warning">This is a warning.</div>;
}
```

## 7) Classes CSS conditionnelles
Changez les styles selon l etat.

Syntaxe:

```jsx
const className = condition ? "a" : "b";
```

```jsx
function Button({ disabled }) {
  return (
    <button className={disabled ? "btn btn-disabled" : "btn"}>
      Save
    </button>
  );
}
```

## 8) Rendu conditionnel en JavaScript (DOM)
Sans React, mettez a jour le DOM selon des conditions.

Syntaxe:

```js
if (condition) {
  element.textContent = "A";
} else {
  element.textContent = "B";
}
```

```html
<div id="status"></div>
<script>
  const isOnline = true;
  const statusEl = document.getElementById("status");

  if (isOnline) {
    statusEl.textContent = "Online";
    statusEl.className = "status status-online";
  } else {
    statusEl.textContent = "Offline";
    statusEl.className = "status status-offline";
  }
</script>
```

## 9) Eviter les pieges courants
- Evitez d afficher `0` ou `false` avec `&&` si cela doit etre masque.
- Preferez des helpers ou un `switch` pour plusieurs branches.
- Gardez le JSX lisible en sortant les conditions complexes du return.

## 10) Mini exemple: liste de produits (React)
Un exemple complet avec chargement, etat vide, et donnees.

Syntaxe:

```jsx
if (isLoading) return <Loading />;
if (!items?.length) return <Empty />;
return <List />;
```

```jsx
function Products({ isLoading, items }) {
  if (isLoading) return <p>Loading products...</p>;
  if (!items || items.length === 0) return <p>No products found.</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```
