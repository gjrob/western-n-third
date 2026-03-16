'use client'

interface Filters {
  q: string
  category: string
  minPrice: string
  maxPrice: string
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'lumber', label: 'Lumber & Wood' },
  { value: 'metals', label: 'Metals' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'hardware', label: 'Hardware & Fixtures' },
  { value: 'flooring', label: 'Flooring & Tile' },
  { value: 'windows', label: 'Windows & Doors' },
]

export default function SearchFilters({
  filters,
  onFiltersChange,
}: {
  filters: Filters
  onFiltersChange: (f: Filters) => void
}) {
  const set = (key: keyof Filters, val: string) => onFiltersChange({ ...filters, [key]: val })

  return (
    <div className="search-filters">
      <div className="filter-group">
        <div className="filter-title">Search</div>
        <input
          type="text"
          value={filters.q}
          onChange={e => set('q', e.target.value)}
          placeholder="Search items..."
        />
      </div>

      <div className="filter-group">
        <div className="filter-title">Category</div>
        <select value={filters.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <div className="filter-title">Price Range</div>
        <input
          type="number"
          value={filters.minPrice}
          onChange={e => set('minPrice', e.target.value)}
          placeholder="Min $"
          style={{ marginBottom: '8px' }}
        />
        <input
          type="number"
          value={filters.maxPrice}
          onChange={e => set('maxPrice', e.target.value)}
          placeholder="Max $"
        />
      </div>

      <button
        className="dash-btn dash-btn-secondary"
        style={{ width: '100%', marginTop: '8px' }}
        onClick={() => onFiltersChange({ q: '', category: 'all', minPrice: '', maxPrice: '' })}
      >
        Clear Filters
      </button>
    </div>
  )
}
