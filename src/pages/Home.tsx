import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Headphones, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'
import CategoryCarousel from '../components/CategoryCarousel'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

interface HomeProps {
  onAddToCart: (product: Product) => void
}

export default function Home({ onAddToCart }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section>
        <HeroSlider />
      </section>

      <CategoryCarousel />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <iframe 
            src="https://jitone.vercel.app/widget" 
            width="100%" 
            height="350" 
            style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            title="Widget de suivi RepairTrack"
          />
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-base md:text-lg">Livraison Rapide</h3>
              <p className="text-gray-600 text-xs md:text-sm">Livraison dans toute l'Algérie en 48h</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-base md:text-lg">Garantie Qualité</h3>
              <p className="text-gray-600 text-xs md:text-sm">Produits authentiques garantis</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-base md:text-lg">Support 24/7</h3>
              <p className="text-gray-600 text-xs md:text-sm">Assistance client disponible</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-base md:text-lg">Prix Compétitifs</h3>
              <p className="text-gray-600 text-xs md:text-sm">Meilleurs prix du marché</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Produits Populaires</h2>
            <p className="text-gray-600 text-lg">Découvrez nos articles les plus vendus</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
              <span>Voir tous les produits</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-pastel-blue/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Prêt à commander ?</h2>
          <p className="text-xl text-gray-600">
            Rejoignez des milliers de clients satisfaits à travers l'Algérie
          </p>
          <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
            <span>Commencer vos achats</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
