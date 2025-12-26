import { useState, useEffect } from 'react'
import type { Product } from '../types'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId)
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
}
