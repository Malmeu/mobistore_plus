import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft, Star, Check, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ShareProductButton from '../components/ShareProductButton'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'
import { WILAYAS } from '../types'

interface ProductDetailOneStepProps {
  onAddToCart: (product: Product) => void
}

export default function ProductDetailOneStep({ onAddToCart: _onAddToCart }: ProductDetailOneStepProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [productImages, setProductImages] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [variants, setVariants] = useState<Array<{ id: string; name: string; value: string; price_adjustment: number; stock: number }>>([])
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    wilaya: '',
  })

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    if (formData.wilaya) {
      fetchDeliveryPrice(formData.wilaya)
    }
  }, [formData.wilaya])


  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)

      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', id)
        .order('display_order')

      if (images && images.length > 0) {
        setProductImages(images.map(img => img.image_url))
      } else {
        setProductImages([data.image_url])
      }

      // Charger les variantes du produit
      const { data: productVariants } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)

      if (productVariants && productVariants.length > 0) {
        setVariants(productVariants)
      }

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

  const fetchDeliveryPrice = async (wilaya: string) => {
    try {
      const { data, error } = await supabase
        .from('delivery_settings')
        .select('price')
        .eq('wilaya', wilaya)
        .single()

      if (error) {
        setDeliveryPrice(0)
      } else {
        setDeliveryPrice(data?.price || 0)
      }
    } catch (error) {
      setDeliveryPrice(0)
    }
  }

  const calculateTotalPrice = () => {
    if (!product) return 0
    let total = product.price
    
    Object.values(selectedVariants).forEach(variantId => {
      const variant = variants.find(v => v.id === variantId)
      if (variant) {
        total += variant.price_adjustment
      }
    })
    
    return total
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        _onAddToCart(product)
      }
    }
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      const productPrice = calculateTotalPrice()
      const total = (productPrice * quantity) + deliveryPrice

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...formData,
          total,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity,
          price: productPrice,
        })

      if (itemsError) throw itemsError

      setOrderPlaced(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la commande')
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const images = productImages.length > 0 ? productImages : (product ? [product.image_url] : [])

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-200 h-96 rounded-3xl animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 h-8 rounded w-3/4 animate-pulse"></div>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft-lg p-8 md:p-12 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Merci pour votre commande ! Nous vous contacterons très bientôt au{' '}
            <span className="font-semibold text-primary-600">{formData.customer_phone}</span> pour
            confirmer la livraison.
          </p>
          <div className="bg-primary-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Résumé de votre commande</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Produit :</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité :</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wilaya :</span>
                <span className="font-medium">{formData.wilaya}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total :</span>
                <span className="font-medium">{(calculateTotalPrice() * quantity).toLocaleString('fr-DZ')} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison :</span>
                <span className="font-medium">{deliveryPrice === 0 ? 'GRATUITE' : `${deliveryPrice.toLocaleString('fr-DZ')} DA`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total :</span>
                <span className="text-primary-600">
                  {((calculateTotalPrice() * quantity) + deliveryPrice).toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-6">
            <Phone className="w-5 h-5" />
            <p className="text-sm">Notre équipe vous contactera dans les 24h</p>
          </div>
          <Link to="/products" className="btn-primary inline-block">
            Continuer mes achats
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm md:text-base text-gray-600">(4.0) • 127 avis</span>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs md:text-sm font-medium">
              {product.category}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Slider d'images */}
          <div className="space-y-4">
            <div className="relative card p-4 overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-64 md:h-96 object-contain rounded-2xl"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-4">
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
                    className="w-full h-16 md:h-24 object-contain rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Description */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Description</h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Variantes */}
            {variants.length > 0 && (
              <div className="mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Options disponibles</h2>
                <div className="space-y-4">
                  {Object.entries(
                    variants.reduce((acc, variant) => {
                      if (!acc[variant.name]) acc[variant.name] = []
                      acc[variant.name].push(variant)
                      return acc
                    }, {} as Record<string, typeof variants>)
                  ).map(([variantName, variantOptions]) => (
                    <div key={variantName}>
                      <label className="block text-sm md:text-base font-medium mb-2">{variantName}</label>
                      <div className="flex flex-wrap gap-2">
                        {variantOptions.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelectedVariants({ ...selectedVariants, [variantName]: variant.id })}
                            className={`px-4 py-2 rounded-xl border-2 transition-all text-sm md:text-base ${
                              selectedVariants[variantName] === variant.id
                                ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {variant.value}
                            {variant.price_adjustment !== 0 && (
                              <span className="ml-1 text-xs">
                                ({variant.price_adjustment > 0 ? '+' : ''}{variant.price_adjustment} DA)
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prix encadré */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 md:p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {calculateTotalPrice().toLocaleString('fr-DZ')}
                  </span>
                  <span className="text-lg md:text-xl text-gray-600">DA</span>
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
                <p className="text-sm md:text-base text-orange-600 font-medium">
                  ⚠️ Plus que {product.stock} en stock !
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-sm md:text-base text-red-600 font-medium">❌ Rupture de stock</p>
              )}
              {product.stock >= 5 && (
                <p className="text-sm md:text-base text-green-600 font-medium flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>En stock</span>
                </p>
              )}
            </div>

            {/* Formulaire de commande encadré orange */}
            <div className="border-2 border-primary-500 rounded-2xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Commander maintenant</h3>
              
              <form onSubmit={handleOrder} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="input-field text-sm md:text-base"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="input-field text-sm md:text-base"
                    placeholder="05XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Wilaya *</label>
                  <select
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="input-field text-sm md:text-base"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Adresse *</label>
                  <textarea
                    required
                    value={formData.customer_address}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    className="input-field text-sm md:text-base"
                    rows={2}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Quantité</label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-lg md:text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg md:text-xl w-10 md:w-12 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-lg md:text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 md:p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Sous-total :</span>
                    <span className="font-semibold">
                      {(calculateTotalPrice() * quantity).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-gray-600">Livraison :</span>
                    <span className={`font-semibold ${deliveryPrice === 0 ? 'text-green-600' : ''}`}>
                      {deliveryPrice === 0 ? 'GRATUITE' : `${deliveryPrice.toLocaleString('fr-DZ')} DA`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold">Total :</span>
                    <span className="text-xl md:text-2xl font-bold text-primary-600">
                      {((calculateTotalPrice() * quantity) + deliveryPrice).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-soft-lg hover:shadow-soft transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span>COMMANDER MAINTENANT</span>
                </button>

                <p className="text-center text-xs text-gray-500">
                  🔒 Paiement à la livraison • Garantie satisfait ou remboursé
                </p>
              </form>

              <div className="mt-4 flex items-center justify-center space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ou ajouter au panier
                </button>
                <ShareProductButton productId={product.id} productName={product.name} />
              </div>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-blue-50 rounded-2xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs md:text-sm">Livraison rapide</h4>
                  <p className="text-xs text-gray-600">Livraison en 48h</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-purple-50 rounded-2xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs md:text-sm">Garantie qualité</h4>
                  <p className="text-xs text-gray-600">Produit authentique</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits connexes */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Produits connexes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  onAddToCart={_onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
