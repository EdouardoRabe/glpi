# 🚀 React - Guide Complet - PAR OÙ COMMENCER ?

> **Bienvenue !** Cette documentation a été créée pour maîtriser React de façon **progressive et structurée**, sans avoir besoin de l'IA pendant les révisions/examens.

---

## 📊 Vue d'ensemble de ta progression

```
🟢 Niveau 1: FONDAMENTAUX (Essentiels)
   ├─ Setup & Installation
   ├─ JSX & Composants
   ├─ Props
   └─ Rendu Conditionnel
         ↓
🟡 Niveau 2: HOOKS REACT ⭐ (La clé de la réactivité)
   ├─ useState
   ├─ useEffect
   ├─ useRef
   ├─ useReducer
   ├─ useContext
   ├─ Custom Hooks
   └─ Et plus...
         ↓
🟠 Niveau 3: INTERACTION & DONNÉES
   ├─ Listes & .map()
   ├─ Formulaires
   ├─ Appels API (Fetch)
   └─ CSS & Styling
         ↓
🔵 Niveau 4: NAVIGATION
   ├─ React Router
   ├─ Paramètres URL
   └─ Navigation Avancée
         ↓
🟣 Niveau 5: AVANCÉ (Optimisation & Patterns)
   ├─ Context API Avancée
   ├─ Patterns Professionnels
   └─ Performance
         ↓
🟠 Niveau 6: COMPOSANTS RÉUTILISABLES
   ├─ Composants de base
   ├─ Composants interactifs
   └─ Layouts & Structures
```

---

## ⏱️ CHEMINS RECOMMANDÉS

### 🔰 **Tu débutes complètement** (1ère fois avec React)

1. [Setup & Structure](../1-FONDAMENTAUX/1.1-setup-et-structure.md)
2. [JSX - Syntaxe](../1-FONDAMENTAUX/1.2-jsx-syntaxe.md)
3. [Composants Fonctionnels](../1-FONDAMENTAUX/1.3-composants-fonctionnels.md)
4. [Props](../1-FONDAMENTAUX/1.4-props.md)
5. [Rendu Conditionnel](../1-FONDAMENTAUX/1.5-rendu-conditionnel.md)
6. **➡️ HOOKS** : [useState](../2-HOOKS/2.1-useState.md) et [useEffect](../2-HOOKS/2.2-useEffect.md)
7. **→ Fais un petit projet** : Compteur, Todo simple
8. Explore les autres hooks : [useRef](../2-HOOKS/2.3-useRef.md), [useReducer](../2-HOOKS/2.4-useReducer.md)

### 📚 **Tu connais déjà les bases et tu veux progresser**

1. [2-HOOKS](../2-HOOKS/README-HOOKS.md) (tous les hooks pour la maîtrise totale)
2. [Listes & .map()](../3-INTERACTION-DONNEES/2.1-listes-et-keys.md)
3. [Formulaires](../3-INTERACTION-DONNEES/2.2-formulaires-complets.md)
4. [Fetch & API](../3-INTERACTION-DONNEES/2.3-fetch-et-api.md)
5. [React Router](../4-NAVIGATION/3.1-react-router-bases.md)
6. **→ Fais un projet** : Liste de produits, API météo
7. [Context API Avancée](../5-AVANCE/4.1-context-api.md)

### 🎯 **Tu veux faire un projet GLPI**

1. Complète les fondamentaux ✅ : 1-FONDAMENTAUX
2. Apprends les **Hooks essentiels** : [2-HOOKS](../2-HOOKS/README-HOOKS.md)
3. [Fetch & API](../3-INTERACTION-DONNEES/2.3-fetch-et-api.md)
4. [useContext](../2-HOOKS/2.5-useContext.md) (état global)
5. [Guide API Keys - Sécurité](../7-GUIDES-UTILES/GUIDE-API-KEYS.md)
6. [Projet GLPI Dashboard](../8-PROJETS-COMPLETS/PROJET-GLPI-Dashboard.md)

---

## 📖 GUIDES RAPIDES À CONNAÎTRE

**Lis ces guides avant de coder :**

