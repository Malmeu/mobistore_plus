import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft, Star, Check, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ShareProductButton from '../components/ShareProductButton'
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
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
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
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
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

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      const total = (product.price * quantity) + deliveryPrice

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
          price: product.price,
        })

      if (itemsError) throw itemsError

      setOrderPlaced(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la commande')
    }
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
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft-lg p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-xl text-gray-600 mb-8">
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
                <span className="font-medium">{(product.price * quantity).toLocaleString('fr-DZ')} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison :</span>
                <span className="font-medium">{deliveryPrice === 0 ? 'GRATUITE' : `${deliveryPrice.toLocaleString('fr-DZ')} DA`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total :</span>
                <span className="text-primary-600">
                  {((product.price * quantity) + deliveryPrice).toLocaleString('fr-DZ')} DA
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

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="card p-4 overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card p-2 overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-4 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mb-6">
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
                <span className="text-gray-600">(4.8) • 247 avis</span>
              </div>

              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl p-6 mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold">
                    {product.price.toLocaleString('fr-DZ')}
                  </span>
                  <span className="text-2xl">DA</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center space-x-2 mb-6">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-xl transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <ShareProductButton productId={product.id} productName={product.name} />
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20">
              <h3 className="text-2xl font-bold mb-6">Commander maintenant</h3>
              
              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="input-field"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="input-field"
                    placeholder="05XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wilaya *</label>
                  <select
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="input-field"
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
                  <label className="block text-sm font-medium mb-2">Adresse *</label>
                  <textarea
                    required
                    value={formData.customer_address}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    className="input-field"
                    rows={2}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantité</label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-xl w-12 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total :</span>
                    <span className="font-semibold">
                      {(product.price * quantity).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison :</span>
                    <span className={`font-semibold ${deliveryPrice === 0 ? 'text-green-600' : ''}`}>
                      {deliveryPrice === 0 ? 'GRATUITE' : `${deliveryPrice.toLocaleString('fr-DZ')} DA`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-xl font-bold">Total :</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {((product.price * quantity) + deliveryPrice).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-soft-lg hover:shadow-soft transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>COMMANDER MAINTENANT</span>
                </button>

                <p className="text-center text-xs text-gray-500">
                  🔒 Paiement à la livraison • Garantie satisfait ou remboursé
                </p>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-pastel-blue/30 rounded-2xl">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Livraison rapide</h4>
                  <p className="text-xs text-gray-600">48h maximum</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-pastel-green/30 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Garantie qualité</h4>
                  <p className="text-xs text-gray-600">100% authentique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
