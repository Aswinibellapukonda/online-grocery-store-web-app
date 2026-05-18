import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get('/cart')
      .then(response => setCart(response.data))
      .catch(err => console.error('Error fetching cart', err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = (cartItemId) => {
    api.delete(`/cart/remove/${cartItemId}`)
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const handleCheckout = () => {
    api.post('/orders/place')
      .then(() => {
        alert('✅ Order placed successfully!');
        navigate('/orders');
      })
      .catch(err => alert('❌ Failed to place order. Cart might be empty.'));
  };

  if (!cart) return <div style={{textAlign: 'center', padding: '3rem', fontSize: '1.25rem', color: 'var(--text-light)'}}>Loading cart...</div>;

  const total = cart.cartItems?.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '2rem'}}>Your Shopping Cart</h2>
      
      {cart.cartItems?.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem 0'}}>
          <p style={{fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1.5rem'}}>Your cart is currently empty.</p>
          <button className="btn" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div>
          <ul style={{listStyle: 'none', padding: 0}}>
            {cart.cartItems?.map(item => (
              <li key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid #e2e8f0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt={item.product.productName} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem'}} />
                  )}
                  <div>
                    <h4 style={{fontSize: '1.1rem', marginBottom: '0.25rem'}}>{item.product.productName}</h4>
                    <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>Quantity: <strong style={{color: 'var(--text-dark)'}}>{item.quantity}</strong></p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontWeight: '800', marginBottom: '0.75rem', fontSize: '1.2rem', color: 'var(--text-dark)'}}>
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button className="btn" style={{backgroundColor: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem'}} onClick={() => handleRemove(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          
          <div style={{marginTop: '2rem', textAlign: 'right', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem'}}>
            <h3 style={{fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.5rem'}}>
              Subtotal: <span style={{fontWeight: '800', color: 'var(--primary-dark)'}}>₹{total.toFixed(2)}</span>
            </h3>
            <p style={{color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Taxes and shipping calculated at checkout.</p>
            <button className="btn" style={{fontSize: '1.1rem', padding: '0.75rem 3rem', width: '100%', maxWidth: '300px'}} onClick={handleCheckout}>Secure Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
