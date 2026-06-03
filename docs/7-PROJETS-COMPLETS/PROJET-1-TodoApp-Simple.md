# 🚀 Projet 1 - TodoApp Simple

## Objectifs

- États (`useState`)
- Listes (`.map()`)
- Formulaires
- Suppression d'éléments

## Structure

```
TodoApp/
├── components/
│   ├── TodoForm.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
└── App.jsx
```

## Code complet

**App.jsx**
```jsx
import { useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }])
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div>
      <h1>Ma TodoApp</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onRemove={removeTodo} />
    </div>
  )
}

export default App
```

---

**[Voir autres projets →](PROJET-2-ListeProduits.md)**
