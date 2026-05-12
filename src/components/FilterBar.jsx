function FilterBar({ filter, selectedTag, tags, stats, onFilterChange, onTagSelect }) {
  const isActive = (key) => filter === key && !selectedTag

  return (
    <>
      <div className="sidebar-section">
        <span className="sidebar-section-title">状态</span>
        <button
          className={`filter-btn ${isActive('all') ? 'active' : ''}`}
          onClick={() => { onFilterChange('all'); onTagSelect(null) }}
        >
          <span>📋</span> 全部
          <span className="count">{stats.all}</span>
        </button>
        <button
          className={`filter-btn ${isActive('active') ? 'active' : ''}`}
          onClick={() => { onFilterChange('active'); onTagSelect(null) }}
        >
          <span>⏳</span> 进行中
          <span className="count">{stats.active}</span>
        </button>
        <button
          className={`filter-btn ${isActive('completed') ? 'active' : ''}`}
          onClick={() => { onFilterChange('completed'); onTagSelect(null) }}
        >
          <span>✅</span> 已完成
          <span className="count">{stats.completed}</span>
        </button>
      </div>

      {tags.length > 0 && (
        <div className="sidebar-section">
          <span className="sidebar-section-title">标签</span>
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`filter-btn ${selectedTag === tag.id ? 'active' : ''}`}
              onClick={() => {
                if (selectedTag === tag.id) {
                  onTagSelect(null)
                } else {
                  onTagSelect(tag.id)
                }
              }}
            >
              <span style={{ color: tag.color }}>●</span> {tag.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default FilterBar
