# 📘 GUIDE COMPLET — ROUTES EXPRESS + req / res + SQLITE

---

# 🧠 1. Rôle des routes

Les routes servent à définir :

👉 comment ton API répond aux requêtes HTTP

---

## Exemple global :

| Méthode | URL    | Action |
| ------- | ------ | ------ |
| GET     | /users | lire   |
| POST    | /users | créer  |

---

# 📦 2. Initialisation du router

```javascript
const express = require("express");
const router = express.Router();
const db = require("../db");
```

---

## 🔹 express.Router()

Crée un **mini serveur Express indépendant**

---

## 🧠 Pourquoi utiliser Router ?

Sans router :

```
server.js = tout le code
```

Avec router :

```
routes/users.js = logique users
routes/products.js = logique products
```

👉 code organisé + scalable

---

## 🔹 db

Connexion SQLite importée pour exécuter les requêtes SQL.

---

# 📥 3. GET /users — récupérer les données

```javascript
router.get("/", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});
```

---

## 🔹 db.all()

Utilisé pour récupérer **plusieurs lignes**

---

### Syntaxe :

```javascript
db.all(SQL, params, callback)
```

---

## 🔹 SQL utilisé

```sql
SELECT * FROM users
```

👉 récupère tous les utilisateurs

---

## 🔹 rows

Contient le résultat :

```json
[
  {
    "id": 1,
    "name": "John",
    "email": "john@test.com"
  }
]
```

---

## 🔴 Gestion erreur

```javascript
if (err)
```

Si problème SQL :

* mauvaise requête
* table inexistante

---

## 🔹 res.status(500)

500 = erreur serveur

---

## 🔹 res.json(rows)

Retourne les données au frontend

---

# 📤 4. POST /users — créer un utilisateur

```javascript
router.post("/", (req, res) => {
    const { name, email } = req.body;
```

---

## 🔹 req.body

Contient les données envoyées par le client :

```json
{
  "name": "John",
  "email": "john@test.com"
}
```

---

## 🔹 destructuring

```javascript
const { name, email } = req.body;
```

équivalent à :

```javascript
const name = req.body.name;
const email = req.body.email;
```

---

# 💾 5. INSERT SQL

```javascript
db.run(
    "INSERT INTO users(name, email) VALUES (?, ?)",
    [name, email],
```

---

## 🔹 db.run()

Utilisé pour :

* INSERT
* UPDATE
* DELETE

---

## 🔹 Pourquoi "?"

C’est une protection contre :

### ❌ injection SQL

---

## 🔹 Exemple sécurisé

```sql
VALUES (?, ?)
```

---

## 🔹 Remplacement automatique

| ? | valeur |
| - | ------ |
| 1 | name   |
| 2 | email  |

---

# 📌 6. Callback db.run

```javascript
function (err)
```

---

## 🔹 this.lastID

Contient l’ID généré automatiquement :

```javascript
id: this.lastID
```

---

## Exemple :

```json
{
  "id": 5,
  "name": "John",
  "email": "john@test.com"
}
```

---

# 📤 7. Response POST

```javascript
res.status(201).json({
    id: this.lastID,
    name,
    email
});
```

---

## 🔹 201 Created

Indique :

👉 ressource créée avec succès

---

# 🔁 8. OBJET req (Request)

## 🔹 req.body

Données envoyées (POST, PUT)

---

## 🔹 req.params

```javascript
/users/5
```

```javascript
req.params.id // 5
```

---

## 🔹 req.query

```javascript
/users?page=2
```

```javascript
req.query.page
```

---

## 🔹 req.headers

Infos navigateur :

* token
* auth
* content-type

---

# 📤 9. OBJET res (Response)

## 🔹 res.json()

```javascript
res.json({ message: "OK" });
```

---

## 🔹 res.send()

```javascript
res.send("Hello");
```

---

## 🔹 res.status()

```javascript
res.status(404);
```

---

## 🔹 combinaison

```javascript
res.status(201).json({...});
```

---

# 🔗 10. Export du router

```javascript
module.exports = router;
```

Permet de brancher les routes dans `server.js`

---

# 🌐 11. Montage dans server.js

```javascript
app.use("/users", userRoutes);
```

---

## Résultat final :

| Route réelle | Action |
| ------------ | ------ |
| GET /users   | lire   |
| POST /users  | créer  |

---

# 🔁 12. Flux complet

## GET

```
React → GET /users → Express → SQLite → JSON → React
```

---

## POST

```
React → POST /users → Express → SQLite INSERT → ID → JSON → React
```

---

# 🚀 CONCLUSION

Tu as maintenant :

✔ compréhension complète routes Express
✔ maîtrise req / res
✔ requêtes SQL sécurisées
✔ architecture API REST propre
✔ séparation logique du code

---

👉 Tu es maintenant au niveau **backend structuré (niveau projet pro)**

Si tu veux la suite logique, je peux te faire :

* 🔐 Auth JWT (login/register)
* 🧱 architecture propre type production (MVC)
* 🧩 middleware avancé (auth, logs, validation)
* ⚡ optimisation SQLite → better-sqlite3
