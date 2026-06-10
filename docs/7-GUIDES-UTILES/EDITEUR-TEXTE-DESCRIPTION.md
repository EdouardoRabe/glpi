# Guide Champ Description & Éditeur de Texte Riche

> 🔎 **Mots-clés de recherche :** éditeur, editor, texte riche, rich text, wysiwyg, tinymce, quill, react-quill, description, textarea, html, gras, bold, italique, mise en forme, contenu, content, formatage, zone de texte

Comment faire un champ **description** : du simple `<textarea>` jusqu'à un vrai éditeur type Word (gras, listes, liens). Avec **installation + utilisation** pour chaque. Copie-colle prêt à l'emploi.

> ⚠️ **Compatibilité React 19** (ton projet utilise React 19.2.6) :
> - `react-quill` (l'ancien) **plante** sur React 19 → utilise **`react-quill-new`** (le fork compatible).
> - TinyMCE React v6 supporte React 19 ✅.

> 💡 **GLPI stocke le `content` d'un ticket en HTML.** Donc un éditeur riche (Quill/TinyMCE) qui produit du HTML est parfait. Un `<textarea>` produit du texte brut (suffisant si tu n'as pas besoin de formatage).

## Table des matières

1. [Option A — Textarea simple (0 librairie)](#option-a--textarea-simple-0-librairie)
2. [Option B — React Quill (facile, recommandé)](#option-b--react-quill-facile-recommandé)
3. [Option C — TinyMCE self-hosted (complet)](#option-c--tinymce-self-hosted-complet)
4. [Afficher le HTML sauvegardé (lecture)](#afficher-le-html-sauvegardé-lecture)
5. [Quelle option choisir ?](#quelle-option-choisir-)

---

## Option A — Textarea simple (0 librairie)

Aucune installation. Texte brut. Parfait si tu n'as pas besoin de gras/listes.

### DescriptionTextarea.jsx
```javascript
import { useState } from "react";

export default function DescriptionTextarea() {
    const [description, setDescription] = useState("");
    const maxLength = 500;

    return (
        <div className="description-field">
            <label htmlFor="description">Description</label>

            <textarea
                id="description"
                className="description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décris ton problème ici..."
                maxLength={maxLength}
                rows={5}
            />

            {/* Compteur de caractères */}
            <div className="description-counter">
                {description.length} / {maxLength}
            </div>
        </div>
    );
}
```

### DescriptionTextarea.css
```css
.description-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.description-field label {
    font-weight: 500;
    color: #333;
    font-size: 14px;
}

.description-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;          /* l'utilisateur peut agrandir verticalement */
    min-height: 100px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.description-textarea:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.description-counter {
    align-self: flex-end;
    font-size: 12px;
    color: #999;
}
```

### Bonus : textarea qui s'agrandit tout seul (auto-resize)
```javascript
import { useState } from "react";

export default function AutoResizeTextarea() {
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);
        // Ajuste la hauteur au contenu
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    return (
        <textarea
            className="description-textarea"
            value={value}
            onChange={handleChange}
            placeholder="Ça grandit en écrivant..."
            rows={3}
        />
    );
}
```

---

## Option B — React Quill (facile, recommandé)

Éditeur riche simple : gras, italique, listes, liens. Produit du **HTML**.

### 1. Installation
```bash
npm install react-quill-new
```

> ⚠️ **`react-quill-new`** (PAS `react-quill`) car ton projet est en React 19. Le package s'importe quand même comme `react-quill-new`.

### 2. DescriptionEditor.jsx
```javascript
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";   // le thème "snow" (barre d'outils claire)
import "./DescriptionEditor.css";

export default function DescriptionEditor() {
    const [content, setContent] = useState("");   // content = du HTML

    // Quels boutons afficher dans la barre d'outils
    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],   // bouton "effacer le formatage"
        ],
    };

    return (
        <div className="description-field">
            <label>Description</label>

            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Décris ton problème..."
            />

            {/* Aperçu du HTML produit (pour comprendre) */}
            <details className="description-debug">
                <summary>Voir le HTML produit</summary>
                <pre>{content}</pre>
            </details>
        </div>
    );
}
```

### 3. DescriptionEditor.css
```css
.description-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.description-field label {
    font-weight: 500;
    color: #333;
    font-size: 14px;
}

/* La zone d'écriture */
.description-field .ql-container {
    min-height: 150px;
    font-size: 14px;
    border-radius: 0 0 6px 6px;
}

/* La barre d'outils */
.description-field .ql-toolbar {
    border-radius: 6px 6px 0 0;
}

.description-debug {
    font-size: 12px;
    color: #999;
}

.description-debug pre {
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
}
```

### 4. Brancher dans ton formulaire de ticket (GLPI)
```javascript
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Ticket from "../../backend/model/Ticket";

export default function CreateTicketForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");   // HTML

    const handleSubmit = async () => {
        const ticket = new Ticket({
            name: title,
            content: content,   // ← le HTML de Quill va direct dans GLPI
        });
        await ticket.save();
        console.log("Ticket créé avec description HTML");
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
            />

            <ReactQuill theme="snow" value={content} onChange={setContent} />

            <button type="submit">Créer le ticket</button>
        </form>
    );
}
```

> ✅ `content` contient déjà du HTML genre `<p>Le PC ne <strong>démarre pas</strong></p>`. Tu le mets tel quel dans `ticket.content` — GLPI l'accepte.

---

## Option C — TinyMCE self-hosted (complet)

Le vrai TinyMCE, **en local, SANS clé API**. Plus lourd mais très complet (tableaux, images, etc.).

### 1. Installation
```bash
npm install tinymce @tinymce/tinymce-react
```

### 2. DescriptionTinyMCE.jsx
```javascript
import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

// Imports pour le mode SELF-HOSTED (pas de clé API, tout en local)
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.css";
// Plugins qu'on veut utiliser
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/autoresize";

export default function DescriptionTinyMCE() {
    const [content, setContent] = useState("");   // HTML

    return (
        <div className="description-field">
            <label>Description</label>

            <Editor
                // licenseKey="gpl" = mode open-source self-hosted, pas de clé API
                licenseKey="gpl"
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: ["lists", "link", "autoresize"],
                    toolbar: "bold italic underline | bullist numlist | link | removeformat",
                    skin: false,         // on a déjà importé le skin CSS au-dessus
                    content_css: false,
                }}
            />
        </div>
    );
}
```

> ⚠️ **`licenseKey="gpl"`** + les imports `import "tinymce/..."` = mode self-hosted gratuit, **aucune clé API, aucun appel réseau**. Si tu mets `apiKey="..."` à la place, là tu utilises le cloud (CDN).

### 3. Brancher dans GLPI

Identique à Quill : `content` est du HTML, tu le mets dans `ticket.content`.

```javascript
const handleSubmit = async () => {
    const ticket = new Ticket({ name: title, content: content });
    await ticket.save();
};
```

### ⚠️ Si Vite affiche une erreur d'import sur les skins
Ajoute ça dans `vite.config.js` pour autoriser les fichiers CSS de TinyMCE :
```javascript
// vite.config.js
export default defineConfig({
    // ...
    optimizeDeps: {
        include: ["tinymce/tinymce"],
    },
});
```

---

## Afficher le HTML sauvegardé (lecture)

Quand tu **relis** un ticket, son `content` est du HTML. Pour l'afficher formaté (pas comme du texte brut avec les balises visibles), utilise `dangerouslySetInnerHTML`.

### TicketDescription.jsx
```javascript
export default function TicketDescription({ html }) {
    return (
        <div
            className="ticket-description-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
```

**Usage :**
```javascript
<TicketDescription html={ticket.content} />
```

> ⚠️ **`dangerouslySetInnerHTML` = afficher du HTML brut.** C'est "dangereux" car si le HTML vient d'une source non fiable, il pourrait contenir du code malveillant (XSS). Pour du contenu venant de **tes propres utilisateurs connectés** (comme GLPI), c'est généralement OK. Pour plus de sécurité, nettoie le HTML avec **DOMPurify** :

```bash
npm install dompurify
```

```javascript
import DOMPurify from "dompurify";

export default function TicketDescription({ html }) {
    const clean = DOMPurify.sanitize(html);   // enlève le code dangereux
    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

---

## Quelle option choisir ?

| Tu veux... | Option | Installation | Sortie |
|------------|--------|--------------|--------|
| Juste du texte, simple | **A — Textarea** | Rien | Texte brut |
| Gras/listes/liens, facile | **B — React Quill** | `npm i react-quill-new` | HTML |
| Éditeur complet type Word | **C — TinyMCE** | `npm i tinymce @tinymce/tinymce-react` | HTML |

✅ **Mon conseil pour ton projet GLPI :**
- Si la description peut rester simple → **Option A** (textarea), tu l'as déjà.
- Si tu veux du formatage sans te compliquer → **Option B (React Quill)**. C'est le meilleur rapport simplicité/fonctionnalités, et `react-quill-new` règle le souci React 19.
- TinyMCE seulement si tu as besoin de tableaux/images dans la description.

---

## Récapitulatif des points clés

1. **TinyMCE n'est pas un appel API** — c'est une librairie JS. Self-hosted = 100% local, sans clé.
2. **React 19 →** utilise `react-quill-new`, pas `react-quill`.
3. **GLPI stocke `content` en HTML** → Quill et TinyMCE collent parfaitement (ils produisent du HTML).
4. **Pour afficher** le HTML → `dangerouslySetInnerHTML` (+ DOMPurify pour la sécurité).
5. **Un textarea suffit** si tu n'as pas besoin de formatage — ne te complique pas pour rien.
