import { useState, useEffect } from 'react'

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5856d6', '#ff2d55', '#5ac8fa']

function TodoForm({ tags, editingTodo, onSubmit, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '')
      setDescription(editingTodo.description || '')
      setPriority(editingTodo.priority || 'medium')
      setDueDate(editingTodo.dueDate || '')
      setSelectedTags(editingTodo.tags || [])
    }
  }, [editingTodo])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      tags: selectedTags,
    })
    if (!editingTodo) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setSelectedTags([])
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{editingTodo ? '编辑任务' : '新建任务'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>任务标题 *</label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入任务标题"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="添加描述（可选）"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>优先级</label>
              <select
                className="form-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div className="form-group">
              <label>截止日期</label>
              <input
                className="form-input"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="form-group">
              <label>标签</label>
              <div className="tag-selector">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn btn-primary">{editingTodo ? '保存' : '创建'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TodoForm
