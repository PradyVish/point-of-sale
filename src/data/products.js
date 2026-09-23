// Sample catalog. In-app changes last only until the page is refreshed.
export const initialProducts = [
  { _id: 'product-01', name: 'Whole Milk 1L', category: 'Dairy', sku: 'DAI-001', price: 60, stock: 24 },
  { _id: 'product-02', name: 'Butter 100g', category: 'Dairy', sku: 'DAI-002', price: 58, stock: 18 },
  { _id: 'product-03', name: 'Whole Wheat Bread', category: 'Bakery', sku: 'BAK-001', price: 45, stock: 15 },
  { _id: 'product-04', name: 'Chocolate Muffin', category: 'Bakery', sku: 'BAK-002', price: 40, stock: 8 },
  { _id: 'product-05', name: 'Basmati Rice 1kg', category: 'Groceries', sku: 'GRO-001', price: 120, stock: 30 },
  { _id: 'product-06', name: 'Wheat Flour 1kg', category: 'Groceries', sku: 'GRO-002', price: 55, stock: 25 },
  { _id: 'product-07', name: 'Orange Juice 1L', category: 'Beverages', sku: 'BEV-001', price: 110, stock: 16 },
  { _id: 'product-08', name: 'Mineral Water 1L', category: 'Beverages', sku: 'BEV-002', price: 20, stock: 48 },
  { _id: 'product-09', name: 'Potato Chips', category: 'Snacks', sku: 'SNK-001', price: 30, stock: 35 },
  { _id: 'product-10', name: 'Chocolate Cookies', category: 'Snacks', sku: 'SNK-002', price: 50, stock: 0 },
  { _id: 'product-11', name: 'Hand Soap', category: 'Household', sku: 'HOU-001', price: 75, stock: 12 },
  { _id: 'product-12', name: 'Dishwashing Liquid 500ml', category: 'Household', sku: 'HOU-002', price: 99, stock: 6 },
];

export function filterProducts(products, search, category = 'All') {
  const query = search.trim().toLowerCase();
  return products.filter(product =>
    (category === 'All' || product.category === category) &&
    (product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query))
  );
}
