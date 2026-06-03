# Routing React Router

Ce document presente les principes de base du routage avec React Router (v6+), avec des exemples simples et des bonnes pratiques.

## 1) Concepts essentiels

- Le routeur gere la navigation cote client sans recharger la page.
- Les routes associent une URL a un composant React.
- Le rendu est declare dans l arbre de composants.

## 2) Installation

```bash
npm install react-router-dom
```

## 3) Mise en place minimale

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 4) Navigation

### Liens declaratifs

```jsx
import { Link, NavLink } from "react-router-dom";

<Link to="/about">A propos</Link>

<NavLink
  to="/about"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  A propos
</NavLink>
```

Notes utiles sur Link:

- Utiliser Link pour la navigation interne (evite le rechargement de page).
- Utiliser une balise a pour les liens externes (http/https).
- Le prop to accepte un chemin absolu, relatif, ou un objet { pathname, search, hash }.
- replace remplace l entree d historique au lieu d en ajouter une nouvelle.
- state permet de passer un etat temporaire sans l exposer dans l URL.

```jsx
<Link to="/products/42">Voir produit</Link>

<Link to="details">Lien relatif</Link>

<Link to={{ pathname: "/search", search: "?q=react" }}>
  Rechercher
</Link>

<Link to="/login" replace>
  Aller login
</Link>

<Link to="/checkout" state={{ from: "cart" }}>
  Paiement
</Link>
```

Exemple Link + Route ensemble:

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/about">A propos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation imperatif

```jsx
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return <button onClick={goHome}>Retour accueil</button>;
}
```

## 5) Routes imbriquees (nested routes)

```jsx
import { Outlet, Route, Routes } from "react-router-dom";

function Layout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<Layout />}>
    <Route index element={<Overview />} />
    <Route path="stats" element={<Stats />} />
  </Route>
</Routes>
```

## 6) Parametres d URL

```jsx
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  return <div>Produit {id}</div>;
}

<Route path="/products/:id" element={<ProductDetail />} />
```

### Passer des variables dans les liens (params)

Les params se mettent dans le chemin de la route avec `:` et se recuperent via `useParams()`.

```jsx
import { Link, Route, Routes, useParams } from "react-router-dom";

function TestLink() {
  const userId = 42;

  return (
    <Link to={`/test/${userId}`}>Voir test {userId}</Link>
  );
}

function TestPage() {
  const { id } = useParams();
  return <div>Test id: {id}</div>;
}

<Routes>
  <Route path="/test/:id" element={<TestPage />} />
</Routes>
```

Exemple avec plusieurs params:

```jsx
<Route path="/users/:userId/posts/:postId" element={<PostDetail />} />

function PostDetail() {
  const { userId, postId } = useParams();
  return (
    <div>
      User {userId} - Post {postId}
    </div>
  );
}
```

Navigation imperative avec params:

```jsx
import { useNavigate } from "react-router-dom";

function GoToTest() {
  const navigate = useNavigate();

  const openTest = (id) => {
    navigate(`/test/${id}`);
  };

  return <button onClick={() => openTest(7)}>Ouvrir test 7</button>;
}
```

Bon a savoir:

- `useParams()` retourne des strings. Convertir si besoin (`Number(id)`).
- Encoder les valeurs si elles peuvent contenir des espaces ou caracteres speciaux.
- Un param manquant ne matche pas la route (ex: `/test/` ne matche pas `/test/:id`).

### Passer des variables hors URL (state)

Utile pour des donnees temporaires qui ne doivent pas apparaitre dans l URL.

```jsx
import { Link, useLocation } from "react-router-dom";

<Link to="/checkout" state={{ from: "cart", total: 99 }}>
  Paiement
</Link>

function Checkout() {
  const location = useLocation();
  const { from, total } = location.state || {};

  return (
    <div>
      from: {from} - total: {total}
    </div>
  );
}
```

## 7) Query string

```jsx
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  return <div>Recherche: {q}</div>;
}
```

## 8) Route 404

```jsx
<Route path="*" element={<NotFound />} />
```

## 9) Protection des routes (auth)

```jsx
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ isAuth }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Outlet />;
}

<Routes>
  <Route element={<RequireAuth isAuth={isAuth} />}>
    <Route path="/admin" element={<Admin />} />
  </Route>
</Routes>
```

## 10) Redirections

```jsx
<Route path="/old" element={<Navigate to="/new" replace />} />
```

Navigate permet de declarer une redirection directement dans le rendu:

```jsx
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ isAuth }) {
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
```

Apres la redirection, recuperer la destination et lier vers la page:

```jsx
import { useLocation, useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Se connecter</button>
      <Link to="/">Retour accueil</Link>
    </div>
  );
}
```

## 11) Chargement lazy

```jsx
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Settings = lazy(() => import("./pages/Settings"));

<Routes>
  <Route
    path="/settings"
    element={
      <Suspense fallback={<div>Loading...</div>}>
        <Settings />
      </Suspense>
    }
  />
</Routes>
```

## 12) Layouts et navigation active

- Utiliser un Layout avec <Outlet /> pour factoriser header/footer.
- Utiliser NavLink pour surligner le lien actif.

## 13) Data router (loader/action) - optionnel

React Router v6.4+ propose un mode data router avec createBrowserRouter, loader, action et errorElement.

```jsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

## 14) Bonnes pratiques

- Organiser les pages dans un dossier pages/.
- Regrouper les routes par domaine (admin, dashboard, etc.).
- Eviter les routes ambigues, preferer des chemins clairs.
- Utiliser des routes imbriquees pour les layouts.
- Centraliser les routes dans un fichier si le projet est grand.

## 15) Resume rapide

- BrowserRouter + Routes + Route pour le routage classique.
- Link/NavLink pour naviguer.
- useNavigate pour redirections code.
- useParams pour URL dynamiques.
- Route "*" pour 404.
- Nested routes avec Outlet.
