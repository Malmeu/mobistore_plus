import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center shadow-neon">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">MOBISTORE</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Votre destination pour les meilleurs accessoires mobiles en Algérie.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-neon-blue transition-colors">Accueil</a></li>
              <li><a href="/products" className="hover:text-neon-blue transition-colors">Produits</a></li>
              <li><a href="/categories" className="hover:text-neon-blue transition-colors">Catégories</a></li>
              <li><a href="/contact" className="hover:text-neon-blue transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Catégories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/categories/coques" className="hover:text-neon-blue transition-colors">Coques</a></li>
              <li><a href="/categories/chargeurs" className="hover:text-neon-blue transition-colors">Chargeurs</a></li>
              <li><a href="/categories/ecouteurs" className="hover:text-neon-blue transition-colors">Écouteurs</a></li>
              <li><a href="/categories/cables" className="hover:text-neon-blue transition-colors">Câbles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+213 XXX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@mobistore.dz</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Alger, Algérie</span>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-neon-blue rounded-xl flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-neon-purple rounded-xl flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Mobistore Plus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
