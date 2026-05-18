import { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      title: "Fresh Groceries Delivered",
      subtitle: "Up to 50% off on fresh produce today!"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
      title: "Daily Essentials",
      subtitle: "Stock up your pantry with best prices."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80",
      title: "Farm Fresh Vegetables",
      subtitle: "Directly from farmers to your doorstep."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="carousel-container" style={{ position: 'relative' }}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '2rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {slide.subtitle}
          </p>
          <button className="btn" style={{ padding: '0.75rem 2rem', fontSize: '1.25rem' }}>
            Shop Now
          </button>
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
