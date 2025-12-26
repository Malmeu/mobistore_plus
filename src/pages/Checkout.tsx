import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { CartItem } from '../types'
import { WILAYAS } from '../types'

interface CheckoutProps {
  cartItems: CartItem[]
  onClearCart: () => void
}

export default function Checkout({ cartItems, onClearCart }: CheckoutProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    wilaya: '',
  })

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      setOrderPlaced(true)
      onClearCart()
      
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Commande confirmée !</h2>
            <p className="text-gray-600 text-lg">
              Merci pour votre commande. Nous vous contacterons bientôt pour confirmer la livraison.
            </p>
            <p className="text-sm text-gray-500">Redirection vers l'accueil...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-xl mb-4">Informations de livraison</h3>
                
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Wilaya *</label>
                    <select
                      required
                      value={formData.wilaya}
                      onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Sélectionnez votre wilaya</option>
                      {WILAYAS.map(wilaya => (
                        <option key={wilaya} value={wilaya}>{wilaya}</option>
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
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-xl mb-6">Votre commande</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{total.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
