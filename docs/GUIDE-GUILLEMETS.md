# 📝 Guide: Guillemets et Caractères Spéciaux en JavaScript/React

## 📖 QUOI

Il existe **3 types de guillemets** en JavaScript (et 1 accent grave spécial):

1. **Guillemets simples** `'` - Apostrophe
2. **Guillemets doubles** `"` - Guillemets français
3. **Backticks** `` ` `` - Accent grave (pour les template literals)

---

## 💡 POURQUOI

En JavaScript, `'` et `"` **font exactement la même chose**. C'est juste une question de style!

Mais les **backticks** `` ` `` sont **différents** car ils permettent d'injecter des variables avec `${}`

```javascript
// ❌ Les 3 font la même chose (simple texte)
const texte1 = 'Bonjour'
const texte2 = "Bonjour"
const texte3 = `Bonjour`

// ✅ MAIS avec backticks on peut injecter des variables
const nom = 'Alice'
const salut = `Bonjour ${nom}`  // ← Template literal!
```

---

## 🛠️ COMMENT

### Technique 1️⃣: Guillemets simples `'`

```javascript
// ✅ Basique
const message = 'Bonjour le monde'

// ✅ Avec apostrophe DEDANS (comment l'écrire?)
// ❌ MAUVAIS - va casser:
const phrase1 = 'C'est bien'  // Erreur! Le JS pense que c'est 'C' et puis 'est bien'

// ✅ BON - Échapper avec \
const phrase2 = 'C\'est bien'  // ← Backslash avant l'apostrophe

// ✅ BON - Utiliser des guillemets doubles au lieu
const phrase3 = "C'est bien"  // Pas besoin d'échapper!
```

### Technique 2️⃣: Guillemets doubles `"`

```javascript
// ✅ Basique
const message = "Bonjour le monde"

// ✅ Avec guillemet DEDANS
// ❌ MAUVAIS - va casser:
const citation = "Il dit "Bonjour""  // Erreur!

// ✅ BON - Échapper avec \
const citation2 = "Il dit \"Bonjour\""  // ← Backslash avant le guillemet

// ✅ BON - Utiliser des guillemets simples au lieu
const citation3 = 'Il dit "Bonjour"'  // Pas besoin d'échapper!
```

### Technique 3️⃣: Backticks `` ` `` (TEMPLATE LITERALS) ⭐

**C'est le plus puissant et moderne!**

```javascript
// ✅ Texte simple (comme ' et ")
const texte = `Bonjour`

// ✅ AJOUTER DES VARIABLES avec ${}
const nom = 'Alice'
const age = 25
const message = `Bonjour, je suis ${nom} et j'ai ${age} ans`
// Résultat: "Bonjour, je suis Alice et j'ai 25 ans"

// ✅ EXPRESSIONS dans ${}
const prix = 99
const taxe = `Avec taxe: ${prix * 1.2}€`

// ✅ FONCTIONS dans ${}
const nom2 = 'bob'
const texte2 = `Nom en majuscules: ${nom2.toUpperCase()}`
// Résultat: "Nom en majuscules: BOB"

// ✅ CONDITIONS dans ${}
const age2 = 20
const categorie = `Âge: ${age2 >= 18 ? 'Adulte' : 'Enfant'}`

// ✅ MULTILIGNE (les backticks permettent les retours à la ligne!)
const html = `
  <div>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </div>
`

// ✅ Avec apostrophe DEDANS (pas besoin d'échapper!)
const phrase = `C'est bien!`
```

---

## 📌 EXEMPLES concrets en React

### Exemple 1️⃣: URL avec variable

```javascript
// ❌ SANS template literal (lourd)
const userId = 123
const url1 = 'https://api.example.com/users/' + userId + '/profile'

// ✅ AVEC template literal (propre!)
const url2 = `https://api.example.com/users/${userId}/profile`

// Les deux donnent: https://api.example.com/users/123/profile
```

### Exemple 2️⃣: Message d'erreur

```javascript
// ❌ SANS template literal
const email = 'test@example.com'
const message1 = 'Erreur: ' + email + ' n\'existe pas'

// ✅ AVEC template literal
const message2 = `Erreur: ${email} n'existe pas`

