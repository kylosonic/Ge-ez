import React, { useEffect, useState } from 'react';
import { X, Package, Calendar, Truck } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('stylehive_orders');
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse orders", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="flex flex-col h-full bg-white shadow-xl">
             {/* Header */}
             <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-stone-200">
                <h2 className="text-lg font-medium text-stone-900 font-serif">Order History</h2>
                <button type="button" className="-m-2 p-2 text-stone-400 hover:text-stone-500" onClick={onClose}>
                  <X size={24} />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                        <Package className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                        <p>No orders found.</p>
                        <button onClick={onClose} className="mt-4 text-stone-900 underline font-medium text-sm">Start Shopping</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            // Calculate subtotal for backward compatibility if shippingCost isn't saved on old orders
                            const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                            const shippingCost = order.shippingCost || 0;
                            const hasShippingInfo = typeof order.shippingCost !== 'undefined';

                            return (
                              <div key={order.id} className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <p className="text-xs text-stone-500">Order #{order.id.slice(-6)}</p>
                                          <div className="flex items-center text-xs text-stone-500 mt-1">
                                              <Calendar size={12} className="mr-1" />
                                              {new Date(order.date).toLocaleDateString()}
                                          </div>
                                      </div>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                          {order.status}
                                      </span>
                                  </div>
                                  
                                  <div className="space-y-3 mb-4">
                                      {order.items.map((item, idx) => (
                                          <div key={idx} className="flex gap-3">
                                              <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover bg-stone-200" />
                                              <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                                                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                              </div>
                                              <p className="text-sm font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                                          </div>
                                      ))}
                                  </div>

                                  <div className="pt-3 border-t border-stone-200 space-y-1">
                                      {hasShippingInfo && (
                                        <>
                                          <div className="flex justify-between items-center text-xs text-stone-500">
                                              <span>Subtotal</span>
                                              <span>${subtotal.toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between items-center text-xs text-stone-500">
                                              <span className="flex items-center"><Truck size={10} className="mr-1"/> Shipping ({order.shippingMethod})</span>
                                              <span>${shippingCost.toFixed(2)}</span>
                                          </div>
                                        </>
                                      )}
                                      <div className="flex justify-between items-center pt-2">
                                          <p className="text-sm font-medium text-stone-900">Total Paid</p>
                                          <p className="text-lg font-bold text-stone-900">${order.total.toFixed(2)}</p>
                                      </div>
                                  </div>
                                  {order.receiptSummary && (
                                    <div className="mt-3 text-xs text-stone-500 bg-white p-2 rounded border border-stone-100 italic">
                                      Receipt Note: {order.receiptSummary}
                                    </div>
                                  )}
                              </div>
                            );
                        })}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};