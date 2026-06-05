# 🧩 GUIDE - Utiliser Promise.all (et variantes)

> Bonnes pratiques pour exécuter des promesses en parallèle, gérer les erreurs et limiter la concurrence.

---

## Quand utiliser `Promise.all`

- Tu as plusieurs opérations asynchrones indépendantes (fetches, DB calls, lecture fichiers) et tu veux attendre que toutes soient terminées.
- Avantage: exécution en parallèle → meilleure performance que séquentiel.
- Attention: si une promesse échoue, `Promise.all` rejette immédiatement et toutes les autres peuvent rester en cours.

---

## Exemple basique (paralléliser des requêtes)

```javascript
const promises = ids.map(id => fetch(`/api/item/${id}`).then(r => r.json()));
const results = await Promise.all(promises);
// results est un tableau aligné avec ids
```

Important: ne fais pas `await` à l'intérieur de la map si tu veux le parallélisme; fais `map` → `Promise.all`.

---

## Gestion d'erreurs

- `Promise.all` rejette dès qu'une promesse rejette.
- Si tu veux récupérer toutes les réponses (avec échecs isolés), utilises `Promise.allSettled` :

```javascript
const settled = await Promise.allSettled(promises);
// settled: [{ status: 'fulfilled', value }, { status: 'rejected', reason }, ...]
```

- Ou enveloppe chaque promesse pour qu'elle réussisse toujours (pattern `catch`):

```javascript
const safe = promises.map(p => p.catch(err => ({ error: err })))
const results = await Promise.all(safe)
// Vérifier result.error pour identifier les échecs
```

---

## Exemple réel — récupérer items pour plusieurs tickets

```javascript
// tickets: [{id:1,...}, {id:2,...}]
const promises = tickets.map(async ticket => {
  try {
    const items = await Ticket.getItems(ticket.id)
    return { ticket, items }
  } catch (err) {
    return { ticket, items: [], error: err }
  }
})

const allData = await Promise.all(promises)
// Construire une Map
const ticketMap = new Map(allData.map(({ ticket, items }) => [ticket.id, { ticket, items }]))
```

---

## Alternatives utiles

- `Promise.allSettled(promises)` → utile quand tu veux tout récupérer même en cas d'échec partiel.
- `Promise.race(promises)` → renvoie la première promesse résolue/rejetée.
- `Promise.any(promises)` → renvoie la première promesse résolue (ignore rejets si d'autres réussissent).

---

## Limiter la concurrence (throttle) — quand tu as beaucoup de fetchs

Faire 1000 requêtes en parallèle peut submerger le serveur ou le navigateur. Solutions :

1) Petit utilitaire (limite simple)

```javascript
async function mapLimit(inputs, limit, mapper) {
  const results = []
  const executing = new Set()

  for (const input of inputs) {
    const p = (async () => mapper(input))()
    results.push(p)
    executing.add(p)

    p.finally(() => executing.delete(p))

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  return Promise.all(results)
}

// Utilisation
const data = await mapLimit(tickets, 10, async (ticket) => ({
  ticket,
  items: await Ticket.getItems(ticket.id)
}))
```

2) Utiliser une librairie (`p-limit`, `p-map`) si tu veux une solution testée.

---

## Conseils pratiques

- Évite `await` dans une boucle `forEach` — ça sera séquentiel.
- Préfère `Promise.all` pour la parallélisation, mais protège-toi des erreurs (`allSettled` ou `catch` par promesse).
- Si les opérations sont lourdes ou nombreuses, limite la concurrence.
- Pour le debug, logge les promesses ou utilise `console.log(await Promise.all(promises))` après les avoir créées.

---

## Récapitulatif rapide

- Parallèle rapide: `Promise.all(promises)`
- Tolérer échecs: `Promise.allSettled(promises)` ou `p.catch()` par promesse
- Limiter concurrence: `mapLimit` ou `p-limit`

---

Voir aussi: `GUIDE-ARRAY-MAP-SET.md` (section Map) pour stocker les résultats dans une `Map` par ID.
