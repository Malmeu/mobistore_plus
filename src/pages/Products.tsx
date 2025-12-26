import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

interface ProductsProps {
  onAddToCart: (product: Product) => void
}

export default function Products({ onAddToCart }: ProductsProps) {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*')

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'name':
          query = query.order('name', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'coques', name: 'Coques' },
    { id: 'chargeurs', name: 'Chargeurs' },
    { id: 'ecouteurs', name: 'Écouteurs' },
    { id: 'cables', name: 'Câbles' },
    { id: 'protections', name: 'Protections d\'écran' },
    { id: 'supports', name: 'Supports' },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nos Produits</h1>
          <p className="text-gray-600">Découvrez notre collection complète d'accessoires</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="card p-4 md:w-64 h-fit">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Filtres</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
