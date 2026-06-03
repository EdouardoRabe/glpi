# GLPI API V2 — Guide complet pour projet React & Reset Database

## 1. Architecture de l'API V2 (High-Level API)

### Deux API en parallèle

| | API V1 (Legacy) | API V2 (HL / High-Level) |
|---|---|---|
| URL de base | `/apirest.php/` | `/api.php/v2/` |
| Auth | Session-Token + App-Token | OAuth2 (Bearer Token) |
| Filtrage | Paramètres GET classiques | RSQL (`filter=name==*server*`) |
| Versioning | Non | Oui (`/v2`, `/v2.1`, `/v2.1.3`) |
| Documentation | Manuel | Swagger auto-généré (`/api.php/doc`) |
| Stabilité | Couplé à la DB interne | Abstraction stable |

> La V2 est disponible depuis GLPI 11.0. Elle est la cible recommandée pour tout nouveau développement.

---

## 2. Authentification OAuth2

### Étape 1 — Créer un client OAuth

Dans GLPI : **Configuration > Clients OAuth**. Récupérer le `client_id` et `client_secret`.

### Étape 2 — Obtenir un access token (Password Grant)

```http
POST /api.php/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&username=glpi
&password=glpi
&scope=api
```

**Réponse :**
```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJ0..."
}
```

### Utilisation dans les requêtes

```http
Authorization: Bearer eyJ0...
Content-Type: application/json
```

### Scopes disponibles

| Scope | Description |
|---|---|
| `api` | Accès à tous les endpoints REST |
| `user` | Informations utilisateur |
| `email` | Email par défaut de l'utilisateur |
| `inventory` | Soumission d'inventaire (agent) |
| `graphql` | Endpoint GraphQL |
| `status` | Endpoints de statut |

### Refresh token (Authorization Code Grant seulement)

```http
POST /api.php/token
grant_type=refresh_token&refresh_token=TOKEN&client_id=ID&client_secret=SECRET
```

---

## 3. Endpoints disponibles en V2

Les routes suivent la convention : `GET|POST|PATCH|DELETE /api.php/v2/{Namespace}/{Resource}/{id?}`

### 🖥️ Assets (AssetController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Assets/Computer` | GET, POST | Ordinateurs |
| `/Assets/Computer/{id}` | GET, PATCH, DELETE | Un ordinateur |
| `/Assets/Monitor` | GET, POST | Moniteurs |
| `/Assets/Monitor/{id}` | GET, PATCH, DELETE | Un moniteur |
| `/Assets/NetworkEquipment` | GET, POST | Équipements réseau |
| `/Assets/NetworkEquipment/{id}` | GET, PATCH, DELETE | Un équipement réseau |
| `/Assets/Peripheral` | GET, POST | Périphériques |
| `/Assets/Peripheral/{id}` | GET, PATCH, DELETE | Un périphérique |
| `/Assets/Phone` | GET, POST | Téléphones |
| `/Assets/Phone/{id}` | GET, PATCH, DELETE | Un téléphone |
| `/Assets/Printer` | GET, POST | Imprimantes |
| `/Assets/Printer/{id}` | GET, PATCH, DELETE | Une imprimante |
| `/Assets/Rack` | GET, POST | Baies serveur |
| `/Assets/Rack/{id}` | GET, PATCH, DELETE | Une baie |
| `/Assets/Enclosure` | GET, POST | Châssis |
| `/Assets/PDU` | GET, POST | PDU |
| `/Assets/PassiveDCEquipment` | GET, POST | Équipements DC passifs |
| `/Assets/Software` | GET, POST | Logiciels |
| `/Assets/Software/{id}` | GET, PATCH, DELETE | Un logiciel |
| `/Assets/SoftwareLicense` | GET, POST | Licences logicielles |
| `/Assets/SoftwareLicense/{id}` | GET, PATCH, DELETE | Une licence |
| `/Assets/Cartridge` | GET, POST | Cartouches |
| `/Assets/CartridgeItem` | GET, POST | Modèles de cartouches |
| `/Assets/Consumable` | GET, POST | Consommables |
| `/Assets/ConsumableItem` | GET, POST | Modèles de consommables |
| `/Assets/Certificate` | GET, POST | Certificats |
| `/Assets/Certificate/{id}` | GET, PATCH, DELETE | Un certificat |
| `/Assets/Cluster` | GET, POST | Clusters |
| `/Assets/Domain` | GET, POST | Domaines |
| `/Assets/Line` | GET, POST | Lignes |
| `/Assets/DatabaseInstance` | GET, POST | Instances base de données |

