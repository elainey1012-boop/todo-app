import { useState, useEffect, useCallback } from 'react'

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedTag, setSelectedTag] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await window.electronAPI.getTodos()
        setTodos(data.todos || [])
        setTags(data.tags || [])
      } catch (e) {
        console.error('Failed to load todos:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto save
  useEffect(() => {
    if (loading) return
    const timeout = setTimeout(() => {
      window.electronAPI.saveTodos({ todos, tags })
    }, 500)
    return () => clearTimeout(timeout)
  }, [todos, tags, loading])

  const addTodo = useCallback((todo) => {
    const newTodo = {
      id: generateId(),
      ...todo,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos(prev => [newTodo, ...prev])
    setShowForm(false)
  }, [])

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    setEditingTodo(null)
    setShowForm(false)
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  const addTag = useCallback((tag) => {
    setTags(prev => [...prev, { id: generateId(), ...tag }])
  }, [])

  const deleteTag = useCallback((tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId))
    setTodos(prev => prev.map(t => ({
      ...t,
      tags: (t.tags || []).filter(id => id !== tagId)
    })))
  }, [])

  const filteredTodos = todos.filter(t => {
    if (filter === 'active' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    if (selectedTag && !(t.tags || []).includes(selectedTag)) return false
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sort by completion, then priority, then due date
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return a.dueDate ? -1 : 1
  })

  const stats = {
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }

  const exportData = async () => {
    await window.electronAPI.exportData({ todos, tags })
  }

  const importData = async () => {
    const data = await window.electronAPI.importData()
    if (data) {
      setTodos(data.todos || [])
      setTags(data.tags || [])
    }
  }

  const openEditForm = (todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }

  return {
    todos: sortedTodos,
    allTodos: todos,
    tags,
    loading,
    filter,
    selectedTag,
    showForm,
    showTagManager,
    editingTodo,
    stats,
    setFilter,
    setSelectedTag,
    setShowForm,
    setShowTagManager,
    setEditingTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addTag,
    deleteTag,
    exportData,
    importData,
    openEditForm,
  }
}
