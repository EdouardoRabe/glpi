# 🔍 Guide: Ajouter les imports manquants

## Pour les débutants: Comment ajouter les imports

Tous les fichiers de la doc utilsent cette structure:

```javascript
// ✅ IMPORTS NECESSAIRES
import { [hooks/composants] } from '[chemin]'

// Ton composant ici
function MaFonction() { ... }
```

---

## 📋 Les imports les plus courants

### 1. useState (pour l'état)
```javascript
// ✅ Ajoute ça en haut du fichier si tu utilises useState
import { useState } from 'react'
```

**Quand l'utiliser :** Si tu as `const [state, setState] = useState()`

### 2. useEffect (pour les effets)
```javascript
// ✅ Ajoute ça en haut du fichier si tu utilises useEffect
import { useEffect } from 'react'
```

**Quand l'utiliser :** Si tu as `useEffect(() => { ... }, [])`

### 3. useContext (pour le contexte)
```javascript
// ✅ Ajoute ça en haut du fichier si tu utilises useContext
import { useContext } from 'react'
import { MonContext } from './MonContext'
```

**Quand l'utiliser :** Si tu as `const data = useContext(MonContext)`

### 4. Importer un autre composant
```javascript
// ✅ Si tu utilises un composant que tu as créé
import NomComposant from './NomComposant'
```

---

## 🎯 Checklist pratique

Avant chaque composant que tu copies, **vérifie** :

- [ ] Y a-t-il `useState` ? → Ajoute `import { useState } from 'react'`
- [ ] Y a-t-il `useEffect` ? → Ajoute `import { useEffect } from 'react'`
- [ ] Y a-t-il `useContext` ? → Ajoute `import { useContext } from 'react'`
- [ ] Y a-t-il d'autres composants utilisés ? → Ajoute les imports correspondants
- [ ] Y a-t-il `createContext` ? → Ajoute `import { createContext } from 'react'`

---

## ❌ Si oublie un import, tu auras cette erreur:

```
Uncaught ReferenceError: useState is not defined
```

**Solution :** Ajoute simplement le import manquant en haut du fichier!

---

## ✅ Exemple complet

```javascript
// ✅ IMPORTS NECESSAIRES
import { useState } from 'react'        // Car on utilise useState
import { useEffect } from 'react'       // Car on utilise useEffect
import MonComposant from './MonComposant' // Car on utilise MonComposant

function MonApp() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('Monté!')
  }, [])

  return (
    <div>
      <p>{count}</p>
      <MonComposant />
    </div>
  )
}

export default MonApp
```

---

## 📌 Important: Structure à TOUJOURS respecter

```javascript
// 1️⃣ IMPORTS EN PREMIER
import { useState } from 'react'

// 2️⃣ COMPOSANT
function MaFonction() {
  return <div>...</div>
}

// 3️⃣ EXPORT À LA FIN
export default MaFonction
```

**Ne fais JAMAIS :**
```javascript
❌ function() { ... }
   import { useState } from 'react'  // ❌ Import après le composant
```

---

**Les imports sont complétés dans les fichiers clés!** 📚 Continue l'apprentissage! 🚀
