# Guide Barres de Progression & Spinners en React

> 🔎 **Mots-clés de recherche :** barre de progression, progress bar, loading, chargement, spinner, rond qui tourne, cercle, trois points, three dots, points qui tournent, loader, animation chargement, indéterminé

Ce guide fournit des exemples **directement utilisables** — copie le code React + CSS ensemble, c'est prêt à marcher!

## Table des matières

1. [Barre Simple](#barre-simple)
2. [Barre avec Bouton](#barre-avec-bouton)
3. [Chargement en Boucle (Indéterminé)](#chargement-en-boucle-indéterminé)
4. [Animations Multiples](#animations-multiples)
5. [Spinners Circulaires (rond qui tourne, trois points)](#spinners-circulaires-rond-qui-tourne-trois-points)
6. [Barre Animée Automatique](#barre-animée-automatique)
7. [Cas d'usage Réels](#cas-dusage-réels)

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

## Spinners Circulaires (rond qui tourne, trois points)

Les **spinners** servent quand tu ne connais pas la durée (chargement de données, attente API). Pas de pourcentage, juste une animation en boucle.

### 1. Rond qui tourne (le classique)

#### Spinner.jsx
```javascript
export default function Spinner() {
    return <div className="spinner"></div>;
}
```

#### Spinner.css
```css
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;       /* l'anneau gris */
    border-top-color: #000;          /* la partie noire qui tourne */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

> 💡 Le secret : un cercle avec une bordure grise, mais **un seul côté en noir** (`border-top-color`). Quand on le fait tourner, seul le bout noir bouge → effet de rotation.

---

### 2. Trois points qui rebondissent

#### DotsLoader.jsx
```javascript
export default function DotsLoader() {
    return (
        <div className="dots-loader">
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}
```

#### DotsLoader.css
```css
.dots-loader {
    display: flex;
    gap: 8px;
    align-items: center;
}

.dots-loader span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #000;
    animation: dot-bounce 1.4s infinite ease-in-out both;
}

/* Décalage pour que les points rebondissent l'un après l'autre */
.dots-loader span:nth-child(1) { animation-delay: -0.32s; }
.dots-loader span:nth-child(2) { animation-delay: -0.16s; }
.dots-loader span:nth-child(3) { animation-delay: 0s; }

@keyframes dot-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}
```

> 💡 Les `animation-delay` négatifs décalent chaque point dans le temps → l'effet de vague.

---

### 3. Trois points qui tournent en rond

C'est ce que tu décrivais : des points disposés en triangle qui **tournent autour du centre**.

#### OrbitLoader.jsx
```javascript
export default function OrbitLoader() {
    return (
        <div className="orbit-loader">
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}
```

#### OrbitLoader.css
```css
.orbit-loader {
    position: relative;
    width: 40px;
    height: 40px;
    animation: spin 1.2s linear infinite;   /* tout le groupe tourne */
}

.orbit-loader span {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #000;
}

/* Les 3 points placés en triangle */
.orbit-loader span:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.orbit-loader span:nth-child(2) { bottom: 0; left: 0; }
.orbit-loader span:nth-child(3) { bottom: 0; right: 0; }

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

---

### 4. Spinner avec texte (cas réel)

Le plus utile : un rond qui tourne + un message, centré.

#### LoadingSpinner.jsx
```javascript
export default function LoadingSpinner({ message = "Chargement..." }) {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-spinner-text">{message}</p>
        </div>
    );
}
```

#### LoadingSpinner.css
```css
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-spinner-text {
    margin: 0;
    font-size: 14px;
    color: #666;
    font-weight: 500;
}
```

**Usage (pendant un chargement de données) :**
```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import LoadingSpinner from "./LoadingSpinner";

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                setTickets(await Ticket.getAll());
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <LoadingSpinner message="Chargement des tickets..." />;

    return (
        <div>
            {tickets.map((t) => <p key={t.id}>{t.name}</p>)}
        </div>
    );
}
```

---

### 5. Spinner plein écran (overlay)

Pour bloquer toute la page pendant une action importante (sauvegarde, etc.).

#### FullScreenLoader.jsx
```javascript
export default function FullScreenLoader({ message = "Veuillez patienter..." }) {
    return (
        <div className="fullscreen-loader">
            <div className="fullscreen-loader-box">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
}
```

#### FullScreenLoader.css
```css
.fullscreen-loader {
    position: fixed;
    inset: 0;                                  /* couvre tout l'écran */
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.fullscreen-loader-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 2rem 3rem;
    border-radius: 8px;
}

.fullscreen-loader-box p {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

**Usage :**
```javascript
{isSaving && <FullScreenLoader message="Sauvegarde en cours..." />}
```

> 💡 **Régler la vitesse :** change la durée dans `animation: spin 0.8s ...`. Plus petit = plus rapide (ex: `0.5s`), plus grand = plus lent (ex: `1.5s`).

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
| **Spinner** | Rond qui tourne (le classique) | Indéterminé |
| **DotsLoader** | Trois points qui rebondissent | Indéterminé |
| **OrbitLoader** | Trois points qui tournent en rond | Indéterminé |
| **LoadingSpinner** | Rond + texte, centré (cas réel) | Indéterminé |
| **FullScreenLoader** | Spinner plein écran (overlay) | Indéterminé |
| **AutoProgressBar** | Progression automatique aléatoire | Déterminé auto |
| **FileUploadProgress** | Upload avec barre de progression | Déterminé + API |
| **DataLoadingBar** | Chargement API avec message success | Déterminé + API |

> 🔑 **Barre vs Spinner :** utilise une **barre** quand tu connais l'avancement (upload, %), un **spinner** quand tu ne sais pas combien de temps ça prend (attente API).

✅ **Comment utiliser:** Copie le JSX + le CSS correspondant dans tes fichiers!
