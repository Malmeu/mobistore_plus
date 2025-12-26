import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Send } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                    <p className="text-gray-600">+213 XXX XXX XXX</p>
                    <p className="text-gray-600">+213 YYY YYY YYY</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pastel-purple to-neon-purple rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">contact@mobistore.dz</p>
                    <p className="text-gray-600">support@mobistore.dz</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pastel-pink to-red-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                    <p className="text-gray-600">123 Rue Didouche Mourad</p>
                    <p className="text-gray-600">Alger Centre, Alger 16000</p>
                    <p className="text-gray-600">Algérie</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pastel-green to-green-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Horaires d'ouverture</h3>
                    <p className="text-gray-600">Samedi - Jeudi : 9h00 - 18h00</p>
                    <p className="text-gray-600">Vendredi : Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Suivez-nous</h2>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-soft"
                >
                  <Facebook className="w-7 h-7 text-white" />
                </a>
                <a
                  href="#"
                  className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-soft"
                >
                  <Instagram className="w-7 h-7 text-white" />
                </a>
              </div>
            </div>

            <div className="card p-4 overflow-hidden rounded-3xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.0984073893195!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ1JzEzLjciTiAzwrAwMycyNy43IkU!5e0!3m2!1sfr!2sdz!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '1rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message envoyé !</h3>
                <p className="text-green-600">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="05XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sujet *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="info">Demande d'information</option>
                    <option value="order">Question sur une commande</option>
                    <option value="product">Question sur un produit</option>
                    <option value="return">Retour / Échange</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    rows={6}
                    placeholder="Votre message..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-blue to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Support téléphonique</h3>
            <p className="text-gray-600 text-sm">Disponible du Samedi au Jeudi de 9h à 18h</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-purple to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Support par email</h3>
            <p className="text-gray-600 text-sm">Réponse sous 24h ouvrées maximum</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-pink to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Visite en magasin</h3>
            <p className="text-gray-600 text-sm">Venez découvrir nos produits sur place</p>
          </div>
        </div>
      </div>
    </div>
  )
}
