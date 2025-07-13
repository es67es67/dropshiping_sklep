import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FaFilter, FaSort, FaTh, FaList, FaSearch } from 'react-icons/fa';

const ProductList = ({ 
  products = [], 
  loading = false, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView,
  onFiltersChange,
  onSortChange,
  onPageChange 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    availability: '',
    delivery: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: '',
      delivery: ''
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nie znaleziono produktów
        </h3>
        <p className="text-gray-500 mb-4">
          Spróbuj zmienić filtry lub wyszukiwanie
        </p>
        <button
          onClick={clearFilters}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Wyczyść filtry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          Znaleziono {products.length} produktów
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Widok siatki"
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Widok listy"
            >
              <FaList />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Najnowsze</option>
              <option value="price_asc">Cena: od najniższej</option>
              <option value="price_desc">Cena: od najwyższej</option>
              <option value="rating">Najwyżej oceniane</option>
              <option value="popularity">Najpopularniejsze</option>
              <option value="name_asc">Nazwa: A-Z</option>
              <option value="name_desc">Nazwa: Z-A</option>
            </select>
            <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFilter />
            <span className="hidden sm:inline">Filtry</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszystkie kategorie</option>
                <option value="electronics">Elektronika</option>
                <option value="clothing">Odzież</option>
                <option value="home">Dom i ogród</option>
                <option value="sports">Sport</option>
                <option value="books">Książki</option>
                <option value="toys">Zabawki</option>
                <option value="beauty">Kosmetyki</option>
                <option value="food">Żywność</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zakres cenowy
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Od"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Do"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ocena
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszystkie oceny</option>
                <option value="5">5 gwiazdek</option>
                <option value="4">4+ gwiazdki</option>
                <option value="3">3+ gwiazdki</option>
                <option value="2">2+ gwiazdki</option>
                <option value="1">1+ gwiazdka</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostępność
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszystkie</option>
                <option value="in_stock">W magazynie</option>
                <option value="on_sale">Promocje</option>
                <option value="new">Nowe produkty</option>
              </select>
            </div>

            {/* Delivery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostawa
              </label>
              <select
                value={filters.delivery}
                onChange={(e) => handleFilterChange('delivery', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wszystkie opcje</option>
                <option value="free">Darmowa dostawa</option>
                <option value="same_day">Dostawa tego samego dnia</option>
                <option value="next_day">Dostawa następnego dnia</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Wyczyść wszystkie filtry
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Anuluj
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Zastosuj filtry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onQuickView={onQuickView}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Poprzednia
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-lg ${
                  page === 1 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Następna
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList; 