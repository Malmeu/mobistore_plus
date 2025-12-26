import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'

interface FavoritesProps {
  favorites: Product[]
  onAddToCart: (product: Product) => void
  onRemoveFavorite: (productId: string) => void
}

export default function Favorites({ favorites, onAddToCart, onRemoveFavorite }: FavoritesProps) {
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pastel-pink to-red-400 rounded-3xl flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Aucun favori</h2>
            <p className="text-gray-600">
              Vous n'avez pas encore ajouté de produits à vos favoris
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Découvrir nos produits</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <Heart className="w-10 h-10 text-red-500 fill-current" />
            <span>Mes Favoris</span>
          </h1>
          <p className="text-gray-600">
            {favorites.length} produit{favorites.length > 1 ? 's' : ''} dans vos favoris
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(product => (
            <div key={product.id} className="relative">
              <button
                onClick={() => onRemoveFavorite(product.id)}
                className="absolute top-6 right-6 z-10 p-2 bg-red-500 hover:bg-red-600 rounded-xl shadow-soft transition-all"
              >
                <Heart className="w-5 h-5 text-white fill-current" />
              </button>
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
