function TodoItem({ todo, tags, onToggle, onDelete, onEdit }) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.getTime() === today.getTime()) return '今天'
    if (d.getTime() === tomorrow.getTime()) return '明天'
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={onToggle}
      />
      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {todo.description && (
          <div style={{ fontSize: 13, color: '#86868b', marginBottom: 6 }}>{todo.description}</div>
        )}
        <div className="todo-meta">
          {todo.priority && (
            <span className={`priority priority-${todo.priority}`}>
              {todo.priority === 'high' ? '高优先级' : todo.priority === 'medium' ? '中优先级' : '低优先级'}
            </span>
          )}
          {todo.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              📅 {formatDate(todo.dueDate)}
              {isOverdue && ' (已过期)'}
            </span>
          )}
          {(todo.tags || []).map(tagId => {
            const tag = tags.find(t => t.id === tagId)
            if (!tag) return null
            return (
              <span key={tagId} className="tag" style={{ background: tag.color + '20', color: tag.color }}>
                {tag.name}
              </span>
            )
          })}
        </div>
      </div>
      <div className="todo-actions">
        <button className="icon-btn" onClick={onEdit} title="编辑">✏️</button>
        <button className="icon-btn delete" onClick={onDelete} title="删除">🗑️</button>
      </div>
    </div>
  )
}

export default TodoItem
