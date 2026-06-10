# Guide Carousel et Diaporamas

> 🔎 **Mots-clés de recherche :** carousel, carrousel, slider, diaporama, slideshow, galerie, gallery, slide, défilement, swipe, scroll horizontal, scroll-snap, auto-play, défilement auto, indicateurs, dots, points, flèches, image, banner, bannière

Tous les composants qui font **défiler du contenu** : un à la fois (carousel), plusieurs visibles (slider de cartes), ou un défilement libre. Copie le JSX **et** le CSS ensemble.

> 💡 **Tu connais "carousel" mais il y en a plusieurs !** Voici les noms :
> - **Carousel / Diaporama** = 1 slide à la fois, on change avec des flèches
> - **Slider de cartes** = plusieurs cartes visibles, on fait défiler
> - **Scroll horizontal** = défilement libre à la souris/doigt (le plus simple)
> - **Galerie** = grande image + miniatures en dessous

## Table des matières

1. [Carousel basique (1 slide à la fois)](#carousel-basique-1-slide-à-la-fois)
2. [Carousel avec indicateurs (dots)](#carousel-avec-indicateurs-dots)
3. [Carousel automatique (auto-play)](#carousel-automatique-auto-play)
4. [Slider de cartes (plusieurs visibles)](#slider-de-cartes-plusieurs-visibles)
5. [Scroll horizontal (le plus simple)](#scroll-horizontal-le-plus-simple)
6. [Galerie d'images (grande + miniatures)](#galerie-dimages-grande--miniatures)
7. [Quel composant choisir ?](#quel-composant-choisir-)

---

## Carousel basique (1 slide à la fois)

Le classique : une image/carte à la fois, on change avec les flèches ◀ ▶.

### Carousel.jsx
```javascript
import { useState } from "react";

export default function Carousel({ slides }) {
    const [current, setCurrent] = useState(0);

    const prev = () => {
        setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
    };

    const next = () => {
        setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
    };

    return (
        <div className="carousel">
            <button className="carousel-arrow left" onClick={prev}>◀</button>

            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="carousel-slide">
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-arrow right" onClick={next}>▶</button>
        </div>
    );
}
```

### Carousel.css
```css
.carousel {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.carousel-viewport {
    overflow: hidden;
    border-radius: 8px;
    flex: 1;
}

.carousel-track {
    display: flex;
    transition: transform 0.4s ease;
}

.carousel-slide {
    min-width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    font-size: 24px;
    color: #333;
}

.carousel-arrow {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #000;
    color: white;
    cursor: pointer;
    font-size: 14px;
    flex-shrink: 0;
    transition: background-color 0.2s;
}

.carousel-arrow:hover {
    background-color: #333;
}
```

**Usage :**
```javascript
<Carousel slides={[
    <img src="/photo1.jpg" alt="1" />,
    <img src="/photo2.jpg" alt="2" />,
    <div>N'importe quel contenu !</div>,
]} />
```

> 💡 Le secret : un `.carousel-track` (rangée horizontale) qu'on **décale** avec `translateX(-N%)`. Chaque slide fait `100%` de large, donc décaler de `-100%` montre le slide suivant.

---

## Carousel avec indicateurs (dots)

Ajoute des petits points en bas pour montrer où on est + cliquer pour y aller.

### CarouselDots.jsx
```javascript
import { useState } from "react";

export default function CarouselDots({ slides }) {
    const [current, setCurrent] = useState(0);

    const goTo = (index) => setCurrent(index);
    const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

    return (
        <div className="carousel-dots-wrapper">
            <div className="carousel">
                <button className="carousel-arrow left" onClick={prev}>◀</button>

                <div className="carousel-viewport">
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((slide, index) => (
                            <div key={index} className="carousel-slide">
                                {slide}
                            </div>
                        ))}
                    </div>
                </div>

                <button className="carousel-arrow right" onClick={next}>▶</button>
            </div>

            {/* Indicateurs */}
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${current === index ? "active" : ""}`}
                        onClick={() => goTo(index)}
                        aria-label={`Aller au slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
```

### CarouselDots.css
```css
/* (réutilise aussi le CSS de Carousel.css ci-dessus) */

.carousel-dots-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.carousel-dots {
    display: flex;
    gap: 0.5rem;
}

.carousel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background-color: #ccc;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
}

.carousel-dot:hover {
    background-color: #999;
}

.carousel-dot.active {
    background-color: #000;
    width: 24px;
    border-radius: 5px;
}
```

---

## Carousel automatique (auto-play)

Défile tout seul toutes les X secondes. S'arrête quand la souris est dessus.

### AutoCarousel.jsx
```javascript
import { useState, useEffect } from "react";

export default function AutoCarousel({ slides, interval = 3000 }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;

        const timer = setInterval(() => {
            setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
        }, interval);

        // Nettoyage : très important pour éviter les bugs
        return () => clearInterval(timer);
    }, [paused, interval, slides.length]);

    return (
        <div
            className="carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="carousel-slide">
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-dots auto">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${current === index ? "active" : ""}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
}
```

### AutoCarousel.css
```css
/* (réutilise Carousel.css + les .carousel-dot ci-dessus) */

.carousel {
    position: relative;
}

.carousel-dots.auto {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
}

.carousel-dots.auto .carousel-dot {
    background-color: rgba(255, 255, 255, 0.6);
}

.carousel-dots.auto .carousel-dot.active {
    background-color: white;
}
```

**Usage :**
```javascript
<AutoCarousel
    slides={[<img src="/a.jpg" />, <img src="/b.jpg" />]}
    interval={4000}
/>
```

> ⚠️ **Le `return () => clearInterval(timer)` est obligatoire !** Sans lui, le timer continue de tourner et tu auras plusieurs carousels qui défilent en même temps. Voir [GUIDE-USEEFFECT-PATTERNS.md](./GUIDE-USEEFFECT-PATTERNS.md).

---

## Slider de cartes (plusieurs visibles)

Au lieu d'1 slide, on voit **plusieurs cartes** et on défile d'une carte à la fois. Parfait pour une liste d'assets ou de produits.

### CardSlider.jsx
```javascript
import { useState } from "react";

export default function CardSlider({ cards, visibleCount = 3 }) {
    const [start, setStart] = useState(0);

    const maxStart = Math.max(0, cards.length - visibleCount);

    const prev = () => setStart((s) => Math.max(0, s - 1));
    const next = () => setStart((s) => Math.min(maxStart, s + 1));

    return (
        <div className="card-slider">
            <button className="carousel-arrow left" onClick={prev} disabled={start === 0}>◀</button>

            <div className="card-slider-viewport">
                <div
                    className="card-slider-track"
                    style={{ transform: `translateX(-${start * (100 / visibleCount)}%)` }}
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="card-slider-item"
                            style={{ minWidth: `${100 / visibleCount}%` }}
                        >
                            {card}
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-arrow right" onClick={next} disabled={start === maxStart}>▶</button>
        </div>
    );
}
```

### CardSlider.css
```css
.card-slider {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card-slider-viewport {
    overflow: hidden;
    flex: 1;
}

.card-slider-track {
    display: flex;
    transition: transform 0.4s ease;
}

.card-slider-item {
    padding: 0.5rem;
    box-sizing: border-box;
}

.carousel-arrow {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #000;
    color: white;
    cursor: pointer;
    font-size: 14px;
    flex-shrink: 0;
    transition: background-color 0.2s;
}

.carousel-arrow:hover:not(:disabled) {
    background-color: #333;
}

.carousel-arrow:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
```

**Usage :**
```javascript
<CardSlider
    visibleCount={3}
    cards={assets.map((asset) => (
        <div className="grid-card" key={asset.id}>
            <h4>{asset.name}</h4>
            <p>{asset.itemType}</p>
        </div>
    ))}
/>
```

---

## Scroll horizontal (le plus simple)

**Pas de JavaScript du tout !** Juste un défilement à la souris/doigt avec un effet "magnétique" (scroll-snap). C'est souvent la meilleure option : simple, fluide, tactile.

### HorizontalScroll.jsx
```javascript
export default function HorizontalScroll({ items }) {
    return (
        <div className="h-scroll">
            {items.map((item, index) => (
                <div key={index} className="h-scroll-item">
                    {item}
                </div>
            ))}
        </div>
    );
}
```

### HorizontalScroll.css
```css
.h-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
    scroll-snap-type: x mandatory;   /* effet magnétique */
    -webkit-overflow-scrolling: touch; /* fluide sur mobile */
}

.h-scroll-item {
    flex: 0 0 250px;   /* largeur fixe, ne rétrécit pas */
    scroll-snap-align: start;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
}

/* Barre de scroll discrète */
.h-scroll::-webkit-scrollbar {
    height: 6px;
}

.h-scroll::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
}

.h-scroll::-webkit-scrollbar-track {
    background-color: #f5f5f5;
}
```

**Usage :**
```javascript
<HorizontalScroll items={assets.map((a) => (
    <div key={a.id}>
        <h4>{a.name}</h4>
        <p>{a.itemType}</p>
    </div>
))} />
```

> 💡 **`scroll-snap-type: x mandatory`** = quand tu arrêtes de scroller, ça s'aligne automatiquement sur une carte. Effet pro sans aucune librairie.

---

## Galerie d'images (grande + miniatures)

Une grande image + des miniatures cliquables en dessous. Comme sur les sites e-commerce.

### Gallery.jsx
```javascript
import { useState } from "react";

export default function Gallery({ images }) {
    const [selected, setSelected] = useState(0);

    return (
        <div className="gallery">
            {/* Grande image */}
            <div className="gallery-main">
                <img src={images[selected]} alt={`Image ${selected + 1}`} />
            </div>

            {/* Miniatures */}
            <div className="gallery-thumbs">
                {images.map((img, index) => (
                    <button
                        key={index}
                        className={`gallery-thumb ${selected === index ? "active" : ""}`}
                        onClick={() => setSelected(index)}
                    >
                        <img src={img} alt={`Miniature ${index + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}
```

### Gallery.css
```css
.gallery {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
}

.gallery-main {
    width: 100%;
    height: 350px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
}

.gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gallery-thumbs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
}

.gallery-thumb {
    flex: 0 0 70px;
    height: 70px;
    border: 2px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: none;
    transition: border-color 0.2s;
}

.gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gallery-thumb.active {
    border-color: #000;
}

.gallery-thumb:hover {
    border-color: #999;
}
```

**Usage :**
```javascript
<Gallery images={[
    "/asset-photo-1.jpg",
    "/asset-photo-2.jpg",
    "/asset-photo-3.jpg",
]} />
```

---

## 🎯 Cas réels : brancher une vraie liste (tickets, assets)

> **LA question :** « Je dois créer mes `<div>` en boucle AVANT de passer au carousel ? »
> **Réponse : OUI.** Tu transformes ta liste de données en liste de JSX avec `.map()`, puis tu passes ce résultat au carousel. Voici les 2 façons de le faire.

### Façon 1 — `.map()` directement dans le JSX (la plus simple)

Tu fais le `.map()` au moment où tu passes la prop. C'est rapide et ça marche tout de suite.

```javascript
import { useEffect, useState } from "react";
import Ticket from "../../backend/model/Ticket";
import CardSlider from "./CardSlider";
import "./CardSlider.css";

export default function TicketsCarousel() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await Ticket.getAll();
            setTickets(data);
        };
        load();
    }, []);

    return (
        <CardSlider
            visibleCount={3}
            cards={tickets.map((ticket) => (    // ← la boucle est ICI
                <div key={ticket.id} className="ticket-card">
                    <h4>#{ticket.external_id}</h4>
                    <p>{ticket.name}</p>
                    <span>Priorité : {ticket.priority}</span>
                </div>
            ))}
        />
    );
}
```

> 💡 Le `cards={tickets.map(...)}` produit un **tableau de `<div>`**. C'est exactement ce que le carousel attend. Le `key={ticket.id}` reste obligatoire sur chaque div.

---

### Façon 2 — une variable avant le `return` (plus lisible)

Quand le contenu de la carte devient gros, sors le `.map()` dans une variable. Le `return` reste propre.

```javascript
export default function TicketsCarousel() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const load = async () => setTickets(await Ticket.getAll());
        load();
    }, []);

    // 1. On construit les cartes AVANT le return
    const ticketCards = tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-card">
            <h4>#{ticket.external_id}</h4>
            <p>{ticket.name}</p>
            <span>Priorité : {ticket.priority}</span>
        </div>
    ));

    // 2. On passe la variable au carousel
    return <CardSlider visibleCount={3} cards={ticketCards} />;
}
```

> ✅ **Façon 1 vs Façon 2 :** elles font exactement la même chose. Utilise la **Façon 2** dès que la carte fait plus de 3-4 lignes — c'est plus lisible.

---

### Façon 3 — le carousel reçoit les données brutes (le plus réutilisable)

Au lieu de passer du JSX, tu passes **les tickets directement** et le carousel s'occupe de l'affichage via une fonction `renderItem`. C'est le pattern le plus propre pour réutiliser partout.

#### CardSliderData.jsx (version améliorée)
```javascript
import { useState } from "react";

