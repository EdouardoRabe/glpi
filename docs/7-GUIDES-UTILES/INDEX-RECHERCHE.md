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

### "Je dois ouvrir une popup (modal) avec un objet ou un id"
→ [README-POPUP-OBJET-ID.md](./README-POPUP-OBJET-ID.md)
- Ouvrir une modal avec l'objet complet
- Ouvrir une modal avec un id
- Quand choisir objet vs id
- Erreurs frequentes et checklist

---

### "Je dois charger des données avec une API"
→ [GUIDE-ASYNC-USEEFFECT.md](./GUIDE-ASYNC-USEEFFECT.md)
- Pattern standard useEffect + fetch
- Gestion loading/erreur
- Cleanup et race conditions
- Exemple: Fetch + Form
- Debounce recherche

---

### "Je dois passer des données d'une page à une autre (useNavigate, useLocation, params)"
→ [3.4-passer-donnees-entre-pages.md](../4-NAVIGATION/3.4-passer-donnees-entre-pages.md)
- Param URL (`useNavigate` + `useParams`)
- Query string (`useSearchParams`)
- State / objet complet (`useNavigate` + `useLocation`)
- Le piège du refresh (state perdu) + pattern robuste
- Passer un message après action ("Ticket créé !")
- Quelle méthode choisir

---

### "Je dois faire une recherche / filtrage multicritères"
→ [multi-criteria-filter.md](../8-PATTERNS-REELS/07-RECHERCHE-FILTRES/multi-criteria-filter.md)
- Filtrage côté client (JavaScript)
- Filtrage côté serveur (RSQL - API GLPI)
- Combos complexes (AND, OR, NOT)
- Hook custom réutilisable
- Performance et debounce
- Checkboxes, dates, recherche textuelle

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

### "Je dois afficher un statut / une priorité avec une couleur"
→ [BADGES-ET-PASTILLES-STATUT.md](./BADGES-ET-PASTILLES-STATUT.md)
- Badge simple et coloré
- Pastille avec point (en ligne / hors ligne)
- Badge de statut de ticket GLPI (id → couleur)
- Badge de priorité
- Badge compteur (notifications)

---

### "Je dois afficher une liste de cartes / une grille"
→ [CARTES-ET-GRILLES.md](./CARTES-ET-GRILLES.md)
- Carte simple
- Grille responsive (sans media query)
- Carte d'asset GLPI
- Cartes de statistiques (dashboard)
- Carte cliquable

---

### "Ma page est vide pendant le chargement / quand il n'y a pas de données"
→ [CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md](./CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md)
- Squelette animé (skeleton)
- Squelette de carte et de tableau
- Écran vide (aucune donnée)
- Pattern complet : loading → vide → données

---

### "Je veux un message d'aide au survol (?)"
→ [INFOBULLES-TOOLTIPS.md](./INFOBULLES-TOOLTIPS.md)
- Tooltip CSS pur (le plus simple)
- Tooltip composant React
- Tooltip dans 4 directions
- Icône d'aide "?" avec texte multi-lignes

---

### "Je veux faire défiler des images / des cartes (carousel, slider, galerie)"
→ [CAROUSEL-ET-DIAPORAMAS.md](./CAROUSEL-ET-DIAPORAMAS.md)
- Carousel basique (1 slide à la fois, flèches)
- Carousel avec indicateurs (dots)
- Carousel automatique (auto-play)
- Slider de cartes (plusieurs visibles)
- Scroll horizontal CSS pur (scroll-snap)
- Galerie d'images (grande + miniatures)

---

### "Je veux un loading rond qui tourne / trois points / spinner / barre de progression"
→ [PROGRESS-BARS.md](./PROGRESS-BARS.md)
- Barres de progression (déterminé : upload, %)
- Spinner rond qui tourne (le classique)
- Trois points qui rebondissent
- Trois points qui tournent en rond (orbit)
- Spinner + texte centré + plein écran (overlay)

---

### "Je veux un champ description / un éditeur de texte riche (gras, listes) / TinyMCE"
→ [EDITEUR-TEXTE-DESCRIPTION.md](./EDITEUR-TEXTE-DESCRIPTION.md)
- Textarea simple (compteur, auto-resize)
- React Quill (install + usage, compatible React 19)
- TinyMCE self-hosted (sans clé API)
- Afficher le HTML sauvegardé (dangerouslySetInnerHTML + DOMPurify)
- Intégration GLPI (ticket.content = HTML)

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

