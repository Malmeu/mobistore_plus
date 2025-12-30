import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
}

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 5
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView.desktop >= categories.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, categories.length - itemsPerView.desktop) : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Chargement des catégories...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-br from-pastel-blue/10 to-pastel-purple/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Nos Catégories</h2>
            <p className="text-gray-600">Explorez notre gamme complète d'accessoires</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white hover:bg-gray-50 rounded-xl shadow-soft transition-all hover:scale-105"
              aria-label="Catégorie précédente"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white hover:bg-gray-50 rounded-xl shadow-soft transition-all hover:scale-105"
              aria-label="Catégorie suivante"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 px-2"
              >
                <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-pastel-blue to-pastel-purple">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-bold text-lg text-center group-hover:text-primary-400 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            <span>Voir toutes les catégories</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
