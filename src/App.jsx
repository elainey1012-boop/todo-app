import { useTodos } from './hooks/useTodos'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import FilterBar from './components/FilterBar'
import TagManager from './components/TagManager'

function App() {
  const {
    todos,
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
  } = useTodos()

  if (loading) {
    return (
      <div className="app" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#86868b', fontSize: 14 }}>加载中...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>待办事项</h1>
        <FilterBar
          filter={filter}
          selectedTag={selectedTag}
          tags={tags}
          stats={stats}
          onFilterChange={setFilter}
          onTagSelect={setSelectedTag}
        />
        <div className="sidebar-section">
          <span className="sidebar-section-title">操作</span>
          <button className="filter-btn" onClick={() => setShowTagManager(true)}>
            <span>🏷️</span> 管理标签
          </button>
          <button className="filter-btn" onClick={exportData}>
            <span>📤</span> 导出数据
          </button>
          <button className="filter-btn" onClick={importData}>
            <span>📥</span> 导入数据
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="header">
          <h2>
            {filter === 'all' && '全部任务'}
            {filter === 'active' && '进行中'}
            {filter === 'completed' && '已完成'}
            {selectedTag && `标签: ${tags.find(t => t.id === selectedTag)?.name || ''}`}
          </h2>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => { setEditingTodo(null); setShowForm(true) }}>
              + 新建任务
            </button>
          </div>
        </div>

        <TodoList
          todos={todos}
          tags={tags}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={openEditForm}
        />
      </main>

      {showForm && (
        <TodoForm
          tags={tags}
          editingTodo={editingTodo}
          onSubmit={editingTodo ? (data) => updateTodo(editingTodo.id, data) : addTodo}
          onClose={() => { setShowForm(false); setEditingTodo(null) }}
        />
      )}

      {showTagManager && (
        <TagManager
          tags={tags}
          onAdd={addTag}
          onDelete={deleteTag}
          onClose={() => setShowTagManager(false)}
        />
      )}
    </div>
  )
}

export default App