export default function CardSliderData({ items, renderItem, visibleCount = 3 }) {
    const [start, setStart] = useState(0);
    const maxStart = Math.max(0, items.length - visibleCount);

    const prev = () => setStart((s) => Math.max(0, s - 1));
    const next = () => setStart((s) => Math.min(maxStart, s + 1));

    return (
        <div className="card-slider">
            <button className="carousel-arrow left" onClick={prev} disabled={start === 0}>◀</button>

            <div className="card-slider-viewport">
                <div
                    className="card-slider-track"
                    style={{ transform: `translateX(-${start * (100 / visibleCount)}%)` }}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.id ?? index}
                            className="card-slider-item"
                            style={{ minWidth: `${100 / visibleCount}%` }}
                        >
                            {renderItem(item)}   {/* ← le carousel appelle ta fonction */}
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-arrow right" onClick={next} disabled={start === maxStart}>▶</button>
        </div>
    );
}
```

#### Usage avec des tickets
```javascript
<CardSliderData
    items={tickets}              // ← données brutes, PAS de .map() ici
    visibleCount={3}
    renderItem={(ticket) => (    // ← tu décris UNE carte, le carousel boucle
        <div className="ticket-card">
            <h4>#{ticket.external_id}</h4>
            <p>{ticket.name}</p>
        </div>
    )}
