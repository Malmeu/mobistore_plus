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

      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-blue to-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Livraison Rapide</h3>
              <p className="text-gray-600 text-sm">Livraison dans toute l'Algérie en 48h</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-purple to-neon-purple rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Garantie Qualité</h3>
              <p className="text-gray-600 text-sm">Produits authentiques garantis</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-pink to-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Support 24/7</h3>
              <p className="text-gray-600 text-sm">Assistance client disponible</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-pastel-green to-green-400 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Prix Compétitifs</h3>
              <p className="text-gray-600 text-sm">Meilleurs prix du marché</p>
            </div>
          </div>
        </div>
      </section>

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
