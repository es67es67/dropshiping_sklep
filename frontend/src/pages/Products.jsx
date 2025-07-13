import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Symulowane dane produktów
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Najnowszy iPhone z zaawansowaną kamerą i procesorem A17 Pro',
      price: 4999.99,
      originalPrice: 5499.99,
      images: [
        'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max',
        'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/007AFF/FFFFFF?text=iPhone+15+Pro+Max',
      ratings: { average: 4.8, count: 127 },
      shop: {
        name: 'Apple Store',
        logo: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=A',
        address: { city: 'Warszawa' }
      },
      isOnSale: true,
      isFeatured: true,
      stock: 15,
      shipping: { freeShipping: true },
      tags: ['smartphone', 'apple', 'premium'],
      category: 'electronics'
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Flaga Samsung z S Pen i zaawansowaną kamerą',
      price: 4499.99,
      originalPrice: 4999.99,
      images: [
        'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra',
        'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24+Ultra',
      ratings: { average: 4.6, count: 89 },
      shop: {
        name: 'Samsung Store',
        logo: 'https://via.placeholder.com/50x50/1428A0/FFFFFF?text=S',
        address: { city: 'Kraków' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 8,
      shipping: { freeShipping: true },
      tags: ['smartphone', 'samsung', 'android'],
      category: 'electronics'
    },
    {
      _id: '3',
      name: 'MacBook Pro 16" M3 Max',
      description: 'Profesjonalny laptop z najnowszym procesorem Apple M3 Max',
      price: 12999.99,
      originalPrice: 13999.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=MacBook+Pro+16',
      ratings: { average: 4.9, count: 45 },
      shop: {
        name: 'Apple Store',
        logo: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=A',
        address: { city: 'Warszawa' }
      },
      isOnSale: false,
      isFeatured: true,
      stock: 3,
      shipping: { freeShipping: true },
      tags: ['laptop', 'apple', 'professional'],
      category: 'electronics'
    },
    {
      _id: '4',
      name: 'Nike Air Max 270',
      description: 'Wygodne buty sportowe z amortyzacją Air Max',
      price: 599.99,
      originalPrice: 699.99,
      images: [
        'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270',
        'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max+270',
      ratings: { average: 4.4, count: 234 },
      shop: {
        name: 'Nike Store',
        logo: 'https://via.placeholder.com/50x50/FF6B35/FFFFFF?text=N',
        address: { city: 'Gdańsk' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 25,
      shipping: { freeShipping: false },
      tags: ['sport', 'nike', 'shoes'],
      category: 'sports'
    },
    {
      _id: '5',
      name: 'Sony WH-1000XM5',
      description: 'Słuchawki z aktywną redukcją szumów',
      price: 1299.99,
      originalPrice: 1499.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Sony+WH-1000XM5',
      ratings: { average: 4.7, count: 156 },
      shop: {
        name: 'Sony Store',
        logo: 'https://via.placeholder.com/50x50/000000/FFFFFF?text=S',
        address: { city: 'Poznań' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 12,
      shipping: { freeShipping: true },
      tags: ['headphones', 'sony', 'wireless'],
      category: 'electronics'
    },
    {
      _id: '6',
      name: 'Adidas Ultraboost 22',
      description: 'Buty do biegania z technologią Boost',
      price: 799.99,
      originalPrice: 899.99,
      images: [
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22',
        'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22+2'
      ],
      mainImage: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Adidas+Ultraboost+22',
      ratings: { average: 4.5, count: 189 },
      shop: {
        name: 'Adidas Store',
        logo: 'https://via.placeholder.com/50x50/000000/FFFFFF?text=A',
        address: { city: 'Wrocław' }
      },
      isOnSale: true,
      isFeatured: false,
      stock: 18,
      shipping: { freeShipping: false },
      tags: ['running', 'adidas', 'shoes'],
      category: 'sports'
    }
  ];

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Tutaj można dodać logikę wyszukiwania
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Tutaj można dodać logikę filtrowania
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    // Tutaj można dodać logikę sortowania
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Pokaż powiadomienie
    alert(`${product.name} został dodany do koszyka!`);
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
    
    // Pokaż powiadomienie
    const isInWishlist = wishlist.find(item => item._id === product._id);
    alert(isInWishlist 
      ? `${product.name} został usunięty z ulubionych!`
      : `${product.name} został dodany do ulubionych!`
    );
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    if (filters.rating && product.ratings.average < parseFloat(filters.rating)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produkty</h1>
              <p className="text-gray-600 mt-1">
                Odkryj najlepsze produkty w najlepszych cenach
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Szukaj produktów..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={filteredProducts}
          loading={loading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img
                    src={selectedProduct.mainImage}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                {/* Product Info */}
                <div>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedProduct.price.toFixed(2)} zł
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {selectedProduct.originalPrice.toFixed(2)} zł
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaHeart
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(selectedProduct.ratings.average)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">
                      ({selectedProduct.ratings.count} opinii)
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Sklep:</span>
                      <span className="font-medium">{selectedProduct.shop.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Stan magazynowy:</span>
                      <span className="font-medium">{selectedProduct.stock} sztuk</span>
                    </div>
                    {selectedProduct.shipping.freeShipping && (
                      <div className="text-sm text-green-600">
                        ✓ Darmowa dostawa
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setShowQuickView(false);
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      Dodaj do koszyka
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(selectedProduct)}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 