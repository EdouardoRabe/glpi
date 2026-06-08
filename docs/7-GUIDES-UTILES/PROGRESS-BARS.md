# Guide Barres de Progression en React

Ce guide explique comment créer des barres de progression avec des animations, des chargements en boucle et des états d'avancement.

## Table des matières

1. [Barre Simple](#barre-simple)
2. [Barre avec Pourcentage](#barre-avec-pourcentage)
3. [Chargement en Boucle (Indéterminé)](#chargement-en-boucle-indéterminé)
4. [Barre Animée](#barre-animée)
5. [Cas d'usage Réels](#cas-dusage-réels)
6. [CSS Styling](#css-styling)

---

## Barre Simple

### HTML Native
```html
<progress value="70" max="100"></progress>
```

### React Composant
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

---

## Barre avec Pourcentage

```javascript
import { useState } from 'react';

export default function ProgressWithPercent() {
    const [progress, setProgress] = useState(0);

    const handleClick = () => {
        if (progress < 100) {
            setProgress(progress + 10);
        }
    };

    return (
        <div className="progress-wrapper">
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}%</p>
            <button onClick={handleClick}>Avancer</button>
        </div>
    );
}
```

---

## Chargement en Boucle (Indéterminé)

### Style simple (sans animation)
```javascript
export default function LoadingBar() {
    return (
        <div className="progress-container">
            <div className="progress-bar progress-bar-infinite"></div>
        </div>
    );
}
```

### Avec animation CSS
```css
.progress-bar-infinite {
    width: 30%;
    height: 4px;
    background: linear-gradient(
        90deg,
        transparent,
        #000,
        transparent
    );
    animation: slideInfinite 1.5s infinite;
}

@keyframes slideInfinite {
    0% {
        left: -30%;
    }
    100% {
        left: 100%;
    }
}
```

### Avec animation en boucle (plusieurs styles)
```javascript
export default function AnimatedLoading() {
    return (
        <div className="loading-container">
            {/* Style 1: Glissement */}
            <div className="progress-wrapper">
                <h3>Chargement...</h3>
                <div className="progress-container">
                    <div className="progress-bar-slide"></div>
                </div>
            </div>

            {/* Style 2: Pulsation */}
            <div className="progress-wrapper">
                <h3>Traitement en cours...</h3>
                <div className="progress-container">
                    <div className="progress-bar-pulse"></div>
                </div>
            </div>

            {/* Style 3: Barre en boucle */}
            <div className="progress-wrapper">
                <h3>Synchronisation...</h3>
                <div className="progress-container">
                    <div className="progress-bar-loop"></div>
                </div>
            </div>
        </div>
    );
}
```

### CSS pour animations en boucle
```css
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

.progress-bar-loop {
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

## Barre Animée

### Progression Automatique
```javascript
import { useState, useEffect } from 'react';

export default function AutoProgressBar({ duration = 3000 }) {
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
        <div className="progress-wrapper">
            <div className="progress-container">
                <div className="progress-bar progress-bar-animated" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="progress-text">{Math.min(Math.round(progress), 100)}%</p>
        </div>
    );
}
```

### Progression avec Timer
```javascript
import { useState, useEffect } from 'react';

export default function TimerProgressBar({ totalTime = 10 }) {
    const [elapsed, setElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setElapsed(prev => {
                if (prev >= totalTime) {
                    setIsRunning(false);
                    return totalTime;
                }
                return prev + 0.1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [isRunning, totalTime]);

    const percentage = (elapsed / totalTime) * 100;
    const remainingTime = (totalTime - elapsed).toFixed(1);

    return (
        <div className="progress-wrapper">
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="progress-text">{remainingTime}s / {totalTime}s</p>
            <button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? 'Pause' : 'Reprendre'}
            </button>
        </div>
    );
}
```

---

## Cas d'usage Réels

### 1. Import de Fichier
```javascript
import { useState } from 'react';

export default function FileUploadProgress() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setProgress(0);

        // Simuler l'upload
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
            // Vrai upload
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/express/import', {
                method: 'POST',
                body: formData,
            });

            setProgress(100);
            console.log('Upload réussi:', response);
        } catch (error) {
            console.error('Upload échoué:', error);
            setProgress(0);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input 
                type="file" 
                onChange={handleFileUpload}
                disabled={isLoading}
            />
            
            {isLoading && (
                <div className="progress-wrapper">
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p>{Math.round(progress)}%</p>
                </div>
            )}
        </div>
    );
}
```

### 2. Chargement de Données
```javascript
import { useState, useEffect } from 'react';

export default function DataLoadingBar() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Commencer à 10% immédiatement
        setProgress(10);

        // Augmenter progressivement
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90;
                return prev + Math.random() * 20;
            });
        }, 300);

        // Charger les données
        const loadData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler API call
                setProgress(100);
                setTimeout(() => setIsLoading(false), 500);
            } catch (error) {
                console.error('Erreur:', error);
                setIsLoading(false);
            }
        };

        loadData();
        return () => clearInterval(interval);
    }, []);

    if (!isLoading && progress === 100) {
        return <p className="success-message">✅ Chargement terminé!</p>;
    }

    return (
        <div className="progress-wrapper">
            {isLoading && <p>Chargement en cours...</p>}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(progress)}%</p>
        </div>
    );
}
```

### 3. Chargement en Boucle (Indéfini)
```javascript
export default function IndeterminateLoading() {
    return (
        <div className="progress-wrapper">
            <p>Traitement en cours...</p>
            <div className="progress-container">
                <div className="progress-bar-infinite"></div>
            </div>
            <p className="loading-text">Veuillez patienter</p>
        </div>
    );
}
```

---

## CSS Styling

### Structure CSS complète
```css
.progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
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

.progress-bar-animated {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.progress-text {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.loading-text {
    font-size: 12px;
    color: #999;
    font-style: italic;
}

.success-message {
    color: #22c55e;
    font-weight: 600;
}

.progress-bar-infinite {
    position: absolute;
    width: 30%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #000, transparent);
    animation: slideInfinite 1.5s infinite;
}

@keyframes slideInfinite {
    0% {
        left: -30%;
    }
    100% {
        left: 100%;
    }
}
```

---

## Résumé

| Type | Cas d'usage | Animation |
|------|-----------|-----------|
| **Déterminé** | Upload, import | width: percentage |
| **Indéterminé** | Chargement réseau | slideInfinite, pulse |
| **Avec Timer** | Comptage à rebours | width: percentage + time |
| **Auto-progression** | Chargement lent | Random increments |

👍 Choisis le type selon ton besoin!
