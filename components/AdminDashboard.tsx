import React, { useState } from 'react';
import { Product, Order } from '../types';
import { Plus, Trash2, Package, Check, Truck, XCircle, Search } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onAddProduct, 
  onDeleteProduct,
  orders,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Shirts',
    image: 'https://picsum.photos/400/500?random=' + Math.floor(Math.random() * 1000)
  });

  if (!isOpen) return null;

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      onAddProduct({
        id: Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category || 'Shirts',
        image: newProduct.image || 'https://picsum.photos/400/500'
      });
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        price: 0,
        category: 'Shirts',
        image: 'https://picsum.photos/400/500?random=' + Math.floor(Math.random() * 1000)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-100 overflow-y-auto">
      <div className="min-h-screen">
        {/* Top Bar */}
        <header className="bg-stone-900 text-white shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl">StyleHive</span>
                <span className="bg-stone-700 text-xs px-2 py-0.5 rounded text-stone-200">Admin</span>
            </div>
            <div className="flex items-center gap-4">
               <nav className="flex gap-4 mr-8">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`text-sm font-medium transition-colors ${activeTab === 'orders' ? 'text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    Orders
                  </button>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`text-sm font-medium transition-colors ${activeTab === 'products' ? 'text-white' : 'text-stone-400 hover:text-white'}`}
                  >
                    Products
                  </button>
               </nav>
               <button onClick={onClose} className="text-stone-400 hover:text-white">Exit Dashboard</button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {activeTab === 'orders' && (
            <div>
               <h2 className="text-2xl font-bold text-stone-900 font-serif mb-6">Order Management</h2>
               <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-200">
                      <thead className="bg-stone-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-stone-200">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-stone-500">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">#{order.id.slice(-6)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{order.userEmail}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${order.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {order.status}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                                    <div className="flex gap-2">
                                        {order.status !== 'Shipped' && (
                                            <button onClick={() => onUpdateOrderStatus(order.id, 'Shipped')} className="text-blue-600 hover:text-blue-900" title="Mark Shipped"><Truck size={18} /></button>
                                        )}
                                        {order.status !== 'Verified' && (
                                            <button onClick={() => onUpdateOrderStatus(order.id, 'Verified')} className="text-green-600 hover:text-green-900" title="Mark Verified"><Check size={18} /></button>
                                        )}
                                        {order.status !== 'Cancelled' && (
                                            <button onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')} className="text-red-600 hover:text-red-900" title="Cancel Order"><XCircle size={18} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-stone-900 font-serif">Product Management</h2>
                    <button 
                        onClick={() => setIsAddingProduct(true)}
                        className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>

                {isAddingProduct && (
                    <div className="mb-8 bg-white p-6 rounded-lg shadow animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-medium text-stone-900 mb-4">Add New Product</h3>
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700">Product Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm border p-2 focus:ring-stone-500 focus:border-stone-500" 
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700">Price ($)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm border p-2 focus:ring-stone-500 focus:border-stone-500" 
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700">Category</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm border p-2 focus:ring-stone-500 focus:border-stone-500"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                >
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Pants">Pants</option>
                                    <option value="Outerwear">Outerwear</option>
                                    <option value="Coats">Coats</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700">Image URL</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm border p-2 focus:ring-stone-500 focus:border-stone-500" 
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddingProduct(false)}
                                    className="px-4 py-2 text-stone-600 hover:text-stone-900"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden group">
                            <div className="relative h-48">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => onDeleteProduct(product.id)}
                                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Product"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-stone-900 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-stone-500 text-sm">{product.category}</span>
                                    <span className="font-semibold text-stone-900">${product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
