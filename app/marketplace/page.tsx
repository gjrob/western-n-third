'use client'

import { useState, useEffect } from 'react'
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader'
import SearchFilters from '@/components/marketplace/SearchFilters'
import ListingsGrid from '@/components/marketplace/ListingsGrid'

interface Filters {
  q: string
  category: string
  minPrice: string
  maxPrice: string
}

export default function MarketplacePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ q: '', category: 'all', minPrice: '', maxPrice: '' })
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const PAGE_SIZE = 20

  useEffect(() => {
    const search = async () => {
      setLoading(true)

      const params = new URLSearchParams({
        q: filters.q,
        limit: PAGE_SIZE.toString(),
        offset: (page * PAGE_SIZE).toString(),
      })

      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

      try {
        const res = await fetch(`/api/marketplace/search?${params}`)
        const data = await res.json()
        setListings(data.listings || [])
        setTotal(data.total || 0)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [filters, page])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPage(0)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="marketplace-page">
      <MarketplaceHeader />

      <main className="marketplace-main">
        <aside className="marketplace-sidebar">
          <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </aside>

        <section className="marketplace-content">
          <div className="results-header">
            <h2>Browse Materials</h2>
            <p className="results-meta">{total} items available · Buy · Sell · Trade</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="listing-skeleton" />)}
            </div>
          ) : listings.length > 0 ? (
            <>
              <ListingsGrid listings={listings} />

              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    ← Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p>No items found. Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
