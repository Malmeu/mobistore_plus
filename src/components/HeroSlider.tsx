import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/image1.jpeg',
    alt: 'Slide 1'
  },
  {
    id: 2,
    image: '/image2.jpeg',
    alt: 'Slide 2'
  },
  {
    id: 3,
    image: '/image3.jpeg',
    alt: 'Slide 3'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10" />
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-contain sm:object-cover object-center bg-gradient-to-br from-gray-900 to-gray-800"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3 md:space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8 sm:w-10 md:w-12 shadow-lg'
                : 'bg-white/50 w-6 sm:w-7 md:w-8 hover:bg-white/70'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