### 🎫 Assistance ITIL (ITILController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Assistance/Ticket` | GET, POST | Tickets |
| `/Assistance/Ticket/{id}` | GET, PATCH, DELETE | Un ticket |
| `/Assistance/Ticket/{id}/Timeline` | GET | Timeline d'un ticket |
| `/Assistance/Ticket/{id}/Task` | GET, POST | Tâches |
| `/Assistance/Ticket/{id}/Followup` | GET, POST | Suivis |
| `/Assistance/Ticket/{id}/Solution` | GET, POST | Solutions |
| `/Assistance/Ticket/{id}/Validation` | GET, POST | Validations |
| `/Assistance/Change` | GET, POST | Changements |
| `/Assistance/Change/{id}` | GET, PATCH, DELETE | Un changement |
| `/Assistance/Change/{id}/Timeline` | GET | Timeline d'un changement |
| `/Assistance/Problem` | GET, POST | Problèmes |
| `/Assistance/Problem/{id}` | GET, PATCH, DELETE | Un problème |

### 👥 Administration (AdministrationController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Administration/User` | GET, POST | Utilisateurs |
| `/Administration/User/{id}` | GET, PATCH, DELETE | Un utilisateur |
| `/Administration/Group` | GET, POST | Groupes |
| `/Administration/Group/{id}` | GET, PATCH, DELETE | Un groupe |
| `/Administration/Entity` | GET, POST | Entités |
| `/Administration/Entity/{id}` | GET, PATCH, DELETE | Une entité |
| `/Administration/Profile` | GET | Profils |
| `/Administration/Rule` | GET | Règles |

### 💼 Gestion (ManagementController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Management/Contract` | GET, POST | Contrats |
| `/Management/Contract/{id}` | GET, PATCH, DELETE | Un contrat |
| `/Management/Document` | GET, POST | Documents |
| `/Management/Document/{id}` | GET, PATCH, DELETE | Un document |
| `/Management/Budget` | GET, POST | Budgets |
| `/Management/Budget/{id}` | GET, PATCH, DELETE | Un budget |
| `/Management/Supplier` | GET, POST | Fournisseurs |
| `/Management/Supplier/{id}` | GET, PATCH, DELETE | Un fournisseur |
| `/Management/Contact` | GET, POST | Contacts |
| `/Management/Contact/{id}` | GET, PATCH, DELETE | Un contact |

### 📋 Projets (ProjectController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Project` | GET, POST | Projets |
| `/Project/{id}` | GET, PATCH, DELETE | Un projet |
| `/Project/{id}/Task` | GET, POST | Tâches de projet |

### 🔧 Composants (ComponentController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Component/Memory` | GET, POST | Mémoire RAM |
| `/Component/Processor` | GET, POST | Processeurs |
| `/Component/HardDrive` | GET, POST | Disques durs |
| `/Component/NetworkCard` | GET, POST | Cartes réseau |
| `/Component/GraphicCard` | GET, POST | Cartes graphiques |
| `/Component/SoundCard` | GET, POST | Cartes son |
| `/Component/PowerSupply` | GET, POST | Alimentations |

### ⚙️ Setup / Configuration (SetupController)

| Endpoint | Méthodes | Description |
|---|---|---|
| `/Setup/Location` | GET, POST | Localisations |
| `/Setup/Location/{id}` | GET, PATCH, DELETE | Une localisation |
| `/Setup/Manufacturer` | GET, POST | Fabricants |
| `/Setup/ITILCategory` | GET, POST | Catégories ITIL |
| `/Setup/Appliance` | GET, POST | Applications |
| `/Setup/KnowledgeBase` | GET, POST | Base de connaissance |
| `/Setup/KnowledgeBase/{id}` | GET, PATCH, DELETE | Un article KB |
| `/Setup/ReservationItem` | GET, POST | Réservations |

### 🔑 Core / Auth

| Endpoint | Méthodes | Description |
|---|---|---|
| `/api.php/token` | POST | Obtenir un token OAuth2 |
| `/api.php/authorize` | GET | Auth Code Flow |
| `/api.php/doc` | GET | Swagger UI |
| `/api.php/doc.json` | GET | Swagger JSON brut |
| `/api.php/GraphQL` | POST | GraphQL endpoint |
| `/api.php/GraphQL/Schema` | GET | Schéma GraphQL |

---

## 4. Filtrage RSQL (spécifique V2)

```
GET /api.php/v2/Assistance/Ticket?filter=name=="*server*" and status==1
GET /api.php/v2/Assets/Computer?filter=name=ilike=PC-*&sort=name&limit=50
```

