# Guide: API Calls et Data Fetching

Ce guide explique comment récupérer des données depuis ton backend Express, gérer les états (loading/error/success) et afficher les résultats dans React.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Charger liste au montage** | BOTicketList, FOAssetsList | `Ticket.getAllComplete()`, `Asset.getAll()` |
| **Charger avec filtres** | BOTicketList, FOAssetsList | Appeler API quand filtres changent |
| **Charger détails** | BOTicketList dialog | Récupérer infos complètes d'un ticket |
| **Upload + réaction** | BOImport.jsx | Uploader fichier, attendre réponse |
| **Login** | BOLogin.jsx | POST email/password, récupérer token |
| **Créer ressource** | FOCreateTicket.jsx | POST nouveau ticket, attendre confirmation |
| **Error handling** | Partout | Network down, 404, validation backend |

## Table des matières

1. [Logique de base](#logique-de-base)
2. [Patterns essentiels](#patterns-essentiels)
3. [Exemple avec states loading/error](#exemple-avec-states-loaderrorrsuccess)
4. [Intégration avec filtres](#intégration-avec-filtres)
5. [Gestion d'erreurs](#gestion-derreurs)
6. [Exemple complet production](#exemple-complet-production)
7. [Bonnes pratiques](#bonnes-pratiques)

---

## Logique de base

### Pattern minimal

```javascript
import { useEffect, useState } from "react";

export default function MonComposant() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/express/tickets");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };

    loadData();
  }, []); // [] = charger une seule fois au montage

  return <div>Tickets: {data.length}</div>;
}
```

### Anatomie d'un fetch

```javascript
// 1. URL de l'API
const url = "/express/tickets";

// 2. Appel réseau
const response = await fetch(url);

// 3. Vérifier si succès (200-299)
if (!response.ok) throw new Error(`HTTP ${response.status}`);

// 4. Parser en JSON
const data = await response.json();

// 5. Utiliser les données
setData(data);
```

---

## Patterns essentiels

### Pattern 1: Charger au montage du composant

```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";

export default function BOTicketList() {
  const [tickets, setTickets] = useState([]);

  // Se déclenche une seule fois au montage ([] vide)
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const tic = await Ticket.getAllComplete();
        setTickets(tic);
      } catch (err) {
        console.error("Erreur chargement:", err);
      }
    };

    loadTickets();
  }, []); // ← Dépendances VIDES = charger 1x au démarrage

  return <div>{tickets.length} tickets</div>;
}
```

### Pattern 2: Charger quand une valeur change (filtres)

```javascript
import { useEffect, useState } from "react";

export default function FOAssetsList() {
  const [assets, setAssets] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);

  // Se déclenche CHAQUE FOIS que filterType change
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const url = filterType
          ? `/express/assets?type=${filterType}`
          : "/express/assets";
        const response = await fetch(url);
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [filterType]); // ← Dépendances AVEC filterType = recharger si change

  return (
    <div>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="">Tous</option>
        <option value="Computer">Computer</option>
      </select>
      {loading ? <p>Chargement...</p> : <p>{assets.length} assets</p>}
    </div>
  );
}
```

### Pattern 3: POST (créer/uploader)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch("/express/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Mon ticket", priority: 2 }),
    });

    if (!response.ok) throw new Error("Création échouée");
    
    const newTicket = await response.json();
    console.log("Créé:", newTicket);
  } catch (err) {
    console.error("Erreur:", err);
  }
};
```

---

## Exemple avec states load/error/success

### Version simple (1 state)

```javascript
import { useEffect, useState } from "react";

export default function BOTicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/express/tickets");
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Affichage conditionnel
  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p>❌ Erreur: {error}</p>;
  if (tickets.length === 0) return <p>Aucun ticket</p>;

  return (
    <div>
      <h2>Tickets ({tickets.length})</h2>
      {tickets.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  );
}
```

### Version avancée (avec retry)

```javascript
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  const loadTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/express/tickets");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadTickets();
}, [retryCount]);

const handleRetry = () => setRetryCount(c => c + 1);

return (
  <>
    {error && (
      <div style={{ color: "red", padding: "1rem", marginBottom: "1rem" }}>
        <p>❌ {error}</p>
        <button onClick={handleRetry}>🔄 Réessayer</button>
      </div>
    )}
    {loading && <p>⏳ Chargement...</p>}
    {!loading && !error && <div>{tickets.length} tickets</div>}
  </>
);
```

---

## Intégration avec filtres

Pattern complet: charger + filtrer + paginer

```javascript
import { useEffect, useState } from "react";

export default function BOTicketList() {
  const [allTickets, setAllTickets] = useState([]);
  const [filters, setFilters] = useState({ stateId: 0, typeId: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Charger TOUTES les données au montage
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/express/tickets");
        const data = await response.json();
        setAllTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // Une seule fois au démarrage

  // 2. Filtrer les données EN LOCAL (pas besoin d'appel API)
  const filteredTickets = allTickets.filter((ticket) => {
    if (filters.stateId > 0 && ticket.status?.id !== filters.stateId) return false;
    if (filters.typeId > 0 && ticket.type !== filters.typeId) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <>
      <select value={filters.stateId} onChange={(e) => handleFilterChange("stateId", e.target.value)}>
        <option value="0">Tous les états</option>
        {/* Options */}
      </select>

      <p>Affichant {filteredTickets.length} / {allTickets.length}</p>

      {filteredTickets.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </>
  );
}
```

---

## Gestion d'erreurs

### Types d'erreurs courantes

```javascript
try {
  const response = await fetch("/express/tickets");

  // ❌ Erreur réseau (pas de connexion)
  if (!response) throw new Error("Réseau indisponible");

  // ❌ HTTP error (404, 500, etc)
  if (!response.ok) {
    throw new Error(`Serveur a répondu ${response.status}`);
  }

  const data = await response.json();
  
  // ❌ Données invalides
  if (!Array.isArray(data)) {
    throw new Error("Format de réponse invalide");
  }

  setData(data);
} catch (err) {
  // ✅ Afficher message à l'utilisateur
  setError(err.message);
  console.error("Erreur complète:", err);
}
```

### Messages d'erreur utilisateur-friendly

```javascript
const getErrorMessage = (error) => {
  if (error.message === "Failed to fetch") {
    return "Pas de connexion internet. Vérifiez votre réseau.";
  }
  if (error.message.includes("404")) {
    return "Ressource non trouvée.";
  }
  if (error.message.includes("500")) {
    return "Erreur serveur. Réessayez plus tard.";
  }
  return error.message || "Une erreur s'est produite.";
};

// Utilisation
<div className="error-box">
  {error && <p>{getErrorMessage(new Error(error))}</p>}
</div>
```

---

## Exemple complet production

### BOTicketList.jsx - Version complète

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

  // Charger les tickets au montage
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const tic = await Ticket.getAllComplete();
        setTickets(tic);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des tickets");
        console.error("Erreur chargement tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []); // Une seule fois au démarrage

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

  // Affichage conditionnel
  if (loading) {
    return <div className="bo-ticket-list"><p>⏳ Chargement des tickets...</p></div>;
  }

  if (error) {
    return (
      <div className="bo-ticket-list">
        <div className="error-message">
          <p>❌ Erreur: {error}</p>
          <button onClick={() => window.location.reload()}>Rafraîchir</button>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return <div className="bo-ticket-list"><p>Aucun ticket trouvé.</p></div>;
  }

  return (
    <div className="bo-ticket-list">
      <h1>Tickets ({filteredTickets.length})</h1>

      {/* Filtres */}
      <div className="bo-ticket-filters">
        <select value={filters.typeId} onChange={(e) => handleFilterChange("typeId", e.target.value)}>
          <option value="0">Tous types</option>
          {TICKET_TYPE.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contenu */}
      <div className="bo-ticket-items">
        {filteredTickets.map(({ ticket }) => (
          <div key={ticket.id} className="bo-ticket-item">
            <h3>{ticket.name}</h3>
            <p>Type: {TICKET_TYPE.find((t) => t.id === ticket.type)?.name || "-"}</p>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <p className="no-results">Aucun ticket ne correspond aux filtres.</p>
      )}
    </div>
  );
}
```

### CSS pour les états

```css
/* Chargement */
.bo-ticket-list p {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Erreur */
.error-message {
  background-color: #fee;
  border: 1px solid #f00;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  color: #c00;
}

.error-message button {
  background-color: #f00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* Aucun résultat */
.no-results {
  text-align: center;
  color: #999;
  padding: 2rem;
  font-style: italic;
}
```

---

## Bonnes pratiques

### ✅ À faire

- **Toujours** avoir loading/error states
- **Toujours** tester l'appel réseau (Network tab dans DevTools)
- **Toujours** vérifier `response.ok` avant parser JSON
- **Utiliser try/catch/finally** pour la gestion d'erreurs
- **Afficher messages clairs** à l'utilisateur
- Charger au montage avec `[]` de dépendances
- Recharger quand dépendance change `[filterId]`
- **Afficher spinner** pendant loading
- **Afficher message d'erreur** si ça échoue
- **Afficher "Aucun résultat"** si tableau vide

### ❌ À éviter

- Oublier `await` sur fetch
- Appeler une fonction async directement dans useEffect (envelopper dans une fonction)
- Oublier le try/catch (ça crash le composant)
- Faire trop d'appels réseau (limiter avec dépendances)
- Appels réseau sans loading state (confus les utilisateurs)
- Parser JSON sans vérifier `response.ok` (erreurs cryptiques)
- Charger CHAQUE rendu (dépendances `[]` oubliées)
- Ignorer les erreurs réseau (logging seulement, pas suffisant)

---

## Questions courantes

**Q: Et si je dois charger plusieurs endpoints?**
```javascript
useEffect(() => {
  const load = async () => {
    try {
      const [tickets, assets] = await Promise.all([
        fetch("/express/tickets").then(r => r.json()),
        fetch("/express/assets").then(r => r.json()),
      ]);
      setTickets(tickets);
      setAssets(assets);
    } catch (err) {
      setError(err.message);
    }
  };
  load();
}, []);
```

**Q: Comment passer des paramètres (filtres, pagination)?**
```javascript
const url = new URLSearchParams();
url.append("typeId", 2);
url.append("page", 1);

const response = await fetch(`/express/tickets?${url}`);
```

**Q: Comment garder les données après un changement de page?**
```javascript
// Ne pas réinitialiser, merger les données
setTickets(prev => [...prev, ...newData]);
```

**Q: Timeout réseau?**
```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(timeout);
}
```

---

Besoin d'adapter à un composant spécifique? 👍
