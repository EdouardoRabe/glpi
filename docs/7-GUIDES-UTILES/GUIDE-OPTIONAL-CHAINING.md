# 📝 GUIDE - Optional Chaining `?.` et Nullish Coalescing `??`

## Optional Chaining `?.`

Accède de **manière sûre** aux propriétés d'un objet qui peut être `null` ou `undefined`.

```jsx
// ❌ ERREUR si user est null
const name = user.name  // TypeError!

// ✅ BON : retourne undefined au lieu d'erreur
const name = user?.name

// ✅ Avec méthodes aussi
user?.save?.()

// ✅ Avec accès par index
const first= array?.[0]
```

## Nullish Coalescing `??`

Utilise une **valeur par défaut** si la valeur est `null` ou `undefined` (mais pas `0` ou `false`).

```jsx
const age = user?.age ?? 18  // 18 si age est null/undefined

// Différence avec || :
const value = 0
console.log(value || 10)      // Affiche 10 (0 est falsy)
console.log(value ?? 10)      // Affiche 0 (0 n'est pas nullish)
```

## Combinaison

```jsx
const name = user?.profile?.name ?? 'Anonyme'
// Si user est null, ou user.profile est null, ou user.profile.name est null
// → Retourne 'Anonyme'
```

---

**[← Guides Principaux](GUIDE-IMPORTS.md)**
