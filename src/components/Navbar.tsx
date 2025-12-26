import { ShoppingCart, Search, Menu, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SearchModal from './SearchModal'

interface NavbarProps {
  cartItemsCount: number
}

export default function Navbar({ cartItemsCount }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center shadow-neon">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                MOBISTORE
              </h1>
              <p className="text-xs text-gray-500">Téléphones & Accessoires</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Produits
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Catégories
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-neon">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Accueil
            </Link>
            <Link to="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Produits
            </Link>
            <Link to="/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Catégories
            </Link>
            <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Contact
            </Link>
          </div>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}
