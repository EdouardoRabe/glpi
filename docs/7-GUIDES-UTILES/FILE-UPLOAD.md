# Guide File Upload & Preview

Explique comment implémenter l'upload de fichiers, l'aperçu avant envoi, et la gestion des fichiers en React.

## 🎯 Cas d'usage réels dans ton projet

| Cas | Où | Exemple |
|-----|-----|---------|
| **Upload CSV** | BOImport.jsx | Charger 3 fichiers CSV + 1 ZIP |
| **Validation fichiers** | BOImport.jsx | Vérifier format .csv/.zip avant upload |
| **Multiple files** | BOImport.jsx | Upload simultané de 4 fichiers différents |
| **Drag & drop** | BOImport.jsx | Glisser les fichiers au lieu de cliquer |
| **Preview** | Asset upload (futur) | Aperçu de l'image avant envoi |

**Exemple adapté BOImport:** Tu as déjà la structure! Ajoute juste la validation (taille, format) et le drag & drop. Remplace `files` par `[file1, file2, file3, file4]` - c'est la même logique!

## Table des matières

1. [Upload simple](#upload-simple)
2. [Aperçu (preview)](#aperçu-preview)
3. [Upload avec drag & drop](#upload-avec-drag--drop)
4. [Validation de fichiers](#validation-de-fichiers)
5. [Multiple files](#multiple-files)
6. [Exemples complets](#exemples-complets)

---

## Upload simple

### Input de fichier basique

```javascript
import { useState } from "react"

export default function SimpleUpload() {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      console.log("Fichier uploadé:", result)
    } catch (error) {
      console.error("Erreur upload:", error)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      {file && <p>Fichier sélectionné: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file}>
        Uploader
      </button>
    </div>
  )
}
```

### Avec état de loading

```javascript
const [file, setFile] = useState(null)
const [loading, setLoading] = useState(false)
const [success, setSuccess] = useState(false)

const handleUpload = async () => {
  if (!file) return

  setLoading(true)
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const result = await response.json()
    setSuccess(true)
    setFile(null)
    
    setTimeout(() => setSuccess(false), 3000)
  } catch (error) {
    console.error("Erreur:", error)
  } finally {
    setLoading(false)
  }
}

return (
  <div>
    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    {success && <p className="success">✓ Fichier uploadé!</p>}
    <button onClick={handleUpload} disabled={!file || loading}>
      {loading ? "Chargement..." : "Uploader"}
    </button>
  </div>
)
```

---

## Aperçu (preview)

### Aperçu d'image

```javascript
import { useState } from "react"

export default function ImagePreview() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    // Créer un aperçu
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />

      {preview && (
        <div className="preview">
          <img src={preview} alt="Aperçu" style={{ maxWidth: "200px" }} />
          <p>{file.name}</p>
          <p>Taille: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  )
}
```

### Aperçu de PDF

```javascript
const [file, setFile] = useState(null)
const [fileInfo, setFileInfo] = useState(null)

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0]
  setFile(selectedFile)

  if (selectedFile) {
    setFileInfo({
      name: selectedFile.name,
      size: (selectedFile.size / 1024 / 1024).toFixed(2), // MB
      type: selectedFile.type,
      lastModified: new Date(selectedFile.lastModified).toLocaleDateString(),
    })
  }
}

return (
  <div>
    <input type="file" onChange={handleFileChange} accept=".pdf" />
    
    {fileInfo && (
      <div className="file-info">
        <p><strong>Nom:</strong> {fileInfo.name}</p>
        <p><strong>Taille:</strong> {fileInfo.size} MB</p>
        <p><strong>Type:</strong> {fileInfo.type}</p>
        <p><strong>Date:</strong> {fileInfo.lastModified}</p>
      </div>
    )}
  </div>
)
```

---

## Upload avec drag & drop

### Drag & Drop simple

```javascript
import { useState } from "react"

export default function DragDropUpload() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)
  }

  return (
    <div
      className={`drop-zone ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <p>✓ {file.name}</p>
      ) : (
        <>
          <p>Glissez votre fichier ici</p>
          <p>ou</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input" className="link">
            cliquez pour sélectionner
          </label>
        </>
      )}
    </div>
  )
}
```

### CSS pour drag & drop

```css
.drop-zone {
  border: 2px dashed #999;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9f9f9;
}

.drop-zone:hover {
  border-color: #000;
  background-color: #f5f5f5;
}

.drop-zone.dragging {
  border-color: #000;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.drop-zone p {
  margin: 0.5rem 0;
  color: #666;
}

.drop-zone .link {
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
```

---

## Validation de fichiers

### Validation type et taille

```javascript
const [file, setFile] = useState(null)
const [error, setError] = useState("")

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0]
  setError("")

  if (!selectedFile) return

  // Vérifier le type
  if (!ALLOWED_TYPES.includes(selectedFile.type)) {
    setError("Type de fichier non autorisé. Utilisez JPG, PNG ou GIF.")
    return
  }

  // Vérifier la taille
  if (selectedFile.size > MAX_SIZE) {
    setError("Le fichier dépasse 5MB.")
    return
  }

  setFile(selectedFile)
}

return (
  <div>
    <input type="file" onChange={handleFileChange} />
    {error && <p className="error">{error}</p>}
    {file && <p className="success">✓ Fichier valide</p>}
  </div>
)
```

### Validation dimensions d'image

```javascript
const validateImageDimensions = (file, minWidth, minHeight) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const isValid =
          img.width >= minWidth && img.height >= minHeight
        resolve({
          valid: isValid,
          width: img.width,
          height: img.height,
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0]

  if (selectedFile) {
    const result = await validateImageDimensions(selectedFile, 800, 600)
    if (!result.valid) {
      setError(
        `Image trop petite. Min: 800x600, Actuel: ${result.width}x${result.height}`
      )
    } else {
      setFile(selectedFile)
      setError("")
    }
  }
}
```

---

## Multiple files

### Upload plusieurs fichiers

```javascript
import { useState } from "react"

export default function MultipleFileUpload() {
  const [files, setFiles] = useState([])

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch("/api/upload-multiple", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      console.log("Fichiers uploadés:", result)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*"
      />

      <div className="files-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.name}</span>
            <button onClick={() => handleRemoveFile(index)}>✕</button>
          </div>
        ))}
      </div>

      <button onClick={handleUpload} disabled={files.length === 0}>
        Uploader {files.length} fichier(s)
      </button>
    </div>
  )
}
```

### CSS pour la liste de fichiers

```css
.files-list {
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
}