- [Guide Imports](../7-GUIDES-UTILES/GUIDE-IMPORTS.md) - Comment faire des imports (87% des erreurs !)
- [Guide Guillemets](../7-GUIDES-UTILES/GUIDE-GUILLEMETS.md) - Simples `''`, doubles `""`, backticks `` ` ``
- [Guide Optional Chaining](../7-GUIDES-UTILES/GUIDE-OPTIONAL-CHAINING.md) - Les opérateurs `?.` et `??`
- [Guide API Keys](../7-GUIDES-UTILES/GUIDE-API-KEYS.md) - Sécuriser tes clés API avec `.env`

---

## ✨ STRUCTURE DE CETTE DOCUMENTATION

```
📚 /docs
├── 0-START-HERE/          ← Tu es ici ! 🎯
│
├── 1-FONDAMENTAUX/        ← Les bases (Req : aucune)
│   ├── 1.1-setup-et-structure.md
│   ├── 1.2-jsx-syntaxe.md
│   ├── 1.3-composants-fonctionnels.md
│   ├── 1.4-props.md
│   ├── 1.5-useState.md
│   ├── 1.6-useEffect.md
│   └── 1.7-rendu-conditionnel.md
│
├── 2-INTERACTION-DONNEES/ ← Travail avec données (Req : 1-FONDAMENTAUX)
│   ├── 2.1-listes-et-keys.md
│   ├── 2.2-formulaires-complets.md
│   ├── 2.3-fetch-et-api.md
│   └── 2.4-styles-css.md
│
├── 3-NAVIGATION/          ← Router et navigation (Req : 1-FONDAMENTAUX)
│   ├── 3.1-react-router-bases.md
│   ├── 3.2-parametres-url.md
│   └── 3.3-navigation-avancee.md
│
├── 4-AVANCE/              ← Patterns profe (Req : 2-INTERACTION-DONNEES)
│   ├── 4.1-context-api.md
│   ├── 4.2-custom-hooks.md
│   ├── 4.3-patterns-professionnels.md
│   └── 4.4-performance.md
│
├── 5-COMPOSANTS-REELS/    ← Prêt à copier-coller (Req : 1-FONDAMENTAUX)
│   ├── 5.1-composants-base.md
│   ├── 5.2-composants-interactifs.md
│   └── 5.3-layouts-et-structures.md
│
├── 6-GUIDES-UTILES/       ← Références rapides
│   ├── GUIDE-IMPORTS.md
│   ├── GUIDE-GUILLEMETS.md
│   ├── GUIDE-OPTIONAL-CHAINING.md
│   ├── GUIDE-API-KEYS.md
│   ├── GUIDE-CSV-JSON.md
│   └── GUIDE-CSV-XML.md
│
└── 7-PROJETS-COMPLETS/    ← Exemples concrets (À faire après chaque niveau)
    ├── PROJET-1-TodoApp-Simple.md
    ├── PROJET-2-ListeProduits.md
    ├── PROJET-3-AppMeteo.md
    └── PROJET-GLPI-Dashboard.md
```

---

## 💡 CONSEILS POUR BIEN APPRENDRE

### ✅ À FAIRE

- **Lire avant de coder** : Lis le guide complet avant de taper du code
- **Tester le code** : Chaque exemple peut être copié et testé immédiatement dans ton projet
- **Comprendre, pas mémoriser** : Où ça va ? Comment ça fonctionne ? Pourquoi ?
- **Faire des projets** : Après chaque niveau, fais un petit projet
- **Réviser sans l'IA** : D'où le format "QUOI + POURQUOI + COMMENT"

### ❌ À ÉVITER

- Sauter les fondamentaux (JSX, props, useState)
- Copier du code sans le lire/comprendre
- Mélanger les concepts (Context avant useState = confusion)
- Faire un grand projet avant de maîtriser les bases

---

## 📌 FORMAT DE CETTE DOCUMENTATION

Chaque fichier suit la même structure :

```
# Titre du concept

## QUOI ?
❓ Explique ce que c'est simplement

## POURQUOI ?
💡 À quoi ça sert ? Quand l'utiliser ?

## COMMENT ?
🛠️ La syntaxe, les étapes, les règles

## EXEMPLES
✅ Code complet, prêt à copier

## PIÈGES COURANTS
⚠️ Erreurs fréquentes et solutions
```

---

## 🎓 PREMIER EXERCICE : Ton premier composant React

Si tu es **complètement new** en React, fais ça maintenant :

1. Crée un projet : `npm create vite@latest mon-app -- --template react`
2. Ouvre [Setup & Structure](../1-FONDAMENTAUX/1.1-setup-et-structure.md)
3. Lance ton serveur de dev
4. Crée un composant `<Bouton />` qui affiche "Clique-moi !"
5. Ajoute un compteur qui monte à chaque clic

**Si tu réussis sans erreur = tu es prêt pour la suite ! 🚀**

---

## 📞 BESOIN D'AIDE ?

Si tu comprends pas un concept :
1. Relis le section "QUOI ?" et "POURQUOI ?"
2. Teste le code dans un fichier isolé
3. Consulte le guide "PIÈGES COURANTS"
4. Regarde l'équivalent dans "PROJETS-COMPLETS"

---

**Bonne chance ! 💪**

Modifié : Juin 2026
