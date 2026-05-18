import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.roles && payload.roles.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Failed to parse token');
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" className="nav-brand" style={{ flexShrink: 0 }}>
        Fresh<span>Cart</span>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '300px', display: 'flex', margin: '0 2rem' }}>
        <input 
          type="text" 
          placeholder="Search for groceries, vegetables, and more..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '0.75rem 1rem', 
            border: 'none', 
            borderRadius: '4px 0 0 4px',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button type="submit" style={{ 
          background: 'var(--primary)', 
          border: 'none', 
          padding: '0 1.5rem', 
          borderRadius: '0 4px 4px 0',
          cursor: 'pointer',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          Search
        </button>
      </form>

      <div className="nav-links" style={{ flexShrink: 0 }}>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            {isAdmin && <Link to="/admin" style={{ color: 'var(--primary)' }}>Admin</Link>}
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', marginLeft: '0.5rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
