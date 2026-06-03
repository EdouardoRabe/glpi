# 🎬 PATTERNS RÉELS - Cas d'Usage Pratiques

> Exemples concrets et patterns réutilisables pour vos projets

---

## 📋 Structure des patterns

Chaque pattern contient :
- 🎯 **Le problème** - Qu'est-ce qu'on veut faire?
- 💡 **La solution** - Comment l'implémenter?
- 📝 **Code complet** - Exemple fonctionnel copiable
- ⚠️ **Pièges courants** - Ce qu'il faut éviter
- 🔗 **Variations** - Autres approches/améliorations

---

## 🗂️ Catégories de patterns

### **01-FORMULAIRES-VALIDATION**
Gestion des formulaires avec validation, messages d'erreur, popups

- `form-simple-validation.md` - Validation basique temps réel
- `form-validation-popup-erreur.md` - Afficher erreurs dans une popup
- `form-success-popup.md` - Message succès après soumission
- `form-multi-etapes.md` - Formulaires complexes (ex: inscription) 
- `form-upload-fichiers.md` - Upload + preview + validation

### **02-AUTHENTIFICATION**
Login, inscription, session, protection des routes

- `login-popup.md` - Login modal avec validation
- `login-api-appel.md` - Call API + gestion erreurs d'auth
- `inscription-flow.md` - Formulaire inscription + popup confirmation
- `session-gestion.md` - Garder session active, logout

### **03-DONNEES-CRUD**
Create, Read, Update, Delete avec confirmations

- `liste-suppression-confirmation.md` - Popup avant suppression
- `liste-modification-inline.md` - Éditer directement dans la liste
- `liste-pagination.md` - Charger par pages (with loading state)
- `crud-complet.md` - Create + Read + Update + Delete ensemble

### **04-NOTIFICATIONS**
Messages utilisateur (succès, erreur, info)

- `toast-simple.md` - Notifications temporaires
- `notification-stacking.md` - Plusieurs notifications en même temps
- `notification-with-actions.md` - Notifications avec boutons (Undo, etc)

### **05-MODALES-POPUPS**
Affichage de popups, modales, dialogues

- `modal-simple.md` - Modal personnalisée custom CSS
- `modal-confirmation.md` - "Êtes-vous sûr?"
- `modal-formulaire.md` - Formulaire à l'intérieur d'une modal
- `modal-avec-scroll.md` - Modal avec contenu scrollable

### **06-ETATS-LOADING**
Gestion du chargement, skeleton, disable buttons

- `button-loading-state.md` - Button avec état "chargement..." 
- `skeleton-loading.md` - Skeleton screens (avant données)
- `refetch-success.md` - Rechargement + message succès
- `optimistic-updates.md` - Mise à jour avant API response

### **07-RECHERCHE-FILTRES**
Recherche en temps réel, debounce, filtres

- `search-debounce.md` - Recherche avec délai
- `filtres-multi.md` - Filtres combinés
- `search-api-with-loading.md` - Recherche API + loading + placeholder

### **08-ERREURS-HANDLING**
Gestion d'erreurs, retry, fallback

- `error-boundary.md` - Attraper les erreurs de composants
- `api-error-affichage.md` - Afficher erreur API
- `retry-avec-popup.md` - Proposer "Réessayer?" en cas d'erreur
- `offline-handling.md` - Détecter offline et afficher message

---

## 🚀 Patterns à créer en priorité

**Lesquels voulez-vous que je détaille d'abord?** (Cochez max 5 pour commencer)

```
[ ] form-success-popup.md
[ ] login-popup.md  
[ ] liste-suppression-confirmation.md
[ ] toast-simple.md
[ ] modal-simple.md
[ ] button-loading-state.md
[ ] search-debounce.md
[ ] error-boundary.md
[ ] Autre?
```

---

## 📌 Conventions des patterns

Chaque fichier suivra le format :

```markdown
# 📝 Nom du Pattern

## 🎯 Problème
Qu'est-ce qu'on veut faire?

## 💡 Solution
(Brève explication)

## 📝 Code Complet
\`\`\`jsx
(Code prêt à copier)
\`\`\`

## ⚠️ Pièges Courants
- Piège 1
- Piège 2

## 🔗 Variations
- Approche alternative 1
- Approche alternative 2
```

---

## 🔗 Navigation

← [Retour](../README.md)  
→ Voir aussi: [6-COMPOSANTS-REELS](../6-COMPOSANTS-REELS/README.md)