.file-item button:hover {
  color: #c82333;
}
```

---

## Exemples complets

### Image upload avec aperçu et validation

```javascript
import { useState } from "react"

export default function ImageUploadComplete() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"]

  const validateAndSetFile = (selectedFile) => {
    setError("")

    if (!selectedFile) return

    // Vérifier le type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Format non accepté. Utilisez JPG, PNG ou GIF.")
      return
    }

    // Vérifier la taille
    if (selectedFile.size > MAX_SIZE) {
      setError("Fichier trop volumineux. Max 5MB.")
      return
    }

    setFile(selectedFile)

    // Créer l'aperçu
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    validateAndSetFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      console.log("Image uploadée:", result)
      
      // Réinitialiser
      setFile(null)
      setPreview(null)
      alert("Image uploadée avec succès!")
    } catch (error) {
      setError("Erreur lors de l'upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-upload">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          id="image-input"
          style={{ display: "none" }}
        />
        <label htmlFor="image-input" className="drop-label">
          {preview ? "✓ Image sélectionnée" : "Glissez une image ou cliquez"}
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Aperçu" />
          <p>{file.name}</p>
          <p>{(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Chargement..." : "Uploader l'image"}
      </button>
    </div>
  )
}
```

### CSS complet pour upload

```css
.image-upload {
  max-width: 500px;
  margin: 2rem auto;
}

.drop-zone {
  border: 2px dashed #999;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9f9f9;
  margin-bottom: 1rem;
}

.drop-zone:hover {
  border-color: #000;
  background-color: #f5f5f5;
}

.drop-zone.dragging {
  border-color: #000;
  background-color: #e8f5ff;
}

.drop-label {
  display: block;
  cursor: pointer;
  font-weight: 500;
}

.preview-container {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.preview-container img {
  max-width: 100%;
  max-height: 300px;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.preview-container p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 14px;
}

.error {
  color: #dc3545;
  padding: 0.75rem;
  background-color: #fef5f5;
  border: 1px solid #dc3545;
  border-radius: 4px;
  margin-bottom: 1rem;
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Valider type et taille
- Montrer un aperçu
- Afficher état de loading
- Supporter drag & drop
- Afficher les erreurs clairement

❌ **À éviter:**
- Accepter tous les fichiers sans validation
- Uploader immédiatement sans confirmation
- Pas de feedback utilisateur
- Limites de taille trop grandes

---

Besoin d'aide pour adapter à ton projet? 👍