console.log(message2)  // Erreur: test@example.com n'existe pas
```

### Exemple 3️⃣: Attribute JSX

```javascript
// ✅ On peut injecter du contenu dans les attributes
const userId = 5
const nom = 'Alice'

<a href={`/users/${userId}`}>Voir profil</a>
<p className={`user-${nom.toLowerCase()}`}>Bonjour</p>
<img alt={`Photo de ${nom}`} />
```

### Exemple 4️⃣: Styles en ligne

```javascript
// ✅ Template literal pour les couleurs dynamiques
const score = 85
const couleur = score > 80 ? 'green' : 'red'

return (
  <p style={{ color: couleur }}>
    Score: {score}%
  </p>
)

// Ou directement dans le template:
const message = `Votre score est: ${score}%`
```

---

## ⚠️ PIÈGES COURANTS

### Piège 1️⃣: Oublier d'échapper l'apostrophe

```javascript
// ❌ ERREUR (ne marche pas)
const phrase = 'C'est bien'

// ✅ FIX 1 - Échapper avec \
const phrase = 'C\'est bien'

// ✅ FIX 2 - Utiliser des guillemets doubles
const phrase = "C'est bien"

// ✅ FIX 3 - Utiliser des backticks
const phrase = `C'est bien`
```

### Piège 2️⃣: Oublier les $ dans template literal

```javascript
// ❌ ERREUR (affiche littéralement "{nom}")
const nom = 'Alice'
const message = `Bonjour nom`  // ← Pas de $

// ✅ BON
const message = `Bonjour ${nom}`  // ← Avec $
```

### Piège 3️⃣: Mélanger les guillemets dans React JSX

```javascript
// ❌ CONFUS (guillemets simples à l'intérieur doubles)
<img alt="Photo d'Alice" />

// ✅ CLAIR (backticks ou guillemets doubles)
<img alt={`Photo d'Alice`} />
// Ou:
<img alt="Photo de Alice" />
```

### Piège 4️⃣: Oublier les accolades dans des attributs

```javascript
// ❌ ERREUR (le JSX pense que c'est du texte)
<p style={color: 'red'}>Texte</p>

// ✅ BON (objet JavaScript)
<p style={{ color: 'red' }}>Texte</p>

// ✅ BON (template literal pour l'URL)
<a href={`/users/${id}`}>Lien</a>
```

---

## 📊 Tableau comparatif

| Type | Syntaxe | Ajout variables | Multiligne | Cas d'usage |
|------|---------|-----------------|------------|-----------|
| Simples | `'texte'` | ❌ Non | ❌ Non | Texte simple, court |
| Doubles | `"texte"` | ❌ Non | ❌ Non | Texte simple, court |
| Backticks | `` `texte` `` | ✅ Oui ($) | ✅ Oui | **RECOMMANDÉ tjs!** |

---

## 🎯 Règle d'or

> **Utilise TOUJOURS les backticks `` ` `` en React moderne!**

Pourquoi?
- ✅ Plus flexible (variables, expressions, multiligne)
- ✅ Moins d'erreurs avec les apostrophes
- ✅ Plus lisible
- ✅ Standard moderne en JavaScript

```javascript
// ✅ LA BONNE HABITUDE À PRENDRE
const userId = 123
const nom = 'Alice'
const message = `Bonjour ${nom}, ton ID est ${userId}`
const url = `https://api.example.com/users/${userId}/profile`
const html = `
  <h1>${nom}</h1>
  <p>Bienvenue!</p>
`
```

---

## 🚀 Résumé rapide

```javascript
// Les 3 façons de faire un texte
const a = 'Bonjour'       // Simple
const b = "Bonjour"       // Double
const c = `Bonjour`       // Backtick

// Avec variable (SEULEMENT backtick)
const nom = 'Alice'
const message = `Bonjour ${nom}`   // ✅ Marche
const message2 = 'Bonjour ' + nom  // ⚠️ Fonctionne mais lourd

// Avec apostrophe dedans
const phrase1 = 'C\'est bien'      // ⚠️ Faut échapper
const phrase2 = "C'est bien"       // ✅ OK
const phrase3 = `C'est bien`       // ✅ BEST!

// Résumé: Utilise toujours les backticks! 🎉
```

---

**Créée:** 2026-05-01  
**Version:** 1.0
