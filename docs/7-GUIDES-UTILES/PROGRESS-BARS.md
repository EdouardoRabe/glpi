# Guide Barres de Progression en React

Ce guide fournit des exemples **directement utilisables** — copie le code React + CSS ensemble, c'est prêt à marcher!

## Table des matières

1. [Barre Simple](#barre-simple)
2. [Barre avec Bouton](#barre-avec-bouton)
3. [Chargement en Boucle (Indéterminé)](#chargement-en-boucle-indéterminé)
4. [Animations Multiples](#animations-multiples)
5. [Barre Animée Automatique](#barre-animée-automatique)
6. [Cas d'usage Réels](#cas-dusage-réels)

---

## Barre Simple

### ProgressBar.jsx
```javascript
export default function ProgressBar({ value = 0, max = 100 }) {
    const percentage = (value / max) * 100;
    
    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
        </div>
    );
}
```

### ProgressBar.css
```css
.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #000;
    transition: width 0.3s ease;
    border-radius: 3px;
}
```

**Usage:**
```javascript
<ProgressBar value={70} max={100} />
```

---

## Barre avec Bouton

### ProgressWithButton.jsx
```javascript
import { useState } from 'react';

export default function ProgressWithButton() {
    const [progress, setProgress] = useState(0);

    const handleClick = () => {
        if (progress < 100) {
            setProgress(progress + 10);
        }
    };

    const handleReset = () => {
        setProgress(0);
    };

    return (
        <div className="progress-wrapper">
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}%</p>
            <div className="progress-buttons">
                <button onClick={handleClick} disabled={progress >= 100}>Avancer (+10%)</button>
                <button onClick={handleReset} className="secondary">Réinitialiser</button>
            </div>
        </div>
    );
}
```

### ProgressWithButton.css
```css
.progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #000;
    transition: width 0.3s ease;
    border-radius: 3px;
}

.progress-text {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}

.progress-buttons {
    display: flex;
    gap: 0.5rem;
}

button {
    padding: 0.5rem 1rem;
    background-color: #000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 0.2s;
}

button:hover:not(:disabled) {
    background-color: #333;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

button.secondary {
    background-color: #999;
}

button.secondary:hover:not(:disabled) {
    background-color: #666;
}
```

---

## Chargement en Boucle (Indéterminé)

### LoadingBar.jsx
```javascript
export default function LoadingBar() {
    return (
        <div className="loading-wrapper">
            <p className="loading-label">Chargement en cours...</p>
            <div className="progress-container">
                <div className="progress-bar-infinite"></div>
            </div>
        </div>
    );
}
```

### LoadingBar.css
```css
.loading-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar-infinite {
    position: absolute;
    width: 30%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #000, transparent);
    animation: slideInfinite 1.5s infinite;
}

@keyframes slideInfinite {
    0% { left: -30%; }
    100% { left: 100%; }
}

.loading-label {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}
```

---

## Animations Multiples

### MultipleLoadingBars.jsx
```javascript
export default function MultipleLoadingBars() {
    return (
        <div className="loading-container">
            <div className="loading-item">
                <h3>Glissement</h3>
                <div className="progress-container">
                    <div className="progress-bar-slide"></div>
                </div>
            </div>

            <div className="loading-item">
                <h3>Pulsation</h3>
                <div className="progress-container">
                    <div className="progress-bar-pulse"></div>
                </div>
            </div>

            <div className="loading-item">
                <h3>Boucle</h3>
                <div className="progress-container">
                    <div className="progress-bar-loop"></div>
                </div>
            </div>
        </div>
    );
}
```

### MultipleLoadingBars.css
```css
.loading-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.loading-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.loading-item h3 {
    margin: 0;
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

/* Style 1: Glissement */
.progress-bar-slide {
    position: absolute;
    width: 30%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #000, transparent);
    animation: slide 1.5s infinite;
}

@keyframes slide {
    0% { left: -30%; }
    100% { left: 100%; }
}

/* Style 2: Pulsation */
.progress-bar-pulse {
    width: 100%;
    height: 100%;
    background: #000;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
}

/* Style 3: Barre en boucle */
.progress-bar-loop {
    position: absolute;
    width: 40%;
    height: 100%;
    background: #000;
    animation: loop 2s infinite;
}

@keyframes loop {
    0% { left: -40%; }
    100% { left: 100%; }
}
```

---

## Barre Animée Automatique

### AutoProgressBar.jsx
```javascript
import { useState, useEffect } from 'react';

export default function AutoProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 30;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="auto-progress-wrapper">
            <p className="progress-label">Progression automatique</p>
            <div className="progress-container">
                <div className="progress-bar progress-bar-animated" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="progress-text">{Math.min(Math.round(progress), 100)}%</p>
        </div>
    );
}
```

### AutoProgressBar.css
```css
.auto-progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.progress-label {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #000, #333);
    transition: width 0.3s ease;
    border-radius: 4px;
}

.progress-bar-animated {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.progress-text {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}
```

---

## Cas d'usage Réels

### 1. Upload de Fichier

#### FileUploadProgress.jsx
```javascript
import { useState } from 'react';

export default function FileUploadProgress() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 25;
            });
        }, 200);

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/express/import', {
                method: 'POST',
                body: formData,
            });

            setProgress(100);
            console.log('Upload réussi');
        } catch (error) {
            console.error('Upload échoué:', error);
            setProgress(0);
        } finally {
            setIsLoading(false);
            setTimeout(() => setFileName(''), 3000);
        }
    };

    return (
        <div className="upload-wrapper">
            <input 
                type="file" 
                onChange={handleFileUpload}
                disabled={isLoading}
                className="file-input"
            />
            
            {isLoading && (
                <div className="upload-progress">
                    <p className="upload-file-name">{fileName}</p>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="progress-text">{Math.round(progress)}%</p>
                </div>
            )}
        </div>
    );
}
```

#### FileUploadProgress.css
```css
.upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.file-input {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.file-input:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.upload-progress {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.upload-file-name {
    font-size: 13px;
    color: #666;
    margin: 0;
    font-weight: 500;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #000;
    transition: width 0.3s ease;
    border-radius: 3px;
}

.progress-text {
    font-size: 13px;
    color: #666;
    margin: 0;
}
```

### 2. Chargement de Données

#### DataLoadingBar.jsx
```javascript
import { useState, useEffect } from 'react';

export default function DataLoadingBar() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        setProgress(10);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90;
                return prev + Math.random() * 20;
            });
        }, 300);

        const loadData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                setProgress(100);
                setTimeout(() => {
                    setIsLoading(false);
                    setIsDone(true);
                }, 500);
            } catch (error) {
                console.error('Erreur:', error);
                setIsLoading(false);
            }
        };

        loadData();
        return () => clearInterval(interval);
    }, []);

    if (isDone && !isLoading) {
        return (
            <div className="success-container">
                <p className="success-message">✅ Données chargées avec succès!</p>
            </div>
        );
    }

    return (
        <div className="data-loading-wrapper">
            {isLoading && <p className="loading-text">Chargement en cours...</p>}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(progress)}%</p>
        </div>
    );
}
```

#### DataLoadingBar.css
```css
.data-loading-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.loading-text {
    font-size: 14px;
    color: #666;
    margin: 0;
    font-weight: 500;
}

.progress-container {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #000;
    transition: width 0.3s ease;
    border-radius: 3px;
}

.progress-text {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.success-container {
    margin: 1rem 0;
    padding: 1rem;
    background: #f0fdf4;
    border-radius: 8px;
}

.success-message {
    color: #22c55e;
    font-weight: 600;
    margin: 0;
    font-size: 14px;
}
```

---

## Résumé

Chaque exemple est **copy-paste prêt** — le JSX et le CSS sont ensemble!

| Composant | Utilité | Type |
|-----------|---------|------|
| **ProgressBar** | Barre simple statique | Déterminé |
| **ProgressWithButton** | Barre interactive avec boutons | Déterminé + Contrôle |
| **LoadingBar** | Chargement indéfini simple | Indéterminé |
| **MultipleLoadingBars** | 3 animations différentes | Indéterminé |
| **AutoProgressBar** | Progression automatique aléatoire | Déterminé auto |
| **FileUploadProgress** | Upload avec barre de progression | Déterminé + API |
| **DataLoadingBar** | Chargement API avec message success | Déterminé + API |

✅ **Comment utiliser:** Copie le JSX + le CSS correspondant dans tes fichiers!
