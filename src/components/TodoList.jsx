import TodoItem from './TodoItem'

function TodoList({ todos, tags, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div>暂无任务</div>
          <div style={{ fontSize: 13, marginTop: 8 }}>点击右上角「新建任务」开始添加</div>
        </div>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          tags={tags}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={() => onEdit(todo)}
        />
      ))}
    </div>
  )
}

export default TodoList