/>
```

#### Le même carousel réutilisé avec des assets
```javascript
<CardSliderData
    items={assets}
    visibleCount={4}
    renderItem={(asset) => (
        <div className="asset-card">
            <h4>{asset.name}</h4>
            <p>{asset.itemType}</p>
        </div>
    )}
/>
```

> ✅ **Avantage de la Façon 3 :** le même carousel marche pour tickets, assets, users... Tu changes juste `items` et `renderItem`. C'est le `key` géré à l'intérieur (`item.id ?? index`), donc tu n'as plus à y penser.

---

### CSS de la carte (à ajouter)
```css
.ticket-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.25rem;
    height: 100%;
    box-sizing: border-box;
}

.ticket-card h4 {
    margin: 0 0 0.5rem 0;
    color: #c0392b;
    font-size: 14px;
}

.ticket-card p {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 13px;
}

.ticket-card span {
    font-size: 12px;
    color: #999;
}
```

---

### ⚠️ Les 3 erreurs classiques quand tu branches une vraie liste

```javascript
// ❌ 1. Oublier le key → warning React "Each child should have a unique key"
tickets.map((t) => <div>{t.name}</div>)
// ✅
tickets.map((t) => <div key={t.id}>{t.name}</div>)


// ❌ 2. Passer la liste vide pendant le chargement → carousel cassé/vide
return <CardSlider cards={tickets.map(...)} />   // tickets = [] au début
// ✅ Attendre les données
if (tickets.length === 0) return <p>Chargement...</p>;
return <CardSlider cards={tickets.map(...)} />;


