# Documentation complète des React Hooks

## 1. Qu’est-ce qu’un Hook en React ?

Les Hooks sont des fonctions spéciales introduites dans React à partir de la version 16.8.

Ils permettent :

- d’utiliser le state
- d’utiliser le cycle de vie
- de partager de la logique
- de gérer les effets secondaires

sans utiliser de classes (`class component`).

---

## Avant les Hooks

```jsx
class App extends React.Component {
    state = {
        count: 0
    }

    render() {
        return <h1>{this.state.count}</h1>
    }
}
```

---

## Avec Hooks

```jsx
function App() {
    const [count, setCount] = useState(0)

    return <h1>{count}</h1>
}
```

---

# 2. Règles importantes des Hooks

## a) Toujours utiliser les Hooks au sommet du composant

### BON

```jsx
function App() {
    const [count, setCount] = useState(0)
}
```

### MAUVAIS

```jsx
if (true) {
    useState(0)
}
```

---

## b) Utiliser uniquement dans :

- un composant React
- un custom hook

---

# 3. Les Hooks principaux

---

# useState

## Définition

Permet d’ajouter un état (state) dans un composant fonctionnel.

---

## Syntaxe

```jsx
const [variable, setVariable] = useState(valeurInitiale)
```

---

## Exemple simple

```jsx
import { useState } from "react"

function App() {

    const [count, setCount] = useState(0)

    return (
        <div>
            <h1>{count}</h1>

            <button onClick={() => setCount(count + 1)}>
                Ajouter
            </button>
        </div>
    )
}
```

---

## À quoi ça sert ?

- compteur
- formulaire
- mode sombre
- afficher/cacher
- stockage temporaire

---

## State avec objet

```jsx
const [user, setUser] = useState({
    nom: "Jean",
    age: 20
})
```

### Modification

```jsx
setUser({
    ...user,
    age: 25
})
```

---

# useEffect

## Définition

Permet d’exécuter du code après le rendu du composant.

---

## À quoi ça sert ?

- appel API
- timer
- récupération données
- événement clavier
- modification DOM

---

## Syntaxe

```jsx
useEffect(() => {

}, [])
```

---

## Exemple : chargement initial

```jsx
import { useEffect } from "react"

function App() {

    useEffect(() => {
        console.log("Composant chargé")
    }, [])

    return <h1>Hello</h1>
}
```

---

## Le tableau de dépendance

### Exécution une seule fois

```jsx
useEffect(() => {

}, [])
```

---

### Exécution quand une variable change

```jsx
useEffect(() => {
    console.log("count modifié")
}, [count])
```

---

### Exécution à chaque rendu

```jsx
useEffect(() => {

})
```

---

## Nettoyage (cleanup)

Très important pour :

- interval
- websocket
- événement

```jsx
useEffect(() => {

    const interval = setInterval(() => {
        console.log("hello")
    }, 1000)

    return () => {
        clearInterval(interval)
    }

}, [])
```

---

# useContext

## Définition

Permet de partager des données globales sans passer les props partout.

---

## À quoi ça sert ?

- thème
- utilisateur connecté
- langue
- panier ecommerce

---

## Création du contexte

```jsx
import { createContext } from "react"

export const UserContext = createContext()
```

---

## Fournir les données

```jsx
<UserContext.Provider value="Jean">
    <App />
</UserContext.Provider>
```

---

## Utiliser les données

```jsx
import { useContext } from "react"

const user = useContext(UserContext)
```

---

# useRef

## Définition

Permet de stocker une valeur sans re-render.

---

## À quoi ça sert ?

- accéder au DOM
- focus input
- stocker valeur persistante

---

## Exemple DOM

```jsx
import { useRef } from "react"

function App() {

    const inputRef = useRef()

    const focusInput = () => {
        inputRef.current.focus()
    }

    return (
        <div>
            <input ref={inputRef} />

            <button onClick={focusInput}>
                Focus
            </button>
        </div>
    )
}
```

---

# useMemo

## Définition

Mémorise un calcul coûteux.

---

## À quoi ça sert ?

Optimisation des performances.

---

## Exemple

```jsx
import { useMemo } from "react"

const resultat = useMemo(() => {
    return calculComplexe(nombre)
}, [nombre])
```

---

## Sans useMemo

Le calcul se refait à chaque rendu.

---

# useCallback

## Définition

Mémorise une fonction.

---

## À quoi ça sert ?

Évite les recréations inutiles de fonctions.

---

## Exemple

```jsx
const increment = useCallback(() => {
    setCount(count + 1)
}, [count])
```

---

# useReducer

## Définition

Alternative à useState pour logique complexe.

---

## Très utilisé pour :

- gros formulaires
- panier
- gestion état complexe

---

## Structure

