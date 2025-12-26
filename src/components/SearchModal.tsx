import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchProducts()
    } else {
      setResults([])
    }
  }, [searchQuery])

  const searchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(10)

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="relative bg-white rounded-3xl shadow-soft-lg w-full max-w-3xl">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {searchQuery.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Commencez à taper pour rechercher...</p>
              </div>
            )}

            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <div className="text-center py-12 text-gray-500">
                <p>Tapez au moins 3 caractères...</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchQuery.length >= 3 && results.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Aucun produit trouvé pour "{searchQuery}"</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                      <p className="text-primary-600 font-bold mt-1">
                        {product.price.toLocaleString('fr-DZ')} DA
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
