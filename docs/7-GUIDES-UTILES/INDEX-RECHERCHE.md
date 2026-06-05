# 🔍 INDEX - Chercher rapidement

> Utilisez ce fichier pour trouver exactement ce que vous cherchez

---

## 🔥 PAR SITUATION

### "J'ai une erreur dans la console!"
→ [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)
- Cannot read property X of undefined
- is not a function
- Infinite loop
- Missing key
- Et 10+ autres erreurs avec fix immédiat

---

### "Mon composant ne change pas / affiche mal"
→ [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)
- Checklist: Pourquoi ça change pas?
- Mutation d'array/objet
- setState non-appelé
- useEffect mal configuré
- React.memo bloque

---

### "Je dois faire un formulaire"
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md)
- Input text (controlled)
- Checkbox (single + multiple)
- Radio buttons
- Select dropdown
- Textarea
- Exemple complet

---

### "Je dois charger des données avec une API"
→ [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md)
- Pattern standard useEffect + fetch
- Gestion loading/erreur
- Cleanup et race conditions
- Exemple: Fetch + Form
- Debounce recherche

---

### "Je dois utiliser .map(), .filter(), .find()"
→ [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md) ou [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md)
- .map() - transformer
- .filter() - garder certains
- .find() - trouver UN
- .reduce() - agréger
- Autres (.includes, .some, .every, .sort)

---

### "Je dois réunir deux tableaux ou utiliser Map/Set"
→ [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md)
- Réunir tableaux (spread, concat, push)
- Opérations Set (union, intersection, différence)
- Map vs Object
- Supprimer doublons
- Combiner Array + Map + Set

---

### "Je vois du code ❌ BAD, comment le fixer?"
→ [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)
- 30+ patterns côte à côte
- Mutation vs spread
- Async/await mauvaise
- Closures stale state
- Keys avec index
- Etc.

---

## 📍 PAR CONCEPT

### **État & Rendering**
- Pourquoi state ne change pas → [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)
- Mutation d'array/objet → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#mutation)
- Closures stale state → [GUIDE-CLOSURES-STALE-STATE.md](./GUIDE-CLOSURES-STALE-STATE.md)
- useEffect infinite loop → [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md#probleme-3)

### **Formulaires**
- Input text → [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#input-text)
- Checkbox → [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#checkbox)
- Radio buttons → [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#radio)
- Select → [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#select)
- Form submit → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#form-submit)

### **Array & Données**
- .map() → [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#map)
- .filter() → [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#filter)
- .find() → [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#find)
- .reduce() → [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#reduce)
- Supprimer element → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#supprimer)
- Modifier element → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#modifier)
- Réunir tableaux → [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md#réunir-deux-tableaux)
- Map, Set, opérations → [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md)

### **Async & API**
- useEffect + fetch → [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md)
- async/await → [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md#pattern)
- Fetch complet → [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md#complet)
- Loading/erreur → [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md#pattern)
- Race conditions → [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md#cleanup)

### **Erreurs & Debug**
- Cannot read property X → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#undefined)
- is not a function → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#not-a-function)
- Key warnings → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#key)
- Infinite loop → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#infinite)
- Maximum update depth → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#depth)

### **Patterns**
- Mutation vs spread → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)
- Controlled input → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#controlled)
- Optional chaining → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#optional)
- Destructuring → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#destructuring)

---

## 🆘 JE SAIS PAS QUOI FAIRE

**Choisissez:**

1. **J'ai une erreur dans la console**
   → [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)

2. **Mon affichage change pas**
   → [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)

3. **Je sais pas comment faire X**
   → Cherchez ci-dessous par MOT-CLÉ

4. **Je vois du code bizarre et sais pas pourquoi c'est mauvais**
   → [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)

---

## 🆎 PAR MOT-CLÉ

**A** - Array · Async · await
→ [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md) · [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md) · [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md)

**B** - Button · bind
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#button) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#event)

**C** - Checkbox · Closure · Controlled
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#checkbox) · [GUIDE-CLOSURES-STALE-STATE.md](./GUIDE-CLOSURES-STALE-STATE.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#controlled)

**D** - Destructuring · Delete
→ [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#destructuring) · [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#filter)

**E** - Event · Error
→ [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md) · [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)

**F** - Filter · Find · Fetch · Form
→ [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md) · [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md) · [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md)

**I** - Input · Infinite loop
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#input) · [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#infinite)

**K** - Key
→ [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#key) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#keys)

**L** - List · Loading
→ [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#map) · [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md)

**M** - Map · Mutation · Memo
→ [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md#partie-2--les-map) · [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#map) · [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#mutation)

**O** - Object · Optional chaining · onClick
→ [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md) · [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md)

**P** - Props · preventDefault
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#submit)

**R** - Radio · Reduce · Re-render
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#radio) · [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#reduce) · [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)

**S** - Select · setState · spread · Sort · Set
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#select) · [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md) · [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#sort) · [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md#partie-3--les-set)

**U** - undefined · Update
→ [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md#undefined) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#modifier)

**U** - useEffect · useRef · useState
→ [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md) · [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md)

---

## 📚 Tous les Guides

| Fichier | Contenu | Usage |
|---------|---------|-------|
| [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md) | Input, Checkbox, Radio, Select, Textarea | Faire des formulaires |
| [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md) | Pourquoi ça change/change pas? | Debug state |
| [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md) | Fetch, loading, erreur, cleanup | API calls |
| [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md) | .map(), .filter(), .find(), .reduce() | Manipuler tableaux |
| [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md) | Array complet, Map, Set, opérations ensembles | Réunir, filtrer, Map/Set |
| [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md) | 10+ erreurs courantes + fixes | Debug erreurs |
| [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md) | 30+ ❌ BAD vs ✅ GOOD | Apprendre patterns |
| [GUIDE-CLOSURES-STALE-STATE.md](./GUIDE-CLOSURES-STALE-STATE.md) | Closures, async, setState | Comprendre async |

---

## 💡 Astuces

- **Favorisez [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)** pour apprendre VISUELLEMENT
- **Gardez [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)** à portée de main
- **Consultez [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md)** comme cheat sheet
- **Utilisez [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md)** pour les opérations complexes sur Array/Map/Set

---

**← [Retour aux Guides](../README.md)**