**B** - Button · bind · Badge · Pastille
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#button) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#event) · [BADGES-ET-PASTILLES-STATUT.md](./BADGES-ET-PASTILLES-STATUT.md)

**C** - Checkbox · Closure · Controlled · Carte · Card · Chargement · Carousel · Carrousel
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#checkbox) · [GUIDE-CLOSURES-STALE-STATE.md](./GUIDE-CLOSURES-STALE-STATE.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md#controlled) · [CARTES-ET-GRILLES.md](./CARTES-ET-GRILLES.md) · [CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md](./CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md) · [CAROUSEL-ET-DIAPORAMAS.md](./CAROUSEL-ET-DIAPORAMAS.md)

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

**D** - Diaporama · Slider · Description
→ [CAROUSEL-ET-DIAPORAMAS.md](./CAROUSEL-ET-DIAPORAMAS.md) · [EDITEUR-TEXTE-DESCRIPTION.md](./EDITEUR-TEXTE-DESCRIPTION.md)

**E** - Éditeur · Editor · WYSIWYG
→ [EDITEUR-TEXTE-DESCRIPTION.md](./EDITEUR-TEXTE-DESCRIPTION.md)

**N** - Navigate · useNavigate · Navigation
→ [3.4-passer-donnees-entre-pages.md](../4-NAVIGATION/3.4-passer-donnees-entre-pages.md)

**L** - useLocation · Location · state
→ [3.4-passer-donnees-entre-pages.md](../4-NAVIGATION/3.4-passer-donnees-entre-pages.md)

**G** - Grille · Grid · Galerie · Gallery
→ [CARTES-ET-GRILLES.md](./CARTES-ET-GRILLES.md) · [CAROUSEL-ET-DIAPORAMAS.md](./CAROUSEL-ET-DIAPORAMAS.md)

**P** - Pastille · Priorité · Pagination
→ [BADGES-ET-PASTILLES-STATUT.md](./BADGES-ET-PASTILLES-STATUT.md) · [PAGINATION.md](./PAGINATION.md)

**S** - Select · setState · spread · Sort · Set · Skeleton · Squelette · Statut · Status
→ [GUIDE-FORMULAIRE-ELEMENTS.md](./GUIDE-FORMULAIRE-ELEMENTS.md#select) · [GUIDE-ETAT-RE-RENDER.md](./GUIDE-ETAT-RE-RENDER.md) · [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md) · [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md#sort) · [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md#partie-3--les-set) · [CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md](./CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md) · [BADGES-ET-PASTILLES-STATUT.md](./BADGES-ET-PASTILLES-STATUT.md)

**T** - Tooltip · Infobulle · TinyMCE · Textarea · Texte riche
→ [INFOBULLES-TOOLTIPS.md](./INFOBULLES-TOOLTIPS.md) · [EDITEUR-TEXTE-DESCRIPTION.md](./EDITEUR-TEXTE-DESCRIPTION.md)

**Q** - Quill · react-quill
→ [EDITEUR-TEXTE-DESCRIPTION.md](./EDITEUR-TEXTE-DESCRIPTION.md)

**V** - Vide · Empty state
→ [CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md](./CHARGEMENT-SQUELETTE-ET-ECRAN-VIDE.md)

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
| [README-POPUP-OBJET-ID.md](./README-POPUP-OBJET-ID.md) | Ouvrir une modal avec objet ou id | Detailler un ticket dans une popup |

---

## 💡 Astuces

- **Favorisez [GUIDE-AVANT-APRES-PATTERNS.md](./GUIDE-AVANT-APRES-PATTERNS.md)** pour apprendre VISUELLEMENT
- **Gardez [GUIDE-ERREURS-MESSAGES.md](./GUIDE-ERREURS-MESSAGES.md)** à portée de main
- **Consultez [GUIDE-ARRAY-METHODES.md](./GUIDE-ARRAY-METHODES.md)** comme cheat sheet
- **Utilisez [GUIDE-ARRAY-MAP-SET.md](./GUIDE-ARRAY-MAP-SET.md)** pour les opérations complexes sur Array/Map/Set

---

**← [Retour aux Guides](../README.md)**
