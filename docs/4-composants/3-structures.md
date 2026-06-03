# Composants Réutilisables - Structures

> ⚠️ **IMPORTANT:** Copie-colle directement! Aucun placeholder `[]` ici - code prêt à utiliser!

## 🏗️ Composant: Layout général

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Layout({ sidebar, content }) {
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh'
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRight: '1px solid #ddd'
    },
    content: {
      flex: 1,
      padding: '20px'
    }
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>{sidebar}</aside>
      <main style={styles.content}>{content}</main>
    </div>
  )
}

export default Layout
```

**Utilisation**
```javascript
<Layout
  sidebar={<Menu />}
  content={<Page />}
/>
```

---

## 📐 Composant: Grille responsive

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Grille({ elements, colonnes = 3, gap = "20px" }) {
  const styles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${colonnes}, 1fr)`,
    gap: gap
  }

  return (
    <div style={styles}>
      {elements.map((element, i) => (
        <div key={i}>{element}</div>
      ))}
    </div>
  )
}

export default Grille
```

**Utilisation**
```javascript
const items = [<Card />, <Card />, <Card />]

<Grille elements={items} colonnes={2} gap="15px" />
```

---

## 📍 Composant: Header & Footer

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Page({ titre, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>{titre}</h1>
      </header>

      {/* Contenu */}
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p>© 2026 Mon App. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default Page
```

**Utilisation**
```javascript
<Page titre="Mon App">
  <h2>Bienvenue!</h2>
  <p>Contenu ici</p>
</Page>
```

---

## 👨‍👩‍👧‍👦 Composant: Carte avec parent/enfants

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function CardContainer({ titre, children }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px',
        fontWeight: 'bold'
      }}>
        {titre}
      </div>
      <div style={{ padding: '15px' }}>
        {children}
      </div>
    </div>
  )
}

function CardItem({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #eee'
    }}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  )
}

export { CardContainer, CardItem }
```

**Utilisation**
```javascript
import { CardContainer, CardItem } from './Card'

<CardContainer titre="Infos utilisateur">
  <CardItem label="Nom" value="Alice" />
  <CardItem label="Email" value="alice@example.com" />
  <CardItem label="Âge" value="25" />
</CardContainer>
```

---

## 📊 Composant: Formulaire group

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function FormGroup({ label, type = "text", placeholder, onChange }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold'
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}
      />
    </div>
  )
}

export default FormGroup
```

**Utilisation**
```javascript
<FormGroup
  label="Nom complet"
  placeholder="Entrez votre nom"
  onChange={(e) => setNom(e.target.value)}
/>
<FormGroup
  label="Email"
  type="email"
  placeholder="votreemail@example.com"
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## 🎯 Composant: Stack (Flexbox)

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Stack({ 
  direction = "column",
  gap = "10px",
  align = "stretch",
  children 
}) {
  const styles = {
    display: 'flex',
    flexDirection: direction,
    gap: gap,
    alignItems: align
  }

  return <div style={styles}>{children}</div>
}

export default Stack
```

**Utilisation**
```javascript
<Stack direction="row" gap="20px">
  <Bouton label="Annuler" />
  <Bouton label="Valider" couleur="green" />
</Stack>
```

---

## 🎨 Composant: Conteneur avec padding

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Conteneur({ 
  padding = "20px", 
  bordure = false,
  children 
}) {
  const styles = {
    padding: padding,
    border: bordure ? '1px solid #ddd' : 'none',
    borderRadius: bordure ? '8px' : '0'
  }

  return <div style={styles}>{children}</div>
}

export default Conteneur
```

**Utilisation**
```javascript
<Conteneur padding="30px" bordure={true}>
  <h2>Titre</h2>
  <p>Contenu</p>
</Conteneur>
```

---

## 📱 Composant: Responsive wrapper

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function Responsive({ largeur = "100%", children }) {
  const styles = {
    maxWidth: largeur,
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  return <div style={styles}>{children}</div>
}

export default Responsive
```

**Utilisation**
```javascript
<Responsive largeur="1200px">
  <h1>Contenu large</h1>
</Responsive>
```

---

## 🎁 Composant: Card avec actions

```javascript
// ✅ IMPORTS NECESSAIRES
// (Rien à importer pour un composant simple!)

function CardAvecAction({ titre, description, actions }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '300px'
    }}>
      <h3>{titre}</h3>
      <p>{description}</p>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
      }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              padding: '8px 15px',
              flex: 1,
              backgroundColor: action.couleur || 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CardAvecAction
```

**Utilisation**
```javascript
<CardAvecAction
  titre="Produit"
  description="Un super produit"
  actions={[
    { label: 'Voir', onClick: () => console.log('voir'), couleur: 'blue' },
    { label: 'Acheter', onClick: () => console.log('acheter'), couleur: 'green' }
  ]}
/>
```

---

## 🎉 C'est réussi!

Tu as maintenant une **documentation complète de React** avec :

✅ **Fondamentaux** - Comprendre les bases  
✅ **Pratique** - Cas d'usage réels  
✅ **Avancé** - Patterns professionnels  
✅ **Composants** - Code prêt à copier-coller (SANS ERREURS!)  

---

**[Retour à l'INDEX](../INDEX.md)**

**Conseils pour les examens :**
- 📌 Imprime ou télécharge cette doc
- 🔍 Utilise Ctrl+F pour chercher rapidement
- 📝 Ajoute des notes personnelles
- 🧪 Teste les exemples localement
- ✍️ Essaie de coder sans copier pour mémoriser

Bonne chance! 🚀
