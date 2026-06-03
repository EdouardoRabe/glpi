# GUIDE - Closures & Stale State (Pièges Importants!)

> **Concept critique** : Un des bugs les plus subtils en React vient des closures et du stale state asynchrone.

---

## QUOI ?

**Stale State** = Quand une fonction asynchrone capture une valeur d'état **périmée** pendant un `await`.

**Closure** = Une fonction a accès aux variables du scope où elle a été créée. Même après un `await`, la fonction utilise la valeur **capturée au départ**.

## POURQUOI ?

React re-rend le composant quand l'état change. Chaque re-render crée de **nouvelles références** aux variables.

Pendant un `await`, l'état peut changer, mais la fonction asynchrone continue d'utiliser **la vieille valeur capturée**! 😱

## COMMENT ?

### ❌ Le Piège: Stale State Sans Arguments

```jsx
function Store() {
    const [productId, setProductId] = useState(1);
    
    // ❌ MAUVAIS - Capture la valeur du moment
    const removeProduct = async () => {
        console.log("1. Avant API - productId:", productId);  // 1
        
        // Pendant ce fetch, l'utilisateur peut changer productId!
        const response = await fetch(`/api/remove/${productId}`);
        
        console.log("2. Après API - productId:", productId);  // Peut être 5!
        // Tu as capturé l'ancienne valeur (1)
    };
    
    return (
        <>
            <select value={productId} onChange={e => setProductId(Number(e.target.value))}>
                <option value={1}>Produit 1</option>
                <option value={5}>Produit 5</option>
            </select>
            
            <button onClick={removeProduct}>Supprimer (UNSAFE)</button>
        </>
    );
}
```

**Scénario du bug:**
1. Utilisateur sélectionne "Produit 1" → productId = 1
2. Clique sur "Supprimer" → API commence
3. **PENDANT l'API**: Utilisateur sélectionne "Produit 5" → React re-rend (productId = 5)
4. API finit → La fonction a capturé productId = 1, mais le state affiche 5
5. **BUG**: Confusion sur quel produit a été supprimé!

---

### ✅ Solution 1: Passer par Arguments (Recommandé)

```jsx
// ✅ BON - Argument = valeur figée
const removeProduct = async (id) => {
    console.log("1. Avant API - id:", id);  // 1
    
    const response = await fetch(`/api/remove/${id}`);
    
    console.log("2. Après API - id:", id);  // Toujours 1!
    // L'argument ne change JAMAIS
};

onClick={() => removeProduct(productId)}
```

**Pourquoi ça marche:**
- L'argument `id` est passé **au moment de l'appel**
- Même si `productId` (dans le state) change après, `id` reste figé
- La fonction utilise `id`, pas `productId`

---

### ✅ Solution 2: useCallback avec Dépendances

```jsx
import { useCallback } from 'react';

const removeProduct = useCallback(async () => {
    console.log("Avant API - productId:", productId);  // 1
    
    const response = await fetch(`/api/remove/${productId}`);
    
    console.log("Après API - productId:", productId);  // 1 (stable!)
}, [productId]);  // Re-crée la fonction si productId change

onClick={removeProduct}
```

**Comment ça marche:**
- `useCallback` "gèle" la fonction si les dépendances ne changent pas
- Si `productId` change, la fonction est **recréée**
- Donc elle capture la NOUVELLE valeur

**Cas d'usage:** Quand tu passes la fonction à un enfant mémorisé

---

### ✅ Solution 3: useRef (Moins Recommandé)

```jsx
import { useRef, useEffect } from 'react';

const productIdRef = useRef(productId);

useEffect(() => {
    productIdRef.current = productId;  // Toujours à jour
}, [productId]);

const removeProduct = async () => {
    const response = await fetch(`/api/remove/${productIdRef.current}`);
    // productIdRef.current = valeur actuelle (pas capturée)
};
```

---

## Exemple Complet: Panier d'Achat

