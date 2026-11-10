import React, { useState } from 'react';
import type { Order, Product } from '../types';
import { CATEGORIES } from '../types';
import {
  Plus,
  Trash2,
  Check,
  XCircle,
  Filter,
  Upload,
  ArrowUpDown,
  FileText,
  RotateCcw,
  Package,
} from 'lucide-react';
import { formatUSD } from '../data/catalog';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const EMPTY_DRAFT = {
  name: '',
  price: '',
  pages: '',
  category: CATEGORIES[0] as string,
  file: '',
  image: '',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  if (!isOpen) return null;

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 800;
        let { width, height } = image;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        context?.drawImage(image, 0, 0, width, height);
        setDraft((current) => ({ ...current, image: canvas.toDataURL('image/jpeg', 0.8) }));
      };
      image.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name || !draft.price || !draft.file) return;

    const slug =
      draft.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `guide-${Date.now()}`;

    onAddProduct({
      id: Date.now(),
      slug,
      name: draft.name,
      tagline: 'Added from the dashboard',
      price: Number(draft.price),
      category: draft.category as Product['category'],
      checkoutUrl: 'https://whop.com/geez-digital/products/',
      planId: '',
      pages: Number(draft.pages) || 0,
      image: draft.image || '/covers/complete-library.svg',
      file: draft.file,
      description: '',
      outcomes: [],
      chapters: [],
      includes: [],
      tags: [],
    });

    setIsAddingProduct(false);
    setDraft(EMPTY_DRAFT);
  };

  const filteredOrders =
    filterStatus === 'All' ? orders : orders.filter((order) => order.status === filterStatus);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return a.id - b.id;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-100">
      <header className="sticky top-0 z-10 bg-stone-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold">Ge'ez Digital</span>
            <span className="rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-200">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="mr-4 flex gap-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'orders' ? 'text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'products' ? 'text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Guides
              </button>
            </nav>
            <button onClick={onClose} className="text-stone-400 hover:text-white">
              Exit dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'orders' && (
          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Orders</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {orders.length} order{orders.length === 1 ? '' : 's'} ·{' '}
                  {formatUSD(orders.reduce((sum, order) => sum + order.total, 0))} collected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-stone-500" />
                <select
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  className="block rounded-md border border-stone-300 bg-white p-2 text-sm shadow-sm focus:border-stone-500 focus:ring-stone-500"
                >
                  {['All', 'Pending', 'Delivered', 'Refunded', 'Cancelled'].map((status) => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All statuses' : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      {['Order', 'Customer', 'Date', 'Files', 'Total', 'Status', 'Actions'].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                          {orders.length === 0
                            ? 'No orders yet.'
                            : 'No orders match the selected filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                            #{order.id.slice(-6)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                            {order.userEmail}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                            {order.items.reduce((sum, item) => sum + (item.isBundle ? 10 : 1), 0)}{' '}
                            PDF
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-900">
                            {formatUSD(order.total)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : order.status === 'Refunded'
                                      ? 'bg-stone-200 text-stone-700'
                                      : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                            <div className="flex gap-2">
                              {order.status !== 'Delivered' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                  className="text-emerald-600 hover:text-emerald-900"
                                  title="Grant access"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              {order.status !== 'Refunded' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Refunded')}
                                  className="text-stone-500 hover:text-stone-900"
                                  title="Refund and revoke access"
                                >
                                  <RotateCcw size={18} />
                                </button>
                              )}
                              {order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel order"
                                >
                                  <XCircle size={18} />
                                </button>
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
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Guides</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {products.length} products · {products.reduce((sum, p) => sum + p.pages, 0)} pages
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 shadow-sm">
                  <ArrowUpDown size={16} className="text-stone-500" />
                  <select
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(event.target.value as 'default' | 'asc' | 'desc')
                    }
                    className="cursor-pointer border-none bg-transparent pr-8 text-sm text-stone-700 outline-none focus:ring-0"
                  >
                    <option value="default">Default</option>
                    <option value="asc">Price: low to high</option>
                    <option value="desc">Price: high to low</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800"
                >
                  <Plus size={18} /> Add guide
                </button>
              </div>
            </div>

            {isAddingProduct && (
              <div className="mb-8 animate-in rounded-lg bg-white p-6 shadow fade-in slide-in-from-top-4">
                <h3 className="mb-4 text-lg font-medium text-stone-900">Add a guide</h3>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Title</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border border-stone-300 p-2 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      value={draft.name}
                      onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Price (USD)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      className="mt-1 block w-full rounded-md border border-stone-300 p-2 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      value={draft.price}
                      onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Pages</label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border border-stone-300 p-2 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      value={draft.pages}
                      onChange={(event) => setDraft({ ...draft, pages: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Category</label>
                    <select
                      className="mt-1 block w-full rounded-md border border-stone-300 p-2 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      value={draft.category}
                      onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">PDF URL</label>
                    <input
                      type="text"
                      required
                      placeholder="/products/my-guide.pdf"
                      className="mt-1 block w-full rounded-md border border-stone-300 p-2 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                      value={draft.file}
                      onChange={(event) => setDraft({ ...draft, file: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Cover image</label>
                    <div className="mt-1 flex items-center gap-4">
                      {draft.image ? (
                        <div className="relative">
                          <img
                            src={draft.image}
                            alt="Cover preview"
                            className="h-16 w-12 rounded border border-stone-200 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setDraft((current) => ({ ...current, image: '' }))}
                            className="absolute -right-2 -top-2 rounded-full border border-stone-200 bg-white p-0.5 text-stone-500 shadow-md hover:text-red-500"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-16 w-12 items-center justify-center rounded border border-dashed border-stone-300 bg-stone-100 text-stone-400">
                          <Package size={18} />
                        </div>
                      )}
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
                      >
                        <Upload size={16} /> Upload
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-stone-900 px-4 py-2 text-white hover:bg-stone-800 disabled:opacity-50"
                      disabled={!draft.name || !draft.price || !draft.file}
                    >
                      Save guide
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="group overflow-hidden rounded-lg bg-white shadow">
                  <div className="relative h-56 bg-stone-100">
                    <img
                      src={product.image}
                      alt={`${product.name} cover`}
                      className="h-full w-full object-cover object-top"
                    />
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="absolute right-2 top-2 rounded-full bg-white/80 p-2 text-red-500 opacity-0 transition-colors hover:bg-red-500 hover:text-white group-hover:opacity-100"
                      title="Delete guide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="truncate font-medium text-stone-900">{product.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <FileText size={11} /> {product.pages || '—'} pages
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-stone-500">{product.category}</span>
                      <span className="font-semibold text-stone-900">
                        {formatUSD(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
