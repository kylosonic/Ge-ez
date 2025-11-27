import React from 'react';
import { X, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  relatedProducts: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  relatedProducts,
  onAddToCart,
  onSelectProduct
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onClose} 
        />

        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl animate-in fade-in zoom-in-95 duration-200">
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-stone-500 hover:text-stone-900 z-10 hover:bg-white transition-colors"
            >
                <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="bg-stone-100 relative h-96 md:h-auto">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                {/* Details Section */}
                <div className="p-8 flex flex-col justify-center">
                    <div>
                        <span className="text-sm text-stone-500 font-medium tracking-wider uppercase">{product.category}</span>
                        <h2 className="mt-1 text-3xl font-serif font-bold text-stone-900">{product.name}</h2>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-2xl font-medium text-stone-900">${product.price.toFixed(2)}</span>
                            <div className="flex items-center text-yellow-500 text-sm">
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <span className="ml-2 text-stone-400 text-xs">(25 reviews)</span>
                            </div>
                        </div>

                        <p className="mt-6 text-stone-600 leading-relaxed">
                            Experience premium quality with our {product.name}. Crafted from the finest materials, this piece from our {product.category} collection offers both comfort and durability for everyday wear. Designed with a modern fit, it's the perfect addition to your wardrobe.
                        </p>

                        <div className="mt-8">
                            <button
                                onClick={() => {
                                    onAddToCart(product);
                                }}
                                className="w-full flex items-center justify-center gap-2 rounded-full bg-stone-900 px-8 py-4 text-base font-medium text-white hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart - ${product.price.toFixed(2)}
                            </button>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-stone-500">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> In Stock
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> Free Shipping
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="bg-stone-50 p-8 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold font-serif text-stone-900">You Might Also Like</h3>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Related to {product.category}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((item) => (
                            <div 
                                key={item.id} 
                                className="group cursor-pointer bg-white rounded-lg p-2 border border-stone-100 hover:shadow-md transition-all"
                                onClick={() => onSelectProduct(item)}
                            >
                                <div className="aspect-square rounded-md overflow-hidden bg-stone-200 relative mb-3">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                </div>
                                <h4 className="text-sm font-medium text-stone-900 truncate px-1">{item.name}</h4>
                                <div className="flex justify-between items-center mt-1 px-1">
                                    <p className="text-sm text-stone-500">${item.price.toFixed(2)}</p>
                                    <div className="p-1 rounded-full bg-stone-100 text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};