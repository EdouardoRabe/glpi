# ⚛️ JSX — Syntaxe et Affichage en React

> **Documentation complète** — Comprendre, écrire et maîtriser la syntaxe JSX pour construire des interfaces React.

---

## 📌 Sommaire

1. [Introduction au JSX](#1-introduction-au-jsx)
2. [Les règles fondamentales de syntaxe](#2-les-règles-fondamentales-de-syntaxe)
3. [Dynamiser l'affichage avec les expressions](#3-dynamiser-laffichage-avec-les-expressions)
4. [Ce qui s'affiche et ce qui ne s'affiche pas](#4-ce-qui-saffiche-et-ce-qui-ne-saffiche-pas)
5. [Rendu conditionnel et listes](#5-rendu-conditionnel-et-listes)
6. [Gestion des événements](#6-gestion-des-événements)
7. [Les styles en JSX](#7-les-styles-en-jsx)
8. [Les Fragments](#8-les-fragments)
9. [Les Props et `children`](#9-les-props-et-children)
10. [Props avancées](#10-props-avancées)
11. [La propriété `key` dans les listes](#11-la-propriété-key-dans-les-listes)
12. [Commentaires en JSX](#12-commentaires-en-jsx)
13. [Les erreurs JSX les plus fréquentes](#13-les-erreurs-jsx-les-plus-fréquentes)
14. [Coulisses : ce que JSX devient réellement](#14-coulisses--ce-que-jsx-devient-réellement)
15. [Cheat Sheet — Aide-mémoire rapide](#15-cheat-sheet--aide-mémoire-rapide)

---

## 1. Introduction au JSX

### Qu'est-ce que JSX ?

JSX (JavaScript XML) est une **extension syntaxique de JavaScript**. Il te permet d'écrire du balisage similaire au HTML directement dans un fichier JavaScript.

```jsx
const element = <h1>Bonjour, monde !</h1>;
```

Ce n'est ni une chaîne de caractères, ni du HTML pur. C'est du **JSX** — et Babel le transforme en JavaScript standard avant que le navigateur l'exécute.

> ℹ️ JSX et React sont techniquement deux choses séparées. JSX est une extension de syntaxe, React est une bibliothèque JavaScript. On peut utiliser l'un sans l'autre, mais ensemble ils sont bien plus puissants.

### Pourquoi utiliser JSX ?

Le Web est historiquement divisé en trois couches séparées : HTML (contenu), CSS (style), JavaScript (logique). Mais à mesure que les interfaces sont devenues plus dynamiques, **la logique JavaScript a commencé à piloter le HTML** — les deux sont devenus indissociables.

React assume cet état de fait en regroupant **logique de rendu et balisage** dans la même unité : le **composant**.

| Ancienne approche | Approche React |
|---|---|
| HTML dans `.html`, logique dans `.js` | Logique + balisage dans un seul composant |
| Séparation par technologie | Séparation par fonctionnalité |

**Avantages concrets de JSX :**

- **Aide visuelle** : structure proche du HTML, plus lisible que des appels de fonctions imbriquées.
- **Sécurité intégrée** : React DOM échappe automatiquement toutes les valeurs insérées, ce qui prévient les attaques XSS (Cross-Site Scripting).
- **Meilleurs messages d'erreur** : React peut indiquer précisément où le problème se situe dans le balisage.

```jsx
const title = response.potentiallyMaliciousInput;
// Ceci est sans risque — React échappe la valeur automatiquement
const element = <h1>{title}</h1>;
```

---

## 2. Les règles fondamentales de syntaxe

JSX est **plus strict que le HTML**. Il impose quatre règles que tu dois respecter absolument.

### A. Un seul élément racine

Un composant React ne peut renvoyer **qu'un seul élément parent**. Si tu as plusieurs éléments côte à côte, tu dois les envelopper.

```jsx
// ❌ Invalide — deux éléments racines
export function App() {
  return (
    <h1>Titre</h1>
    <p>Paragraphe</p>
  );
}

// ✅ Valide — enveloppés dans un Fragment
export function App() {
  return (
    <>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </>
  );
}
```

> ⚠️ **Pourquoi cette règle ?** Sous le capot, JSX se transforme en un appel de fonction JavaScript (`React.createElement(...)`). Une fonction ne peut renvoyer qu'une seule valeur — d'où la contrainte d'un seul nœud racine.

### B. Fermeture systématique des balises

Contrairement au HTML, **toutes les balises doivent être fermées** en JSX, y compris les balises orphelines.

```jsx
// ❌ HTML valide, mais JSX invalide
<img src="photo.jpg" alt="Photo">
<br>
<input type="text">

// ✅ JSX valide
<img src="photo.jpg" alt="Photo" />
<br />
<input type="text" />

// Les balises avec contenu se ferment normalement
<li>Mon élément de liste</li>
```

### C. Le camelCase pour les attributs

JSX se compile en JavaScript. Les attributs deviennent des **propriétés d'objets JavaScript**, et JavaScript n'accepte pas les tirets dans les noms de propriétés, ni les mots réservés.

| HTML | JSX | Raison |
|---|---|---|
| `class` | `className` | `class` est un mot réservé JS |
| `for` | `htmlFor` | `for` est un mot réservé JS |
| `stroke-width` | `strokeWidth` | Les tirets sont invalides en JS |
| `tabindex` | `tabIndex` | Convention camelCase |
| `onclick` | `onClick` | Convention camelCase |
| `maxlength` | `maxLength` | Convention camelCase |
| `readonly` | `readOnly` | Convention camelCase |
| `crossorigin` | `crossOrigin` | Convention camelCase |

```jsx
// ❌ HTML classique
<label for="email" class="label" maxlength="100">Email</label>

// ✅ JSX correct
<label htmlFor="email" className="label" maxLength={100}>Email</label>
```

> ℹ️ **Exception** : Les attributs `aria-*` et `data-*` s'écrivent **avec des tirets**, comme en HTML. C'est voulu pour des raisons de compatibilité et d'accessibilité.

```jsx
<button aria-label="Fermer" data-id="modal-1">×</button>
```

### D. La majuscule pour les composants React

C'est une règle fondamentale que React utilise pour distinguer les éléments HTML natifs des composants React personnalisés.

- **Minuscule** → React considère que c'est une balise HTML native (`div`, `span`, `button`...)
- **Majuscule** → React considère que c'est un composant React

```jsx
// React cherche une balise HTML native "button" ← minuscule
const a = <button>Cliquez</button>;

// React cherche un composant React "Button" ← Majuscule
const b = <Button>Cliquez</Button>;
```

```jsx
// ❌ Ce composant ne fonctionnera PAS correctement
function monBouton() {
  return <button>Cliquez</button>;
}

// React va tenter de créer une balise HTML <monbouton>, pas un composant
const element = <monBouton />; // Ne fonctionne pas comme prévu

// ✅ Toujours commencer par une majuscule
function MonBouton() {
  return <button>Cliquez</button>;
}

const element = <MonBouton />; // React sait que c'est un composant
```

> ⚠️ Ce bug est silencieux et difficile à détecter : le code s'exécute sans erreur, mais le composant ne s'affiche pas comme prévu. La convention est de **toujours nommer tes composants avec une majuscule**.

---

## 3. Dynamiser l'affichage avec les expressions

Le vrai pouvoir de JSX est la possibilité d'**insérer du JavaScript** directement dans le balisage grâce aux **accolades `{ }`**.

### Expressions seulement — pas de statements

C'est une distinction fondamentale à comprendre.

Une **expression** est quelque chose qui produit une valeur. Un **statement** est une instruction qui fait quelque chose mais ne retourne pas de valeur directement.

```jsx
// ✅ EXPRESSIONS — autorisées dans les accolades JSX
{name}                         // variable
{2 + 2}                        // opération
{isLoggedIn ? "Oui" : "Non"}  // ternaire
{items.map(i => <li>{i}</li>)} // appel de méthode
{formatDate(date)}             // appel de fonction
{user && <p>{user.name}</p>}   // opérateur logique

// ❌ STATEMENTS — interdits directement dans les accolades JSX
{if (condition) { ... }}       // if est un statement
{for (let i...) { ... }}       // for est un statement
{let x = 5}                    // déclaration de variable
```

Pour utiliser un `if` ou une boucle `for`, tu dois les écrire **en dehors** du JSX, puis utiliser leur résultat :

```jsx
// ✅ Bonne pratique — logique en dehors du JSX
export function App({ score }) {
  let message;
  if (score >= 10) {
    message = <p className="success">Réussi !</p>;
  } else {
    message = <p className="fail">Échoué.</p>;
  }

  return <div>{message}</div>;
}
```

### Interpolation de variables

```jsx
const name = 'Ny Voary';
const element = <h1>Bonjour, {name}</h1>;
// Affiche : Bonjour, Ny Voary
```

### Appels de fonctions et expressions complexes

```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = { firstName: 'Kylian', lastName: 'Mbappé' };

const element = (
  <h1>Bonjour, {formatName(user)} !</h1>
);
```

> ℹ️ On enveloppe souvent le JSX multi-lignes dans des **parenthèses `()`** pour la lisibilité et pour éviter les pièges d'insertion automatique de point-virgule.

### Attributs dynamiques

Pour les attributs, tu choisis entre une valeur fixe (guillemets) ou une valeur dynamique (accolades).

```jsx
// Valeur fixe : guillemets
const link = <a href="https://reactjs.org">React</a>;

// Valeur dynamique : accolades — sans guillemets !
const avatar = <img src={user.avatarUrl} alt={user.name} />;

// ❌ Ne jamais combiner les deux pour le même attribut
const wrong = <img src="{user.avatarUrl}" />; // Renvoie la chaîne littérale, pas la valeur
```

### JSX peut être utilisé comme une expression

Après la compilation, JSX n'est qu'une expression JavaScript. Tu peux l'utiliser dans des `if`, des boucles, des fonctions...

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Bonjour, {formatName(user)} !</h1>;
  }
  return <h1>Bonjour, Belle Inconnue.</h1>;
}
```

---

## 4. Ce qui s'affiche et ce qui ne s'affiche pas

Quand tu mets une valeur entre `{ }` dans JSX, le comportement de React dépend du **type** de cette valeur. Ce tableau est essentiel à connaître.

| Type de valeur | Exemple | Affiché dans le DOM ? |
|---|---|---|
| `string` | `{"Bonjour"}` | ✅ Oui, tel quel |
| `number` | `{42}` | ✅ Oui, tel quel |
| `0` (zéro) | `{0}` | ⚠️ **Oui !** Affiche `0` dans la page |
| `true` / `false` | `{true}` | ❌ Non, rien n'est affiché |
| `null` | `{null}` | ❌ Non, rien n'est affiché |
| `undefined` | `{undefined}` | ❌ Non, rien n'est affiché |
| Élément JSX | `{<p>Texte</p>}` | ✅ Oui, l'élément est rendu |
| Tableau | `{[1, 2, 3]}` | ✅ Oui, chaque élément est rendu |
| Objet `{}` | `{monObjet}` | ❌ **Erreur** — les objets ne peuvent pas être rendus directement |

### Le piège du `0`

C'est l'un des bugs les plus courants en React. `false`, `null`, `undefined` n'affichent rien. Mais `0` est un nombre valide, et React l'affiche.

```jsx
const count = 0;

// ❌ Piège : affiche "0" dans la page si count vaut 0
{count && <p>Il y a {count} messages</p>}

// ✅ Correct : convertir en booléen explicite
{count > 0 && <p>Il y a {count} messages</p>}

// ✅ Aussi correct
{!!count && <p>Il y a {count} messages</p>}
```

### Les objets ne sont pas affichables directement

React ne sait pas comment afficher un objet. Il faut accéder à ses propriétés.

```jsx
const user = { name: 'Ny Voary', age: 22 };

// ❌ Erreur : "Objects are not valid as a React child"
<p>{user}</p>

// ✅ Correct : accéder aux propriétés
<p>{user.name} — {user.age} ans</p>
```

### Les tableaux s'affichent sans séparateur

```jsx
const fruits = ['Pomme', 'Banane', 'Cerise'];

// Affiche : PommeBananeCerise — les éléments sont collés !
<p>{fruits}</p>

// ✅ Utiliser join() si tu veux un séparateur
<p>{fruits.join(', ')}</p>
// Affiche : Pomme, Banane, Cerise
```

---

## 5. Rendu conditionnel et listes

### Retourner `null` pour ne rien afficher

Un composant peut retourner `null` pour ne rien rendre du tout. C'est utile pour masquer conditionnellement un composant entier.

```jsx
function Alerte({ message, visible }) {
  if (!visible) return null; // Le composant ne rend rien

  return <div className="alerte">{message}</div>;
}

// Utilisation
export function App() {
  return (
    <div>
      <Alerte message="Erreur détectée !" visible={true} />
      <Alerte message="Invisible" visible={false} /> {/* Ne s'affiche pas */}
    </div>
  );
}
```

> ℹ️ Retourner `null` ne supprime pas le composant de l'arbre React — il existe toujours, mais ne produit aucun élément DOM. Son état (avec `useState`) est conservé.

### Affichage conditionnel avec `&&`

Si la condition est vraie, l'élément s'affiche. Si elle est fausse (`false`, `null`, `undefined`), rien n'est rendu.

```jsx
export function App({ title, isAdmin }) {
  return (
    <>
      {title && <h1>{title}</h1>}
      {isAdmin && <button>Panneau admin</button>}
      <p>Contenu toujours visible</p>
    </>
  );
}
```

### Affichage conditionnel avec l'opérateur ternaire

Pour alterner entre deux éléments :

```jsx
export function App({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Bienvenue, vous êtes connecté.</p>
      ) : (
        <p>Veuillez vous connecter.</p>
      )}
    </div>
  );
}
```

### Ternaire avec `null` pour masquer un seul côté

```jsx
// Affiche le badge uniquement si notifications > 0, sinon rien
{notifications > 0 ? <span className="badge">{notifications}</span> : null}
```

### Rendu de listes avec `.map()`

Pour transformer un tableau de données en éléments JSX, on utilise `.map()`.

```jsx
const tasks = ['Apprendre React', 'Faire un projet', 'Maîtriser JSX'];

export function TodoList() {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task}>{task}</li>
      ))}
    </ul>
  );
}
```

### Listes d'objets (cas le plus courant)

```jsx
const users = [
  { id: 1, name: 'Ny Voary', role: 'Développeur' },
  { id: 2, name: 'Étudiant', role: 'Apprenant' },
];

export function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <strong>{user.name}</strong> — {user.role}
        </li>
      ))}
    </ul>
  );
}
```

### Listes filtrées (filter + map)

On peut enchaîner `.filter()` et `.map()` pour afficher seulement certains éléments :

```jsx
const tasks = [
  { id: 1, texte: 'Apprendre React', terminee: true },
  { id: 2, texte: 'Faire un projet', terminee: false },
  { id: 3, texte: 'Maîtriser JSX', terminee: false },
];

export function TodoList() {
  return (
    <ul>
      {tasks
        .filter(task => !task.terminee)
        .map(task => (
          <li key={task.id}>{task.texte}</li>
        ))}
    </ul>
  );
}
```

> ⚠️ Chaque élément d'une liste **doit** avoir une prop `key` unique. Voir la [section dédiée](#11-la-propriété-key-dans-les-listes).

---

## 6. Gestion des événements

Les événements en JSX sont nommés en **camelCase** (pas en minuscules comme en HTML) et reçoivent une **fonction de rappel** (pas une chaîne de caractères).

```jsx
// ❌ HTML classique
<button onclick="handleClick()">Cliquez</button>

// ✅ JSX — on passe la référence de la fonction, sans la parenthèse ()
<button onClick={handleClick}>Cliquez</button>
```

> ⚠️ **Piège courant** : ne pas mettre de parenthèses `()` après le nom de la fonction, sinon elle est appelée immédiatement au rendu, pas au clic.

```jsx
// ❌ La fonction est appelée immédiatement au rendu — pas au clic
<button onClick={handleClick()}>Cliquez</button>

// ✅ On passe la référence — appelée uniquement au clic
<button onClick={handleClick}>Cliquez</button>
```

### Exemple complet

```jsx
export function App() {
  const handleClick = () => {
    alert('Bouton cliqué !');
  };

  return <button onClick={handleClick}>Cliquez ici</button>;
}
```

### Accéder à l'objet événement

La fonction de rappel reçoit automatiquement un objet `event`, compatible avec les événements natifs du navigateur.

```jsx
export function App() {
  const handleSubmit = (e) => {
    e.preventDefault();    // Empêche le rechargement de la page
    e.stopPropagation();   // Arrête la propagation vers les parents
    console.log('Formulaire soumis !');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Passer des arguments à un gestionnaire d'événement

Si tu as besoin de passer des arguments supplémentaires en plus de l'événement, utilise une fonction fléchée intermédiaire :

```jsx
const handleDelete = (id, e) => {
  e.preventDefault();
  console.log(`Supprimer l'élément ${id}`);
};

// ✅ Fonction fléchée qui capture l'id et passe l'événement
<button onClick={(e) => handleDelete(item.id, e)}>Supprimer</button>
```

### Passer une fonction comme prop (callbacks)

C'est un pattern fondamental en React : un composant enfant peut **communiquer vers son parent** en appelant une fonction que le parent lui a passée en prop.

```jsx
// Composant enfant — reçoit une fonction en prop
function Bouton({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>;
}

// Composant parent — passe sa propre fonction à l'enfant
export function App() {
  const handleAction = () => {
    alert('Action déclenchée depuis l\'enfant !');
  };

  return <Bouton onClick={handleAction} label="Cliquer" />;
}
```

### Événements courants

| Catégorie | Événement HTML | Prop JSX |
|---|---|---|
| Souris | `onclick` | `onClick` |
| Souris | `ondblclick` | `onDoubleClick` |
| Souris | `onmouseover` | `onMouseOver` |
| Souris | `onmouseout` | `onMouseOut` |
| Formulaire | `onchange` | `onChange` |
| Formulaire | `onsubmit` | `onSubmit` |
| Formulaire | `oninput` | `onInput` |
| Clavier | `onkeydown` | `onKeyDown` |
| Clavier | `onkeyup` | `onKeyUp` |
| Focus | `onfocus` | `onFocus` |
| Focus | `onblur` | `onBlur` |

---

## 7. Les styles en JSX

### Style en ligne avec un objet JavaScript

L'attribut `style` en JSX n'est **pas une chaîne de caractères** comme en HTML. C'est un **objet JavaScript**, avec les propriétés CSS écrites en camelCase.

```jsx
// ❌ HTML classique
<div style="background-color: blue; width: 50px;">...</div>

// ✅ JSX — double accolades : une pour l'expression JS, une pour l'objet
<div style={{ backgroundColor: 'blue', width: 50, height: 50 }}>...</div>
```

> ℹ️ Les valeurs numériques sans unité (comme `width: 50`) sont interprétées en `px` par défaut. Pour d'autres unités, utilise une chaîne : `width: '50%'`, `fontSize: '1.2rem'`.

### Séparer l'objet de style pour plus de clarté

```jsx
const cardStyle = {
  backgroundColor: '#f0f0f0',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export function Card() {
  return <div style={cardStyle}>Contenu de la carte</div>;
}
```

### Utiliser `className` pour les classes CSS

Pour les classes CSS définies dans un fichier `.css`, utilise `className` :

```jsx
// Dans App.css :
// .highlight { color: red; font-weight: bold; }

export function App() {
  return <p className="highlight">Ce texte est en rouge.</p>;
}
```

### Classes CSS dynamiques — pattern courant

On a souvent besoin d'appliquer une classe conditionnellement. Voici les patterns les plus utilisés :

```jsx
// ✅ Pattern 1 : ternaire
<div className={isActive ? 'actif' : 'inactif'}>...</div>

// ✅ Pattern 2 : template literal pour plusieurs classes
<div className={`carte ${isSelected ? 'selectionnee' : ''}`}>...</div>

// ✅ Pattern 3 : construction manuelle
const classes = ['bouton'];
if (isPrimary) classes.push('bouton-primary');
if (isDisabled) classes.push('bouton-disabled');
<button className={classes.join(' ')}>...</button>
```

> ℹ️ Pour les projets complexes, la bibliothèque `clsx` simplifie la gestion des classes conditionnelles. Mais les patterns ci-dessus couvrent tous les cas courants sans dépendance supplémentaire.

---

## 8. Les Fragments

### Le problème

JSX impose un seul élément racine, mais ajouter une `<div>` superflue peut :
- Casser un layout CSS (Flexbox, Grid)
- Alourdir inutilement le DOM
- Créer des éléments parasites dans l'inspecteur

### La solution : les Fragments

Un **Fragment** groupe des éléments sans ajouter de nœud réel dans le DOM.

```jsx
// Syntaxe courte (la plus utilisée)
export function App() {
  return (
    <>
      <p>Premier paragraphe</p>
      <p>Second paragraphe</p>
    </>
  );
}

// Syntaxe longue (nécessaire si tu as besoin d'une `key`)
import { Fragment } from 'react';

export function DefinitionList({ items }) {
  return (
    <dl>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

> ℹ️ La syntaxe courte `<>...</>` ne peut pas recevoir de props. La syntaxe longue `<Fragment key={...}>` est la **seule façon de passer une `key`** à un Fragment dans une boucle `.map()`.

### Quand utiliser un Fragment plutôt qu'une `<div>` ?

```jsx
// ❌ Casse le CSS Table — <div> n'est pas valide entre <tr> et <td>
function TableRow({ data }) {
  return (
    <div>
      <td>{data.name}</td>
      <td>{data.value}</td>
    </div>
  );
}

// ✅ Fragment — aucun nœud ajouté, structure valide
function TableRow({ data }) {
  return (
    <>
      <td>{data.name}</td>
      <td>{data.value}</td>
    </>
  );
}
```

---

## 9. Les Props et `children`

### Qu'est-ce que les Props ?

Les **props** (propriétés) permettent de passer des données d'un composant **parent** vers un composant **enfant**. C'est le mécanisme principal pour personnaliser et réutiliser des composants.

```jsx
// Définition d'un composant qui accepte des props
function Bienvenue({ nom, age }) {
  return <p>Bonjour {nom}, tu as {age} ans.</p>;
}

// Utilisation avec passage de props
export function App() {
  return (
    <div>
      <Bienvenue nom="Ny Voary" age={22} />
      <Bienvenue nom="Étudiant" age={20} />
    </div>
  );
}
```

> ℹ️ Les valeurs textuelles se passent avec des guillemets (`nom="Ny Voary"`), les expressions JavaScript avec des accolades (`age={22}`).

### Les props sont en lecture seule

Un composant ne doit **jamais modifier ses propres props**. Les props vont toujours du parent vers l'enfant, jamais dans l'autre sens.

```jsx
function MonComposant({ valeur }) {
  // ❌ Ne jamais faire ça — les props sont immuables
  valeur = valeur * 2;

  // ✅ Créer une variable locale à la place
  const valeurDouble = valeur * 2;

  return <p>{valeurDouble}</p>;
}
```

### La prop spéciale `children`

Quand tu mets du contenu **entre les balises ouvrante et fermante** d'un composant, React le place automatiquement dans une prop appelée `children`.

```jsx
// Définition du composant conteneur
function Card({ children }) {
  return <div className="card-style">{children}</div>;
}

// Utilisation — tout ce qu'on met entre les balises devient "children"
export function App() {
  return (
    <Card>
      <h2>Titre de la carte</h2>
      <p>Ceci est le contenu passé via la prop children.</p>
    </Card>
  );
}
```

`children` peut contenir n'importe quoi : du texte, d'autres composants, du JSX complexe.

```jsx
// children peut aussi être du texte simple
<Button>Enregistrer</Button>

// ou du JSX complexe
<Modal>
  <h1>Confirmation</h1>
  <p>Êtes-vous sûr ?</p>
  <Button>Confirmer</Button>
</Modal>
```

---

## 10. Props avancées

### Valeur booléenne implicite

Quand tu passes une prop booléenne à `true`, tu peux omettre la valeur — la présence de l'attribut suffit.

```jsx
// Ces deux lignes sont strictement identiques
<Input disabled={true} />
<Input disabled />

// Ces deux lignes sont strictement identiques
<Button primary={true} />
<Button primary />
```

> ℹ️ En revanche, pour `false`, tu dois l'écrire explicitement : `<Input disabled={false} />`.

### Valeurs par défaut des props

Tu peux définir des valeurs par défaut directement dans la destructuration :

```jsx
function Bouton({ label = 'Cliquez ici', color = 'blue', size = 'medium' }) {
  return (
    <button style={{ color }} className={`btn btn-${size}`}>
      {label}
    </button>
  );
}

// Sans props → utilise les valeurs par défaut
<Bouton />

// Avec props → écrase les valeurs par défaut
<Bouton label="Envoyer" color="red" />
```

### Spread des props avec `{...props}`

Si un composant reçoit beaucoup de props et doit les transmettre à un élément sous-jacent, le spread évite de les lister une par une.

```jsx
// Sans spread — répétitif
function Input({ type, placeholder, value, onChange, disabled }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} />;
}

// ✅ Avec spread — plus concis
function Input(props) {
  return <input {...props} />;
}

// ✅ Avec spread partiel — on garde le contrôle sur certaines props
function Input({ className, ...rest }) {
  return <input className={`input-base ${className}`} {...rest} />;
}
```

> ⚠️ Utilise le spread avec prudence : passer des props inconnues à un élément HTML natif peut générer des avertissements dans la console.

### Passer n'importe quel type de donnée en prop

Les props peuvent contenir tout type de valeur JavaScript :

```jsx
function Composant({
  texte,        // string
  nombre,       // number
  actif,        // boolean
  liste,        // array
  config,       // object
  onAction,     // function
  element,      // JSX / React element
}) { ... }

<Composant
  texte="Bonjour"
  nombre={42}
  actif
  liste={['a', 'b', 'c']}
  config={{ theme: 'dark' }}
  onAction={() => alert('Action !')}
  element={<span>Un élément</span>}
/>
```

---

## 11. La propriété `key` dans les listes

### Pourquoi `key` est obligatoire

Sans `key`, si tu modifies un élément dans une liste de 1000 lignes, React pourrait avoir besoin de **re-rendre toute la liste** faute de savoir quel élément a changé.

La `key` est un **identifiant unique** qui permet à React de :
- Savoir quel élément a été **ajouté**
- Savoir quel élément a été **modifié**
- Savoir quel élément a été **supprimé**

```jsx
// ✅ Bonne pratique — utiliser un identifiant unique et stable
const todos = [
  { id: 1, texte: 'Apprendre React' },
  { id: 2, texte: 'Faire un projet' },
  { id: 3, texte: 'Maîtriser JSX' },
];

export function TodoList() {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.texte}</li>
      ))}
    </ul>
  );
}
```

### La règle d'or sur les clés

```jsx
// ❌ À éviter — l'index du tableau comme clé
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}
```

> ⚠️ **N'utilise jamais l'index** comme `key` si la liste peut être **triée, filtrée ou réordonnée**. Quand l'ordre change, les index changent aussi, et React peut associer le mauvais état à un mauvais élément — ce qui cause des bugs visuels subtils, notamment dans les formulaires (les valeurs des champs peuvent se retrouver sur le mauvais élément).

**Règle simple** : utilise un `id` stable provenant de tes données (base de données, UUID, etc.).

### La `key` doit être unique parmi les frères (siblings)

La `key` n'a pas besoin d'être globalement unique dans toute l'application — seulement parmi les éléments du **même niveau** dans la même liste.

```jsx
// ✅ Valide — même id "1" dans deux listes différentes
<ul>
  {fruits.map(f => <li key={f.id}>{f.name}</li>)}
</ul>
<ul>
  {legumes.map(l => <li key={l.id}>{l.name}</li>)}
</ul>
```

### La `key` ne se passe pas comme prop

`key` est un attribut spécial de React. Il n'est **pas accessible** dans le composant enfant via `props.key`.

```jsx
function Item({ key, name }) {
  // ⚠️ key est undefined ici — React ne la passe pas comme prop
  console.log(key); // undefined

  return <li>{name}</li>;
}

// Si tu as besoin de l'id dans l'enfant, passe-le séparément
function Item({ id, name }) {
  console.log(id); // ✅ Accessible
  return <li>{name}</li>;
}

{items.map(item => <Item key={item.id} id={item.id} name={item.name} />)}
```

---

## 12. Commentaires en JSX

Tu ne peux **pas** utiliser `//` ou `/* */` directement dans le balisage JSX. Il faut les envelopper dans une **expression JavaScript** avec des accolades.

```jsx
export function App() {
  return (
    <div>
      {/* Ceci est un commentaire JSX — il n'apparaît pas dans le DOM */}
      <h1>Mon Titre</h1>

      {/* 
        Commentaire
        sur plusieurs lignes
      */}
      <p>Mon paragraphe</p>
    </div>
  );
}
```

Les commentaires JavaScript normaux (`//`) restent valides **en dehors** du JSX :

```jsx
export function App() {
  // Ce commentaire est dans la partie JS de la fonction — OK
  const title = 'Bonjour'; // OK aussi

  return (
    <div>
      {/* Ce commentaire est dans le JSX — syntaxe différente */}
      <h1>{title}</h1>
    </div>
  );
}
```

---

## 13. Les erreurs JSX les plus fréquentes

Voici les erreurs que tu rencontreras le plus souvent, avec leurs messages exacts et comment les corriger.

### ❌ Adjacent JSX elements must be wrapped

```
Error: Adjacent JSX elements must be wrapped in an enclosing tag.
Did you want a JSX fragment <>...</>?
```

**Cause** : plusieurs éléments au même niveau sans parent.

```jsx
// ❌ Problème
return (
  <h1>Titre</h1>
  <p>Texte</p>
);

// ✅ Solution
return (
  <>
    <h1>Titre</h1>
    <p>Texte</p>
  </>
);
```

### ❌ Objects are not valid as a React child

```
Error: Objects are not valid as a React child (found: object with keys {...})
```

**Cause** : tu essaies d'afficher un objet directement dans JSX.

```jsx
const user = { name: 'Ny Voary', age: 22 };

// ❌ Problème
<p>{user}</p>

// ✅ Solution
<p>{user.name}</p>
```

### ❌ Each child in a list should have a unique "key" prop

```
Warning: Each child in a list should have a unique "key" prop.
```

**Cause** : une liste rendue avec `.map()` sans prop `key`.

```jsx
// ❌ Problème
{items.map(item => <li>{item}</li>)}

// ✅ Solution
{items.map(item => <li key={item.id}>{item}</li>)}
```

### ❌ className au lieu de class

```
Warning: Invalid DOM property `class`. Did you mean `className`?
```

**Cause** : utilisation de `class` au lieu de `className`.

```jsx
// ❌ Problème
<div class="container">...</div>

// ✅ Solution
<div className="container">...</div>
```

### ❌ Composant non trouvé — lettre minuscule

```
Warning: <monComposant /> is using incorrect casing. Use PascalCase.
// ou le composant s'affiche comme une balise HTML inconnue
```

**Cause** : le composant commence par une minuscule.

```jsx
// ❌ Problème
function monBouton() { return <button>Clic</button>; }
<monBouton /> // Traité comme une balise HTML, pas un composant

// ✅ Solution
function MonBouton() { return <button>Clic</button>; }
<MonBouton />
```

### ❌ La fonction est appelée immédiatement

**Cause** : parenthèses `()` sur la fonction dans l'événement.

```jsx
// ❌ Problème — handleClick() est appelée au rendu, pas au clic
<button onClick={handleClick()}>Clic</button>

// ✅ Solution — on passe la référence de la fonction
<button onClick={handleClick}>Clic</button>

// ✅ Aussi correct si tu as besoin de passer des arguments
<button onClick={() => handleClick(item.id)}>Clic</button>
```

---

## 14. Coulisses : ce que JSX devient réellement

### La compilation par Babel

Babel transforme tout JSX en appels à `React.createElement()`. Ces deux blocs sont **strictement identiques** :

```jsx
// Ce que tu écris
const element = (
  <h1 className="greeting">
    Bonjour, monde !
  </h1>
);

// Ce que Babel génère
const element = React.createElement(
  'h1',                        // 1. Le type (balise HTML ou composant)
  { className: 'greeting' },  // 2. Les props
  'Bonjour, monde !'          // 3. Les enfants (children)
);
```

### Avec des enfants imbriqués

```jsx
// JSX
const element = (
  <div className="container">
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </div>
);

// Après compilation
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Titre'),
  React.createElement('p', null, 'Paragraphe')
);
```

### L'objet résultant (l'élément React)

`React.createElement()` retourne un **objet JavaScript** simple qui décrit ce que tu veux afficher :

```js
// L'objet résultant (structure simplifiée)
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Bonjour, monde !'
  }
};
```

Ces objets sont appelés des **éléments React**. React les lit, les compare avec le rendu précédent (Virtual DOM), et ne met à jour dans le vrai DOM que ce qui a réellement changé.

```
[JSX]
  ↓ (Babel compile)
[React.createElement()]
  ↓ (retourne)
[Élément React = objet JS simple]
  ↓ (React lit et compare)
[Virtual DOM]
  ↓ (diffing — calcul des différences)
[DOM réel — seulement ce qui a changé]
```

### Pourquoi le Virtual DOM ?

Manipuler le DOM réel est coûteux en performance. React maintient une **copie légère du DOM en mémoire** (le Virtual DOM). À chaque rendu, il compare l'ancien et le nouvel état, et met à jour uniquement les parties qui ont changé — au lieu de tout reconstruire.

---

## 15. Cheat Sheet — Aide-mémoire rapide

### Syntaxe de base

| Concept | Règle / Syntaxe |
|---|---|
| Balises | Toujours fermées : `<br />`, `<img />` |
| Classes CSS | `className` (pas `class`) |
| Labels `<label>` | `htmlFor` (pas `for`) |
| Expressions JS | Entre accolades `{maVariable}` |
| Plusieurs éléments | Envelopper dans `<> </>` |
| Style en ligne | Objet JS : `style={{ color: 'red' }}` |
| Événements | camelCase : `onClick`, `onChange` |
| Commentaires | `{/* commentaire */}` |
| Clé de liste | `key={id}` unique et stable |

### Ce qui s'affiche

| Valeur | Rendu |
|---|---|
| `"texte"` | Affiché |
| `42` | Affiché |
| `0` | **Affiché** (piège !) |
| `true` / `false` | Rien |
| `null` / `undefined` | Rien |
| `{...}` objet | **Erreur** |
| Tableau | Chaque élément affiché |

### Props

| Concept | Syntaxe |
|---|---|
| Données vers enfant | `<Comp nom="valeur" age={22} />` |
| Booléen implicite | `<Input disabled />` = `disabled={true}` |
| Valeur par défaut | `function F({ val = 'défaut' }) {}` |
| Spread props | `<Input {...props} />` |
| Contenu entre balises | Prop `children` automatique |
| Callback vers parent | `<Btn onClick={maFonction} />` |

### Pièges à éviter

| Erreur | Cause | Solution |
| --- | --- | --- |
| Composant invisible | Nom commence par minuscule | `MonComposant` pas `monComposant` |
| `0` affiché | Condition numérique avec `&&` | Utiliser `count > 0 &&` |
| Fonction appelée au rendu | `onClick={fn()}` avec parenthèses | `onClick={fn}` sans parenthèses |
| Objet non affiché | `{monObjet}` directement | `{monObjet.propriete}` |
| Bug de liste | Pas de `key` ou `key={index}` | `key={id}` stable |

---

> **Astuce :** Pour convertir du HTML existant en JSX, tu peux utiliser un convertisseur en ligne. Mais comprendre les règles par toi-même reste la meilleure façon de progresser.