```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

---

## Exemple

```jsx
function reducer(state, action) {

    switch(action.type) {

        case "increment":
            return {
                count: state.count + 1
            }

        default:
            return state
    }
}
```

---

## Utilisation

```jsx
const [state, dispatch] = useReducer(reducer, {
    count: 0
})
```

---

## Dispatch

```jsx
dispatch({
    type: "increment"
})
```

---

# useLayoutEffect

## Définition

Semblable à useEffect, mais exécuté avant l’affichage écran.

---

## Utilisation

- mesure taille élément
- animation précise

---

## Exemple

```jsx
useLayoutEffect(() => {
    console.log("avant affichage")
}, [])
```

---

# useImperativeHandle

## Définition

Personnalise les méthodes exposées avec ref.

---

## Souvent utilisé avec

```jsx
forwardRef
```

---

## Exemple

```jsx
useImperativeHandle(ref, () => ({
    focus() {
        inputRef.current.focus()
    }
}))
```

---

# useDebugValue

## Définition

Affiche des informations dans React DevTools.

---

## Utilisation

Surtout pour custom hooks.

---

## Exemple

```jsx
useDebugValue(isOnline ? "Online" : "Offline")
```

---

# 4. Hooks avancés React 18+

---

# useId

## Définition

Génère un identifiant unique.

---

## Exemple

```jsx
const id = useId()
```

---

## Utilisation

- accessibilité
- label/input

```jsx
<label htmlFor={id}>Nom</label>
<input id={id} />
```

---

# useTransition

## Définition

Permet des mises à jour non urgentes.

---

## Exemple

```jsx
const [isPending, startTransition] = useTransition()

startTransition(() => {
    setData(nouvelleData)
})
```

---

## Utilisation

- recherche
- gros filtrage
- UI fluide

---

# useDeferredValue

## Définition

Retarde une valeur lourde à afficher.

---

## Exemple

```jsx
const deferredSearch = useDeferredValue(search)
```

---

# useSyncExternalStore

## Définition

Synchronise React avec un store externe.

---

## Utilisation

- Redux
- store custom

---

# useInsertionEffect

## Définition

Hook spécial pour librairies CSS.

---

## Rarement utilisé directement.

---

# 5. Custom Hooks

## Définition

Créer son propre Hook personnalisé.

---

## Exemple : récupération API

```jsx
import { useState, useEffect } from "react"

function useFetch(url) {

    const [data, setData] = useState(null)

    useEffect(() => {

        fetch(url)
            .then(res => res.json())
            .then(data => setData(data))

    }, [url])

    return data
}
```

---

## Utilisation

```jsx
const users = useFetch("/api/users")
```

---

# 6. Différence entre Hooks importants

| Hook | Sert à |
|---|---|
| useState | état simple |
| useEffect | effet secondaire |
| useContext | données globales |
| useRef | référence DOM |
| useMemo | mémoriser calcul |
| useCallback | mémoriser fonction |
| useReducer | état complexe |

---

# 7. Quand utiliser quoi ?

## useState

Petit état simple.

---

## useReducer

Logique complexe.

---

## useMemo

Calcul lourd.

---

## useCallback

Optimisation fonction.

---

## useContext

Données partagées globalement.

---

# 8. Cycle général des Hooks

```jsx
function App() {

    const [data, setData] = useState([])

    useEffect(() => {

        fetch("/api")
            .then(res => res.json())
            .then(data => setData(data))

    }, [])

    return (
        <div>
            {data.map(item => (
                <p>{item.nom}</p>
            ))}
        </div>
    )
}
```

---

# 9. Bonnes pratiques

## Éviter trop de useEffect

Beaucoup de débutants abusent de useEffect.

---

## Toujours nettoyer

```jsx
return () => {
    clearInterval(interval)
}
```

---

## Séparer logique avec custom hooks

### BON

```jsx
useAuth()
useFetch()
useTheme()
```

---

# 10. Hooks les plus utilisés en entreprise

## Très fréquents

- useState
- useEffect
- useContext
- useRef

---

## Moyennement fréquents

- useMemo
- useCallback
- useReducer

---

## Plus rares

- useImperativeHandle
- useInsertionEffect
- useDebugValue

---

# 11. Exemple complet

```jsx
import {
    useState,
    useEffect
} from "react"

function App() {

    const [users, setUsers] = useState([])

    useEffect(() => {

        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(data => setUsers(data))

    }, [])

    return (
        <div>

            <h1>Liste utilisateurs</h1>

            {
                users.map(user => (
                    <p key={user.id}>
                        {user.name}
                    </p>
                ))
            }

        </div>
    )
}
```

---

# 12. Conclusion

Les Hooks sont aujourd’hui la base du développement moderne avec React.

## Les plus importants à maîtriser d’abord

1. useState
2. useEffect
3. useContext
4. useRef

---

## Puis ensuite

5. useReducer
6. useMemo
7. useCallback

---

Quand tu maîtrises ces Hooks, tu peux créer :

- dashboard
- ERP
- CRM
- application temps réel
- système d’authentification
- application API
- gestion complexe d’état

avec une architecture moderne et professionnelle.

