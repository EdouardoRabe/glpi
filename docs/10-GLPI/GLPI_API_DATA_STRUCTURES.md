# Structures de données GLPI

## 📋 Table des matières

1. [Ticket](#ticket)
2. [Computer](#computer)
3. [User](#user)
4. [Collection (List Response)](#collection)
5. [Énumérations](#énumérations)
6. [Champs spéciaux](#champs-spéciaux)

---

## Ticket

### Exemple complet

```javascript
{
  // Identifiants
  id: 123,
  uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",

  // Informations de base
  name: "Problème d'accès réseau",
  content: "<p>Je n'arrive pas à me connecter au réseau</p>",
  type: 1,  // 1=Incident, 2=Demande

  // Status et priorité
  status: 2,  // 1=Nouveau, 2=Assigné, 3=Planifié, 4=Attente, 5=Résolu, 6=Fermé
  urgency: 4,  // 1=Faible, 2=Normal, 3=Élevée, 4=Très élevée, 5=Critique
  impact: 2,    // 1=Faible, 2=Moyen, 3=Élevé, 4=Très élevé, 5=Critique
  priority: 5,  // Calculée : urgency × impact

  // Assignation
  _users_id_assign: 42,  // ID de l'utilisateur assigné
  _groups_id_assign: 7,  // ID du groupe assigné

  // Temps
  date_creation: "2024-06-03 10:30:00",
  date_mod: "2024-06-03 14:45:00",
  date_due: "2024-06-10 17:00:00",
  time_to_own: 3600,  // Secondes avant assignation
  time_to_resolve: 7200,  // Secondes avant résolution

  // Entité et localisation
  entities_id: 1,
  locations_id: 5,

  // Catégories
  itilcategories_id: 2,
  requesttypes_id: 1,

  // État système
  is_deleted: 0,
  users_id_lastupdater: 42,
  
  // Champs texte libres
  description: "Détails additionnels",
  solution: "Redémarrer le routeur",

  // Données de suivi
  count_followups: 3,
  count_documents: 1,
  count_tasks: 2
}
```

### Extraction de données courantes

```javascript
// Accéder aux champs
const ticket = await getById("Ticket", 123)

const name = ticket.name
const status = ticket.status  // 1-6
const isOpen = ticket.status !== 6  // Pas fermé ?
const isNew = ticket.status === 1
const isClosed = ticket.status === 6

const createdDate = new Date(ticket.date_creation)
const daysSinceCreation = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24))
```

### Créer un ticket

```javascript
const newTicket = await createItem("Ticket", {
  name: "Bug: La page ne charge pas",
  content: "Quand je clique sur 'Rapports', la page reste blanche",
  type: 1,  // Incident
  urgency: 3,
  impact: 2,
  itilcategories_id: 2,  // Catégorie appropriée
  requesttypes_id: 1
})

console.log(`Ticket créé : #${newTicket.id}`)
```

### Mettre à jour un ticket

```javascript
// Assignation
await updateItem("Ticket", 123, {
  _users_id_assign: 42,  // Assigner à l'utilisateur 42
  status: 2  // Markier comme assigné
})

// Changement de priorité
await patchItem("Ticket", 123, {
  urgency: 5,  // Critique
  priority: 25  // Recalculé
})

// Fermeture avec solution
await patchItem("Ticket", 123, {
  status: 6,  // Fermé
  solution: "Problème résolu après mise à jour du pilote"
})
```

---

## Computer

### Exemple complet

```javascript
{
  // Identifiants
  id: 456,
  uuid: "550e8400-e29b-41d4-a716-446655440000",

  // Informations de base
  name: "PC-BUREAU-001",
  serial: "ABC123XYZ",
  type: 1,  // 1=Ordinateur bureau, 2=Ordinateur portable, 3=Serveur, etc.
  status: 1,  // 1=Actif, 0=Inactif, 2=À recycler, etc.

  // Localisation
  locations_id: 5,  // Salle 5
  users_id: 42,  // Utilisateur propriétaire
  groups_id: 7,  // Groupe propriétaire

  // Spécifications matérielles
  sku: "DEL123456",
  autoupdatesystems_id: 1,

  // OS
  operatingsystems_id: 2,  // Windows, Linux, etc.
  operatingsystemversions_id: 15,
  operatingsystemservicepacks_id: 3,

  // Hardware
  manufacturers_id: 5,  // DELL, HP, Lenovo, etc.
  computermodels_id: 22,
  
  // Stockage
  nbproc: 4,  // Nombre de processeurs/cores
  processors_id: 18,  // Modèle du processeur
  nbcores: 8,  // Nombre de cores
  nbthreads: 16,  // Nombre de threads

  ram_id: "2048",  // Mémoire RAM en MB

  // Réseau
  macs: ["00:1A:2B:3C:4D:5E", "00:1A:2B:3C:4D:5F"],

  // Dates
  date_creation: "2023-01-15 09:00:00",
  date_mod: "2024-06-03 14:30:00",
  date_lastplugin_update: "2024-05-20 11:00:00",

  // Entité
  entities_id: 1,
  is_deleted: 0,

  // Commentaires
  comment: "Ordinateur de la salle serveurs",

  // Suivi
  is_template: 0,
  template_name: null
}
```

### Extraction de données courantes

```javascript
const computer = await getById("Computer", 456)

// Spécifications
const cores = computer.nbcores
const ram = computer.ram_id + " MB"
const cpu = computer.nbproc + " processeurs"

// État
const isActive = computer.status === 1
const isDeleted = computer.is_deleted === 1

// Propriétaire
const userOwner = computer.users_id  // ID à chercher dans User table
const groupOwner = computer.groups_id

// Localisation
const location = computer.locations_id
```

---

## User

### Exemple complet

```javascript
{
  // Identifiants
  id: 42,
  login: "jean.dupont",
  name: "Jean Dupont",

  // Contact
  email: "jean.dupont@company.com",
  phone: "01 23 45 67 89",
  mobile: "06 12 34 56 78",

  // Département
  department: "IT",
  title: "Administrateur Système",
  usertitles_id: 3,
  usercategories_id: 1,

  // Localisation
  locations_id: 5,
  users_id_supervisor: 1,  // Son manager

  // Authentification
  picture: null,  // URL ou null
  is_active: 1,  // 1=Actif, 0=Inactif
  is_deleted: 0,
  is_notified: 1,  // Reçoit les notifications

  // Droits et rôles
  // (Voir dans la relation profiles/entities)

  // Dates
  date_creation: "2020-03-10 08:00:00",
  date_mod: "2024-06-03 10:15:00",
  date_password_last_update: "2024-04-01 09:30:00",

  // Entité
  entities_id: 1,

  // Préférences
  language: "fr_FR",
  datetime_format: "Y-m-d H:i",
  number_format: "0,00"
}
```

### Récupérer les utilisateurs d'un groupe

```javascript
// Tous les utilisateurs
const allUsers = await getAll("User", { limit: 100 })

// Utilisateurs actifs
const activeUsers = await getAll("User", {
  filter: "is_active=1",
  limit: 100
})

// Utilisateur spécifique
const user = await getById("User", 42)
const email = user.email
const isActive = user.is_active === 1
```

---

## Collection

### Réponse d'une liste (getAll)

```javascript
const response = {
  // Tableau de ressources
  data: [
    { id: 1, name: "Ticket 1", status: 2 },
    { id: 2, name: "Ticket 2", status: 5 },
    { id: 3, name: "Ticket 3", status: 1 }
  ],

  // Métadonnées
  totalcount: 342,  // Total d'enregistrements en base
  count: 3  // Nombre d'enregistrements retournés
}

// Boucler sur les résultats
response.data.forEach(item => {
  console.log(`ID: ${item.id}, Nom: ${item.name}`)
})

// Vérifier s'il y a plus de résultats
const hasMore = response.totalcount > response.count
if (hasMore) {
  console.log(`Il y a ${response.totalcount - response.count} autres enregistrements`)
}
```

### Pagination

```javascript
// Page 1 (premiers 20 enregistrements)
const page1 = await getAll("Ticket", {
  limit: 20,
  offset: 0
})

// Page 2 (enregistrements 20-40)
const page2 = await getAll("Ticket", {
  limit: 20,
  offset: 20
})

// Calculer le nombre de pages
const pageSize = 20
const totalPages = Math.ceil(page1.totalcount / pageSize)
console.log(`Total de pages : ${totalPages}`)
```

---

## Énumérations

### Statuts de Ticket

```javascript
const TICKET_STATUS = {
  1: "Nouveau",
  2: "Assigné",
  3: "Planifié",
  4: "Attente",
  5: "Résolu",
  6: "Fermé"
}

// Utilisation
const ticket = await getById("Ticket", 123)
console.log(`Statut : ${TICKET_STATUS[ticket.status]}`)

// Vérifier un statut
if (ticket.status === 6) {
  console.log("Ticket fermé")
}
```

### Type de Ticket

```javascript
const TICKET_TYPE = {
  1: "Incident",
  2: "Demande"
}
```

### Priorité (Urgence)

```javascript
const URGENCY_LEVEL = {
  1: "Faible",
  2: "Normal",
  3: "Élevée",
  4: "Très élevée",
  5: "Critique"
}
```

### Impact

```javascript
const IMPACT_LEVEL = {
  1: "Faible",
  2: "Moyen",
  3: "Élevé",
  4: "Très élevé",
  5: "Critique"
}
```

### État de l'ordinateur

```javascript
const COMPUTER_STATUS = {
  0: "Inactif",
  1: "Actif",
  2: "À recycler",
  3: "En réparation",
  4: "En stock"
}
```

---

## Champs spéciaux

### Champs d'action (underscore prefix)

Certains champs commencent par `_` et ne sont pas stockés directement, mais déclenchent des actions :

```javascript
// Assigner à un utilisateur
{
  _users_id_assign: 42  // Assigne à user 42
}

// Assigner à un groupe
{
  _groups_id_assign: 7  // Assigne au groupe 7
}

// Ces champs ne sont pas retournés en GET
// Ils servent uniquement en POST/PUT pour déclencher des actions
```

### Champs HTML

Certains champs peuvent contenir du HTML :

```javascript
{
  content: "<p>Texte en <strong>gras</strong></p>",
  solution: "<ul><li>Étape 1</li><li>Étape 2</li></ul>"
}

// Nettoyer le HTML pour l'affichage sûr
const stripHtml = (html) => {
  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText
}

const plainText = stripHtml(ticket.content)
```

### Champs calculés

Certains champs sont calculés et en lecture seule :

```javascript
const ticket = await getById("Ticket", 123)

// Ces champs sont calculés par GLPI
console.log(ticket.priority)  // Calculé : urgency × impact
console.log(ticket.count_followups)  // Compte les followups
console.log(ticket.count_documents)  // Compte les documents
```

---

## 🔍 Exemple pratique complet

```javascript
// Récupérer tous les tickets ouverts
const openTickets = await getAll("Ticket", {
  filter: "status=in=(1,2,3,4)",  // Exclu Résolu(5) et Fermé(6)
  sort: "-priority",  // Priorité décroissante
  limit: 50
})

// Traiter les résultats
openTickets.data.forEach(ticket => {
  // Vérifier les propriétés
  if (!ticket._users_id_assign) {
    console.log(`❌ Ticket #${ticket.id} non assigné`)
  } else if (ticket.priority >= 20) {
    console.log(`🔴 URGENT Ticket #${ticket.id} (priorité ${ticket.priority})`)
  } else {
    console.log(`✅ Ticket #${ticket.id} (${TICKET_STATUS[ticket.status]})`)
  }
})

console.log(`Total : ${openTickets.totalcount} tickets ouverts`)
```

---

## 📚 Ressources

- [Documentation GLPI API v2](http://glpi.local/api.php/doc)
- [Guide JSON de ce projet](./JSON_PARSING_GUIDE.md)
