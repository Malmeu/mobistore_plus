import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Phone, ShoppingCart, Check, Star, Truck, Shield, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'
import { WILAYAS } from '../types'

export default function SingleProduct() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [productImages, setProductImages] = useState<string[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
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

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      const total = product.price * quantity

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Produit non trouvé</h2>
          <p className="text-gray-600">Le produit que vous recherchez n'existe pas.</p>
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
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total :</span>
                <span className="text-primary-600">
                  {(product.price * quantity).toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Phone className="w-5 h-5" />
            <p className="text-sm">Notre équipe vous contactera dans les 24h</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 via-white to-pastel-pink/20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-3 text-center">
        <p className="text-sm font-medium">
          🎉 OFFRE SPÉCIALE : Livraison GRATUITE dans toute l'Algérie !
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
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
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(4.8) • 247 avis</span>
              </div>

              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl p-8 mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-6xl font-bold">
                    {product.price.toLocaleString('fr-DZ')}
                  </span>
                  <span className="text-3xl">DA</span>
                </div>
                <p className="text-white/90 mt-2">Livraison gratuite incluse</p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center space-x-3 mb-6">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-medium">
                  ✅ En stock • Expédition sous 24h
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 space-y-4">
              <h3 className="font-semibold text-xl">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <Truck className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Livraison 48h</p>
              </div>
              <div className="card p-4 text-center">
                <Shield className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Garantie qualité</p>
              </div>
              <div className="card p-4 text-center">
                <Clock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Support 24/7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft-lg p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Commandez maintenant !</h2>
              <p className="text-xl text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer
              </p>
            </div>

            <form onSubmit={handleOrder} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium mb-2">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="input-field"
                    placeholder="05XX XX XX XX"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-2">Adresse complète *</label>
                <textarea
                  required
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Votre adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantité</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-2xl w-16 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Sous-total :</span>
                  <span className="font-semibold">
                    {(product.price * quantity).toLocaleString('fr-DZ')} DA
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Livraison :</span>
                  <span className="font-semibold text-green-600">GRATUITE</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold">Total :</span>
                  <span className="text-3xl font-bold text-primary-600">
                    {(product.price * quantity).toLocaleString('fr-DZ')} DA
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-2xl font-bold text-xl shadow-soft-lg hover:shadow-soft transition-all hover:scale-105 flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>COMMANDER MAINTENANT</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <p className="text-center text-sm text-gray-500">
                🔒 Paiement sécurisé à la livraison • Garantie satisfait ou remboursé
              </p>
            </form>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-blue to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Livraison rapide</h3>
            <p className="text-gray-600">Livraison dans toute l'Algérie en 48h maximum</p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-purple to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Garantie qualité</h3>
            <p className="text-gray-600">Produits authentiques 100% garantis</p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-green to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Support client</h3>
            <p className="text-gray-600">Assistance disponible 7j/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}
