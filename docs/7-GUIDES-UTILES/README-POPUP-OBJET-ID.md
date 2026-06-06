# Popup React : passer un objet ou un id

Ce guide montre comment ouvrir une popup (modal) dans React dans deux cas tres courants :

- Cas 1 : vous passez directement l'objet complet
- Cas 2 : vous passez seulement l'id, puis vous retrouvez l'objet

Le bon choix depend de la quantite de donnees et de la fraicheur des donnees.

## 1) Cas 1 - passer l'objet complet

### Quand l'utiliser
- Vous avez deja les donnees dans la liste.
- Vous voulez ouvrir la popup instantanement.
- L'objet n'est pas trop volumineux.

### Exemple

```jsx
const [selectedTicket, setSelectedTicket] = useState(null);

const openTicketDetails = (ticketObject) => {
  setSelectedTicket(ticketObject);
};

<button onClick={() => openTicketDetails({ ticket, assets, costs })}>
  Voir details
</button>
```

## 2) Cas 2 - passer seulement l'id

### Quand l'utiliser
- Vous voulez minimiser les donnees passees au clic.
- Les donnees doivent etre relues a jour.
- Vous avez un endpoint detail par id.

### Exemple (recherche locale)

```jsx
const openTicketDetails = (ticketId) => {
  const found = tickets.find(({ ticket }) => ticket.id === ticketId);
  setSelectedTicket(found ?? null);
};

<button onClick={() => openTicketDetails(ticket.id)}>Voir details</button>
```

### Exemple (fetch detail par id)

```jsx
const [selectedTicket, setSelectedTicket] = useState(null);
const [loadingDetail, setLoadingDetail] = useState(false);

const openTicketDetails = async (ticketId) => {
  setLoadingDetail(true);
  try {
    const detail = await Ticket.getById(ticketId);
    setSelectedTicket(detail);
  } finally {
    setLoadingDetail(false);
  }
};
```

## 3) Structure modal minimale

```jsx
{selectedTicket && (
  <div className="overlay" onClick={closeModal}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button onClick={closeModal}>Fermer</button>
      <h2>{selectedTicket.ticket?.name ?? selectedTicket.name}</h2>
    </div>
  </div>
)}
```

Points importants :
- `onClick={closeModal}` sur l'overlay pour fermer.
- `e.stopPropagation()` sur la boite modal pour eviter la fermeture au clic interne.
- `selectedTicket && ...` pour rendre la popup seulement si elle existe.

## 4) Quel choix pour votre cas

Pour votre page BO (`BOTicketList`), vous avez deja `ticket`, `assets`, `costs` via `Ticket.getAllComplete()`.
Le plus simple est de passer l'objet complet au clic.

Si plus tard vous voulez des details plus riches (historique, commentaires), passez l'id puis faites un fetch detail a l'ouverture.

## 5) Erreurs frequentes

- Mettre `async` directement dans le `map` du JSX.
- Faire `await` dans le `return` React.
- Passer un objet dans `option.value` d'un `<select>` natif.
- Oublier de fermer la popup (state jamais remis a `null`).

## 6) Checklist rapide

- [ ] Le clic ouvre la popup
- [ ] Le clic en dehors ferme la popup
- [ ] Le bouton "Fermer" ferme la popup
- [ ] Pas de `await` dans le rendu JSX
- [ ] Le detail affiche soit l'objet passe, soit l'objet retrouve/fetch par id