```jsx
import { useState } from 'react';

function ShoppingCart() {
    const [items, setItems] = useState([
        { id: 1, name: 'Laptop', qty: 1 },
        { id: 2, name: 'Mouse', qty: 2 }
    ]);
    const [selectedId, setSelectedId] = useState(1);
    
    // ❌ MAUVAIS - Sans arguments
    const removeItemBad = async () => {
        console.log(`Suppression de l'article ${selectedId}`);
        
        const response = await fetch(`/api/cart/remove/${selectedId}`);
        // Si l'utilisateur change selectedId ici, on utilise la NOUVELLE valeur!
        
        setItems(items.filter(item => item.id !== selectedId));
        // Peut supprimer le MAUVAIS article!
    };
    
    // ✅ BON - Avec arguments
    const removeItemGood = async (idToRemove) => {
        console.log(`Suppression de l'article ${idToRemove}`);
        
        const response = await fetch(`/api/cart/remove/${idToRemove}`);
        // idToRemove ne changera JAMAIS même si selectedId change
        
        setItems(items.filter(item => item.id !== idToRemove));
        // Supprime le BON article
    };
    
    return (
        <>
            <h2>Mon Panier</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name} (x{item.qty})
                    </li>
                ))}
            </ul>
            
            <select value={selectedId} onChange={e => setSelectedId(Number(e.target.value))}>
                {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
            
            <button onClick={() => removeItemGood(selectedId)}>
                Supprimer ✅ (SAFE)
            </button>
            
            <button onClick={removeItemBad}>
                Supprimer ❌ (UNSAFE - à éviter)
            </button>
        </>
    );
}
```

---

## Quand C'est un Problème?

| Situation | Risque | Solution |
|-----------|--------|----------|
| Fonction **synchrone** (pas d'`await`) | ❌ Aucun | Accès direct OK |
| Fonction **asynchrone** (avec `await`) | ⚠️ RISQUE! | Passer arguments |
| État change **pendant** l'appel API | ⚠️ RISQUE! | Passer arguments |
| Fonction dans `useEffect` | ⚠️ RISQUE! | Ajouter dépendances |
| Callback passé à un enfant | ⚠️ RISQUE! | `useCallback` + dépendances |

---

## Pièges Courants

### ❌ ERREUR: Accès direct dans async

```jsx
const handleSubmit = async () => {
    const userId = user.id;  // ❌ Capturé
    await api.save(userId);
    
    // Si user.id change pendant l'API, userId garde la vieille valeur!
};
```

### ✅ CORRECT: Passer par argument

```jsx
const handleSubmit = async (userId) => {
    await api.save(userId);  // userId = valeur figée
};

onClick={() => handleSubmit(user.id)}
```

### ❌ ERREUR: useEffect sans dépendances

```jsx
useEffect(() => {
    // Cette fonction capture productId du moment
    const fetchProduct = async () => {
        const data = await fetch(`/api/${productId}`);
        setResult(data);
    };
    
    fetchProduct();
}, []);  // ❌ Jamais re-créée! productId reste périmé!
```

### ✅ CORRECT: useEffect avec dépendances

```jsx
useEffect(() => {
    const fetchProduct = async () => {
        const data = await fetch(`/api/${productId}`);
        setResult(data);
    };
    
    fetchProduct();
}, [productId]);  // ✅ Re-créée si productId change
```

---

## À Retenir ✨

- ✅ **Asynchrone + Accès d'état = Passer par arguments**
- ✅ **Les arguments figent la valeur au moment de l'appel**
- ✅ **`useCallback` recréates la fonction si dépendance change**
- ✅ **`useEffect` doit avoir les bonnes dépendances**
- ✅ **Synchrone = Pas de risque (accès direct OK)**

---

## Cas Pratique Complet: Form avec Validation

```jsx
import { useState } from 'react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    
    // ✅ BON - Arguments garantissent la valeur correcte
    const handleSubmit = async (emailToSend, passwordToSend) => {
        // Valider
        if (!emailToSend.includes('@')) {
            setErrors({ email: 'Email invalide' });
            return;  // ← Sort AVANT l'await, pas de problème
        }
        
        // Envoyer au serveur
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: emailToSend,
                    password: passwordToSend
                })
            });
            
            // Pendant ce fetch, l'utilisateur peut changer l'input
            // Mais on utilise toujours emailToSend et passwordToSend
            
            if (response.ok) {
                setErrors({});
                // Rediriger...
            }
        } catch (err) {
            setErrors({ submit: err.message });
        }
    };
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(email, password);  // Passer les valeurs actuelles
        }}>
            <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            {errors.email && <span>{errors.email}</span>}
            
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            
            <button type="submit">Se Connecter</button>
            
            {errors.submit && <span>{errors.submit}</span>}
        </form>
    );
}
```

---

**Lien connexe:**
- [2.2 - useEffect (Dépendances)](../2-HOOKS/2.2-useEffect.md)
- [2.6 - useCallback & useMemo](../2-HOOKS/2.6-useCallback-useMemo.md)
