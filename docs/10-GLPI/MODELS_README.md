# Guide des Modèles GLPI

Les modèles permettent d'interagir avec l'API GLPI v2 de façon orientée objet.
Chaque modèle suit la même structure — ce guide utilise `Ticket` comme exemple,
mais tout s'applique identiquement à `Computer`, `User`, etc.

---

## Table des matières

1. [Structure d'un modèle](#1-structure-dun-modèle)
2. [Lecture — méthodes statiques](#2-lecture--méthodes-statiques)
   - [getAll](#getall)
   - [getById](#getbyid)
   - [getBy](#getby)
   - [getByAnd](#getbyand)
   - [getByOr](#getbyor)
   - [getByNot](#getbynot)
   - [getByNotAnd](#getbynotand)
   - [getByNotOr](#getbynotor)
   - [getIncl](#getincl)
   - [getExcl](#getexcl)
3. [Écriture — méthodes d'instance](#3-écriture--méthodes-dinstance)
   - [save](#save)
   - [update](#update)
   - [delete](#delete)
4. [Suppression — méthode statique](#4-suppression--méthode-statique)
   - [deleteAll](#deleteall)
5. [Exemples complets](#5-exemples-complets)
6. [Créer un nouveau modèle](#6-créer-un-nouveau-modèle)

---

## 1. Structure d'un modèle

```javascript
class Ticket {
    // Endpoint API GLPI
    static endpoint = "Assistance/Ticket";

    // Nombre d'éléments récupérés par requête (pagination interne automatique)
    static limit = 100;

    // IDs protégés — jamais supprimés par deleteAll()
    static protectedIds = [6];

    constructor(data = {}) {
        this.id     = data.id     ?? null;
        this.name   = data.name   ?? "";
        // ...tous les champs du modèle avec leurs valeurs par défaut
    }
}
```

**Les méthodes de lecture et `deleteAll` sont `static`** → s'appellent directement sur la classe.
**Les méthodes `save`, `update`, `delete` sont d'instance** → s'appellent sur un objet `new Ticket(...)`.

---

## 2. Lecture — méthodes statiques

### getAll

Récupère **tous** les enregistrements (toutes les pages automatiquement).

```javascript
const tickets = await Ticket.getAll();
```

| | |
|---|---|
| **Arguments** | aucun |
| **Retour** | `Promise<Ticket[]>` — tableau d'instances |
| **Erreur** | throw si l'API retourne une erreur |

---

### getById

Récupère **un seul** enregistrement par son ID.

```javascript
const ticket = await Ticket.getById(42);
console.log(ticket.name);        // "Panne réseau"
console.log(ticket.status.name); // "Nouveau"
```

| | |
|---|---|
| **Arguments** | `id` — number \| string |
| **Retour** | `Promise<Ticket>` — une instance |
| **Erreur** | throw si l'ID n'existe pas ou si l'API retourne une erreur |

---

### getBy

Récupère tous les enregistrements où **`colonne == valeur`**.

```javascript
// Tous les tickets avec status id == 1
const nouveaux = await Ticket.getBy("status", 1);

// Tous les tickets de type Incident
const incidents = await Ticket.getBy("type", 1);
```

| | |
|---|---|
| **Arguments** | `column` string — nom du champ GLPI, `value` any — valeur recherchée |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si l'API retourne une erreur |

---

### getByAnd

Récupère tous les enregistrements correspondant à **plusieurs critères** (ET logique).
Tous les critères doivent être vrais simultanément.

```javascript
// Tickets assignés ET urgence critique
const tickets = await Ticket.getByAnd([
    { column: "status",  value: 2 },
    { column: "urgency", value: 5 },
]);
```

| | |
|---|---|
| **Arguments** | `criteria` — `Array<{ column: string, value: any }>` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

### getByOr

Récupère tous les enregistrements correspondant à **au moins un critère** (OU logique).

```javascript
// Tickets nouveaux OU en attente
const tickets = await Ticket.getByOr([
    { column: "status", value: 1 },
    { column: "status", value: 4 },
]);
```

| | |
|---|---|
| **Arguments** | `criteria` — `Array<{ column: string, value: any }>` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

### getByNot

Récupère tous les enregistrements où **`colonne != valeur`**.

```javascript
// Tous les tickets sauf les fermés
const nonFermes = await Ticket.getByNot("status", 6);
```

| | |
|---|---|
| **Arguments** | `column` string, `value` any |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si l'API retourne une erreur |

---

### getByNotAnd

Exclut les enregistrements correspondant à **tous les critères** (ET logique d'exclusion).
Un enregistrement est retourné seulement si **aucun** des critères n'est vrai.

```javascript
// Tickets ni résolus ni fermés
const actifs = await Ticket.getByNotAnd([
    { column: "status", value: 5 },
    { column: "status", value: 6 },
]);
```

| | |
|---|---|
| **Arguments** | `criteria` — `Array<{ column: string, value: any }>` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

### getByNotOr

Exclut les enregistrements où **au moins un critère** est vrai (OU logique d'exclusion).

```javascript
// Tickets où le type n'est pas Incident OU la priorité n'est pas haute
const tickets = await Ticket.getByNotOr([
    { column: "type",     value: 1 },
    { column: "priority", value: 4 },
]);
```

| | |
|---|---|
| **Arguments** | `criteria` — `Array<{ column: string, value: any }>` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

### getIncl

Récupère uniquement les enregistrements dont l'**ID est dans la liste**.

```javascript
// Récupère uniquement les tickets 1, 5 et 12
const selection = await Ticket.getIncl([1, 5, 12]);
```

| | |
|---|---|
| **Arguments** | `ids` — `number[]` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

### getExcl

Récupère tous les enregistrements **sauf** ceux dont l'ID est dans la liste.

```javascript
// Tous les tickets sauf 1, 5 et 12
const tickets = await Ticket.getExcl([1, 5, 12]);
```

| | |
|---|---|
| **Arguments** | `ids` — `number[]` |
| **Retour** | `Promise<Ticket[]>` |
| **Erreur** | throw si le tableau est vide ou si l'API retourne une erreur |

---

## 3. Écriture — méthodes d'instance

### save

Crée l'enregistrement dans GLPI et **met à jour `this.id`** avec l'ID généré.

```javascript
const ticket = new Ticket({
    name:    "Panne imprimante",
    content: "L'imprimante du 2ème étage ne répond plus.",
    type:    1,   // Incident
    urgency: 3,
});

await ticket.save();
console.log(ticket.id); // ID généré par GLPI, ex: 47
```

| | |
|---|---|
| **Arguments** | aucun |
| **Retour** | `Promise<Ticket>` — `this` avec `id` mis à jour |
| **Erreur** | throw si `this.id` est déjà défini — utiliser `update()` à la place |
| **Erreur** | throw si l'API retourne une erreur |

---

### update

Met à jour **uniquement les champs fournis** dans GLPI et les applique sur `this`.

```javascript
const ticket = await Ticket.getById(47);

// Modifier un seul champ
await ticket.update({ name: "Panne imprimante — résolu" });

// Modifier plusieurs champs
await ticket.update({
    name:    "Panne imprimante — résolu",
    status:  5,
    urgency: 1,
});

console.log(ticket.name); // "Panne imprimante — résolu" — mis à jour sur l'instance aussi
```

| | |
|---|---|
| **Arguments** | `fields` — `{ [champ]: valeur }` — objet avec les champs à modifier |
| **Retour** | `Promise<Ticket>` — `this` avec les champs mis à jour |
| **Erreur** | throw si `this.id` est null — utiliser `save()` à la place |
| **Erreur** | throw si l'API retourne une erreur |

> ⚠️ Seuls les champs passés dans `fields` sont envoyés à l'API.
> Les autres champs de l'instance ne sont pas touchés.

---

### delete

Supprime l'enregistrement dans GLPI et remet **`this.id` à `null`**.

```javascript
const ticket = await Ticket.getById(47);
await ticket.delete();

console.log(ticket.id); // null
```

| | |
|---|---|
| **Arguments** | aucun |
| **Retour** | `Promise<void>` |
| **Erreur** | throw si `this.id` est null |
| **Erreur** | throw si l'API retourne une erreur |

---

## 4. Suppression — méthode statique

### deleteAll

Supprime **tous** les enregistrements du modèle, en respectant les `protectedIds`.
Les IDs protégés sont définis dans `static protectedIds` de chaque modèle et ne seront jamais supprimés.

```javascript
// Supprime tous les tickets sauf ceux dont l'ID est dans protectedIds
await Ticket.deleteAll();
```

| | |
|---|---|
| **Arguments** | aucun |
| **Retour** | `Promise<void>` |
| **IDs protégés** | définis dans `static protectedIds = [...]` du modèle |

**Configurer les IDs protégés dans le modèle :**

```javascript
class Ticket {
    static protectedIds = [6]; // le ticket #6 ne sera jamais supprimé
}

class User {
    static protectedIds = [1, 2]; // utilisateurs système — jamais supprimés
}
```

> ⚠️ Cette méthode supprime tous les enregistrements sans confirmation.
> À utiliser uniquement sur des environnements de test/démo.

---

## 5. Exemples complets

### Créer un ticket et le fermer

```javascript
// Création
const ticket = new Ticket({
    name:    "Écran noir poste comptabilité",
    content: "Le poste de Marie ne démarre plus.",
    type:    1,      // Incident
    urgency: 4,
});
await ticket.save();
console.log(`Ticket #${ticket.id} créé`);

// Résolution
await ticket.update({ status: 5 }); // Résolu

// Fermeture
await ticket.update({ status: 6 }); // Fermé
```

---

### Récupérer et afficher tous les tickets ouverts

```javascript
const tickets = await Ticket.getByNotAnd([
    { column: "status", value: 5 }, // pas Résolu
    { column: "status", value: 6 }, // pas Fermé
]);

tickets.forEach(t => {
    console.log(`#${t.id} — ${t.name} (${t.status?.name})`);
});
```

---

### Modifier plusieurs tickets en boucle

```javascript
const urgents = await Ticket.getBy("urgency", 5);

for (const ticket of urgents) {
    await ticket.update({ priority: 6 }); // Priorité Majeure
    console.log(`Ticket #${ticket.id} mis à jour`);
}
```

---

### Supprimer une sélection de tickets

```javascript
const aSupprimer = [10, 11, 12];
const tickets = await Ticket.getIncl(aSupprimer);

for (const ticket of tickets) {
    await ticket.delete();
}
```

---

### Reset complet d'un modèle

```javascript
// Supprime tout sauf les IDs dans protectedIds
await Ticket.deleteAll();
```

---

## 6. Créer un nouveau modèle

Pour créer un modèle `Computer`, `User`, etc. :

1. Copier `Ticket.js` et le renommer
2. Changer `static endpoint` avec le bon endpoint GLPI
3. Changer `static protectedIds` selon les IDs à protéger
4. Adapter le `constructor` avec les champs retournés par l'API

```javascript
class Computer {
    static endpoint     = "Assets/Computer";
    static limit        = 100;
    static protectedIds = []; // aucun ordinateur protégé

    constructor(data = {}) {
        this.id         = data.id         ?? null;
        this.name       = data.name       ?? "";
        this.serial     = data.serial     ?? null;
        this.is_deleted = data.is_deleted ?? false;
        // ...autres champs
    }

    // Copier/coller toutes les méthodes depuis Ticket.js
    // Remplacer "Ticket" par "Computer" dans les messages d'erreur
}
```

### Endpoints par modèle

| Modèle | `static endpoint` | `protectedIds` recommandés |
|---|---|---|
| Ticket | `Assistance/Ticket` | `[]` |
| Change | `Assistance/Change` | `[]` |
| Problem | `Assistance/Problem` | `[]` |
| Computer | `Assets/Computer` | `[]` |
| Monitor | `Assets/Monitor` | `[]` |
| Printer | `Assets/Printer` | `[]` |
| Phone | `Assets/Phone` | `[]` |
| NetworkEquipment | `Assets/NetworkEquipment` | `[]` |
| Software | `Assets/Software` | `[]` |
| User | `Administration/User` | `[1, 2]` — utilisateurs système |
| Group | `Administration/Group` | à vérifier selon config |
| Entity | `Administration/Entity` | `[0]` — entité racine |
| Contract | `Management/Contract` | `[]` |
| Document | `Management/Document` | `[]` |
| Supplier | `Management/Supplier` | `[]` |
| Project | `Project` | `[]` |

