# 📚 TABLE DES MATIÈRES — EXPRESS COMPLET

1. Introduction à Express
2. Installation et création du serveur
3. Application Express (`app`)
4. Routes HTTP (GET, POST, PUT, DELETE)
5. Router (organisation du code)
6. Middleware (concept clé)
7. req (Request) — objet complet
8. res (Response) — objet complet
9. Cycle complet d’une requête
10. CORS
11. Parsing JSON
12. Gestion des erreurs
13. Architecture recommandée
14. Bonnes pratiques
15. Conclusion

---

# 🧠 1. INTRODUCTION À EXPRESS

## 📌 Qu’est-ce que Express ?

Express est un **framework Node.js** qui permet de créer :

* des API REST
* des serveurs web
* des applications backend

---

## 🧠 Pourquoi Express existe ?

Sans Express :

```javascript id="x1"
const http = require("http");
```

➡ code compliqué pour gérer routes + JSON + headers

---

Avec Express :

```javascript id="x2"
const express = require("express");
const app = express();
```

➡ simple, rapide, structuré

---

## 🧱 Rôle dans ton architecture

```text id="x3"
React → Express API → SQLite
```

---

# ⚙️ 2. INSTALLATION

```bash id="x4"
npm install express
```

Option dev :

```bash id="x5"
npm install nodemon
```

---

# 🚀 3. CRÉATION DU SERVEUR

```javascript id="x6"
const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("Serveur démarré");
});
```

---

## 📌 app.listen()

Démarre le serveur HTTP.

---

# 🧩 4. APPLICATION EXPRESS (`app`)

```javascript id="x7"
const app = express();
```

## 🧠 app = serveur principal

Il permet :

* créer routes
* ajouter middleware
* écouter requêtes

---

## 📌 Fonctions principales

```javascript id="x8"
app.get()
app.post()
app.put()
app.delete()
app.use()
```

---

# 🌐 5. ROUTES HTTP

## 📥 GET

```javascript id="x9"
app.get("/users", (req, res) => {});
```

➡ lire des données

---

## 📤 POST

```javascript id="x10"
app.post("/users", (req, res) => {});
```

➡ créer des données

---

## ✏️ PUT

➡ modifier entièrement

---

## 🧩 PATCH

➡ modifier partiellement

---

## ❌ DELETE

➡ supprimer

---

# 🧭 6. ROUTER (ORGANISATION)

```javascript id="x11"
const router = express.Router();
```

## 📌 Pourquoi ?

Permet de découper :

```text id="x12"
routes/users.js
routes/products.js
routes/auth.js
```

---

## 📌 Exemple

```javascript id="x13"
router.get("/", (req, res) => {
    res.json([]);
});
```

---

## 📌 Montage

```javascript id="x14"
app.use("/users", router);
```

---

# ⚙️ 7. MIDDLEWARE

## 📌 Définition

Un middleware est une fonction exécutée :

```text id="x15"
AVANT la route finale
```

---

## 📌 Exemple

```javascript id="x16"
app.use((req, res, next) => {
    console.log("Request reçue");
    next();
});
```

---

## 📌 next()

Permet de passer au middleware suivant.

---

## 📌 Types de middleware

* global (`app.use`)
* route spécifique
* third-party (cors, json)

---

# 📦 8. req (REQUEST)

## 📌 C’est quoi ?

Objet contenant la requête client.

---

## 🔹 req.body

Données envoyées :

```json id="x17"
{ "name": "John" }
```

---

## 🔹 req.params

```javascript id="x18"
/users/5
```

```javascript id="x19"
req.params.id // 5
```

---

## 🔹 req.query

```javascript id="x20"
/users?page=2
```

```javascript id="x21"
req.query.page
```

---

## 🔹 req.headers

Infos navigateur :

* token
* content-type
* auth

---

# 📤 9. res (RESPONSE)

## 📌 C’est quoi ?

Objet utilisé pour répondre au client.

---

## 🔹 res.json()

```javascript id="x22"
res.json({ message: "OK" });
```

---

## 🔹 res.send()

```javascript id="x23"
res.send("Hello");
```

---

## 🔹 res.status()

```javascript id="x24"
res.status(404);
```

---

## 🔹 combinaison

```javascript id="x25"
res.status(201).json({});
```

---

# 🔁 10. CYCLE COMPLET

```text id="x26"
React → HTTP Request
     ↓
Express reçoit req
     ↓
Middleware
     ↓
Route
     ↓
SQLite (si besoin)
     ↓
res.json()
     ↓
React reçoit data
```

---

# 🌍 11. CORS

## 📌 Problème

React :

```text id="x27"
localhost:5173
```

Express :

```text id="x28"
localhost:3000
```

➡ bloqué par navigateur

---

## 📌 Solution

```javascript id="x29"
const cors = require("cors");
app.use(cors());
```

---

# 📦 12. JSON PARSING

```javascript id="x30"
app.use(express.json());
```

## 📌 Rôle

Convertit :

```json id="x31"
"{ name: 'John' }"
```

en objet JS :

```javascript id="x32"
{ name: "John" }
```

---

# ❌ 13. GESTION DES ERREURS

```javascript id="x33"
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    });
});
```

---

## 📌 Codes HTTP importants

| Code | Signification |
| ---- | ------------- |
| 200  | OK            |
| 201  | Created       |
| 400  | Bad Request   |
| 401  | Unauthorized  |
| 404  | Not Found     |
| 500  | Server Error  |

---

# 🧱 14. ARCHITECTURE RECOMMANDÉE

```text id="x34"
src/
 ├── server.js
 ├── db.js
 ├── routes/
 │    ├── users.js
 │    ├── auth.js
 ├── controllers/
 ├── middleware/
```

---

# ⚡ 15. BONNES PRATIQUES

✔ utiliser Router
✔ séparer DB / routes
✔ utiliser async logique propre
✔ sécuriser SQL avec `?`
✔ toujours gérer les erreurs
✔ utiliser CORS uniquement si nécessaire

---

# 🚀 16. CONCLUSION

Express est :

✔ un framework minimal
✔ rapide à apprendre
✔ parfait pour API REST
✔ indispensable avec React + Node

---

## 🧠 Résumé mental :

```text id="x35"
Express = gestion des requêtes HTTP
SQLite = stockage des données
React = affichage utilisateur
```

---

👉 Avec cette base tu peux construire :

* API GLPI
* backend complet SaaS
* système auth
* dashboard admin
