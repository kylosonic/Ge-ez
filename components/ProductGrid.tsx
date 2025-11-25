import React, { useMemo } from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, selectedCategory, onSelectCategory }) => {

  // Extract unique categories from products, sorted alphabetically
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
      
      {/* Category List */}
      <div id="lookbook" className="mb-20 scroll-mt-24">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 font-serif">Our Category List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
                className="relative group overflow-hidden rounded-xl h-96 cursor-pointer"
                onClick={() => onSelectCategory('All')}
            >
                <img src="https://picsum.photos/400/600?random=2" alt="Collection" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-medium">Full Collection</h3>
                    <p className="text-white/80 text-sm">Browse All Items</p>
                </div>
            </div>
            <div 
                className="relative group overflow-hidden rounded-xl h-96 cursor-pointer"
                onClick={() => onSelectCategory('Shirts')}
            >
                <img src="https://picsum.photos/400/600?random=3" alt="Shirts" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-medium">Shirts</h3>
                    <p className="text-white/80 text-sm">Essential Tops</p>
                </div>
            </div>
            <div 
                className="relative group overflow-hidden rounded-xl h-96 cursor-pointer"
                onClick={() => onSelectCategory('Hoodies')}
            >
                <img src="https://picsum.photos/400/600?random=4" alt="Hoodie" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-medium">Hoodies</h3>
                    <p className="text-white/80 text-sm">Cozy Comfort</p>
                </div>
            </div>
        </div>
      </div>

      {/* Products */}
      <div id="shopping-grid" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-stone-900 font-serif">Our Products</h2>
                <p className="text-stone-500 mt-1">
                    {selectedCategory === 'All' ? 'All available items' : `Showing ${selectedCategory}`}
                </p>
            </div>
            <div className="flex gap-2 flex-wrap">
                 {categories.map((category) => (
                     <button 
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`px-4 py-2 text-sm rounded-full transition-colors ${
                            selectedCategory === category 
                            ? 'bg-stone-900 text-white' 
                            : 'text-stone-600 hover:bg-stone-100 bg-stone-50'
                        }`}
                     >
                        {category}
                     </button>
                 ))}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-stone-200 group-hover:opacity-90 transition-opacity relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                  className="absolute bottom-4 right-4 h-12 w-12 sm:h-10 sm:w-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all transform sm:translate-y-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 duration-300 z-20 cursor-pointer"
                  aria-label={`Add ${product.name} to cart`}
                >
                    <Plus size={20} />
                </button>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-stone-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">{product.category}</p>
                </div>
                <p className="text-lg font-medium text-stone-900">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-stone-500 bg-stone-50 rounded-lg">
                <p>No products found in this category.</p>
                <button 
                    onClick={() => onSelectCategory('All')} 
                    className="mt-4 text-stone-900 underline font-medium"
                >
                    View all products
                </button>
            </div>
        )}
      </div>
    </div>
  );
};