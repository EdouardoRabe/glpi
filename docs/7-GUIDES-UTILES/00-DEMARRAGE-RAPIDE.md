# 🚀 Démarrage Rapide - Guides Utiles

Chaque guide est **copy-paste ready** - change juste les noms et c'est fini!

---

## 📋 Guides par cas d'usage

### 🎨 Formulaires & Inputs

| Guide | Utilité | Pages concernées |
|-------|---------|-----------------|
| **[RADIO-BUTTONS-TOGGLES](RADIO-BUTTONS-TOGGLES.md)** | Radio buttons, checkboxes, toggles, selects | BOReset, FOCreateTicket, FOAssetsList |
| **[VALIDATION-FORMULAIRES](VALIDATION-FORMULAIRES.md)** | Valider avant soumettre, messages d'erreur | BOLogin, FOCreateTicket, BOImport |
| **[FILE-UPLOAD](FILE-UPLOAD.md)** | Upload fichiers, preview, drag & drop | BOImport, (futur: Asset upload) |
| **[DATE-TIME-PICKERS](DATE-TIME-PICKERS.md)** | Date/heure inputs, formatage, validation | FOCreateTicket, (futur: Recherche) |

### 📊 Listes & Tableaux

| Guide | Utilité | Pages concernées |
|-------|---------|-----------------|
| **[PAGINATION](PAGINATION.md)** | Paginer les listes | FOAssetsList, BOTicketList, BODashboard |
| **[MATERIAL-REACT-TABLE-DETAILS](MATERIAL-REACT-TABLE-DETAILS.md)** | Tableaux avec détails expansibles | BOTicketList, FOOderRow |

### 🗂️ Organisation du contenu

| Guide | Utilité | Pages concernées |
|-------|---------|-----------------|
| **[TABS-ACCORDION-COLLAPSE](TABS-ACCORDION-COLLAPSE.md)** | Onglets, accordéons, sections repliables | BOTicketList (dialog→accordion), BODashboard |
| **[MULTI-STEP-FORMS](MULTI-STEP-FORMS.md)** | Wizards multi-étapes | BOImport (futur), FOCreateTicket (futur) |

---

## 🎯 Comment utiliser ces guides

### Exemple: Ajouter pagination à FOAssetsList

1. **Ouvre** [PAGINATION.md](PAGINATION.md)
2. **Copie** le code du "Composant complet"
3. **Remplace:**
   - `assets` → `filteredAssets` (tu l'as déjà!)
   - `Asset` → `FOAssetsList` (nom du composant)
   - `"fo-assets-list"` → ton className
4. **Colle** et c'est fini! ✅

### Exemple: Ajouter validation à FOCreateTicket

1. **Ouvre** [VALIDATION-FORMULAIRES.md](VALIDATION-FORMULAIRES.md)
2. **Copie** la section "Validation simple"
3. **Remplace:**
   - `email, password` → `title, date`
   - Les patterns de validation
   - Les messages d'erreur
4. **Ajoute** avant `handleSubmit()` et c'est fini! ✅

---

## ✨ Guides supplémentaires (pour approfondir)

- **[GUIDE-ARRAY-MAP-SET.md](GUIDE-ARRAY-MAP-SET.md)** — Manipuler les arrays/sets
- **[GUIDE-ASYNC-USEEFFECT.md](GUIDE-ASYNC-USEEFFECT.md)** — Charger les données
- **[GUIDE-PROMISE-ALL.md](GUIDE-PROMISE-ALL.md)** — Charger plusieurs APIs
- **[GUIDE-ERREURS-MESSAGES.md](GUIDE-ERREURS-MESSAGES.md)** — Gérer les erreurs

---

## 🎓 Structure de chaque guide

Chaque guide suit ce pattern:

```
# Titre

## 🎯 Cas d'usage réels (où et comment l'utiliser dans ton projet)

## Logique de base (concept simple)

## Exemple basique (copie-colle)

## Exemple avancé (avec plus de fonctionnalités)

## CSS (styles)

## Exemple complet (production-ready)

## Bonnes pratiques (À faire/À éviter)
```

---

## 💡 Tips d'utilisation

✅ **Commence toujours** par "Cas d'usage réels" pour savoir où ça s'applique

✅ **Utilise** le code complet (pas juste les snippets)

✅ **Change** les noms pour adapter à tes variables

✅ **Ajoute** le CSS correspondant à ton fichier styles

✅ **Teste** dans le navigateur immédiatement

---

## 🔗 Navigation rapide

- **Par page du projet:**
  - [BOLogin.jsx](VALIDATION-FORMULAIRES.md)
  - [BOImport.jsx](FILE-UPLOAD.md) → [MULTI-STEP-FORMS](MULTI-STEP-FORMS.md)
  - [BOReset.jsx](RADIO-BUTTONS-TOGGLES.md)
  - [BODashboard.jsx](PAGINATION.md)
  - [BOTicketList.jsx](MATERIAL-REACT-TABLE-DETAILS.md) → [TABS-ACCORDION-COLLAPSE](TABS-ACCORDION-COLLAPSE.md)
  - [FOAssetsList.jsx](RADIO-BUTTONS-TOGGLES.md) → [PAGINATION](PAGINATION.md)
  - [FOCreateTicket.jsx](VALIDATION-FORMULAIRES.md) → [DATE-TIME-PICKERS](DATE-TIME-PICKERS.md) → [MULTI-STEP-FORMS](MULTI-STEP-FORMS.md)

---

**Besoin d'aide?** Chaque guide a une section "Exemples complets" qui montre le code final!

Bon code! 🚀
