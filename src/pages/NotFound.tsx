import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pastel-blue/20 via-white to-pastel-pink/20">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-xl text-gray-600">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="card p-8 mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-16 h-16 text-white" />
          </div>
          <p className="text-gray-600 mb-6">
            Vous pouvez retourner à l'accueil ou explorer nos produits
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary flex items-center justify-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </Link>
            <Link to="/products" className="btn-secondary flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Voir les produits</span>
            </Link>
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-primary-600 transition-colors flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à la page précédente</span>
        </button>
      </div>
    </div>
  )
}
