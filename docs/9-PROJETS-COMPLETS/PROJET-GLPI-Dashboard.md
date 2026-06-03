# 🚀 Projet GLPI - Dashboard

## Objectifs

- Authentification GLPI
- Fetch des tickets
- Affichage en liste/grille
- Filtrage par statut
- Navigation vers détail

## Structure recommandée

```
src/
├── components/
│   ├── TicketList.jsx
│   ├── TicketDetail.jsx
│   └── TicketCard.jsx
├── hooks/
│   └── useGLPI.js
├── contexts/
│   └── AuthContext.jsx
├── api/
│   └── glpi.js
└── App.jsx
```

## API GLPI - Essentials

```jsx
// Authentification
fetch('https://glpi.url/api/rest.php/initSession', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'App-Token': APP_TOKEN
  }
})

// Lister les tickets
fetch('https://glpi.url/api/rest.php/search/Ticket', {
  headers: {
    'Session-Token': sessionToken,
    'App-Token': APP_TOKEN
  }
})
```

---

**[← Projets principaux](PROJET-2-ListeProduits.md)**
