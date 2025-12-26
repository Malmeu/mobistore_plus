import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Eye, Truck, Upload, Clock, CheckCircle, XCircle, Phone, MapPin, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'
import { WILAYAS } from '../types'

interface DeliverySetting {
  id: string
  wilaya: string
  price: number
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  wilaya: string
  total: number
  status: string
  created_at: string
}

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  products?: Product
}

export default function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({})
  const [deliverySettings, setDeliverySettings] = useState<DeliverySetting[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'coques',
    stock: '',
  })
  const [deliveryPrices, setDeliveryPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchDeliverySettings()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])

      for (const order of data || []) {
        const { data: items } = await supabase
          .from('order_items')
          .select('*, products(*)')
          .eq('order_id', order.id)

        if (items) {
          setOrderItems(prev => ({ ...prev, [order.id]: items }))
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchDeliverySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_settings')
        .select('*')

      if (error) throw error
      setDeliverySettings(data || [])
      
      const prices: Record<string, string> = {}
      data?.forEach(setting => {
        prices[setting.wilaya] = setting.price.toString()
      })
      setDeliveryPrices(prices)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files])
      
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) {
      return formData.image_url ? [formData.image_url] : []
    }

    setUploadingImage(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      return uploadedUrls
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload des images.')
      return formData.image_url ? [formData.image_url] : []
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const imageUrls = await uploadImages()
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: imageUrls[0] || formData.image_url,
        category: formData.category,
        stock: parseInt(formData.stock),
      }

      let productId: string

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        productId = editingProduct.id

        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()

        if (error) throw error
        productId = data.id
      }

      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url, index) => ({
          product_id: productId,
          image_url: url,
          display_order: index,
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords)

        if (imagesError) throw imagesError
      }

      setShowAddModal(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', image_url: '', category: 'coques', stock: '' })
      setImageFiles([])
      setImagePreviews([])
      fetchProducts()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleSaveDeliveryPrices = async () => {
    try {
      for (const wilaya of Object.keys(deliveryPrices)) {
        const price = parseFloat(deliveryPrices[wilaya] || '0')
        
        const existing = deliverySettings.find(s => s.wilaya === wilaya)
        
        if (existing) {
          await supabase
            .from('delivery_settings')
            .update({ price })
            .eq('wilaya', wilaya)
        } else {
          await supabase
            .from('delivery_settings')
            .insert({ wilaya, price })
        }
      }
      
      setShowDeliveryModal(false)
      fetchDeliverySettings()
      alert('Prix de livraison mis à jour avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleEdit = async (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      stock: product.stock.toString(),
    })

    try {
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order')

      if (images && images.length > 0) {
        setImagePreviews(images.map(img => img.image_url))
      } else {
        setImagePreviews([product.image_url])
      }
    } catch (error) {
      setImagePreviews([product.image_url])
    }

    setImageFiles([])
    setShowAddModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'shipped': return 'Expédiée'
      case 'delivered': return 'Livrée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const stats = [
    { label: 'Total Produits', value: products.length, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'En Stock', value: products.filter(p => p.stock > 0).length, icon: ShoppingCart, color: 'from-green-500 to-green-600' },
    { label: 'Rupture', value: products.filter(p => p.stock === 0).length, icon: TrendingUp, color: 'from-red-500 to-red-600' },
    { label: 'Catégories', value: new Set(products.map(p => p.category)).size, icon: Users, color: 'from-purple-500 to-purple-600' },
  ]

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Gérez vos produits et commandes</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
            <button
              onClick={() => setShowDeliveryModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Truck className="w-5 h-5" />
              <span>Prix de livraison</span>
            </button>
            <button
              onClick={() => {
                setEditingProduct(null)
                setFormData({ name: '', description: '', price: '', image_url: '', category: 'coques', stock: '' })
                setImageFiles([])
                setImagePreviews([])
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un produit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Produits ({products.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Commandes ({orders.length})</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <div className="card p-6">
          <h2 className="text-2xl font-bold mb-6">Liste des produits</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Image</th>
                    <th className="text-left py-4 px-4">Nom</th>
                    <th className="text-left py-4 px-4">Catégorie</th>
                    <th className="text-left py-4 px-4">Prix</th>
                    <th className="text-left py-4 px-4">Stock</th>
                    <th className="text-right py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      </td>
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold">
                        {product.price.toLocaleString('fr-DZ')} DA
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          product.stock > 5 ? 'bg-green-100 text-green-700' :
                          product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`/sp/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir la page de vente"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </a>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-primary-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {activeTab === 'orders' && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Gestion des commandes</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">{order.customer_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusLabel(order.status)}</span>
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{order.customer_phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{order.wilaya} - {order.customer_address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(order.created_at).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{order.total.toLocaleString('fr-DZ')} DA</p>
                      </div>
                    </div>

                    {orderItems[order.id] && (
                      <div className="border-t pt-4 mb-4">
                        <p className="text-sm font-semibold mb-2">Produits commandés :</p>
                        <div className="space-y-2">
                          {orderItems[order.id].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 text-sm">
                              {item.products && (
                                <>
                                  <img 
                                    src={item.products.image_url} 
                                    alt={item.products.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{item.products.name}</p>
                                    <p className="text-gray-600">Quantité: {item.quantity} × {item.price.toLocaleString('fr-DZ')} DA</p>
                                  </div>
                                  <p className="font-semibold">{(item.quantity * item.price).toLocaleString('fr-DZ')} DA</p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className="input-field flex-1"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-soft-lg w-full max-w-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Ex: Coque iPhone 14 Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Description du produit"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix (DA) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      placeholder="1500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="coques">Coques</option>
                    <option value="chargeurs">Chargeurs</option>
                    <option value="ecouteurs">Écouteurs</option>
                    <option value="cables">Câbles</option>
                    <option value="protections">Protections d'écran</option>
                    <option value="supports">Supports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images du produit *</label>
                  
                  {imagePreviews.length > 0 && (
                    <div className="mb-4 grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Aperçu ${index + 1}`}
                            className="w-full h-32 object-cover rounded-2xl"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                        <Upload className="w-5 h-5" />
                        <span>Ajouter des images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imageFiles.length > 0 && (
                        <span className="text-sm text-green-600">✓ {imageFiles.length} image(s) sélectionnée(s)</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">ou</div>
                    
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="input-field"
                      placeholder="URL de l'image (https://...)"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="btn-primary flex-1"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Upload en cours...' : editingProduct ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeliveryModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-soft-lg w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
                <Truck className="w-8 h-8 text-primary-600" />
                <span>Prix de livraison par wilaya</span>
              </h2>
              
              <p className="text-gray-600 mb-6">
                Définissez le prix de livraison pour chaque wilaya. Laissez à 0 pour la livraison gratuite.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {WILAYAS.map((wilaya) => (
                  <div key={wilaya} className="flex items-center space-x-3">
                    <label className="flex-1 text-sm font-medium">{wilaya}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={deliveryPrices[wilaya] || '0'}
                        onChange={(e) => setDeliveryPrices({ ...deliveryPrices, [wilaya]: e.target.value })}
                        className="input-field w-32"
                        placeholder="0"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">DA</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveDeliveryPrices}
                  className="btn-primary flex-1"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrderModal(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-soft-lg w-full max-w-3xl p-8">
              <h2 className="text-3xl font-bold mb-6">Détails de la commande</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Informations client</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nom :</span>
                        <p className="font-medium">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Téléphone :</span>
                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Wilaya :</span>
                        <p className="font-medium">{selectedOrder.wilaya}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Adresse :</span>
                        <p className="font-medium">{selectedOrder.customer_address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Informations commande</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Date :</span>
                        <p className="font-medium">
                          {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Statut :</span>
                        <p className="font-medium">
                          <span className={`px-3 py-1 rounded-full text-xs inline-flex items-center space-x-1 ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            <span>{getStatusLabel(selectedOrder.status)}</span>
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total :</span>
                        <p className="font-bold text-2xl text-primary-600">{selectedOrder.total.toLocaleString('fr-DZ')} DA</p>
                      </div>
                    </div>
                  </div>
                </div>

                {orderItems[selectedOrder.id] && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Produits commandés</h3>
                    <div className="space-y-3">
                      {orderItems[selectedOrder.id].map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                          {item.products && (
                            <>
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                                className="w-20 h-20 object-cover rounded-xl"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">{item.products.name}</p>
                                <p className="text-sm text-gray-600">{item.products.description}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Quantité: {item.quantity} × {item.price.toLocaleString('fr-DZ')} DA
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{(item.quantity * item.price).toLocaleString('fr-DZ')} DA</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Fermer
                  </button>
                  <a
                    href={`tel:${selectedOrder.customer_phone}`}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appeler le client</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
