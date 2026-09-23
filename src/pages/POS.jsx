import { useState, useRef } from 'react';
import { filterProducts } from '../data/products';
import { Search, Filter, Plus, Minus, Trash2, CheckCircle, Printer, ShoppingCart } from 'lucide-react';

export default function POS({ products, setProducts }) {
  const categories = ['All', ...new Set(products.map(product => product.category))];
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState(1001);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lastSale, setLastSale] = useState(null);
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const printRef = useRef(null);

  const filteredProducts = filterProducts(products, search, category);

  const addToCart = (product) => {
    const existing = cart.find(item => item.product === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Not enough stock!");
        return;
      }
      setCart(cart.map(item =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      if (product.stock <= 0) {
        alert("Out of stock!");
        return;
      }
      setCart([...cart, {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
        maxStock: product.stock
      }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.product === id) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= item.maxStock) {
          return { ...item, quantity: newQty, subtotal: newQty * item.price };
        }
        if (newQty > item.maxStock) {
          alert("Not enough stock!");
        }
        return item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.product !== id));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = cartSubtotal * 0.05; // 5% flat tax for example
  const cartTotal = cartSubtotal + tax;

  const [checkoutError, setCheckoutError] = useState('');

  const handleCheckout = () => {
    setCheckoutError('');
    if (!cart.length) return;
    if (paymentMethod === 'Cash' && (!Number.isFinite(Number(amountReceived)) || Number(amountReceived) < cartTotal)) {
      setCheckoutError('Enter enough cash to cover the total.');
      return;
    }
    setLastSale({
      _id: crypto.randomUUID(),
      items: cart,
      subtotal: cartSubtotal,
      discount: 0,
      total: cartTotal,
      paymentMethod,
      customerName: dpdpConsent ? customerName : '',
      customerPhone: dpdpConsent ? customerPhone : '',
    });
    setProducts(current => current.map(product => {
      const item = cart.find(entry => entry.product === product._id);
      return item ? { ...product, stock: product.stock - item.quantity } : product;
    }));
    setCart([]);
    setOrderNumber(current => current + 1);
    setCustomerName('');
    setCustomerPhone('');
    setAmountReceived('');
    setDpdpConsent(false);
    setShowCheckout(false);
    setShowSuccess(true);
  };

  const printReceipt = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quick reset after print
  };

  return (
    <div className="flex h-full">
      {/* Main Product Area */}
      <div className="flex-col" style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
        <header className="topbar">
          <div className="flex items-center gap-4 w-full">
            <div className="input-group" style={{ margin: 0, flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input"
                placeholder="Search products by name, SKU..."
                style={{ paddingLeft: '2.5rem', background: 'var(--bg-secondary)' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} color="var(--text-muted)" />
              <select className="input" style={{ width: '200px' }} value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="content-area">
            <div className="product-grid">
              {filteredProducts.map(p => (
                <div key={p._id} className="product-card" onClick={() => addToCart(p)}>
                  <span className="product-category-tag">{p.category}</span>
                  <h3 className="product-name">{p.name}</h3>
                  <div className="flex justify-between items-end mt-2">
                    <span className="product-price">₹{p.price}</span>
                    <span className="product-stock" style={{ color: p.stock < 10 ? 'var(--accent-warning)' : '' }}>
                      {p.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && <p className="text-muted">No products found.</p>}
            </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="cart-panel">
        <div className="cart-header">
          <h2 style={{ margin: 0 }}>Current Order</h2>
          <p className="text-muted text-sm">Order #{orderNumber}</p>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted gap-2">
              <ShoppingCart size={48} opacity={0.5} />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product} className="cart-item">
                <div className="cart-item-info">
                  <h4 className="cart-item-name" title={item.name}>{item.name}</h4>
                  <div className="cart-item-price">₹{item.price} x {item.quantity} = ₹{item.subtotal}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product, -1)}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.875rem', minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product, 1)}><Plus size={14} /></button>
                  </div>
                  <button className="btn-icon" style={{ color: 'var(--accent-danger)' }} onClick={() => removeFromCart(item.product)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span style={{ color: 'var(--accent-success)' }}>- ₹0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary w-full mt-4"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            Charge ₹{cartTotal.toFixed(2)}
          </button>
        </div>
      </div>

      {/* ── Billing Counter Modal ── */}
      {showCheckout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div className="billing-counter-modal">

            {/* Left Panel: Order Summary */}
            <div className="billing-order-panel">
              <div className="billing-panel-header">
                <span style={{ fontSize: '1.4rem' }}>🧾</span>
                <div>
                  <h3 style={{ margin: 0 }}>Order Summary</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="billing-items-scroll">
                {cart.map(item => (
                  <div key={item.product} className="billing-item-row">
                    <span className="billing-item-name">{item.name}</span>
                    <div className="billing-item-right">
                      <span className="billing-item-qty">×{item.quantity}</span>
                      <span className="billing-item-price">₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="billing-totals">
                <div className="billing-total-row">
                  <span>Subtotal</span><span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="billing-total-row">
                  <span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="billing-total-row">
                  <span>Discount</span><span style={{ color: 'var(--accent-success)' }}>— ₹0.00</span>
                </div>
                <div className="billing-grand-total">
                  <span>Grand Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Customer & Payment */}
            <div className="billing-form-panel">
              <div className="billing-panel-header">
                <span style={{ fontSize: '1.4rem' }}>🏪</span>
                <div>
                  <h3 style={{ margin: 0 }}>Billing Counter</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete your purchase</p>
                </div>
              </div>

              {/* ── DPDP Consent Block ── */}
              <div className="dpdp-notice">
                <div className="dpdp-notice-header">
                  <div className="dpdp-shield">🛡️</div>
                  <div>
                    <h4 className="dpdp-title">Data Collection Notice</h4>
                    <p className="dpdp-act-tag">Static demo</p>
                  </div>
                </div>
                <p className="dpdp-body">
                  Optional customer details are used only for this demo sale. They stay in memory
                  and are cleared when you refresh the page.
                </p>
                <label className="dpdp-consent-row">
                  <input
                    type="checkbox"
                    className="dpdp-checkbox"
                    checked={dpdpConsent}
                    onChange={e => {
                      setDpdpConsent(e.target.checked);
                      if (!e.target.checked) { setCustomerName(''); setCustomerPhone(''); }
                    }}
                  />
                  <span>I voluntarily consent to share my personal data for billing purposes</span>
                </label>
                {!dpdpConsent && (
                  <p className="dpdp-skip-note">⚡ You may also proceed without sharing personal data</p>
                )}
              </div>

              {/* Customer Fields — only after consent */}
              {dpdpConsent && (
                <div className="billing-customer-fields">
                  <div className="input-group">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      className="input"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="input-group">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      className="input"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</p>
                <div className="payment-methods-grid">
                  {[
                    { id: 'Cash',  icon: '💵', label: 'Cash' },
                    { id: 'Card',  icon: '💳', label: 'Card' },
                    { id: 'UPI',   icon: '📱', label: 'UPI' },
                  ].map(({ id, icon, label }) => (
                    <button
                      key={id}
                      className={`payment-method-btn ${paymentMethod === id ? 'active' : ''}`}
                      onClick={() => { setPaymentMethod(id); setAmountReceived(''); }}
                    >
                      <span className="payment-icon">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Received (Cash only) */}
              {paymentMethod === 'Cash' && (
                <div className="input-group">
                  <label>Cash Received (₹)</label>
                  <input
                    type="number"
                    className="input"
                    value={amountReceived}
                    onChange={e => setAmountReceived(e.target.value)}
                    placeholder={`Minimum ₹${cartTotal.toFixed(2)}`}
                    min={cartTotal}
                  />
                  {amountReceived && Number(amountReceived) >= cartTotal && (
                    <div className="change-display">
                      <span>💰 Change to Return</span>
                      <span className="change-amount">₹{(Number(amountReceived) - cartTotal).toFixed(2)}</span>
                    </div>
                  )}
                  {amountReceived && Number(amountReceived) < cartTotal && (
                    <div className="change-display insufficient">
                      <span>⚠️ Insufficient amount</span>
                      <span>Need ₹{(cartTotal - Number(amountReceived)).toFixed(2)} more</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="billing-actions">
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setShowCheckout(false); setDpdpConsent(false); setCheckoutError(''); }}>Cancel</button>
                <button
                  className="btn btn-success"
                  style={{ flex: 2 }}
                  onClick={handleCheckout}
                  disabled={paymentMethod === 'Cash' && (!amountReceived || Number(amountReceived) < cartTotal)}
                >
                  ✓ Complete Sale — ₹{cartTotal.toFixed(2)}
                </button>
              </div>
              {/* Cash payment hint */}
              {paymentMethod === 'Cash' && (!amountReceived || Number(amountReceived) < cartTotal) && (
                <p style={{ fontSize: '0.78rem', color: 'var(--accent-warning)', textAlign: 'center', marginTop: '0.4rem' }}>
                  ⚠️ Enter cash received above to enable payment
                </p>
              )}
              {/* Inline error */}
              {checkoutError && (
                <div style={{
                  marginTop: '0.5rem', padding: '0.65rem 0.85rem',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                  color: 'var(--accent-danger)', display: 'flex', gap: '0.4rem', alignItems: 'flex-start'
                }}>
                  ❌ {checkoutError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} color="var(--accent-success)" />
            </div>
            <h2>Demo Sale Complete!</h2>
            <p className="text-muted mb-6">Simulated payment via {lastSale?.paymentMethod}</p>

            <div className="flex gap-4">
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={printReceipt}>
                <Printer size={18} /> Print Bill
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowSuccess(false)}>
                New Sale
              </button>
            </div>

            {/* Hidden Receipt for Printing */}
            <div style={{ display: 'none' }}>
              <div ref={printRef} className="receipt">
                <div className="receipt-header">
                  <h2>QuickPOS Supermarket</h2>
                  <p>123 Main Street, City</p>
                  <p>Date: {new Date().toLocaleString()}</p>
                  <p>Receipt #{lastSale?._id.slice(-8)}</p>
                </div>
                <div>
                  {lastSale?.items.map(item => (
                    <div className="receipt-item" key={item.product}>
                      <span>{item.name.substring(0, 20)} x{item.quantity}</span>
                      <span>{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="receipt-total">
                  <div className="receipt-item"><span>Subtotal:</span><span>{lastSale?.subtotal}</span></div>
                  <div className="receipt-item"><span>Tax:</span><span>{(lastSale?.total - lastSale?.subtotal).toFixed(2)}</span></div>
                  <div className="receipt-item"><span>Total:</span><span>{lastSale?.total}</span></div>
                  <div className="receipt-item"><span>Payment:</span><span>{lastSale?.paymentMethod}</span></div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <p>Thank you for shopping!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
