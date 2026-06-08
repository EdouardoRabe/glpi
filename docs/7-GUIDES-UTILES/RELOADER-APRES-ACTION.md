# Guide: Reloader les Données Après une Action

Ce guide explique comment rafraîchir les données après une action utilisateur (clic bouton, suppression, etc.).

## Table des matières

1. [Concept](#concept)
2. [Méthode 1: Recharger Toute la Page](#méthode-1-recharger-toute-la-page)
3. [Méthode 2: Recharger les Données Localement](#méthode-2-recharger-les-données-localement)
4. [Méthode 3: Mettre à Jour le State Directement](#méthode-3-mettre-à-jour-le-state-directement)
5. [Comparaison](#comparaison)
6. [Cas d'Usages Réels](#cas-dusages-réels)

---

## Concept

Après une action (suppression, création, modification), tu dois **mettre à jour l'interface** pour refléter les changements. Trois approches:

| Approche | Comment | Quand l'utiliser |
|----------|---------|------------------|
| **Page reload** | `window.location.reload()` | Changements majeurs, simplicity |
| **State reload** | Rappeler `useEffect` | Données critiques, UX fluide |
| **Direct update** | Modifier le state manuellement | Changement mineur, rapide |

---

## Méthode 1: Recharger Toute la Page

### ❌ Simple mais basique

```javascript
const toRestore = async (id) => {
    console.log("Restoration...", id);
    await del(`/corbeille/${id}`);
    window.location.reload();  // ← Recharge tout
};
```

**Avantages:**
- ✅ Très simple
- ✅ S'assure que tout est à jour

**Inconvénients:**
- ❌ Perte de scroll position
- ❌ Perte de focus utilisateur
- ❌ Pas fluide (flash de page)
- ❌ Lent

---

## Méthode 2: Recharger les Données Localement

### ✅ Recommandé pour la plupart des cas

Extrais la logique de chargement dans une fonction réutilisable:

```javascript
import { useEffect, useState } from "react";
import { put, get, post, del } from "../../backend/utils/expressApi.js";
import Ticket from "../../backend/model/Ticket.js";

export default function BOCorbeille() {
    const [onCorbeille, setOnCorbeille] = useState([]);
    const [delet, setDelet] = useState([]);

    // ← Extrais en fonction séparée
    const loadCorbeille = async () => {
        try {
            const deleted = await get('/corbeille');
            const tabDeleted = deleted.map((del) => del.idticket);
            const on = tabDeleted.length > 0 ? await Ticket.getIncl(tabDeleted) : [];
            setOnCorbeille(on);
            setDelet(deleted);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    useEffect(() => {
        loadCorbeille();  // ← Appel initial
    }, []);

    const toRestore = async (id) => {
        try {
            await del(`/corbeille/${id}`);
            await loadCorbeille();  // ← Recharge après action
        } catch (error) {
            console.error('Erreur restore:', error);
        }
    };

    return (
        <div>
            <h1>Corbeille</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>REF</th>
                        <th>NAME</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {onCorbeille.map((ticket) => (
                        <tr key={`${ticket.id}-${ticket.name}`}>
                            <td>{ticket.id}</td>
                            <td>{ticket.external_id}</td>
                            <td>{ticket.name}</td>
                            <td>
                                <div className="bo-ticket-item-actions">
                                    <button 
                                        type="button" 
                                        onClick={() => toRestore(ticket.id)}
                                    >
                                        Restaurer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

**Avantages:**
- ✅ Fluide (pas de recharge page)
- ✅ Rapide
- ✅ Garde scroll position
- ✅ Réutilisable

**Inconvénients:**
- ❌ Code plus long
- ❌ Faut dupliquer la logique si plusieurs actions

---

## Méthode 3: Mettre à Jour le State Directement

### ✅ Ultra rapide pour changements locaux

Si tu sais exactement ce qui change:

```javascript
const toRestore = async (id) => {
    try {
        await del(`/corbeille/${id}`);
        
        // ← Mettre à jour directement le state
        setOnCorbeille(prev => prev.filter(ticket => ticket.id !== id));
        setDelet(prev => prev.filter(del => del.idticket !== id));
    } catch (error) {
        console.error('Erreur restore:', error);
    }
};
```

**Avantages:**
- ✅ Instantané
- ✅ Pas de requête API
- ✅ Fluide

**Inconvénients:**
- ❌ Faut connaître la structure du state
- ❌ Risque de désynchronisation si plusieurs utilisateurs

---

## Comparaison

| Méthode | Vitesse | Code | UX | Sécurité | Quand l'utiliser |
|---------|---------|------|----|---------:|-----------------|
| **Page reload** | Lent | Simple | Basique | ✅✅ | Rarement |
| **State reload** | Rapide | Medium | Fluide | ✅✅ | **Recommandé** |
| **Direct update** | Très rapide | Simple | Très fluide | ✅ | Changements simples |

---

## Cas d'Usages Réels

### 1. Suppression simple (BOCorbeille)

```javascript
const toRestore = async (id) => {
    try {
        await del(`/corbeille/${id}`);
        // Option A: Recharger tout
        const deleted = await get('/corbeille');
        setDelet(deleted);
        
        // Option B: Supprimer localement
        setDelet(prev => prev.filter(del => del.idticket !== id));
    } catch (error) {
        console.error('Erreur:', error);
    }
};
```

### 2. Création + recharge

```javascript
const handleCreate = async (newItem) => {
    try {
        const result = await post('/items', newItem);
        // Recharger pour voir le nouvel item
        await loadItems();
        showSuccess('Item créé avec succès!');
    } catch (error) {
        showError('Erreur lors de la création');
    }
};
```

### 3. Modification + recharge

```javascript
const handleUpdate = async (id, updates) => {
    try {
        await put(`/items/${id}`, updates);
        // Recharger seulement l'item modifié
        const updated = await getItem(id);
        setItems(prev => prev.map(item => 
            item.id === id ? updated : item
        ));
    } catch (error) {
        console.error('Erreur:', error);
    }
};
```

### 4. Action en masse

```javascript
const handleRestoreAll = async () => {
    try {
        for (const item of selectedItems) {
            await del(`/corbeille/${item.id}`);
        }
        // Une seule recharge à la fin
        await loadCorbeille();
        setSelectedItems([]);
    } catch (error) {
        console.error('Erreur:', error);
    }
};
```

---

## Bonnes Pratiques

✅ **À faire:**
- Extraire la logique de chargement en fonction `load*()`
- Appeler `load*()` au démarrage ET après action
- Ajouter try/catch et gestion d'erreur
- Afficher un message de succès/erreur
- Réinitialiser les selections après action

❌ **À éviter:**
- `window.location.reload()` sauf cas exceptionnel
- Modifier le state manuellement sans certitude
- Oublier de réinitialiser les filtres/selections
- Ne pas gérer les erreurs

---

## Résumé

**Pour 99% des cas: Méthode 2 (State reload)**

```javascript
// 1. Extrais le chargement
const loadData = async () => { /* ... */ };

// 2. Appelle au démarrage
useEffect(() => { loadData(); }, []);

// 3. Rappelle après action
const handleAction = async () => {
    await apiCall();
    await loadData();  // ← Recharge
};
```

Fluide, rapide, et fiable! 👍
