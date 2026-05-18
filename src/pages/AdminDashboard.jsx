import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ productName: '', price: 0, description: '', stockQuantity: 10, category: '', imageUrl: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    api.get('/orders/all').then(res => setOrders(res.data)).catch(() => {});
    api.get('/products').then(res => setProducts(res.data)).catch(() => {});
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    api.post('/products', newProduct)
      .then(res => {
        alert('Product added');
        setProducts([...products, res.data]);
        setNewProduct({ productName: '', price: 0, description: '', stockQuantity: 10, category: '', imageUrl: '' });
      })
      .catch(err => alert('Failed to add product (are you Admin?)'));
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    api.put(`/products/${editingProduct.id}`, editingProduct)
      .then(res => {
        alert('Product updated');
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
        setEditingProduct(null);
      })
      .catch(err => alert('Failed to update product'));
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      api.delete(`/products/${id}`)
        .then(() => setProducts(products.filter(p => p.id !== id)))
        .catch(err => alert('Failed to delete'));
    }
  };

  return (
    <div>
      <h1 style={{marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '800'}}>Admin Dashboard</h1>
      
      <div className="card" style={{marginBottom: '2rem'}}>
        <h2 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <input className="form-control" type="text" placeholder="Name" required 
            value={editingProduct ? editingProduct.productName : newProduct.productName}
            onChange={e => editingProduct ? setEditingProduct({...editingProduct, productName: e.target.value}) : setNewProduct({...newProduct, productName: e.target.value})} />
          <input className="form-control" type="number" step="0.01" placeholder="Price" required 
            value={editingProduct ? editingProduct.price : (newProduct.price || '')}
            onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)}) : setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
          <input className="form-control" type="text" placeholder="Category" required 
            value={editingProduct ? editingProduct.category : newProduct.category}
            onChange={e => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})} />
          <input className="form-control" type="number" placeholder="Stock" required 
            value={editingProduct ? editingProduct.stockQuantity : newProduct.stockQuantity}
            onChange={e => editingProduct ? setEditingProduct({...editingProduct, stockQuantity: parseInt(e.target.value)}) : setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value)})} />
          <input className="form-control" type="text" placeholder="Image URL (optional)" 
            value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
            onChange={e => editingProduct ? setEditingProduct({...editingProduct, imageUrl: e.target.value}) : setNewProduct({...newProduct, imageUrl: e.target.value})} />
          
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <button type="submit" className="btn" style={{flex: 1}}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
            {editingProduct && <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>}
          </div>
        </form>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
        <div className="card">
          <h2 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Manage Inventory ({products.length})</h2>
          <div style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            <ul style={{listStyle: 'none', padding: 0}}>
              {products.map(p => (
                <li key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #e2e8f0'}}>
                  <div>
                    <div style={{fontWeight: '700', fontSize: '1.1rem'}}>{p.productName}</div>
                    <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
                      <span className="badge" style={{marginRight: '0.5rem'}}>{p.category || 'General'}</span>
                      ₹{p.price?.toFixed(2) ?? '0.00'} • Stock: <strong style={{color: p.stockQuantity < 10 ? 'red' : 'inherit'}}>{p.stockQuantity ?? 'N/A'}</strong>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button onClick={() => setEditingProduct(p)} className="btn" style={{backgroundColor: '#3b82f6', padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="btn" style={{backgroundColor: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>All Orders ({orders.length})</h2>
          <div style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            <ul style={{listStyle: 'none', padding: 0}}>
              {orders.length === 0 ? <p>No orders found.</p> : orders.map(o => (
                <li key={o.id} style={{padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '0.5rem', marginBottom: '0.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <strong style={{fontSize: '1.1rem', color: 'var(--secondary)'}}>Order #{o.id}</strong>
                    <span className="badge" style={{backgroundColor: o.status === 'DELIVERED' ? '#dcfce7' : '#fef3c7', color: o.status === 'DELIVERED' ? '#166534' : '#d97706'}}>
                      {o.status || 'PENDING'}
                    </span>
                  </div>
                  <div style={{fontSize: '0.95rem', color: '#475569'}}>
                    <p><strong>Customer:</strong> {o.user?.username} ({o.user?.email})</p>
                    <p><strong>Total Amount:</strong> <span style={{fontWeight: '700', color: 'var(--text-dark)'}}>₹{o.totalAmount?.toFixed(2) || '0.00'}</span></p>
                    <p><strong>Date:</strong> {o.orderDate ? new Date(o.orderDate).toLocaleString() : 'N/A'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
