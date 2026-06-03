# 📚 Documentation React - Guide Complet d'Apprentissage

> **Objectif:** Une documentation réutilisable pour réviser React sans IA (examens)  
> **Format:** QUOI + POURQUOI + COMMENT + Code réutilisable + Exemples  
> **Mise à jour:** Mise à jour régulière pendant l'apprentissage

---

## 📖 Table des matières

### 🔍 Guide d'apprentissage (À LIRE D'ABORD!)
- [Guide Imports](./GUIDE-IMPORTS.md) - Comment ajouter les imports (crucial pour les débutants!)
- [Guide Guillemets](./GUIDE-GUILLEMETS.md) - Les 3 types de guillemets et quand les utiliser ⭐ **NOUVEAU!**
- [Guide Optional Chaining](./GUIDE-OPTIONAL-CHAINING.md) - `?.` et `??` pour accéder en sécurité aux données ⭐ **NOUVEAU!**
- [Guide CSV en JSON](./GUIDE-CSV-JSON.md) - Export/Import CSV en format JSON ⭐ **NOUVEAU!**
- [Guide CSV en XML](./GUIDE-CSV-XML.md) - Export/Import CSV en format XML ⭐ **NOUVEAU!**
- [Guide API Keys](./GUIDE-API-KEYS.md) - Stocker les clés API de façon sécurisée avec .env ⭐ **NOUVEAU!**

### 🔵 Niveau 1 : Fondamentaux
L'essentiel pour démarrer avec React.

1. [Setup & Structure du projet](./1-fondamentaux/1-setup.md)
2. [Composants & JSX](./1-fondamentaux/2-composants.md)
3. [Props - Passer des données](./1-fondamentaux/3-props.md)
4. [useState - État local](./1-fondamentaux/4-useState.md)
5. [useEffect - Effets secondaires](./1-fondamentaux/5-useEffect.md)
6. [React Router - Navigation multipages](./1-fondamentaux/6-routing.md)
7. [URLs et Paramètres - useLocation, useSearchParams, Template Literals](./1-fondamentaux/7-urls-et-params.md) ⭐ **NOUVEAU!**
8. [Conditional Rendering - Afficher/Cacher du contenu](./1-fondamentaux/8-conditional-rendering.md) ⭐ **NOUVEAU!**

### 🟢 Niveau 2 : Pratique
Manipuler des données et créer des interactions.

1. [Listes & .map()](./2-pratique/1-listes.md)
2. [Formulaires](./2-pratique/2-formulaires.md)
3. [Appels API avec fetch](./2-pratique/3-api.md) ⭐ **MÀJ: Simple (.then) + Pro (async/await)!**

### 🟣 Niveau 3 : Avancé
Patterns et techniques professionnelles.

1. [Context API - État global](./3-avance/1-context.md)
2. [Custom Hooks - Réutilisabilité](./3-avance/2-custom-hooks.md)
3. [Patterns & Bonnes pratiques](./3-avance/3-patterns.md)

### 🟡 Composants Réutilisables
Code prêt à copier-coller.

1. [Composants de base (Buttons, Cards, Listes)](./4-composants/1-base.md)
2. [Composants interactifs (Formulaires, Modals, Onglets)](./4-composants/2-interactifs.md)
3. [Structures (Parent/Enfants, Layouts)](./4-composants/3-structures.md)

### 🚀 Projets Réels (Comment faire une VRAIE app!) ⭐ **NOUVEAU!**

1. [Structure d'un projet réel](./5-projets-reels/STRUCTURE-PROJET.md) - Organisez votre code
2. [Exemple complet: E-commerce avec React Router](./5-projets-reels/EXEMPLE-APP-COMPLETE.md) - Une vraie app avec plusieurs pages, panier, formulaires
3. [Exemple: Formulaire → Liste (Moteur de recherche)](./5-projets-reels/EXEMPLE-FORMULAIRE-LISTE.md) - Un cas d'usage très commun
4. [Exemple AVANCÉ: Formulaire → Liste avec useSearchParams](./5-projets-reels/EXEMPLE-FORMULAIRE-LISTE-AVANCE.md) - ⭐ **Version professionnelle avec URLs shareable!**

---

## 📖 Comment utiliser cette doc ?

### Pour réviser un concept:
1. Ouvre le fichier du concept (ex: `useState.md`)
2. Lis la section **QUOI** pour comprendre le concept
3. Lis **POURQUOI** pour voir les cas d'usage
4. Lis **COMMENT** pour voir le code
5. **TOUS les imports sont inclus au top de chaque exemple!** ✅
6. Copie le code complet et adapte les `[]`

### Pour réutiliser du code:
1. Va dans `4-composants/`
2. Trouve le composant qui te plaît
3. Copie la fonction complète (avec les imports!)
4. Remplace les `[]` par tes valeurs

### 🎯 IMPORTANT: Les imports sont complétés!

Chaque exemple de code inclut:
- ✅ Les imports nécessaires (ex: `import { useState } from 'react'`)
- ✅ Le composant complet
- ✅ Les commentaires `// ✅ IMPORTS NECESSAIRES`

**Tu peux copier-coller directement et ça va marcher!** 🎉

Si tu oublies les imports, consulte [GUIDE-IMPORTS.md](./GUIDE-IMPORTS.md)

### Exemple:
```javascript
// ✅ IMPORTS NECESSAIRES (Toujours en premier!)
import { useState } from 'react'

// Ton composant
function Compteur() {
  const [count, setCount] = useState(0)
  return <p>{count}</p>
}

export default Compteur
```

---

## 📝 Legend des sections

- **QUOI** 📖 : Définition et explication du concept
- **POURQUOI** 💡 : Utilité et cas d'usage réels
- **COMMENT** 🛠️ : Code réutilisable avec placeholders `[]`
- **EXEMPLE** 📌 : Utilisation concrète et complète

---

## ✅ Trucs et astuces pour les examens

- 📄 Imprime cette doc ou télécharge-la en PDF
- 🔍 Utilise Ctrl+F pour chercher rapidement
- 📋 Les sections COMMENT contiennent le code à copier
- 🧪 Teste les exemples localement avant l'examen
- 📌 Ajoute des notes personnelles à côté du code

---

**Créée:** 2026-04-19  
**Dernière mise à jour:** --  
**Niveau:** Débutant → Avancé

---

**[Commencez par Setup &gt;](./1-fondamentaux/1-setup.md)**
