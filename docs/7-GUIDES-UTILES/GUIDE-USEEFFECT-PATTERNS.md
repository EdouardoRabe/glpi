# Guide: useEffect Patterns

Ce guide explique comment utiliser `useEffect` correctement pour charger des données, déclencher des actions, et nettoyer les ressources dans React.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Charger au montage** | BOTicketList, FOAssetsList, BODashboard | Une seule fois au démarrage du composant |
| **Refetcher si filtre change** | BOTicketList (filtres), FOAssetsList | Recharger data quand stateId ou typeId change |
| **Charger détails au clic** | BOTicketList (dialog), FOAssetsList | Ouvrir modal → charger infos détaillées |
| **Réagir à URL** | Toutes pages | Si route change, charger données correspondantes |
| **Cleanup (désabonnement)** | Composants avec websocket | Si on avait des listeners, les retirer en cleanup |
| **Dépendances externes** | Si tu ajoutes des libs | Réinitialiser quand dépendance change |

## Table des matières

1. [Comprendre useEffect](#comprendre-useeffect)
2. [Les 3 patterns essentiels](#les-3-patterns-essentiels)
3. [Gestion des dépendances](#gestion-des-dépendances)
4. [Async/Await dans useEffect](#asyncawait-dans-useeffect)
5. [Cleanup functions](#cleanup-functions)
6. [Erreurs courantes](#erreurs-courantes)
7. [Exemple complet](#exemple-complet-production)
8. [Bonnes pratiques](#bonnes-pratiques)

---

## Comprendre useEffect

### Anatomie

```javascript
useEffect(() => {
  // Code à exécuter
  console.log("Effect déclenché");

  return () => {
    // Code de nettoyage (optionnel)
    console.log("Cleanup");
  };
}, [dépendances]); // Tableau des dépendances (optionnel)
```

### Les 3 parties

1. **Fonction** - Code à exécuter
2. **Return (optionnel)** - Cleanup function
3. **Dépendances (optionnel)** - Quand relancer

---

## Les 3 patterns essentiels

### Pattern 1: Charger UNE SEULE FOIS au montage

**Quand?** Page charge, on veut juste récupérer la liste initiale

```javascript
useEffect(() => {
  console.log("✅ Composant monté, charge la liste");
  
  const loadData = async () => {
    const data = await fetch("/express/tickets").then(r => r.json());
    setTickets(data);
  };
  
  loadData();
}, []); // ← CLÉ: [] vide = une seule fois au montage
```

**Exemple réel (BOTicketList.jsx):**
```javascript
useEffect(() => {
  const loadTickets = async () => {
    const tic = await Ticket.getAllComplete();
    setTickets(tic);
  };
  loadTickets();
}, []); // Une seule fois au démarrage
```

---

### Pattern 2: Refetcher QUAND UNE VALEUR CHANGE

**Quand?** Filtres changent → recharger data filtrée

```javascript
useEffect(() => {
  console.log(`✅ Filter changé: ${filterType}, recharge...`);
  
  const loadData = async () => {
    const url = filterType
      ? `/express/assets?type=${filterType}`
      : "/express/assets";
    const data = await fetch(url).then(r => r.json());
    setAssets(data);
  };
  
  loadData();
}, [filterType]); // ← CLÉ: [filterType] = relancer si change
```

**Avec PLUSIEURS dépendances:**
```javascript
useEffect(() => {
  console.log(`Filtres changés: state=${stateId}, type=${typeId}`);
  
  // Recharger quand SOIT stateId SOIT typeId change
  const loadData = async () => {
    // Appel API avec les 2 filtres
  };
  
  loadData();
}, [stateId, typeId]); // ← Recharger si l'un de ces 2 change
```

**Réinitialiser pagination quand filtres changent:**
```javascript
const [filters, setFilters] = useState({ stateId: 0, typeId: 0 });
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  setCurrentPage(1); // ← Retour à page 1 quand filtres changent
  
  const loadData = async () => {
    // Charger data avec filtres
  };
  
  loadData();
}, [filters.stateId, filters.typeId]);
```

---

### Pattern 3: Réagir à un changement ET avoir un cleanup

**Quand?** On s'abonne à quelque chose et on doit se désabonner

```javascript
useEffect(() => {
  console.log("✅ S'abonner à algo");
  
  const listener = () => console.log("Événement!");
  window.addEventListener("resize", listener);
  
  // Return = cleanup (retirer l'écouteur)
  return () => {
    console.log("❌ Se désabonner");
    window.removeEventListener("resize", listener);
  };
}, []); // Une seule fois au montage/démontage
```

**Exemple réel (si tu avais du WebSocket):**
```javascript
useEffect(() => {
  const ws = new WebSocket("ws://localhost:3000");
  
  ws.onmessage = (event) => {
    const newTicket = JSON.parse(event.data);
    setTickets(prev => [...prev, newTicket]);
  };
  
  // Cleanup: fermer la connexion quand composant se démonte
  return () => ws.close();
}, []);
```

---

## Gestion des dépendances

### Tableau de dépendances: expliqué

```javascript
// ❌ PAS DE TABLEAU = relancer à CHAQUE rendu
useEffect(() => {
  console.log("Exécuté à chaque rendu!");
  fetch("/data"); // ⚠️ Appels réseau infinis!
});

// ✅ TABLEAU VIDE [] = relancer UNE SEULE FOIS
useEffect(() => {
  console.log("Exécuté au montage");
  fetch("/data");
}, []);

// ✅ AVEC DÉPENDANCES [x, y] = relancer si x ou y change
useEffect(() => {
  console.log(`x ou y a changé`);
  fetch(`/data?x=${x}&y=${y}`);
}, [x, y]);
```

### Dépendances courantes

```javascript
// État simple
const [count, setCount] = useState(0);
useEffect(() => {
  // Relancer si count change
}, [count]);

// Objet d'état
const [filters, setFilters] = useState({ typeId: 0 });
useEffect(() => {
  // ⚠️ Attention: useEffect ne voit pas les PROPRIÉTÉS d'un objet
  // Mieux: [filters.typeId] ou [filters]
}, [filters.typeId]); // ← Mettre la PROPRIÉTÉ en dépendance

// Props
export default function MyComponent({ userId }) {
  useEffect(() => {
    // Relancer si userId change
  }, [userId]);
}

// Plusieurs dépendances
useEffect(() => {
  // Relancer si filterType OU filterStatus change
}, [filterType, filterStatus]);
```

### ⚠️ Dépendances manquantes (bug courant)

```javascript
const [count, setCount] = useState(0);

// ❌ MAUVAIS: oublie 'count' en dépendance
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // ❌ Toujours 0!
  }, 1000);
  
  return () => clearInterval(timer);
}, []); // Oublie count!

// ✅ BON: inclure count
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // ✅ Valeur actuelle
  }, 1000);
  
  return () => clearInterval(timer);
}, [count]); // Inclure count
```

### Dépendances d'objets/arrays

```javascript
// ❌ MAUVAIS: créer un objet NEUF dans JSX
export default function Parent() {
  const obj = { id: 1 }; // Créé à CHAQUE rendu
  return <Child data={obj} />;
}

function Child({ data }) {
  useEffect(() => {
    // Relance INFINIMENT car obj est nouvelle à chaque rendu!
  }, [data]);
}

// ✅ BON: créer l'objet HORS du composant ou avec useMemo
const obj = { id: 1 }; // Une seule fois

export default function Parent() {
  return <Child data={obj} />;
}

// OU avec useMemo
export default function Parent() {
  const obj = useMemo(() => ({ id: 1 }), []);
  return <Child data={obj} />;
}
```

---

## Async/Await dans useEffect

### ❌ MAUVAIS: async directement sur useEffect

```javascript
// ❌ Ne pas faire ça!
useEffect(async () => { // ← Ne pas async ici!
  const data = await fetch("/data").then(r => r.json());
  setData(data);
}, []);
```

### ✅ BON: créer une fonction async DEDANS

```javascript
// ✅ Créer fonction async à l'intérieur
useEffect(() => {
  const loadData = async () => {
    try {
      const response = await fetch("/express/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  loadData();
}, []);
```

### Avec cleanup pour annuler fetch

```javascript
useEffect(() => {
  let isMounted = true; // Tracker si composant est encore monté

  const loadData = async () => {
    try {
      const data = await fetch("/express/tickets").then(r => r.json());
      
      // Vérifier que composant n'a pas été démonté
      if (isMounted) {
        setTickets(data);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message);
      }
    }
  };

  loadData();

  // Cleanup: marquer comme démonté
  return () => {
    isMounted = false;
  };
}, []);
```

---

## Cleanup functions

### Quand retourner une cleanup?

```javascript
// ❌ Si pas de ressources à nettoyer = pas besoin
useEffect(() => {
  console.log("Composant monté");
  // Pas de listeners, pas de timers, pas de listeners
  // Pas besoin de cleanup
}, []);

// ✅ Si on crée une ressource = cleanup obligatoire
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);
  
  // CLEANUP: arrêter le timer
  return () => clearInterval(timer);
}, []);
```

### Exemples de cleanup

**Timer/Interval:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => setMessage("Timeout!"), 3000);
  return () => clearTimeout(timer); // Nettoyer si composant se démonte
}, []);
```

**Event Listener:**
```javascript
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener("resize", handleResize);
  
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

**Variable/State à nettoyer:**
```javascript
useEffect(() => {
  let data = null;
  
  const loadData = async () => {
    data = await fetch("/data").then(r => r.json());
    setData(data);
  };
  
  loadData();
  
  return () => {
    data = null; // Nettoyer la référence
  };
}, []);
```

---

## Erreurs courantes

### ❌ Erreur 1: Appels API infinis

```javascript
// ❌ MAUVAIS: oubli [] = relancer à chaque rendu
useEffect(() => {
  fetch("/data");
});

// ✅ BON: [] = une seule fois
useEffect(() => {
  fetch("/data");
}, []);
```

### ❌ Erreur 2: Dépendance manquante

```javascript
const [userId, setUserId] = useState(1);

// ❌ MAUVAIS: oublie userId en dépendance
useEffect(() => {
  fetch(`/user/${userId}`);
}, []); // ← userId manquant!

// ✅ BON: inclure userId
useEffect(() => {
  fetch(`/user/${userId}`);
}, [userId]); // ← userId inclus
```

### ❌ Erreur 3: Créer des objets en dépendance

```javascript
// ❌ MAUVAIS: créer filters neuf à chaque rendu
const [stateId, setStateId] = useState(0);
const [typeId, setTypeId] = useState(0);
const filters = { stateId, typeId }; // ← Créé à chaque rendu

useEffect(() => {
  // Relance infiniment car 'filters' est toujours nouveau!
}, [filters]);

// ✅ BON: utiliser les propriétés individuelles
useEffect(() => {
  // Relance que si stateId ou typeId change
}, [stateId, typeId]);
```

### ❌ Erreur 4: async directement sur useEffect

```javascript
// ❌ MAUVAIS
useEffect(async () => { // ← Ne pas async ici!
  const data = await fetch("/data");
}, []);

// ✅ BON
useEffect(() => {
  const load = async () => {
    const data = await fetch("/data");
  };
  load();
}, []);
```

---

## Exemple complet production

### BOTicketList.jsx avec useEffect master

```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_STATUS } from "../../backend/utils/utils";
import "../../css/pages/BO/BOTicketList.css";

export default function BOTicketList() {
  // États
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    stateId: 0,
    typeId: 0,
    priorityId: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Effect 1: Charger TOUTES les données au montage (UNE SEULE FOIS)
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const tic = await Ticket.getAllComplete();
        setTickets(tic);
      } catch (err) {
        setError(err.message);
        console.error("Erreur chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []); // ← Une seule fois au montage

  // Effect 2: Réinitialiser page quand filtres changent
  useEffect(() => {
    setCurrentPage(1); // Retour à page 1
  }, [filters.stateId, filters.typeId, filters.priorityId]); // ← Relancer si filtre change

  // Filtrer les données
  const filteredTickets = tickets.filter(({ ticket }) => {
    if (filters.stateId > 0 && ticket.status?.id !== filters.stateId) return false;
    if (filters.typeId > 0 && ticket.type !== filters.typeId) return false;
    if (filters.priorityId > 0 && ticket.priority !== filters.priorityId) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? 0 : Number(value),
    }));
  };

  // Affichage
  if (loading) {
    return <div className="bo-ticket-list"><p>⏳ Chargement...</p></div>;
  }

  if (error) {
    return (
      <div className="bo-ticket-list">
        <div className="error-message">
          ❌ {error}
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bo-ticket-list">
      <h1>Tickets ({filteredTickets.length})</h1>

      {/* Filtres */}
      <div className="bo-ticket-filters">
        <select 
          value={filters.typeId} 
          onChange={(e) => handleFilterChange("typeId", e.target.value)}
        >
          <option value="0">Tous types</option>
          {TICKET_TYPE.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      {/* Contenu */}
      {filteredTickets.length === 0 ? (
        <p>Aucun ticket ne correspond aux filtres.</p>
      ) : (
        <div className="bo-ticket-items">
          {filteredTickets.map(({ ticket }) => (
            <div key={ticket.id} className="bo-ticket-item">
              <h3>{ticket.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Bonnes pratiques

### ✅ À faire

- **Toujours inclure les dépendances** utilisées dans l'effect
- **Utiliser []** pour charger une seule fois au montage
- **Réinitialiser page à 1** quand filtres changent
- **Créer une fonction async dedans**, pas en dehors
- **Gérer loading et error** states dans les effects
- **Nettoyer les ressources** (timers, listeners) dans le return
- **Vérifier isMounted** avant setState dans async
- **Tester quand** l'effect se déclenche (voir DevTools)

### ❌ À éviter

- **Oublier []** quand tu veux une seule fois
- **Oublier les dépendances** (ESLint t'avertira)
- **Créer async directement** sur useEffect (`useEffect(async () => ...)`)
- **Appels réseau sans loading state**
- **Laisser des listeners actifs** après démonter le composant
- **Créer des objets/arrays en dépendances** (utiliser les propriétés au lieu)
- **Ignorer les erreurs** dans try/catch
- **Relancer tous les effects** quand juste 1 a besoin de se redéclencher

---

## Déboguer useEffect

### Voir quand l'effect se déclenche

```javascript
useEffect(() => {
  console.log("✅ Effect déclenché avec:", { userId, typeId });
  
  // Ton code ici
  
  return () => {
    console.log("❌ Cleanup exécuté");
  };
}, [userId, typeId]);
```

### Voir les dépendances manquantes

Installe ESLint rule: `eslint-plugin-react-hooks`

```bash
npm install --save-dev eslint-plugin-react-hooks
```

Config ESLint:
```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

Maintenant ESLint t'avertira si dépendances manquent! 🎯

---

Besoin d'aide pour adapter à un composant? 👍
