# 📝 GUIDE - Imports en React

## Les trois types d'imports

### 1. Modules Node (npm packages)

```jsx
// Depuis node_modules/
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
```

### 2. Fichiers locaux (chemin absolu)

```jsx
import Button from '@/components/Button'
import { useCounter } from '@/hooks/useCounter'
```

### 3. Fichiers locaux (chemin relatif)

```jsx
// Même dossier
import Sibling from './Sibling'

// Parent
import Parent from '../Parent'

// Sous-dossier
import Child from './subfolder/Child'
```

## Destructuration

```jsx
// ❌ Mauvais
import defaultexport from './module'

// ✅ BON
import { Component1, Component2 } from './module'
```

## Erreur courante

```jsx
// ❌ ERREUR : fichier qui commence par un chiffre
import { utils } from './1-utils.js'  // Ne fonctionne pas!

// ✅ BON : renommer le fichier
import { utils } from './utils.js'
```

---

**[← Guides Principaux](GUIDE-IMPORTS.md)**
