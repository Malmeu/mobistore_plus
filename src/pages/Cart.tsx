import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CartItem } from '../types'

interface CartProps {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-3xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Votre panier est vide</h2>
            <p className="text-gray-600">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link to="/products" className="btn-primary inline-block">
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Votre Panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="card p-6">
                <div className="flex gap-6">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-2xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm">{item.product.category}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {(item.product.price * item.quantity).toLocaleString('fr-DZ')} DA
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.product.price.toLocaleString('fr-DZ')} DA / unité
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-xl mb-6">Résumé de la commande</h3>
              
              <div className="space-y-3 mb-6">
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

              <Link to="/checkout" className="btn-primary w-full text-center block">
                Passer la commande
              </Link>

              <Link to="/products" className="btn-secondary w-full text-center block mt-3">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