| Opérateur | Description | Exemple |
|---|---|---|
| `==` | Égal | `status==1` |
| `!=` | Différent | `status!=6` |
| `=in=` | Dans la liste | `status=in=(1,2,3)` |
| `=out=` | Hors de la liste | `status=out=(5,6)` |
| `=lt=` | Inférieur | `date=lt=2024-01-01` |
| `=gt=` | Supérieur | `priority=gt=2` |
| `=like=` | Contient | `name=like=*srv*` |
| `=ilike=` | Contient (insensible casse) | `name=ilike=PC-*` |
| `=isnull=` | Est null | `serial=isnull=` |
| `=isnotnull=` | Non null | `serial=isnotnull=` |

---

## 5. Reset Database — Liste des ressources à supprimer

> ⚠️ **ATTENTION** : Un reset de base GLPI supprime toutes les données métier. À ne faire que sur des environnements de démo / test.

### Stratégie recommandée

Pour chaque ressource :
1. `GET /api.php/v2/{Resource}?limit=500` → récupérer tous les IDs
2. Filtrer les IDs à conserver (liste d'exceptions ci-dessous)
3. `DELETE /api.php/v2/{Resource}/{id}` pour chaque ID restant

### Ordre de suppression (respecter les dépendances FK)

```
1. Timeline items (Followup, Task, Solution) → avant les Tickets
2. Tickets, Changes, Problems
3. Assets (Computer, Monitor, etc.)
4. Software / Licenses
5. Contracts, Documents, Budgets
6. Projects
7. Groups (sauf groupes systèmes)
8. Users (sauf users systèmes)
```

---

### Tableau complet : Ressources à resetter + exceptions d'IDs

| Ressource | Endpoint V2 | IDs à NE PAS supprimer | Raison |
|---|---|---|---|
| **Tickets** | `/Assistance/Ticket` | aucun | Tout supprimer |
| **Changes** | `/Assistance/Change` | aucun | Tout supprimer |
| **Problems** | `/Assistance/Problem` | aucun | Tout supprimer |
| **Computers** | `/Assets/Computer` | aucun | Tout supprimer |
| **Monitors** | `/Assets/Monitor` | aucun | Tout supprimer |
| **NetworkEquipment** | `/Assets/NetworkEquipment` | aucun | Tout supprimer |
| **Printers** | `/Assets/Printer` | aucun | Tout supprimer |
| **Phones** | `/Assets/Phone` | aucun | Tout supprimer |
| **Peripherals** | `/Assets/Peripheral` | aucun | Tout supprimer |
| **Software** | `/Assets/Software` | aucun | Tout supprimer |
| **SoftwareLicense** | `/Assets/SoftwareLicense` | aucun | Tout supprimer |
| **Certificates** | `/Assets/Certificate` | aucun | Tout supprimer |
| **Contracts** | `/Management/Contract` | aucun | Tout supprimer |
| **Documents** | `/Management/Document` | aucun | Tout supprimer |
| **Budgets** | `/Management/Budget` | aucun | Tout supprimer |
| **Suppliers** | `/Management/Supplier` | aucun | Tout supprimer |
| **Contacts** | `/Management/Contact` | aucun | Tout supprimer |
| **Projects** | `/Project` | aucun | Tout supprimer |
| **KnowledgeBase** | `/Setup/KnowledgeBase` | aucun | Tout supprimer |
| **Users** | `/Administration/User` | **ID=2** (glpi) | Compte super-admin |
| **Users** | `/Administration/User` | **ID=1** si existe | Utilisateur anonyme (helpdesk) |
| **Groups** | `/Administration/Group` | à vérifier selon config | Groupes liés aux profils système |
| **Entities** | `/Administration/Entity` | **ID=0** | Entité racine (Root entity) — NE JAMAIS SUPPRIMER |
| **Profiles** | `/Administration/Profile` | **IDs 1-8** | Profils natifs GLPI (Super-Admin, Admin, Technician, etc.) |
| **Locations** | `/Setup/Location` | à décider | Peuvent être conservés comme référentiel |

### IDs système critiques à toujours conserver

```javascript
const PROTECTED_IDS = {
  // Entité racine — suppression = crash total de GLPI
  Entity: [0],

  // Utilisateur super-admin par défaut
  User: [2],          // 'glpi' (ID 2 dans une install standard)
                      // ID 1 = utilisateur anonyme public helpdesk
  
  // Profils natifs GLPI (ne jamais supprimer)
  Profile: [1, 2, 3, 4, 5, 6, 7, 8],
  // 1=Super-Admin, 2=Admin, 3=Technician, 4=Normal, 
  // 5=Post-Only, 6=Read-Only, 7=Observer, 8=Hotliner

  // Catégories ITIL de base (optionnel, selon besoins)
  // ITILCategory: [],
};
```

---

## 6. Exemple d'implémentation React — Service de Reset

```typescript
// glpiResetService.ts

const API_BASE = '/api.php/v2';

const RESOURCES_TO_RESET = [
  // Ordre important : d'abord les dépendants
  { name: 'Tickets',          endpoint: '/Assistance/Ticket' },
  { name: 'Changes',          endpoint: '/Assistance/Change' },
  { name: 'Problems',         endpoint: '/Assistance/Problem' },
  { name: 'Computers',        endpoint: '/Assets/Computer' },
  { name: 'Monitors',         endpoint: '/Assets/Monitor' },
  { name: 'NetworkEquipment', endpoint: '/Assets/NetworkEquipment' },
  { name: 'Printers',         endpoint: '/Assets/Printer' },
  { name: 'Phones',           endpoint: '/Assets/Phone' },
  { name: 'Peripherals',      endpoint: '/Assets/Peripheral' },
  { name: 'Software',         endpoint: '/Assets/Software' },
  { name: 'SoftwareLicense',  endpoint: '/Assets/SoftwareLicense' },
  { name: 'Contracts',        endpoint: '/Management/Contract' },
  { name: 'Documents',        endpoint: '/Management/Document' },
  { name: 'Budgets',          endpoint: '/Management/Budget' },
  { name: 'Suppliers',        endpoint: '/Management/Supplier' },
  { name: 'Contacts',         endpoint: '/Management/Contact' },
  { name: 'Projects',         endpoint: '/Project' },
  { name: 'KnowledgeBase',    endpoint: '/Setup/KnowledgeBase' },
  // Users en dernier, avec exceptions
  { name: 'Users',            endpoint: '/Administration/User',
    protectedIds: [1, 2] },
];

async function getToken(clientId: string, clientSecret: string, 
                         username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE.replace('/v2', '')}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username, password,
      scope: 'api',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchAllIds(endpoint: string, token: string): Promise<number[]> {
  const ids: number[] = [];
  let start = 0;
  const limit = 100;
  
  while (true) {
    const res = await fetch(
      `${API_BASE}${endpoint}?limit=${limit}&start=${start}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) break;
    
    const items = await res.json();
    if (!items.length) break;
    
    items.forEach((item: { id: number }) => ids.push(item.id));
    if (items.length < limit) break;
    start += limit;
  }
  return ids;
}

