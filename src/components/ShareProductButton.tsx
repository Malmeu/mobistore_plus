import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareProductButtonProps {
  productId: string
  productName: string
}

export default function ShareProductButton({ productId, productName }: ShareProductButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const singleProductUrl = `${window.location.origin}/sp/${productId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(singleProductUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowMenu(false)
    }, 2000)
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(singleProductUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const message = `Découvrez ${productName} sur Mobistore Plus : ${singleProductUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn-secondary py-2 px-4 flex items-center space-x-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Partager</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg z-50 overflow-hidden">
            <div className="p-4 border-b">
              <p className="text-sm font-medium text-gray-700">Partager ce produit</p>
            </div>
            
            <div className="p-2 space-y-1">
              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">f</span>
                </div>
                <span className="font-medium">Facebook</span>
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">W</span>
                </div>
                <span className="font-medium">WhatsApp</span>
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium">
                  {copied ? 'Lien copié !' : 'Copier le lien'}
                </span>
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 mb-2">Lien de vente directe :</p>
              <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 break-all border">
                {singleProductUrl}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
