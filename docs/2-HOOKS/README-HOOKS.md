# 2 - HOOKS REACT

Bienvenue dans le guide complet des Hooks React! Les Hooks sont les briques fondamentales pour construire des composants React modernes et réactifs.

## 📚 Ordre de Lecture Recommandé

### Essentiels (COMMENCER ICI)
1. **[2.1 - useState](2.1-useState.md)** ⭐
   - Créer un état réactif
   - Updates simples et complexes
   - Gestion d'objets et d'arrays
   - **Temps**: ~30 min

2. **[2.2 - useEffect](2.2-useEffect.md)** ⭐
   - Effets secondaires après le rendu
   - Appels API
   - Nettoyage des ressources
   - **Temps**: ~40 min

3. **[2.3 - useRef](2.3-useRef.md)**
   - Accéder directement au DOM
   - Références persistantes
   - Quand NE PAS réutiliser useState
   - **Temps**: ~25 min

### Gestion d'État Avancée
4. **[2.4 - useReducer](2.4-useReducer.md)**
   - États complexes et liés
   - Machine d'état
   - Alternative à useState
   - **Temps**: ~35 min

5. **[2.5 - useContext](2.5-useContext.md)**
   - Partage global de données
   - Éviter le prop drilling
   - Authentification, thème, notifications
   - **Temps**: ~40 min

### Optimisation
6. **[2.6 - useCallback & useMemo](2.6-useCallback-useMemo.md)**
   - Mémorisation des performances
   - Quand l'utiliser et quand pas
   - Éviter la suroptimisation
   - **Temps**: ~40 min

### Réutilisabilité
7. **[2.7 - Custom Hooks](2.7-custom-hooks.md)** 🚀
   - Créer ses propres hooks
   - Extraire la logique réutilisable
   - Patterns courants (useFetch, useForm, etc.)
   - **Temps**: ~45 min

---

## 🎯 Quick Reference

| Hook | Utilité | Quand |
|------|---------|--------|
| **useState** | État réactif | Données qui changent |
| **useEffect** | Effets secondaires | Appels API, cleanup |
| **useRef** | Références persistantes | Accès DOM, pas de re-render |
| **useReducer** | Gestion État complexe | États liés multiples |
| **useContext** | Partage global | Auth, thème, notifs |
| **useCallback** | Fonction stable | Props de callback |
| **useMemo** | Calcul mémorisé | Calculs coûteux |
| **Custom Hook** | Réutiliser logique | Code dans plusieurs composants |

---

## 🔄 Chemins d'Apprentissage

### Débutant (Fondamentaux React)
```
0-START-HERE → 1-FONDAMENTAUX → 2.1 useState → 2.2 useEffect
                    ↓                              ↓
             Composants, Props            Premières interactifs
```

### Intermédiaire (Avec Interactions)
```
2.1-2.3 [useState, useEffect, useRef]
    ↓
3-INTERACTION-DONNEES (Listes, Formulaires, API)
    ↓
2.4 useReducer (État complexe)
    ↓
4-NAVIGATION (React Router)
```

### Avancé (Professionnelle)
```
2.5 useContext + 2.4 useReducer (Gestion état globale)
    ↓
2.6 useCallback + useMemo (Optimisation)
    ↓
2.7 Custom Hooks (Patterns réutilisables)
    ↓
5-AVANCE (Patterns pro)
```

---

## 💡 Règles Importantes des Hooks

### Les Deux Règles d'Or
1. **Appeler les hooks uniquement au top-level** (pas dans boucles/conditions/fonctions)
2. **Appeler les hooks uniquement depuis des composants React ou custom hooks**

```jsx
// ✅ BON
function Component() {
  const [state, setState] = useState(0);  // Top-level
  if (condition) {
    setState(1);  // OK - appeler une fonction
  }
}

// ❌ MAUVAIS
function Component() {
  if (condition) {
    useState(0);  // ERREUR - conditional call
  }
}
```

---

## 🚀 Cas d'Utilisation Courants

### Comment Implémenter...

**Un Compteur Simple?** → [useState](2.1-useState.md)

**Un Appel API?** → [useEffect](2.2-useEffect.md) + [useState](2.1-useState.md)

**Un Formulaire?** → [Custom Hook: useForm](2.7-custom-hooks.md)

**Accéder au DOM?** → [useRef](2.3-useRef.md)

**État Global (Auth)?** → [useContext](2.5-useContext.md)

**Calculs Coûteux?** → [useMemo](2.6-useCallback-useMemo.md)

**Comportement Complexe?** → [useReducer](2.4-useReducer.md)

---

## 📖 Retour à la Navigation

- [← Retour à Fondamentaux](../1-FONDAMENTAUX/)
- [→ Vers Interaction Données](../3-INTERACTION-DONNEES/)
- [📋 Menu Principal](../README.md)

---

## ⚡ Performance Tips

1. **Dépendances correctes** - la cause #1 des bugs
2. **Ne pas suroptimiser** - mesurer d'abord
3. **Utiliser les DevTools React** - inspecter les re-rendus
4. **Mémoriser au bon endroit** - fonctions/valeurs stables passées comme props

---

**Temps total recommandé**: 4-5 heures

Bon apprentissage! 🎓
