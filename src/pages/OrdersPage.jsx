import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders', error));
  }, []);

  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <h2 style={{marginBottom: '2rem'}}>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem'}}>
                <div>
                  <span style={{fontWeight: 'bold'}}>Order #{order.id}</span>
                  <p style={{fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem'}}>{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <span style={{fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem'}}></span>
                  <p style={{fontSize: '0.875rem', marginTop: '0.25rem'}}>{order.status}</p>
                </div>
              </div>
              <ul style={{listStyle: 'none'}}>
                {order.orderItems?.map(item => (
                  <li key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                    <span>{item.product.productName} (x{item.quantity})</span>
                    <span></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
