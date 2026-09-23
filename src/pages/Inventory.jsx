import { useState } from 'react';
import { filterProducts } from '../data/products';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function Inventory({ products, setProducts }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    sku: ''
  });
  const [editingId, setEditingId] = useState(null);

  const filteredProducts = filterProducts(products, search);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      ...formData,
      name: formData.name.trim(),
      category: formData.category.trim(),
      sku: formData.sku.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      _id: editingId || crypto.randomUUID(),
    };
    if (!product.name || !product.category || !product.sku ||
        !Number.isFinite(product.price) || product.price < 0 ||
        !Number.isInteger(product.stock) || product.stock < 0) {
      alert('Enter valid product details, a non-negative price and whole stock quantity.');
      return;
    }
    if (products.some(item => item._id !== editingId && item.sku.toLowerCase() === product.sku.toLowerCase())) {
      alert('A product with this SKU already exists.');
      return;
    }
    setProducts(current => editingId
      ? current.map(item => item._id === editingId ? product : item)
      : [...current, product]);
    setShowForm(false);
    setFormData({ name: '', category: '', price: '', stock: '', sku: '' });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(current => current.filter(product => product._id !== id));
    }
  };

  return (
    <div className="flex-col h-full">
      <header className="topbar justify-between">
        <h2 style={{ margin: 0 }}>Inventory Management</h2>
        <div className="flex gap-4">
          <div className="input-group" style={{ margin: 0, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search inventory..." 
              style={{ paddingLeft: '2.5rem', background: 'var(--bg-secondary)', width: '300px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', category: '', price: '', stock: '', sku: '' });
            setShowForm(true);
          }}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </header>

      <div className="content-area">
        <div className="table-container glass-panel">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td></tr>
              )}
              {filteredProducts.map(p => (
                <tr key={p._id}>
                  <td><span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{p.sku}</span></td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.category}</td>
                  <td className="text-success font-bold">₹{p.price}</td>
                  <td>
                    <span style={{ color: p.stock < 10 ? 'var(--accent-warning)' : 'inherit' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon" onClick={() => handleEdit(p)}><Edit size={14} /></button>
                      <button className="btn-icon" style={{ color: 'var(--accent-danger)' }} onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Product Name</label>
                <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label>Category</label>
                  <input required type="text" className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="input-group w-full">
                  <label>SKU</label>
                  <input required type="text" className="input" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label>Price (₹)</label>
                  <input required type="number" min="0" step="0.01" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="input-group w-full">
                  <label>Stock Quantity</label>
                  <input required type="number" min="0" step="1" className="input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
