import { ShoppingCart, Heart } from 'lucide-react'
import type { Product } from '../types'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card p-4 group">
      <div className="relative overflow-hidden rounded-2xl mb-4">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:bg-white transition-all">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-pastel-yellow rounded-xl text-xs font-semibold">
            Stock limité
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white rounded-xl text-xs font-semibold">
            Rupture de stock
          </div>
        )}
      </div>

      <Link to={`/product/${product.id}`}>
        <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            {product.price.toLocaleString('fr-DZ')}
          </span>
          <span className="text-sm text-gray-600 ml-1">DA</span>
        </div>
        
        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="btn-primary py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  )
}
