import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultCategories = [
    {
      id: '1',
      name: 'Coques',
      slug: 'coques',
      image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Chargeurs',
      slug: 'chargeurs',
      image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Écouteurs',
      slug: 'ecouteurs',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop',
    },
    {
      id: '4',
      name: 'Câbles',
      slug: 'cables',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    },
    {
      id: '5',
      name: 'Protections d\'écran',
      slug: 'protections',
      image_url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=400&fit=crop',
    },
    {
      id: '6',
      name: 'Supports',
      slug: 'supports',
      image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop',
    },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Nos Catégories</h1>
          <p className="text-xl text-gray-600">
            Découvrez notre large gamme d'accessoires mobiles
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <div className="flex items-center text-white/90 space-x-2">
                      <span className="text-sm">Voir les produits</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-primary-50 to-pastel-blue/30 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="text-gray-600 text-lg mb-6">
            Contactez-nous et nous vous aiderons à trouver l'accessoire parfait
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center space-x-2">
            <span>Nous contacter</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
