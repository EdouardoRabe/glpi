# 📘 Documentation Complète — Composants & Props React

> **Version React ciblée :** React 18+  
> **Niveau :** Débutant → Avancé  
> **Langue :** Français

---

## Table des matières

1. [Introduction aux Composants](#1-introduction-aux-composants)
2. [Composants Fonctionnels](#2-composants-fonctionnels)
3. [Composants de Classe (legacy)](#3-composants-de-classe-legacy)
4. [Les Props — Fondamentaux](#4-les-props--fondamentaux)
5. [Types de Props](#5-types-de-props)
6. [Props par défaut (defaultProps)](#6-props-par-défaut-defaultprops)
7. [PropTypes — Validation des Props](#7-proptypes--validation-des-props)
8. [TypeScript avec les Props](#8-typescript-avec-les-props)
9. [La Prop Spéciale `children`](#9-la-prop-spéciale-children)
10. [Passage de Fonctions comme Props (Callbacks)](#10-passage-de-fonctions-comme-props-callbacks)
11. [Spread des Props](#11-spread-des-props)
12. [Destructuration des Props](#12-destructuration-des-props)
13. [Props et Immutabilité](#13-props-et-immutabilité)
14. [Composition de Composants](#14-composition-de-composants)
15. [Render Props Pattern](#15-render-props-pattern)
16. [Higher-Order Components (HOC)](#16-higher-order-components-hoc)
17. [Forwarding de Refs](#17-forwarding-de-refs)
18. [Composants Contrôlés vs Non-Contrôlés](#18-composants-contrôlés-vs-non-contrôlés)
19. [Bonnes Pratiques](#19-bonnes-pratiques)
20. [Erreurs Courantes à Éviter](#20-erreurs-courantes-à-éviter)

---

## 1. Introduction aux Composants

Un **composant React** est une fonction (ou classe) JavaScript qui retourne du JSX (du HTML enrichi). C'est la brique de base de toute application React.

```jsx
// Le composant le plus simple possible
function Bonjour() {
  return <h1>Bonjour le monde !</h1>;
}
```

### Règles fondamentales

- Le nom d'un composant **doit commencer par une majuscule** (`MonComposant`, pas `monComposant`)
- Un composant **doit toujours retourner** du JSX (ou `null`)
- Un composant peut retourner **un seul élément racine** (ou un Fragment `<>...</>`)

```jsx
// ✅ Correct — un seul élément racine
function Carte() {
  return (
    <div>
      <h2>Titre</h2>
      <p>Contenu</p>
    </div>
  );
}

// ✅ Correct — utilisation d'un Fragment
function Carte() {
  return (
    <>
      <h2>Titre</h2>
      <p>Contenu</p>
    </>
  );
}

// ❌ Incorrect — deux éléments racines sans wrapper
function Carte() {
  return (
    <h2>Titre</h2>
    <p>Contenu</p>
  );
}
```

### Utilisation d'un composant

```jsx
function App() {
  return (
    <div>
      <Bonjour />
      <Carte />
    </div>
  );
}
```

---

## 2. Composants Fonctionnels

Depuis l'introduction des **Hooks** (React 16.8), les composants fonctionnels sont la norme. Ils sont plus simples, plus lisibles et plus puissants qu'avant.

### Structure de base

```jsx
function MonComposant() {
  return (
    <div>
      <p>Je suis un composant fonctionnel</p>
    </div>
  );
}

export default MonComposant;
```

### Avec une Arrow Function

```jsx
const MonComposant = () => {
  return <p>Composant en arrow function</p>;
};

// Retour implicite (sans accolades)
const MonComposantCourt = () => <p>Encore plus court</p>;
```

### Avec des Hooks

```jsx
import { useState, useEffect } from 'react';

function Compteur() {
  const [compte, setCompte] = useState(0); // état local

  useEffect(() => {
    document.title = `Compteur : ${compte}`;
  }, [compte]); // effet de bord

  return (
    <div>
      <p>Valeur : {compte}</p>
      <button onClick={() => setCompte(compte + 1)}>Incrémenter</button>
      <button onClick={() => setCompte(0)}>Réinitialiser</button>
    </div>
  );
}
```

---

## 3. Composants de Classe (legacy)

Les composants de classe existaient avant les Hooks. Vous les rencontrerez dans du code ancien. Il n'est **pas recommandé** de les utiliser dans de nouveaux projets.

```jsx
import { Component } from 'react';

class Compteur extends Component {
  // L'état est défini dans le constructeur
  constructor(props) {
    super(props); // obligatoire
    this.state = { compte: 0 };
  }

  incrementer = () => {
    this.setState({ compte: this.state.compte + 1 });
  };

  // Méthode de cycle de vie
  componentDidMount() {
    console.log('Composant monté');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.compte !== this.state.compte) {
      document.title = `Compteur : ${this.state.compte}`;
    }
  }

  componentWillUnmount() {
    console.log('Composant démonté');
  }

  render() {
    return (
      <div>
        <p>Valeur : {this.state.compte}</p>
        <button onClick={this.incrementer}>Incrémenter</button>
      </div>
    );
  }
}
```

### Équivalent en composant fonctionnel (moderne)

```jsx
import { useState, useEffect } from 'react';

function Compteur() {
  const [compte, setCompte] = useState(0);

  useEffect(() => {
    console.log('Composant monté');
    return () => console.log('Composant démonté'); // cleanup
  }, []);

  useEffect(() => {
    document.title = `Compteur : ${compte}`;
  }, [compte]);

  return (
    <div>
      <p>Valeur : {compte}</p>
      <button onClick={() => setCompte(c => c + 1)}>Incrémenter</button>
    </div>
  );
}
```

---

## 4. Les Props — Fondamentaux

Les **props** (abréviation de *properties*) sont le mécanisme par lequel un composant **parent** transmet des données à un composant **enfant**. Elles fonctionnent comme les attributs HTML.

### Passer des props

```jsx
// Le parent passe les props
function App() {
  return (
    <ProfilUtilisateur
      nom="Alice Dupont"
      age={28}
      estAdmin={true}
    />
  );
}
```

### Recevoir des props

```jsx
// L'enfant reçoit les props via son premier argument
function ProfilUtilisateur(props) {
  return (
    <div>
      <h2>{props.nom}</h2>
      <p>Âge : {props.age}</p>
      {props.estAdmin && <span>👑 Administrateur</span>}
    </div>
  );
}
```

### Flux des données : unidirectionnel

```
App (parent)
  │
  │  props: { nom: "Alice", age: 28 }
  ↓
ProfilUtilisateur (enfant)
```

Les props ne peuvent **jamais** remonter du bas vers le haut directement. C'est le principe de **one-way data binding**.

---

## 5. Types de Props

Les props peuvent recevoir n'importe quelle valeur JavaScript valide.

### Chaîne de caractères (String)

```jsx
<Composant texte="Bonjour" />
// Les guillemets = toujours une string
```

### Nombre (Number)

```jsx
<Composant age={25} prix={9.99} />
// Les accolades sont nécessaires pour les non-strings
```

### Booléen (Boolean)

```jsx
<Composant actif={true} />
<Composant actif />          // équivalent à actif={true}
<Composant actif={false} />
```

### Tableau (Array)

```jsx
const fruits = ['Pomme', 'Banane', 'Cerise'];

<ListeFruits items={fruits} />

function ListeFruits({ items }) {
  return (
    <ul>
      {items.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### Objet (Object)

```jsx
const utilisateur = {
  nom: 'Bob',
  email: 'bob@example.com',
  role: 'admin'
};

<CarteUtilisateur utilisateur={utilisateur} />

function CarteUtilisateur({ utilisateur }) {
  return (
    <div>
      <h3>{utilisateur.nom}</h3>
      <p>{utilisateur.email}</p>
      <span>{utilisateur.role}</span>
    </div>
  );
}
```

### Fonction (Function)

```jsx
function App() {
  const gererClic = () => alert('Cliqué !');

  return <Bouton onClick={gererClic} label="Cliquez-moi" />;
}

function Bouton({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### JSX / Composants React

```jsx
const icone = <span>⭐</span>;

<Bouton icone={icone} label="Favori" />
```

---

## 6. Props par défaut (defaultProps)

Vous pouvez définir des valeurs par défaut pour les props au cas où elles ne sont pas fournies par le parent.

### Méthode 1 : Valeurs par défaut dans la destructuration (recommandée)

```jsx
function Bouton({ label = "Cliquer", couleur = "bleu", taille = "moyen" }) {
  return (
    <button
      style={{ backgroundColor: couleur }}
      className={`btn btn-${taille}`}
    >
      {label}
    </button>
  );
}

// Utilisation
<Bouton />                          // label="Cliquer", couleur="bleu", taille="moyen"
<Bouton label="Envoyer" />          // label="Envoyer", reste par défaut
<Bouton couleur="rouge" />          // couleur="rouge", reste par défaut
```

### Méthode 2 : `defaultProps` (ancienne façon, toujours valide)

```jsx
function Bouton({ label, couleur, taille }) {
  return (
    <button style={{ backgroundColor: couleur }} className={`btn-${taille}`}>
      {label}
    </button>
  );
}

Bouton.defaultProps = {
  label: 'Cliquer',
  couleur: 'bleu',
  taille: 'moyen'
};
```

### Exemple complet avec valeurs par défaut

```jsx
function CarteArticle({
  titre = "Sans titre",
  auteur = "Anonyme",
  datePublication = new Date().toLocaleDateString('fr-FR'),
  nombreCommentaires = 0,
  estMisEnAvant = false
}) {
  return (
    <article className={estMisEnAvant ? 'article--vedette' : 'article'}>
      <h2>{titre}</h2>
      <p>Par {auteur} — {datePublication}</p>
      <p>💬 {nombreCommentaires} commentaire(s)</p>
      {estMisEnAvant && <span className="badge">⭐ À la une</span>}
    </article>
  );
}

// Exemples d'utilisation
<CarteArticle titre="Mon premier article" auteur="Marie" />
<CarteArticle estMisEnAvant />
<CarteArticle />
```

---

## 7. PropTypes — Validation des Props

`PropTypes` permet de valider le type et la présence des props en développement. Des avertissements apparaissent dans la console si les types ne correspondent pas.

### Installation

```bash
npm install prop-types
```

### Utilisation de base

```jsx
import PropTypes from 'prop-types';

function ProfilUtilisateur({ nom, age, email, estAdmin }) {
  return (
    <div>
      <h2>{nom}</h2>
      <p>Âge : {age}</p>
      <p>Email : {email}</p>
      {estAdmin && <span>Administrateur</span>}
    </div>
  );
}

ProfilUtilisateur.propTypes = {
  nom: PropTypes.string.isRequired,    // string, obligatoire
  age: PropTypes.number.isRequired,    // number, obligatoire
  email: PropTypes.string,             // string, optionnel
  estAdmin: PropTypes.bool,            // boolean, optionnel
};
```

### Tous les types PropTypes disponibles

```jsx
MonComposant.propTypes = {
  // Types primitifs
  texte: PropTypes.string,
  nombre: PropTypes.number,
  booleen: PropTypes.bool,
  fonction: PropTypes.func,
  symbole: PropTypes.symbol,

  // Types complexes
  objet: PropTypes.object,
  tableau: PropTypes.array,

  // Nœud React (tout ce qui peut être rendu)
  contenu: PropTypes.node,

  // Élément React spécifique
  element: PropTypes.element,

  // Instance d'une classe
  date: PropTypes.instanceOf(Date),

  // Valeur parmi une liste
  couleur: PropTypes.oneOf(['rouge', 'vert', 'bleu']),

  // Type parmi plusieurs
  valeur: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  // Tableau d'un type précis
  notes: PropTypes.arrayOf(PropTypes.number),

  // Objet avec des clés précises
  adresse: PropTypes.shape({
    rue: PropTypes.string,
    ville: PropTypes.string.isRequired,
    codePostal: PropTypes.string
  }),

  // Objet dont toutes les valeurs sont d'un type
  scores: PropTypes.objectOf(PropTypes.number),

  // Rendre une prop obligatoire
  nomObligatoire: PropTypes.string.isRequired,
};
```

### Exemple réel détaillé

```jsx
import PropTypes from 'prop-types';

function CarteProduct({ produit, onAjouterAuPanier, quantite }) {
  return (
    <div className="carte-produit">
      <img src={produit.image} alt={produit.nom} />
      <h3>{produit.nom}</h3>
      <p>{produit.description}</p>
      <span className={`badge badge--${produit.categorie}`}>
        {produit.categorie}
      </span>
      <p>Prix : {produit.prix.toFixed(2)} €</p>
      <p>Quantité : {quantite}</p>
      <button
        onClick={() => onAjouterAuPanier(produit.id)}
        disabled={produit.stock === 0}
      >
        {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
      </button>
    </div>
  );
}

CarteProduct.propTypes = {
  produit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nom: PropTypes.string.isRequired,
    description: PropTypes.string,
    prix: PropTypes.number.isRequired,
    image: PropTypes.string,
    categorie: PropTypes.oneOf(['electronique', 'vetement', 'livre', 'autre']),
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAjouterAuPanier: PropTypes.func.isRequired,
  quantite: PropTypes.number,
};

CarteProduct.defaultProps = {
  quantite: 1,
};
```

---

## 8. TypeScript avec les Props

TypeScript apporte un typage statique plus robuste que PropTypes, avec une vérification au moment de la compilation.

### Interface pour les props

```tsx
interface BoutonProps {
  label: string;
  onClick: () => void;
  couleur?: 'primaire' | 'secondaire' | 'danger'; // optionnel avec union type
  desactive?: boolean;
  taille?: 'petit' | 'moyen' | 'grand';
}

function Bouton({ label, onClick, couleur = 'primaire', desactive = false, taille = 'moyen' }: BoutonProps) {
  return (
    <button
      onClick={onClick}
      disabled={desactive}
      className={`btn btn--${couleur} btn--${taille}`}
    >
      {label}
    </button>
  );
}
```

### Type vs Interface

```tsx
// Avec type
type CarteProps = {
  titre: string;
  description?: string;
  children: React.ReactNode;
};

// Avec interface (préférable pour les props React, extensible)
interface CarteProps {
  titre: string;
  description?: string;
  children: React.ReactNode;
}

// Extension d'interface
interface CarteAvanceeProps extends CarteProps {
  couleurFond?: string;
  onFermer?: () => void;
}
```

### Types React courants

```tsx
import React from 'react';

interface ExempleProps {
  // Contenu rendu (string, number, JSX, tableau, null, etc.)
  children: React.ReactNode;

  // Uniquement un élément React (un seul JSX)
  icone: React.ReactElement;

  // Référence vers un élément DOM
  refInput: React.RefObject<HTMLInputElement>;

  // Handler d'événement pour un bouton
  onClick: React.MouseEventHandler<HTMLButtonElement>;

  // Handler pour un input
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  // Handler de soumission de formulaire
  onSubmit: React.FormEventHandler<HTMLFormElement>;

  // Style CSS inline
  style?: React.CSSProperties;

  // Classes CSS
  className?: string;
}
```

### Exemple complet en TypeScript

```tsx
interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'utilisateur' | 'moderateur';
  dateInscription: Date;
}

interface ListeUtilisateursProps {
  utilisateurs: Utilisateur[];
  onSelectionner: (id: number) => void;
  utilisateurSelectionne?: number;
  afficherEmail?: boolean;
}

function ListeUtilisateurs({
  utilisateurs,
  onSelectionner,
  utilisateurSelectionne,
  afficherEmail = false
}: ListeUtilisateursProps) {
  return (
    <ul>
      {utilisateurs.map((user) => (
        <li
          key={user.id}
          onClick={() => onSelectionner(user.id)}
          className={user.id === utilisateurSelectionne ? 'selectionne' : ''}
        >
          {user.avatar && <img src={user.avatar} alt={user.nom} />}
          <span>{user.nom}</span>
          {afficherEmail && <span>{user.email}</span>}
          <span className={`badge--${user.role}`}>{user.role}</span>
        </li>
      ))}
    </ul>
  );
}
```

---

## 9. La Prop Spéciale `children`

`children` est une prop **réservée** de React qui représente tout le contenu placé entre les balises ouvrante et fermante d'un composant.

### Utilisation de base

```jsx
function Carte({ children }) {
  return (
    <div className="carte">
      {children}
    </div>
  );
}

// Utilisation
<Carte>
  <h2>Titre de la carte</h2>
  <p>Contenu quelconque ici...</p>
  <button>Action</button>
</Carte>
```

### `children` peut être n'importe quoi

```jsx
// Du texte simple
<Carte>Bonjour !</Carte>

// Un seul élément
<Carte><img src="photo.jpg" alt="Photo" /></Carte>

// Plusieurs éléments
<Carte>
  <h2>Titre</h2>
  <p>Paragraphe</p>
</Carte>

// Un tableau de composants
<Carte>
  {articles.map(a => <Article key={a.id} {...a} />)}
</Carte>
```

### Layout avec children

```jsx
function Disposition({ enfantGauche, enfantDroit }) {
  return (
    <div className="disposition-deux-colonnes">
      <aside>{enfantGauche}</aside>
      <main>{enfantDroit}</main>
    </div>
  );
}

// Utilisation avec des "slots" nommés
<Disposition
  enfantGauche={<MenuNavigation />}
  enfantDroit={<ContenuPrincipal />}
/>
```

### Manipulation de `children` avec `React.Children`

```jsx
import { Children, cloneElement } from 'react';

function GroupeBoutons({ children, taille = 'moyen' }) {
  // Cloner chaque enfant en ajoutant une prop supplémentaire
  const enfantsAvecProps = Children.map(children, (enfant) => {
    return cloneElement(enfant, { taille });
  });

  return <div className="groupe-boutons">{enfantsAvecProps}</div>;
}

// Utilisation — chaque Bouton recevra automatiquement taille="grand"
<GroupeBoutons taille="grand">
  <Bouton label="Annuler" />
  <Bouton label="Confirmer" />
  <Bouton label="Sauvegarder" />
</GroupeBoutons>
```

### Compter et vérifier les enfants

```jsx
function Conteneur({ children }) {
  const nbEnfants = Children.count(children);

  return (
    <div>
      <p>{nbEnfants} élément(s)</p>
      {children}
    </div>
  );
}
```

---

## 10. Passage de Fonctions comme Props (Callbacks)

Passer des fonctions comme props est la façon standard de **faire remonter des informations** d'un enfant vers un parent (communication ascendante).

### Pattern de base

```jsx
function Parent() {
  const [message, setMessage] = useState('');

  const gererMessage = (nouveauMessage) => {
    setMessage(nouveauMessage);
  };

  return (
    <div>
      <p>Message reçu : {message}</p>
      <Enfant onEnvoyerMessage={gererMessage} />
    </div>
  );
}

function Enfant({ onEnvoyerMessage }) {
  return (
    <button onClick={() => onEnvoyerMessage('Bonjour depuis l\'enfant !')}>
      Envoyer un message
    </button>
  );
}
```

### Exemple de formulaire avec callbacks

```jsx
function FormulaireRecherche({ onRechercher, onEffacer }) {
  const [terme, setTerme] = useState('');

  const gererSoumission = (e) => {
    e.preventDefault();
    onRechercher(terme);
  };

  const gererEffacement = () => {
    setTerme('');
    onEffacer();
  };

  return (
    <form onSubmit={gererSoumission}>
      <input
        value={terme}
        onChange={(e) => setTerme(e.target.value)}
        placeholder="Rechercher..."
      />
      <button type="submit">🔍 Rechercher</button>
      <button type="button" onClick={gererEffacement}>✕ Effacer</button>
    </form>
  );
}

// Parent
function App() {
  const [resultats, setResultats] = useState([]);

  return (
    <div>
      <FormulaireRecherche
        onRechercher={(terme) => {
          console.log(`Recherche : ${terme}`);
          // Appel API, etc.
        }}
        onEffacer={() => setResultats([])}
      />
    </div>
  );
}
```

### Passage de données avec les callbacks

```jsx
function ListeItems({ items, onSupprimer, onModifier }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.nom}</span>
          {/* On passe l'id à chaque callback */}
          <button onClick={() => onModifier(item.id)}>✏️</button>
          <button onClick={() => onSupprimer(item.id)}>🗑️</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 11. Spread des Props

L'opérateur spread (`...`) permet de passer toutes les propriétés d'un objet comme props.

### Utilisation du spread

```jsx
const propsCommunes = {
  className: 'btn',
  disabled: false,
  type: 'button'
};

// Sans spread
<button className={propsCommunes.className} disabled={propsCommunes.disabled} type={propsCommunes.type}>
  Clic
</button>

// Avec spread — équivalent et plus lisible
<button {...propsCommunes}>Clic</button>
```

### Spread avec des props supplémentaires

```jsx
function Bouton({ label, variante = 'primaire', ...autresProps }) {
  return (
    // autresProps contient tout ce qui n'est pas `label` et `variante`
    <button className={`btn btn--${variante}`} {...autresProps}>
      {label}
    </button>
  );
}

// Le `onClick`, `disabled`, `aria-label` etc. sont transmis via autresProps
<Bouton
  label="Valider"
  variante="danger"
  onClick={gererClic}
  disabled={chargement}
  aria-label="Valider le formulaire"
/>
```

### Attention — ordre du spread

```jsx
const props = { couleur: 'bleu', taille: 'moyen' };

// La prop couleur de l'objet sera ÉCRASÉE par "rouge"
<Composant {...props} couleur="rouge" />
// Résultat : couleur="rouge", taille="moyen"

// La prop couleur explicite sera ÉCRASÉE par l'objet
<Composant couleur="rouge" {...props} />
// Résultat : couleur="bleu", taille="moyen"
```

### Transmettre les props à un élément natif (wrapper)

```jsx
function ChampTexte({ label, erreur, ...propsInput }) {
  return (
    <div className="champ">
      <label>{label}</label>
      <input {...propsInput} className={erreur ? 'input--erreur' : 'input'} />
      {erreur && <span className="message-erreur">{erreur}</span>}
    </div>
  );
}

// Toutes les props natives de <input> fonctionneront
<ChampTexte
  label="Email"
  erreur="Email invalide"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="exemple@domaine.com"
  autoComplete="email"
  required
/>
```

---

## 12. Destructuration des Props

La destructuration rend le code plus lisible et évite la répétition de `props.`.

### Destructuration dans les paramètres

```jsx
// Sans destructuration
function Utilisateur(props) {
  return <h1>{props.nom} ({props.age} ans)</h1>;
}

// Avec destructuration — plus propre
function Utilisateur({ nom, age }) {
  return <h1>{nom} ({age} ans)</h1>;
}
```

### Destructuration avec renommage

```jsx
function Composant({ nom: prenom, age: annees }) {
  // `prenom` vaut ce qui était `nom`
  // `annees` vaut ce qui était `age`
  return <p>{prenom} a {annees} ans</p>;
}
```

### Destructuration imbriquée

```jsx
function Carte({ utilisateur: { nom, email, adresse: { ville, pays } } }) {
  return (
    <div>
      <h2>{nom}</h2>
      <p>{email}</p>
      <p>{ville}, {pays}</p>
    </div>
  );
}

// Utilisation
<Carte utilisateur={{
  nom: "Claire",
  email: "claire@example.com",
  adresse: { ville: "Paris", pays: "France" }
}} />
```

### Destructuration avec valeurs par défaut

```jsx
function Bouton({
  label = "Valider",
  type = "button",
  variante = "primaire",
  taille = "moyen",
  desactive = false,
  onClick
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={desactive}
      className={`btn btn--${variante} btn--${taille}`}
    >
      {label}
    </button>
  );
}
```

---

## 13. Props et Immutabilité

**Règle absolue :** les props sont **en lecture seule**. Un composant enfant ne doit jamais modifier ses propres props.

### ❌ Mauvaise pratique

```jsx
function Mauvais({ compteur }) {
  // INTERDIT — ne jamais muter les props
  compteur = compteur + 1;
  props.nom = "autre nom";

  return <p>{compteur}</p>;
}
```

### ✅ Bonne pratique — utiliser l'état local

```jsx
function Bon({ compteurInitial }) {
  // Copier la valeur de la prop dans l'état local si on veut la modifier
  const [compteur, setCompteur] = useState(compteurInitial);

  return (
    <div>
      <p>{compteur}</p>
      <button onClick={() => setCompteur(c => c + 1)}>+</button>
    </div>
  );
}
```

### ✅ Bonne pratique — remonter l'événement

```jsx
// Plutôt que de muter, signaler au parent via un callback
function Enfant({ valeur, onChanger }) {
  return (
    <button onClick={() => onChanger(valeur + 1)}>
      Valeur : {valeur}
    </button>
  );
}

function Parent() {
  const [valeur, setValeur] = useState(0);
  return <Enfant valeur={valeur} onChanger={setValeur} />;
}
```

---

## 14. Composition de Composants

La **composition** est le pattern fondamental de React : assembler des composants simples pour former des composants complexes.

### Composition simple

```jsx
function Icone({ nom }) {
  const icones = { email: '📧', telephone: '📞', localisation: '📍' };
  return <span>{icones[nom] || '❓'}</span>;
}

function Libelle({ texte }) {
  return <span className="libelle">{texte}</span>;
}

function ChampInfoContact({ type, valeur }) {
  return (
    <div className="info-contact">
      <Icone nom={type} />
      <Libelle texte={valeur} />
    </div>
  );
}

function CarteContact({ contact }) {
  return (
    <div className="carte-contact">
      <h3>{contact.nom}</h3>
      <ChampInfoContact type="email" valeur={contact.email} />
      <ChampInfoContact type="telephone" valeur={contact.telephone} />
      <ChampInfoContact type="localisation" valeur={contact.ville} />
    </div>
  );
}
```

### Composition avec spécialisation

```jsx
// Composant générique
function Alerte({ type, titre, message, children }) {
  return (
    <div className={`alerte alerte--${type}`}>
      <strong>{titre}</strong>
      <p>{message}</p>
      {children}
    </div>
  );
}

// Composants spécialisés
function AlerteSucces({ message }) {
  return <Alerte type="succes" titre="✅ Succès" message={message} />;
}

function AlerteErreur({ message, onReessayer }) {
  return (
    <Alerte type="erreur" titre="❌ Erreur" message={message}>
      <button onClick={onReessayer}>Réessayer</button>
    </Alerte>
  );
}

function AlerteInfo({ message, lien }) {
  return (
    <Alerte type="info" titre="ℹ️ Information" message={message}>
      {lien && <a href={lien}>En savoir plus</a>}
    </Alerte>
  );
}
```

---

## 15. Render Props Pattern

Le pattern **Render Props** consiste à passer une fonction comme prop, permettant à un composant de déléguer ce qu'il rend.

```jsx
// Composant qui gère la logique de survol
function SurvolDetecteur({ rendu }) {
  const [estSurvole, setEstSurvole] = useState(false);

  return (
    <div
      onMouseEnter={() => setEstSurvole(true)}
      onMouseLeave={() => setEstSurvole(false)}
    >
      {/* On appelle la fonction prop avec l'état */}
      {rendu(estSurvole)}
    </div>
  );
}

// Utilisation — le parent décide quoi afficher
<SurvolDetecteur
  rendu={(estSurvole) => (
    <div style={{ background: estSurvole ? 'jaune' : 'blanc' }}>
      {estSurvole ? '🔥 Survolé !' : 'Survolez-moi'}
    </div>
  )}
/>

// Deuxième utilisation complètement différente
<SurvolDetecteur
  rendu={(estSurvole) => (
    <img
      src={estSurvole ? 'chat-heureux.jpg' : 'chat-normal.jpg'}
      alt="Chat"
    />
  )}
/>
```

### Avec `children` comme fonction

```jsx
function RecuperateurDonnees({ url, children }) {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => { setDonnees(data); setChargement(false); })
      .catch(err => { setErreur(err); setChargement(false); });
  }, [url]);

  // children est une fonction appelée avec l'état
  return children({ donnees, chargement, erreur });
}

// Utilisation
<RecuperateurDonnees url="/api/utilisateurs">
  {({ donnees, chargement, erreur }) => {
    if (chargement) return <Chargement />;
    if (erreur) return <AlerteErreur message={erreur.message} />;
    return <ListeUtilisateurs utilisateurs={donnees} />;
  }}
</RecuperateurDonnees>
```

---

## 16. Higher-Order Components (HOC)

Un **HOC** est une fonction qui prend un composant et retourne un nouveau composant enrichi. C'est un pattern de réutilisation de logique.

```jsx
// HOC qui ajoute une vérification d'authentification
function avecAuthentification(ComposantWrappe) {
  function ComposantProtege(props) {
    const { estConnecte, utilisateur } = useAuth();

    if (!estConnecte) {
      return <Redirect to="/connexion" />;
    }

    return <ComposantWrappe {...props} utilisateur={utilisateur} />;
  }

  // Nom pour le débogage
  ComposantProtege.displayName = `avecAuthentification(${ComposantWrappe.displayName || ComposantWrappe.name})`;

  return ComposantProtege;
}

// Composant normal
function TableauDeBord({ utilisateur }) {
  return <h1>Bienvenue, {utilisateur.nom} !</h1>;
}

// Composant protégé
const TableauDeBordProtege = avecAuthentification(TableauDeBord);

// Utilisation
<TableauDeBordProtege />
```

### HOC pour le chargement

```jsx
function avecChargement(Composant) {
  return function ({ chargement, ...props }) {
    if (chargement) {
      return (
        <div className="chargement">
          <div className="spinner" />
          <p>Chargement...</p>
        </div>
      );
    }
    return <Composant {...props} />;
  };
}

const ListeAvecChargement = avecChargement(Liste);

<ListeAvecChargement chargement={true} items={[]} />
```

---

## 17. Forwarding de Refs

`React.forwardRef` permet à un composant parent de passer une `ref` à un composant enfant.

```jsx
import { forwardRef, useRef } from 'react';

// Le composant accepte une ref en plus des props
const ChampTexte = forwardRef(function ChampTexte({ label, ...props }, ref) {
  return (
    <div className="champ">
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  );
});

// Dans le parent, on peut accéder directement à l'input
function Formulaire() {
  const refInput = useRef(null);

  const focuserInput = () => {
    refInput.current?.focus();
  };

  return (
    <div>
      <ChampTexte
        ref={refInput}
        label="Nom"
        type="text"
        placeholder="Votre nom"
      />
      <button onClick={focuserInput}>Focus sur l'input</button>
    </div>
  );
}
```

---

## 18. Composants Contrôlés vs Non-Contrôlés

### Composant contrôlé (recommandé)

La valeur est **gérée par React** via l'état.

```jsx
function FormulaireControle() {
  const [valeur, setValeur] = useState('');

  return (
    <div>
      <input
        value={valeur}                        // contrôlé par l'état
        onChange={(e) => setValeur(e.target.value)}
      />
      <p>Valeur actuelle : "{valeur}"</p>
      <button onClick={() => setValeur('')}>Effacer</button>
    </div>
  );
}
```

### Composant non-contrôlé

La valeur est **gérée par le DOM**, on accède via une `ref`.

```jsx
import { useRef } from 'react';

function FormulaireNonControle() {
  const refInput = useRef(null);

  const gererSoumission = (e) => {
    e.preventDefault();
    // On lit la valeur directement depuis le DOM
    alert(`Valeur : ${refInput.current.value}`);
  };

  return (
    <form onSubmit={gererSoumission}>
      <input
        ref={refInput}
        defaultValue="Valeur initiale"  // valeur initiale seulement
      />
      <button type="submit">Lire</button>
    </form>
  );
}
```

### Comparaison

| Caractéristique | Contrôlé | Non-contrôlé |
|---|---|---|
| Source de vérité | État React | DOM |
| Validation temps réel | ✅ Facile | ❌ Difficile |
| Réinitialisation | ✅ Simple | ❌ Complexe |
| Valeur par défaut | `value` | `defaultValue` |
| Recommandé | ✅ Oui | Pour cas simples |

---

## 19. Bonnes Pratiques

### 1. Un composant = une responsabilité

```jsx
// ❌ Composant trop gros
function PageProduit() {
  // gère navigation, liste, détail, panier, paiement...
}

// ✅ Chaque composant a une seule responsabilité
function PageProduit() {
  return (
    <>
      <EnTete />
      <ListeProduits />
      <PanierLateral />
      <PiedDePage />
    </>
  );
}
```

### 2. Nommer clairement les props de callback

```jsx
// ❌ Noms ambigus
<Bouton click={fn} action={fn2} />

// ✅ Convention onEvenement
<Bouton onClick={fn} onDoubleClick={fn2} onSurvol={fn3} />
```

### 3. Éviter les props drilling excessif

```jsx
// ❌ Passer une prop à travers 4 niveaux
<A theme={theme}>
  <B theme={theme}>
    <C theme={theme}>
      <D theme={theme} />
    </C>
  </B>
</A>

// ✅ Utiliser Context API pour les données globales
const ThemeContext = createContext('clair');

function App() {
  return (
    <ThemeContext.Provider value="sombre">
      <A />
    </ThemeContext.Provider>
  );
}

function D() {
  const theme = useContext(ThemeContext); // accès direct
  return <div className={`theme-${theme}`}>...</div>;
}
```

### 4. Mémoïser les fonctions et valeurs coûteuses

```jsx
import { useCallback, useMemo } from 'react';

function Parent({ items }) {
  // useCallback — mémoïse la fonction pour éviter re-rendus inutiles
  const gererClic = useCallback((id) => {
    console.log(`Cliqué sur ${id}`);
  }, []); // dépendances vides = jamais recréée

  // useMemo — mémoïse un calcul coûteux
  const itemsFiltres = useMemo(() => {
    return items.filter(item => item.actif).sort((a, b) => a.nom.localeCompare(b.nom));
  }, [items]);

  return <Liste items={itemsFiltres} onClic={gererClic} />;
}
```

### 5. Utiliser `React.memo` pour éviter les re-rendus inutiles

```jsx
import { memo } from 'react';

// Le composant ne se re-rend que si ses props changent
const CarteUtilisateur = memo(function CarteUtilisateur({ utilisateur }) {
  return (
    <div>
      <h3>{utilisateur.nom}</h3>
      <p>{utilisateur.email}</p>
    </div>
  );
});
```

---

## 20. Erreurs Courantes à Éviter

### ❌ Oublier la `key` dans les listes

```jsx
// ❌ Sans key — avertissement React
{items.map(item => <Item item={item} />)}

// ✅ Avec key unique et stable
{items.map(item => <Item key={item.id} item={item} />)}

// ⚠️ Éviter l'index comme key si la liste peut être réordonnée
{items.map((item, index) => <Item key={index} item={item} />)}
```

### ❌ Modifier les props directement

```jsx
// ❌ JAMAIS
function Mauvais({ tableau }) {
  tableau.push('nouvel élément'); // mutation de prop
  return <Liste items={tableau} />;
}

// ✅ Créer une copie
function Bon({ tableau }) {
  const tableauEtendu = [...tableau, 'nouvel élément'];
  return <Liste items={tableauEtendu} />;
}
```

### ❌ Passer des objets/fonctions créés inline sans mémoïsation

```jsx
// ❌ Nouvel objet créé à chaque rendu → re-rendu de l'enfant à chaque fois
<Enfant config={{ couleur: 'bleu', taille: 10 }} />

// ✅ Définir l'objet en dehors ou mémoïser
const config = useMemo(() => ({ couleur: 'bleu', taille: 10 }), []);
<Enfant config={config} />

// Ou à l'extérieur du composant si la valeur est constante
const CONFIG = { couleur: 'bleu', taille: 10 };
function Parent() {
  return <Enfant config={CONFIG} />;
}
```

### ❌ Oublier que `children` peut être `undefined`

```jsx
// ❌ Peut planter si children est undefined
function Carte({ children }) {
  return <div>{children.length} éléments</div>;
}

// ✅ Vérification + Children.count
import { Children } from 'react';

function Carte({ children }) {
  return <div>{Children.count(children)} éléments</div>;
}
```

---

## Récapitulatif rapide

| Concept | Résumé |
|---|---|
| Composant | Fonction JS qui retourne du JSX |
| Props | Données passées du parent → enfant |
| `children` | Contenu entre les balises du composant |
| Immutabilité | Les props ne se modifient jamais |
| Callback | Fonction prop pour communiquer enfant → parent |
| defaultProps | Valeurs par défaut pour les props |
| PropTypes | Validation des types en développement |
| TypeScript | Typage statique au moment de la compilation |
| Spread `...` | Passer toutes les propriétés d'un objet |
| Composition | Assembler des composants simples |
| Render Props | Déléguer le rendu via une fonction prop |
| HOC | Enrichir un composant via une fonction |
| forwardRef | Transmettre une ref vers un élément enfant |
| Contrôlé | Valeur gérée par l'état React |
| Non-contrôlé | Valeur gérée par le DOM via ref |
| `React.memo` | Éviter les re-rendus inutiles |

---

*Documentation rédigée pour React 18+ — © 2024*
