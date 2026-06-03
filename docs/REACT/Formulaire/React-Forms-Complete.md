# React Forms - Guide Complet

Ce document regroupe et organise toutes les notions clés relatives aux formulaires React : gestion des champs, contrôles, soumission, validation et cas spéciaux comme les checkbox et les uploads de fichiers.

## Sommaire

- [Introduction](#introduction)
- [Pourquoi React contrôle les formulaires](#pourquoi-react-contrôle-les-formulaires)
- [1. Composants contrôlés](#1-composants-contrôlés)
  - [1.1 Champ texte](#11-champ-texte)
  - [1.2 Textarea](#12-textarea)
  - [1.3 Select](#13-select)
  - [1.4 Radio](#14-radio)
  - [1.5 Checkbox](#15-checkbox)
- [2. Gérer plusieurs champs](#2-gérer-plusieurs-champs)
- [3. Upload de fichier](#3-upload-de-fichier)
- [4. Soumission et validation](#4-soumission-et-validation)
- [5. Bonnes pratiques](#5-bonnes-pratiques)
- [6. Exemples complets](#6-exemples-complets)
- [Conclusion](#conclusion)

## Introduction

En React, les formulaires ne sont pas gérés comme en HTML classique. React préfère contrôler les données du formulaire avec l'état du composant, ce qui permet d'avoir une source unique de vérité.

## Pourquoi React contrôle les formulaires

En HTML pur, un champ `<input>` garde sa valeur en interne. En React, cette valeur est stockée dans le `state` du composant et l'élément lit cette valeur via l'attribut `value`.

Cela rend le formulaire :

- prévisible,
- testable,
- facile à valider.

Les trois points clés d'un formulaire React sont :

1. Gestion de l'état
2. Soumission avec `onSubmit` et `preventDefault()`
3. Validation et envoi des données

## 1. Composants contrôlés

Un composant contrôlé lie la valeur du champ à l'état React. On lit l'état avec `value` ou `checked` et on le met à jour avec `onChange`.

### 1.1 Champ texte

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function MyForm() {
  const [name, setName] = useState('');

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form>
      <label>
        Enter your name:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <p>Current value: {name}</p>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

- `value={name}` : le champ affiche la valeur du state.
- `onChange={handleChange}` : chaque frappe met à jour le state.

> Si tu utilises `value={name}` sans `onChange`, le champ sera figé et l'utilisateur ne pourra plus saisir de texte.

### 1.2 Textarea

En React, la valeur d'un `<textarea>` est gérée avec l'attribut `value`, comme pour un `<input>`.

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

function MyForm() {
  const [mytxt, setMytxt] = useState('');

  function handleChange(e) {
    setMytxt(e.target.value);
  }

  return (
    <form>
      <label>
        Write here:
        <textarea value={mytxt} onChange={handleChange} />
      </label>
      <p>Current value: {mytxt}</p>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

### 1.3 Select

Pour un `<select>`, React contrôle la valeur sélectionnée via l'attribut `value` du `<select>`.

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function MyForm() {
  const [myCar, setMyCar] = useState('Volvo');

  const handleChange = (event) => {
    setMyCar(event.target.value);
  };

  return (
    <form>
      <select value={myCar} onChange={handleChange}>
        <option value="Ford">Ford</option>
        <option value="Volvo">Volvo</option>
        <option value="Fiat">Fiat</option>
      </select>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

- `value={myCar}` force le `<select>` à afficher l'option correspondant à l'état.
- `event.target.value` contient la nouvelle option choisie.

### 1.4 Radio

Les boutons radio sont utilisés en groupe. Une seule option peut être sélectionnée par groupe. En React, on compare `checked` avec la valeur stockée dans l'état.

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function MyForm() {
  const [selectedFruit, setSelectedFruit] = useState('banana');

  const handleChange = (event) => {
    setSelectedFruit(event.target.value);
  };

  return (
    <form>
      <p>Select your favorite fruit:</p>
      <label>
        <input
          type="radio"
          name="fruit"
          value="apple"
          checked={selectedFruit === 'apple'}
          onChange={handleChange}
        />
        Apple
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="fruit"
          value="banana"
          checked={selectedFruit === 'banana'}
          onChange={handleChange}
        />
        Banana
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="fruit"
          value="cherry"
          checked={selectedFruit === 'cherry'}
          onChange={handleChange}
        />
        Cherry
      </label>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

- Tous les radio du groupe doivent partager le même `name`.
- L'option dont la valeur correspond à l'état est cochée.

### 1.5 Checkbox

Pour les checkbox, React utilise `checked` au lieu de `value` pour contrôler l'état.

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function MyForm() {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    let fillings = '';
    if (inputs.tomato) fillings += 'tomato';
    if (inputs.onion) {
      if (inputs.tomato) fillings += ' and ';
      fillings += 'onion';
    }
    if (fillings === '') fillings = 'no fillings';
    alert(`${inputs.firstname} wants a burger with ${fillings}`);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        My name is:
        <input
          type="text"
          name="firstname"
          value={inputs.firstname || ''}
          onChange={handleChange}
        />
      </label>

      <p>I want a burger with:</p>
      <label>
        Tomato:
        <input
          type="checkbox"
          name="tomato"
          checked={inputs.tomato || false}
          onChange={handleChange}
        />
      </label>
      <label>
        Onion:
        <input
          type="checkbox"
          name="onion"
          checked={inputs.onion || false}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

- `checked` indique si la checkbox est cochée (`true`) ou non (`false`).
- `value` ne fonctionne pas correctement pour une checkbox contrôlée.
- `target.checked` est utilisé pour les checkbox.

## 2. Gérer plusieurs champs

Lorsque plusieurs champs sont présents, on peut stocker toutes les valeurs dans un seul objet d'état.

```jsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function MyForm() {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <form>
      <label>
        First name:
        <input
          type="text"
          name="firstname"
          value={inputs.firstname || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          type="text"
          name="lastname"
          value={inputs.lastname || ''}
          onChange={handleChange}
        />
      </label>
      <p>Current values: {inputs.firstname} {inputs.lastname}</p>
    </form>
  );
}

createRoot(document.getElementById('root')).render(<MyForm />);
```

- Chaque champ doit avoir un `name` unique.
- `setInputs(values => ({ ...values, [name]: value }))` met à jour uniquement la propriété concernée.
- Initialiser l'état avec un objet vide permet d'éviter des erreurs lorsque une propriété n'existe pas encore.

### Gérer plusieurs types de champs dans le même handler

Pour gérer à la fois les champs texte et les checkbox :

```jsx
const handleChange = (e) => {
  const target = e.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  setInputs((values) => ({ ...values, [name]: value }));
};
```

### Exemple : valeurs initiales

```jsx
const [inputs, setInputs] = useState({
  firstname: 'John',
  lastname: 'Doe',
});
```

Cette initialisation affiche immédiatement des valeurs par défaut.

## 3. Upload de fichier

Pour un champ de type `file`, on récupère `event.target.files[0]` au lieu de `event.target.value`.

```jsx
import { useState } from 'react';

function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Veuillez choisir un fichier avant d'envoyer.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const result = await response.json();
      setMessage(`Upload réussi : ${result.filename || 'OK'}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Choisir un fichier :
        <input type="file" onChange={handleFileChange} />
      </label>
      <button type="submit">Envoyer</button>
      <p>{message}</p>
    </form>
  );
}
```

### Envoyer plusieurs fichiers

```jsx
<input type="file" multiple onChange={handleFilesChange} />
```

```js
const handleFilesChange = (event) => {
  setFiles(Array.from(event.target.files));
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  files.forEach((file) => formData.append('files[]', file));
  await fetch('/api/upload', { method: 'POST', body: formData });
};
```

### Pourquoi utiliser `FormData` ?

- Permet d'envoyer des fichiers en `multipart/form-data`.
- Autorise l'ajout de champs texte et de fichiers dans la même requête.
- `fetch` gère automatiquement le boundary, donc il ne faut pas définir `Content-Type` manuellement.

## 4. Soumission et validation

En React, on intercepte la soumission du formulaire pour empêcher le rechargement de la page.

```jsx
function MyForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Le nom est requis.');
      return;
    }
    setError('');
    console.log('Données envoyées :', name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your name:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">Envoyer</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

- `onSubmit={handleSubmit}` attache le gestionnaire de soumission au formulaire.
- `e.preventDefault()` bloque le rechargement de la page.
- Après validation, on peut envoyer les données au backend ou traiter le payload.

## 5. Bonnes pratiques

- Toujours donner un `name` unique à chaque champ.
- Utiliser un seul `handleChange` pour plusieurs champs lorsque c'est possible.
- Pour les checkbox, utiliser `checked` plutôt que `value`.
- Initialiser l'état avec un objet même vide.
- Ne pas fixer `Content-Type` manuellement quand on envoie un `FormData`.
- Valider les données côté client avant l'envoi.

## 6. Exemples complets

### Exemple checkbox avec tableau de sélection

```jsx
import { useState } from 'react';

function FoodForm() {
  const [form, setForm] = useState({
    name: '',
    plat: {
      frite: false,
      burger: false,
      jus: false,
    },
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        plat: {
          ...prev.plat,
          [value]: checked,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: form.name,
      plat: Object.keys(form.plat).filter((key) => form.plat[key]),
    };

    console.log(JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom:
        <input type="text" name="name" value={form.name} onChange={handleChange} />
      </label>

      <label>
        Frite
        <input type="checkbox" name="plat" value="frite" checked={form.plat.frite} onChange={handleChange} />
      </label>
      <label>
        Burger
        <input type="checkbox" name="plat" value="burger" checked={form.plat.burger} onChange={handleChange} />
      </label>
      <label>
        Jus
        <input type="checkbox" name="plat" value="jus" checked={form.plat.jus} onChange={handleChange} />
      </label>

      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Version simplifiée avec tableau final

```jsx
const [form, setForm] = useState({
  name: '',
  plat: [],
});

const handleChange = (e) => {
  const { value, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    plat: checked
      ? [...prev.plat, value]
      : prev.plat.filter((item) => item !== value),
  }));
};

const handleSubmit = (event) => {
  event.preventDefault();

  const payload = {
    name: form.name,
    plat: form.plat,
  };

  console.log(JSON.stringify(payload, null, 2));
};
```

Cette version est pratique si tu veux que l'état contienne déjà le tableau final `plat: ['frite', 'burger']`.

## Conclusion

Les formulaires React sont plus robustes que le HTML classique quand ils sont contrôlés par l'état. En centralisant l'état, en utilisant `onChange`, `value` et `checked` correctement, tu obtiens un formulaire prévisible, facile à valider et à maintenir.

Résumé des points essentiels :

- Utiliser `value` pour les champs texte, `textarea` et `select`.
- Utiliser `checked` pour les checkbox et radio.
- Gérer plusieurs champs avec un objet d'état unique.
- Intercepter la soumission avec `preventDefault()`.
- Envoyer des fichiers avec `FormData` sans fixer manuellement `Content-Type`.