async function deleteItem(endpoint: string, id: number, token: string): Promise<void> {
  await fetch(`${API_BASE}${endpoint}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function resetDatabase(
  token: string,
  onProgress?: (resource: string, done: number, total: number) => void
): Promise<void> {
  for (const resource of RESOURCES_TO_RESET) {
    const allIds = await fetchAllIds(resource.endpoint, token);
    const protectedIds = resource.protectedIds ?? [];
    const toDelete = allIds.filter(id => !protectedIds.includes(id));
    
    for (let i = 0; i < toDelete.length; i++) {
      await deleteItem(resource.endpoint, toDelete[i], token);
      onProgress?.(resource.name, i + 1, toDelete.length);
    }
  }
}
```

---

## 7. Exemple de requête RSQL — Recherche dans GLPI

```typescript
// Recherche de tickets ouverts liés à un utilisateur
const searchTickets = async (token: string, userName: string) => {
  const filter = `status=in=(1,2,3) and name=ilike=*${userName}*`;
  const res = await fetch(
    `/api.php/v2/Assistance/Ticket?filter=${encodeURIComponent(filter)}&sort=date_creation&order=DESC&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.json();
};

// Recherche d'assets par nom
const searchComputers = async (token: string, query: string) => {
  const filter = `name=ilike=*${query}*`;
  const res = await fetch(
    `/api.php/v2/Assets/Computer?filter=${encodeURIComponent(filter)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.json();
};
```

---

## 8. Notes importantes pour le développement React

- **Swagger** : Toujours consulter `/api.php/doc` sur votre instance pour voir les schémas exacts des payloads (ils varient selon la version GLPI installée).
- **Pagination** : L'API retourne 50 items par défaut. Utiliser `limit` et `start` pour paginer.
- **CORS** : En développement local, configurer un proxy dans `vite.config.ts` pour éviter les erreurs CORS.
- **Infocom** : Les données financières (`/Infocom`) sont en lecture seule en V2 (prévu pour V2.2).
- **GraphQL** : Disponible en lecture seule, utile pour réduire le nombre de requêtes avec des jointures complexes.
- **Version pinning** : Utiliser `/api.php/v2/...` pour toujours avoir la dernière version mineure stable.
