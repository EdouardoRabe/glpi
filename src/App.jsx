import { useEffect, useState } from 'react';
import { get } from './services/api';

function App() {
  const [status, setStatus] = useState('Chargement des tickets...');

  useEffect(() => {
    async function loadTickets() {
      const result = await get('Assistance/Ticket',1);
      console.log('Tickets:', result);

      if (typeof result === 'string') {
        console.warn('La réponse est une chaîne HTML/texte, pas du JSON GLPI.');
      }

      if (result && result.error) {
        setStatus(`Erreur: ${result.message || 'inconnue'}`);
        return;
      }

      setStatus('Tickets chargés, voir la console.');
    }

    loadTickets();
  }, []);

  return <div>{status}</div>;
}

export default App;
