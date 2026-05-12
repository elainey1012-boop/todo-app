import { useState } from 'react'

const COLORS = ['#0071e3', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5856d6', '#ff2d55', '#5ac8fa']

function TagManager({ tags, onAdd, onDelete, onClose }) {
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), color: selectedColor })
    setName('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>管理标签</h3>

        <div className="form-group">
          <label>新建标签</label>
          <div className="tag-input-row">
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="标签名称"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="btn btn-primary" onClick={handleAdd}>添加</button>
          </div>
          <div className="color-picker">
            {COLORS.map(color => (
              <div
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>已有标签</label>
          {tags.length === 0 ? (
            <div style={{ color: '#86868b', fontSize: 13, padding: '12px 0' }}>暂无标签</div>
          ) : (
            <div className="tag-list">
              {tags.map(tag => (
                <div key={tag.id} className="tag-item">
                  <div className="tag-item-left">
                    <div className="tag-color-dot" style={{ background: tag.color }} />
                    <span>{tag.name}</span>
                  </div>
                  <button
                    className="icon-btn delete"
                    onClick={() => onDelete(tag.id)}
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  )
}

export default TagManager
