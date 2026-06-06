## Gestion des sélecteurs multiples (multiple select) en React

Ce guide explique comment gérer correctement un `<select multiple>` contrôlé en React, les erreurs courantes (types, valeur, Promise stockée), et des patterns pratiques adaptés au projet (assets mixtes : `Computer` / `Monitor`).

### Principes
- Un `select multiple` contrôlé doit recevoir en `value` un tableau (Array) contenant toutes les valeurs sélectionnées.
- Les valeurs des `<option>` sont toujours des chaînes dans la DOM. Si vos IDs sont numériques, convertissez-les explicitement (`Number`) à la lecture.
- Toujours garder la cohérence du type : si `value` contient des `Number`, faites `option.value = String(id)` et convertissez à la réception.
- Ne stockez jamais de Promises dans l'état React — `await`ez les appels asynchrones avant de mettre à jour le state.

### Exemple corrigé (FOCreateTicket.jsx)

Voici un exemple complet et robuste adapté à votre composant `FOCreateTicket.jsx` :

```jsx
import { useEffect, useMemo, useState } from "react";
import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";

export default function FOCreateTicket() {
  const [selectedItems, setSelectedItems] = useState([]); // tableau de Number
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadElements = async () => {
      const com = await Computer.getAll();
      const mon = await Monitor.getAll();
      setItems([...com, ...mon]);
    };
    loadElements();
  }, []);

  // lookup Map pour récupérer rapidement les objets par id
  const itemsById = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);

  // valeurs sélectionnées sous forme d'objets (utile en lecture seule / affichage)
  const selectedObjects = useMemo(
    () => selectedItems.map(id => itemsById.get(id)).filter(Boolean),
    [selectedItems, itemsById]
  );

  return (
    <select
      multiple
      value={selectedItems}
      onChange={e => {
        // e.target.selectedOptions est une collection d'options sélectionnées
        const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setSelectedItems(values);
      }}
    >
      {items.map(item => (
        // option.value est une string dans le DOM, mais on convertit à la lecture
        <option key={item.id} value={String(item.id)}>
          {item.name}
        </option>
      ))}
    </select>
  );
}
```

Points clés de l'exemple :
- `selectedItems` stocke des `Number` (IDs). On force `Number(opt.value)` à la lecture.
- `option.value` est la string `String(item.id)` pour garantir la compatibilité DOM.
- `itemsById` est calculé avec `useMemo` pour éviter des recalculs coûteux.
- `selectedObjects` fournit les objets complets correspondant aux IDs sélectionnés.

### Soumission du formulaire

Quand vous envoyez le ticket au backend :
- Envoyez généralement un tableau d'IDs (`selectedItems`) si l'API attend des identifiants.
- Si l'API attend des objets complets, mappez-les côté client :

```js
const payload = {
  title,
  description,
  items: selectedItems, // -> [1, 42, 123]
};

await api.post('/tickets', payload);
```

Ou si vous avez besoin des objets :

```js
const payload = {
  title,
  items: selectedObjects,
};
```

### Validation & UX
- Validez la sélection côté client (ex : minimum/maximum d'items).
- Affichez les éléments sélectionnés dans une liste sous le `select` pour la visibilité.
- Pour beaucoup d'options, utilisez un contrôle searchable (select custom) ou un `combobox` accessible.

### Accessibilité
- Ajoutez un `label` explicite lié au `select` (`<label htmlFor="items">` + `id="items"`).
- Indiquez clairement que le contrôle accepte une sélection multiple (texte d'aide ou aria-describedby).

### Problèmes courants et dépannage
- Valeurs de type mixte : si vous mélangez string/number, faites une conversion cohérente à l'entrée et/ou à la sortie.
- `selectedOptions` vide après `setItems` : si les options sont remplies après l'initialisation, veillez à synchroniser `selectedItems` (re-sélectionner côté effet si nécessaire).
- Stocker une `Promise` dans `value` ou dans `state` : vérifiez tous les `await` — ne mettez à jour le state qu'avec des données résolues.
- `map is not a function` / `undefined.entries()` : signe que vous avez mis un `Promise` à la place d'un tableau ou d'une `Map` — `await`ez la valeur renvoyée par la fonction asynchrone avant de l'utiliser.

### Patterns avancés
- Limiter la sélection : `if (values.length > MAX) return;` ou désactiver des options.
- Préselectionner à partir d'une source : `useEffect` avec dépendances pour remplir `selectedItems` après `items` chargés.
- Conversion et normalisation centrale : créez des helpers `normalizeItemId(value)` pour garantir la cohérence.

### Conclusion — checklist rapide
- [ ] `value` du `select` est un tableau.
- [ ] Convertir les `option.value` en `Number` si besoin.
- [ ] `await` toutes les promesses avant `setState`.
- [ ] Utiliser `useMemo` pour maps/lookup sur gros tableaux.
- [ ] Tester la soumission : API attend IDs vs objets.

---
Fichier utile : `src/pages/FO/FOCreateTicket.jsx` — adaptez l'exemple ci-dessus pour remplacer le `onChange` et la gestion des `option.value`.
