import React from 'react';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onCheckout 
}) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-stone-900 font-serif">Shopping cart</h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-stone-400 hover:text-stone-500"
                    onClick={onClose}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 text-stone-500">
                        <p>Your cart is empty.</p>
                        <button onClick={onClose} className="mt-4 text-stone-900 underline font-medium">Continue Shopping</button>
                    </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-stone-200">
                      {cartItems.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-stone-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-stone-900">
                                <h3>
                                  <a href="#">{product.name}</a>
                                </h3>
                                <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-stone-500">{product.category}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-stone-200 rounded-md">
                                <button 
                                  onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
                                  className="p-1 text-stone-600 hover:text-black hover:bg-stone-100 transition-colors disabled:opacity-30"
                                  disabled={product.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-2 text-stone-900 font-medium min-w-[1.5rem] text-center">
                                  {product.quantity}
                                </span>
                                <button 
                                  onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                                  className="p-1 text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(product.id)}
                                className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 px-4 py-6 sm:px-6 bg-stone-50">
                <div className="flex justify-between text-base font-medium text-stone-900">
                  <p>Subtotal</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-stone-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-stone-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-stone-800 transition-colors"
                  >
                    Checkout with Bank Transfer
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-stone-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-stone-900 hover:text-stone-800"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};