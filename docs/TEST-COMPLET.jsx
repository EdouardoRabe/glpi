import { useState, useEffect } from 'react'

// 1️⃣ Composant Compteur (useState)
function Compteur() {
  const [count, setCount] = useState(0)

  const incrementer = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h2>Compteur: {count}</h2>
      <button onClick={incrementer}>+1</button>
    </div>
  )
}

// 2️⃣ Composant Fetch API (useEffect + fetch)
function ListeUtilisateurs() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users?_limit=5')
      .then(response => response.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setErreur(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Chargement...</p>
  if (erreur) return <p>Erreur: {erreur}</p>

  return (
    <div>
      <h2>Utilisateurs (depuis API)</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 3️⃣ Composant Bouton réutilisable
function Bouton({ label = "Clique", onClick, couleur = "blue" }) {
  const styles = {
    backgroundColor: couleur,
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
  return <button style={styles} onClick={onClick}>{label}</button>
}

// 4️⃣ Composant Formulaire avec validation
function Formulaire() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [erreurs, setErreurs] = useState({})

  const valider = () => {
    const newErreurs = {}
    if (!nom) newErreurs.nom = 'Nom requis'
    if (!email.includes('@')) newErreurs.email = 'Email invalide'
    setErreurs(newErreurs)

    if (Object.keys(newErreurs).length === 0) {
      alert(`✅ Formulaire valide!\nNom: ${nom}\nEmail: ${email}`)
      setNom('')
      setEmail('')
    }
  }

  return (
    <div>
      <h2>Formulaire de contact</h2>
      <div>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        {erreurs.nom && <p style={{color: 'red'}}>{erreurs.nom}</p>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {erreurs.email && <p style={{color: 'red'}}>{erreurs.email}</p>}
      </div>
      <Bouton label="Envoyer" couleur="green" onClick={valider} />
    </div>
  )
}

// 5️⃣ Composant Liste avec .map()
function ListeTaches() {
  const [taches, setTaches] = useState(['Apprendre React', 'Faire des projets'])

  const supprimer = (index) => {
    setTaches(taches.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2>Mes tâches</h2>
      <ul>
        {taches.map((tache, index) => (
          <li key={index}>
            {tache}
            <button onClick={() => supprimer(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 6️⃣ APP PRINCIPALE
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test complet de React ✅</h1>

      <hr />
      <Compteur />

      <hr />
      <ListeTaches />

      <hr />
      <Formulaire />

      <hr />
      <ListeUtilisateurs />
    </div>
  )
}

export default App
