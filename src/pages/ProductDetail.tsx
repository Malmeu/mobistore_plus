import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft, Star, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ShareProductButton from '../components/ShareProductButton'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'

interface ProductDetailProps {
  onAddToCart: (product: Product) => void
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
      
      if (data) {
        fetchRelatedProducts(data.category)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', id)
        .limit(4)

      if (error) throw error
      setRelatedProducts(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product)
      }
    }
  }

  const images = product ? [product.image_url, product.image_url, product.image_url] : []

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-200 h-96 rounded-3xl animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-200 h-24 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 h-8 rounded w-3/4 animate-pulse"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2 animate-pulse"></div>
              <div className="bg-gray-200 h-20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 space-y-6">
            <h2 className="text-3xl font-bold">Produit non trouvé</h2>
            <p className="text-gray-600">Le produit que vous recherchez n'existe pas.</p>
            <Link to="/products" className="btn-primary inline-block">
              Retour aux produits
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        {/* Titre du produit */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">(4.0) • 127 avis</span>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Slider d'images */}
          <div className="space-y-4">
            <div className="relative card p-4 overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain rounded-2xl"
              />
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card p-2 overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-contain rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-xl mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Prix encadré */}
            <div className="border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.price.toLocaleString('fr-DZ')}
                  </span>
                  <span className="text-xl text-gray-600">DA</span>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-xl transition-all ${
                    isFavorite
                      ? 'bg-red-50 text-red-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              {product.stock < 5 && product.stock > 0 && (
                <p className="text-orange-600 font-medium">
                  ⚠️ Plus que {product.stock} en stock !
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-red-600 font-medium">❌ Rupture de stock</p>
              )}
              {product.stock >= 5 && (
                <p className="text-green-600 font-medium flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>En stock</span>
                </p>
              )}
            </div>

            {/* Formulaire d'achat encadré orange */}
            <div className="border-2 border-primary-500 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantité :</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="font-semibold text-xl w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Ajouter au panier</span>
                </button>
                <ShareProductButton productId={product.id} productName={product.name} />
              </div>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Livraison rapide</h4>
                  <p className="text-xs text-gray-600">Livraison en 48h</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-2xl">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Garantie qualité</h4>
                  <p className="text-xs text-gray-600">Produit authentique</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits connexes */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8">Produits connexes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