// ❌ 3. Appeler renderItem au lieu de le passer (Façon 3)
renderItem={renderTicket(ticket)}   // ← exécute tout de suite = erreur
// ✅ Passer la fonction, le carousel l'appellera
renderItem={(ticket) => renderTicket(ticket)}
// ou simplement
renderItem={renderTicket}
```

---

## Quel composant choisir ?

| Tu veux... | Utilise | JavaScript ? |
|------------|---------|--------------|
| 1 image à la fois avec flèches | **Carousel** | Oui (léger) |
| Pareil + points en bas | **CarouselDots** | Oui |
| Ça défile tout seul | **AutoCarousel** | Oui (+ timer) |
| Plusieurs cartes, défiler 1 par 1 | **CardSlider** | Oui |
| Défilement libre tactile | **HorizontalScroll** | ❌ Non (CSS pur) |
| Grande image + miniatures | **Gallery** | Oui (léger) |

✅ **Mon conseil pour débuter :** commence par **HorizontalScroll** (scroll-snap). C'est du CSS pur, ça marche au doigt sur mobile, et c'est suffisant 80% du temps. Passe au Carousel seulement si tu as vraiment besoin des flèches et du "1 à la fois".

---

## ⚠️ Pièges courants

### Le track ne bouge pas
```css
/* ❌ Sans overflow: hidden sur le viewport, on voit tout */
.carousel-viewport { /* manque overflow: hidden */ }

/* ✅ Le viewport DOIT cacher ce qui dépasse */
.carousel-viewport { overflow: hidden; }
```

### Les slides ne font pas toute la largeur
```css
/* ✅ min-width: 100% (pas width) pour qu'ils ne rétrécissent pas */
.carousel-slide { min-width: 100%; }
```

### L'auto-play crée plusieurs timers
```javascript
// ✅ TOUJOURS nettoyer le timer dans le useEffect
useEffect(() => {
    const timer = setInterval(...);
    return () => clearInterval(timer);  // ← obligatoire
}, [...]);
```
