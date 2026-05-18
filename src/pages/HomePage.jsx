import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import Carousel from '../components/Carousel';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    api.get('/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products', error));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(product => product.category || 'General')));
    return ['All', ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => (product.category || 'General') === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        (product.productName && product.productName.toLowerCase().includes(searchQuery)) ||
        (product.description && product.description.toLowerCase().includes(searchQuery)) ||
        (product.category && product.category.toLowerCase().includes(searchQuery))
      );
    }

    return filtered;
  }, [products, selectedCategory, location.search]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (productId) => {
    api.post('/cart/add', { productId, quantity: 1 })
      .then(() => showToast('✅ Item successfully added to cart!'))
      .catch(() => showToast('❌ Failed to add to cart. Please log in.'));
  };

  const searchParams = new URLSearchParams(location.search);
  const isSearchActive = searchParams.has('search');

  return (
    <div style={{ position: 'relative' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'var(--white)',
          color: 'var(--text-dark)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: '4px solid var(--primary)',
          zIndex: 1000,
          fontWeight: '600'
        }}>
          {toastMessage}
        </div>
      )}

      {!isSearchActive && <Carousel />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: isSearchActive ? '1rem' : '0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Explore Categories</h2>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {categories.map(category => (
          <button
            key={category}
            style={{
              backgroundColor: selectedCategory === category ? 'var(--secondary)' : '#e2e8f0',
              color: selectedCategory === category ? '#fff' : 'var(--text-dark)',
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'var(--transition)',
              boxShadow: selectedCategory === category ? 'var(--shadow)' : 'none'
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>
        {isSearchActive 
          ? `Search Results for "${searchParams.get('search')}"` 
          : (selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Products`)}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {visibleProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <h3>No products found. Try adjusting your search or category filter.</h3>
          </div>
        ) : visibleProducts.map(product => (
          <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.productName} className="product-image" />
              ) : (
                <div className="product-image" style={{ backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-light)' }}>No Image</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>{product.productName}</h3>
                <span className="badge">{product.category || 'General'}</span>
              </div>
              
              <p style={{ color: 'var(--text-light)', margin: '0.5rem 0', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <p className="price">₹{product.price?.toFixed(2) ?? '0.00'}</p>
                <p style={{ fontSize: '0.85rem', color: product.stockQuantity > 0 ? 'var(--primary-dark)' : 'red', fontWeight: '600' }}>
                  {product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                </p>
              </div>
            </div>
            <button 
              className="btn" 
              style={{ width: '100%', marginTop: '1.5rem' }} 
              onClick={() => addToCart(product.id)}
              disabled={product.stockQuantity <= 0}
            >
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
