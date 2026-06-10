# Guide SQLite — Quelle Fonction Utiliser et Quand ?

> 🔎 **Mots-clés de recherche :** CASE WHEN END, MAX, MIN, SUM, COUNT, AVG, COALESCE, IFNULL, NULLIF, IIF, GROUP_CONCAT, GROUP BY, HAVING, pivot, window function, OVER, PARTITION BY, ROW_NUMBER, RANK, CTE, WITH, sous-requête, UNION, EXISTS, CAST, quand utiliser, fonction conditionnelle

> 📘 **Ce guide complète** [sqlite3-guide.md](sqlite3-guide.md) (qui couvre SELECT, INSERT, UPDATE, DELETE, JOIN, index, transactions...). Ici on se concentre sur **QUELLE fonction choisir selon ton objectif**, du simple au très complexe.

## Table des matières

1. [Choisir par objectif (tableau maître)](#choisir-par-objectif-tableau-maître)
2. [CASE WHEN ... END (la condition en SQL)](#case-when--end-la-condition-en-sql)
3. [Gérer les NULL : COALESCE, IFNULL, NULLIF, IIF](#gérer-les-null--coalesce-ifnull-nullif-iif)
4. [Les agrégats : COUNT, SUM, AVG, MIN, MAX, GROUP_CONCAT](#les-agrégats--count-sum-avg-min-max-group_concat)
5. [WHERE vs HAVING : où filtrer ?](#where-vs-having--où-filtrer-)
6. [Fonctions texte, nombre, date — quand ?](#fonctions-texte-nombre-date--quand-)
7. [CAST — convertir un type](#cast--convertir-un-type)
8. [Sous-requête vs JOIN vs CTE (WITH)](#sous-requête-vs-join-vs-cte-with)
9. [EXISTS vs IN](#exists-vs-in)
10. [UNION, INTERSECT, EXCEPT](#union-intersect-except)
11. [Window functions (OVER, PARTITION BY) — avancé](#window-functions-over-partition-by--avancé)
12. [La requête "ultime" qui combine tout](#la-requête-ultime-qui-combine-tout)

---

## Choisir par objectif (tableau maître)

> 👉 Tu ne sais pas quoi utiliser ? Trouve ton objectif dans la colonne de gauche.

| Je veux... | J'utilise | Section |
|------------|-----------|---------|
| Afficher une valeur **selon une condition** (si/sinon) | `CASE WHEN ... END` | [#2](#case-when--end-la-condition-en-sql) |
| Remplacer un **NULL** par une valeur | `COALESCE` / `IFNULL` | [#3](#gérer-les-null--coalesce-ifnull-nullif-iif) |
| **Compter / additionner / moyenne** des lignes | `COUNT` / `SUM` / `AVG` | [#4](#les-agrégats--count-sum-avg-min-max-group_concat) |
| La **plus grande / petite** valeur | `MAX` / `MIN` | [#4](#les-agrégats--count-sum-avg-min-max-group_concat) |
| **Coller plusieurs valeurs** en une chaîne | `GROUP_CONCAT` | [#4](#les-agrégats--count-sum-avg-min-max-group_concat) |
| Filtrer **avant** regroupement | `WHERE` | [#5](#where-vs-having--où-filtrer-) |
| Filtrer **après** regroupement (sur un COUNT/SUM) | `HAVING` | [#5](#where-vs-having--où-filtrer-) |
| Transformer des **lignes en colonnes** (pivot) | `MAX(CASE WHEN...)` | [#2](#case-when--end-la-condition-en-sql) |
| **Convertir** un texte en nombre (ou l'inverse) | `CAST` | [#7](#cast--convertir-un-type) |
| Réutiliser une **requête nommée** lisible | `WITH` (CTE) | [#8](#sous-requête-vs-join-vs-cte-with) |
| Vérifier **s'il existe** des lignes liées | `EXISTS` | [#9](#exists-vs-in) |
| **Numéroter / classer** des lignes | `ROW_NUMBER` / `RANK` | [#11](#window-functions-over-partition-by--avancé) |

---

## CASE WHEN ... END (la condition en SQL)

C'est le **"si... alors... sinon..."** de SQL. À utiliser dès que la valeur affichée **dépend d'une condition**.

### Structure
```sql
CASE
    WHEN condition1 THEN valeur1
    WHEN condition2 THEN valeur2
    ELSE valeur_par_defaut
END
```

> ⚠️ Le `END` est **obligatoire** : il ferme le `CASE`. Le `ELSE` est optionnel (si absent et qu'aucune condition ne matche → renvoie `NULL`).

### Exemple 1 — afficher un libellé selon un nombre
```sql
SELECT
    name,
    priority,
    CASE
        WHEN priority = 5 THEN 'Très haute'
        WHEN priority = 4 THEN 'Haute'
        WHEN priority = 3 THEN 'Moyenne'
        ELSE 'Basse'
    END AS priorite_texte
FROM tickets;
```

### Exemple 2 — créer une catégorie (tranches)
```sql
SELECT
    name,
    total,
    CASE
        WHEN total >= 1000 THEN 'Gros'
        WHEN total >= 100  THEN 'Moyen'
        ELSE 'Petit'
    END AS categorie
FROM orders;
```

### Exemple 3 — CASE dans un ORDER BY (tri personnalisé)
```sql
-- Mettre les tickets "Nouveau" en premier, peu importe l'ordre alphabétique
SELECT * FROM tickets
ORDER BY
    CASE WHEN status = 1 THEN 0 ELSE 1 END,   -- 0 passe avant 1
    name;
```

### Exemple 4 — CASE dans un UPDATE
```sql
UPDATE tickets
SET priority = CASE
    WHEN urgency >= 4 THEN 5
    WHEN urgency = 3  THEN 3
    ELSE 1
END;
```

### Exemple 5 ⭐ — le PIVOT (lignes → colonnes) avec MAX(CASE...)

C'est LE cas le plus puissant : transformer des lignes (1 par langue) en colonnes.

```sql
SELECT
    s.id_status,
    MAX(CASE WHEN sn.language_code = 'fr' THEN sn.name END) AS french_name,
    MAX(CASE WHEN sn.language_code = 'en' THEN sn.name END) AS english_name,
    MAX(CASE WHEN sn.language_code = 'mg' THEN sn.name END) AS malagasy_name,
    s.color
FROM status s
LEFT JOIN status_name sn ON sn.id_status = s.id_status
GROUP BY s.id_status, s.color;
```

> 💡 **Pourquoi `MAX` ici ?** Après `GROUP BY`, chaque langue produit une ligne où le `CASE` vaut soit le nom, soit `NULL`. `MAX()` ignore les `NULL` et garde la seule vraie valeur. On pourrait aussi utiliser `MIN()` — le but est juste de "récupérer la valeur non-NULL du groupe".

---

## Gérer les NULL : COALESCE, IFNULL, NULLIF, IIF

| Fonction | Ce qu'elle fait | Quand l'utiliser |
|----------|-----------------|------------------|
| `COALESCE(a, b, c)` | Renvoie la **1ère valeur non-NULL** | Valeur de repli (plusieurs options) |
| `IFNULL(a, b)` | Si `a` est NULL → `b`, sinon `a` | Repli simple (2 valeurs) |
| `NULLIF(a, b)` | Renvoie NULL si `a = b`, sinon `a` | Éviter une division par zéro |
| `IIF(cond, a, b)` | Si `cond` vrai → `a`, sinon `b` | CASE court (1 seule condition) |

```sql
-- COALESCE : afficher "Non renseigné" si pas de téléphone
SELECT name, COALESCE(phone, 'Non renseigné') FROM users;

-- COALESCE avec plusieurs replis (prend le premier non-NULL)
SELECT COALESCE(mobile, phone, email, 'aucun contact') FROM users;

-- IFNULL : équivalent court de COALESCE à 2 arguments
SELECT IFNULL(phone, 'N/A') FROM users;

-- NULLIF : éviter division par zéro (x/0 → NULL au lieu d'erreur)
SELECT total / NULLIF(quantite, 0) AS prix_unitaire FROM orders;

-- IIF : un CASE WHEN à une seule condition, en plus court
SELECT name, IIF(active = 1, 'Actif', 'Inactif') AS etat FROM users;
-- équivaut à : CASE WHEN active = 1 THEN 'Actif' ELSE 'Inactif' END
```

> 💡 **IIF vs CASE :** `IIF` = raccourci pour UNE condition. Dès que tu as **plusieurs** conditions (si/sinon si/sinon), repasse au `CASE WHEN`.

---

## Les agrégats : COUNT, SUM, AVG, MIN, MAX, GROUP_CONCAT

Une fonction **d'agrégation** prend **plusieurs lignes** et renvoie **une seule valeur**. Presque toujours utilisée avec `GROUP BY`.

| Fonction | Renvoie | Exemple |
|----------|---------|---------|
| `COUNT(*)` | Nombre de lignes | Combien de tickets ? |
| `COUNT(col)` | Nombre de valeurs **non-NULL** | Combien ont un téléphone ? |
| `SUM(col)` | Somme | Total des coûts |
| `AVG(col)` | Moyenne | Coût moyen |
| `MIN(col)` | Plus petite valeur | Ticket le plus ancien |
| `MAX(col)` | Plus grande valeur | Coût le plus élevé |
| `GROUP_CONCAT(col, sep)` | Colle les valeurs en une chaîne | "fr, en, mg" |

```sql
-- Combien de tickets par statut + coût total + coût moyen
SELECT
    status,
    COUNT(*)        AS nb_tickets,
    SUM(cost)       AS cout_total,
    ROUND(AVG(cost), 2) AS cout_moyen,
    MIN(cost)       AS moins_cher,
    MAX(cost)       AS plus_cher
FROM tickets
GROUP BY status;

-- GROUP_CONCAT : lister les langues dispo par statut sur une ligne
SELECT
    id_status,
    GROUP_CONCAT(language_code, ', ') AS langues   -- "fr, en, mg"
FROM status_name
GROUP BY id_status;

-- COUNT(*) vs COUNT(colonne)
SELECT
    COUNT(*)     AS total_users,        -- toutes les lignes
    COUNT(phone) AS avec_telephone      -- seulement les non-NULL
FROM users;
```

### Bonus — agrégat conditionnel avec FILTER (SQLite ≥ 3.30)
```sql
-- Compter les tickets ouverts ET fermés en une seule requête
SELECT
    COUNT(*) FILTER (WHERE status = 1) AS nouveaux,
    COUNT(*) FILTER (WHERE status = 6) AS clos,
    COUNT(*)                            AS total
FROM tickets;

-- Équivalent sans FILTER (avec CASE) :
SELECT
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS nouveaux,
    SUM(CASE WHEN status = 6 THEN 1 ELSE 0 END) AS clos
FROM tickets;
```

---

## WHERE vs HAVING : où filtrer ?

La confusion la plus fréquente chez les débutants !

| | `WHERE` | `HAVING` |
|---|---------|----------|
| **Quand** | AVANT le `GROUP BY` | APRÈS le `GROUP BY` |
| **Filtre sur** | les lignes individuelles | le résultat d'un agrégat (COUNT, SUM...) |

```sql
-- ❌ FAUX : on ne peut pas filtrer un COUNT dans WHERE
SELECT status, COUNT(*) AS nb
FROM tickets
WHERE COUNT(*) > 5          -- ERREUR
GROUP BY status;

-- ✅ JUSTE : filtrer un agrégat → HAVING
SELECT status, COUNT(*) AS nb
FROM tickets
GROUP BY status
HAVING COUNT(*) > 5;        -- garder les statuts avec + de 5 tickets

-- ✅ Les deux ensemble : WHERE filtre les lignes, HAVING filtre les groupes
SELECT status, COUNT(*) AS nb
FROM tickets
WHERE priority >= 3          -- 1) garder les tickets prioritaires
GROUP BY status
HAVING COUNT(*) > 2;         -- 2) puis garder les statuts qui en ont + de 2
```

> 💡 **Règle simple :** condition sur une **colonne normale** → `WHERE`. Condition sur un **COUNT/SUM/AVG** → `HAVING`.

---

## Fonctions texte, nombre, date — quand ?

### Texte — quand tu manipules des chaînes
```sql
UPPER(name)                    -- 'JOHN' — mettre en majuscules
LOWER(email)                   -- normaliser un email avant comparaison
LENGTH(name)                   -- longueur (ex: valider une saisie)
SUBSTR(email, 1, 5)            -- extraire une partie
INSTR(email, '@')              -- position d'un caractère (ex: découper un email)
REPLACE(phone, ' ', '')        -- nettoyer (enlever les espaces)
TRIM('  x  ')                  -- enlever les espaces autour
name || ' - ' || email         -- coller (concaténer) avec ||
```

### Nombre — calculs
```sql
ROUND(cost, 2)                 -- arrondir à 2 décimales (affichage prix)
ABS(-42)                       -- valeur absolue → 42
CAST(x AS INTEGER)             -- enlever les décimales
total * 1.20                   -- calcul direct (ajouter 20%)
```

### Date — SQLite stocke les dates en TEXTE
```sql
DATE('now')                          -- date du jour '2026-06-10'
DATETIME('now')                      -- date + heure
DATE('now', '-7 days')               -- il y a 7 jours
DATE(created_at, '+1 month')         -- dans 1 mois
STRFTIME('%Y', created_at)           -- extraire l'année
STRFTIME('%Y-%m', created_at)        -- année-mois (pour grouper par mois)
JULIANDAY('2026-12-31') - JULIANDAY('now')  -- nb de jours entre 2 dates
```

```sql
-- Exemple : nombre de tickets créés par mois
SELECT
    STRFTIME('%Y-%m', date_creation) AS mois,
    COUNT(*) AS nb
FROM tickets
GROUP BY mois
ORDER BY mois;
```

---

## CAST — convertir un type

À utiliser quand un type ne correspond pas (texte stocké comme nombre, etc.).

```sql
CAST('42' AS INTEGER)      -- texte → entier : 42
CAST(3.99 AS INTEGER)      -- réel → entier : 3 (tronque)
CAST(42 AS TEXT)           -- nombre → texte : '42'
CAST(total AS REAL)        -- forcer une division décimale

-- Piège classique : division entière
SELECT 5 / 2;                          -- = 2 (division entière !)
SELECT CAST(5 AS REAL) / 2;            -- = 2.5 ✅
```

---

## Sous-requête vs JOIN vs CTE (WITH)

Trois façons d'utiliser le résultat d'une requête dans une autre.

### Sous-requête — rapide pour un petit besoin ponctuel
```sql
-- Tickets dont le coût est au-dessus de la moyenne
SELECT * FROM tickets
WHERE cost > (SELECT AVG(cost) FROM tickets);
```

### JOIN — pour combiner des colonnes de plusieurs tables
```sql
SELECT t.name, s.color
FROM tickets t
JOIN status s ON s.id_status = t.status;
```

### CTE (`WITH`) — pour rendre une requête complexe LISIBLE
La CTE = une "table temporaire nommée" valable le temps de la requête. Idéale quand la requête devient longue.

```sql
WITH cout_par_statut AS (
    SELECT status, SUM(cost) AS total
    FROM tickets
    GROUP BY status
)
SELECT s.color, c.total
FROM cout_par_statut c
JOIN status s ON s.id_status = c.status
ORDER BY c.total DESC;
```

> 💡 **Quand utiliser quoi ?**
> - **Sous-requête** : besoin simple, une seule valeur ou une liste.
> - **JOIN** : tu veux des **colonnes** de plusieurs tables côte à côte.
> - **CTE (`WITH`)** : la requête devient longue/imbriquée → la découper en étapes nommées et lisibles.

---

## EXISTS vs IN

Les deux vérifient une présence, mais pas pareil.

```sql
-- IN : "la valeur est-elle dans cette liste ?"
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);

-- EXISTS : "existe-t-il au moins une ligne liée ?" (souvent plus rapide sur gros volume)
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- NOT EXISTS : les users SANS commande
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

> 💡 `IN` est plus simple à lire pour une petite liste. `EXISTS` est préférable quand la sous-requête est grosse ou corrélée (dépend de la ligne courante).

---

## UNION, INTERSECT, EXCEPT

Combiner les résultats de **deux SELECT** (mêmes colonnes).

```sql
-- UNION : fusionner (sans doublons)
SELECT name FROM clients
UNION
SELECT name FROM prospects;

-- UNION ALL : fusionner (AVEC doublons, plus rapide)
SELECT name FROM clients
UNION ALL
SELECT name FROM prospects;

-- INTERSECT : seulement ce qui est dans LES DEUX
SELECT email FROM clients
INTERSECT
SELECT email FROM newsletter;

-- EXCEPT : dans le premier MAIS PAS le second
SELECT email FROM clients
EXCEPT
SELECT email FROM desabonnes;
```

> 💡 `UNION` enlève les doublons (plus lent), `UNION ALL` les garde (plus rapide). Si tu sais qu'il n'y a pas de doublon → `UNION ALL`.

---

## Window functions (OVER, PARTITION BY) — avancé

Une **window function** fait un calcul sur un groupe de lignes **sans les fusionner** (contrairement à `GROUP BY`). Tu gardes toutes les lignes ET tu ajoutes une colonne calculée.

```sql
-- Numéroter les tickets (1, 2, 3...) par ordre de date
SELECT
    name,
    date_creation,
    ROW_NUMBER() OVER (ORDER BY date_creation) AS numero
FROM tickets;

-- Numéroter EN REPARTANT À 1 pour chaque statut (PARTITION BY)
SELECT
    name,
    status,
    ROW_NUMBER() OVER (PARTITION BY status ORDER BY date_creation) AS numero_dans_statut
FROM tickets;

-- Classement (RANK) par coût, du plus cher au moins cher
SELECT
    name,
    cost,
    RANK() OVER (ORDER BY cost DESC) AS rang
FROM tickets;

-- Total cumulé + comparaison à la moyenne, en gardant chaque ligne
SELECT
    name,
    cost,
    SUM(cost) OVER (ORDER BY date_creation) AS cumul,
    AVG(cost) OVER ()                       AS moyenne_globale
FROM tickets;
```

| Fonction | Ce qu'elle fait |
|----------|-----------------|
| `ROW_NUMBER()` | Numéro de ligne (1, 2, 3...) — toujours unique |
| `RANK()` | Classement (égalités → même rang, saute le suivant : 1,1,3) |
| `DENSE_RANK()` | Classement sans saut (1,1,2) |
| `SUM() OVER (...)` | Total cumulé / par groupe sans fusionner |

> 💡 **GROUP BY vs OVER :** `GROUP BY` **réduit** les lignes (1 par groupe). `OVER` **garde** toutes les lignes et ajoute une colonne. Tu veux le détail ligne par ligne + un calcul global → `OVER`.

---

## La requête "ultime" qui combine tout

Pour voir comment tout s'assemble — du simple au complexe. Objectif : **un tableau de bord des statuts** avec noms multilingues, nombre de tickets, coût total, classement, le tout filtré et trié.

```sql
WITH stats_tickets AS (
    -- 1) CTE : on pré-calcule les stats par statut
    SELECT
        status,
        COUNT(*)            AS nb_tickets,
        SUM(cost)           AS cout_total,
        ROUND(AVG(cost), 2) AS cout_moyen
    FROM tickets
    WHERE is_deleted = 0                 -- WHERE : filtre les lignes avant regroupement
    GROUP BY status
    HAVING COUNT(*) > 0                  -- HAVING : garde les statuts non vides
)
SELECT
    s.id_status,

    -- pivot des noms (lignes → colonnes)
    MAX(CASE WHEN sn.language_code = 'fr' THEN sn.name END) AS french_name,
    MAX(CASE WHEN sn.language_code = 'mg' THEN sn.name END) AS malagasy_name,

    -- valeur de repli si pas de couleur
    COALESCE(s.color, '#cccccc')         AS color,

    -- stats venant de la CTE
    st.nb_tickets,
    st.cout_total,

    -- libellé conditionnel
    CASE
        WHEN st.nb_tickets >= 10 THEN 'Chargé'
        WHEN st.nb_tickets >= 1  THEN 'Normal'
        ELSE 'Vide'
    END                                  AS charge,

    -- classement par coût (window function)
    RANK() OVER (ORDER BY st.cout_total DESC) AS rang_cout

FROM status s
LEFT JOIN status_name sn ON sn.id_status = s.id_status
JOIN stats_tickets st     ON st.status    = s.id_status
GROUP BY s.id_status, s.color, st.nb_tickets, st.cout_total
ORDER BY st.cout_total DESC;
```

**Ce que cette requête utilise :** `WITH` (CTE), `WHERE`, `GROUP BY`, `HAVING`, `COUNT/SUM/AVG`, `MAX(CASE...)` (pivot), `COALESCE`, `CASE WHEN`, `LEFT JOIN` + `JOIN`, `RANK() OVER`, `ORDER BY`. 🎉

---

## Récapitulatif — quand utiliser quoi

| Situation | Outil |
|-----------|-------|
| Valeur selon condition (si/sinon) | `CASE WHEN ... END` (ou `IIF` si 1 condition) |
| Remplacer NULL | `COALESCE` / `IFNULL` |
| Compter / sommer / moyenne | `COUNT` / `SUM` / `AVG` |
| Min / max | `MIN` / `MAX` |
| Lignes → colonnes (pivot) | `MAX(CASE WHEN ...)` + `GROUP BY` |
| Coller des valeurs | `GROUP_CONCAT` |
| Filtrer des lignes | `WHERE` |
| Filtrer un agrégat | `HAVING` |
| Convertir un type | `CAST` |
| Requête longue lisible | `WITH` (CTE) |
| Vérifier présence | `EXISTS` / `IN` |
| Fusionner 2 SELECT | `UNION` / `UNION ALL` |
| Numéroter / classer sans fusionner | `ROW_NUMBER` / `RANK` `OVER (...)` |

✅ **Le réflexe débutant :** commence simple (`SELECT ... WHERE`), ajoute `GROUP BY` + agrégats quand tu veux des totaux, sors le `CASE WHEN` quand l'affichage dépend d'une condition, et garde les CTE/window functions pour quand ça devient vraiment complexe.
