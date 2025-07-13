import React, { useState } from 'react';
import { FaHeart, FaEye, FaShoppingCart, FaStar, FaMapMarkerAlt, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onQuickView }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    _id,
    name,
    description,
    price,
    originalPrice,
    images = [],
    mainImage,
    ratings = { average: 0, count: 0 },
    shop = {},
    isOnSale = false,
    isFeatured = false,
    stock = 0,
    shipping = {},
    tags = []
  } = product;

  const displayImage = images[currentImageIndex] || mainImage || images[0] || '/placeholder-product.jpg';
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isInStock = stock > 0;

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div 
      className="product-card bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            -{discount}%
          </span>
        )}
        {isFeatured && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Polecany
          </span>
        )}
        {!isInStock && (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Niedostępny
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleAddToWishlist}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Dodaj do ulubionych"
        >
          <FaHeart className="text-sm" />
        </button>
        <button
          onClick={handleQuickView}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors"
          title="Szybki podgląd"
        >
          <FaEye className="text-sm" />
        </button>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`w-8 h-8 rounded border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-blue-500 scale-110' 
                    : 'border-white hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${name} ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Shop Info */}
        {shop.name && (
          <div className="flex items-center gap-2 mb-2">
            {shop.logo && (
              <img src={shop.logo} alt={shop.name} className="w-4 h-4 rounded" />
            )}
            <span className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer">
              {shop.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/product/${_id}`} className="block">
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(ratings.average)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            ({ratings.count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            {price.toFixed(2)} zł
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice.toFixed(2)} zł
            </span>
          )}
        </div>

        {/* Shipping Info */}
        {shipping.freeShipping && (
          <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
            <FaTruck />
            <span>Darmowa dostawa</span>
          </div>
        )}

        {/* Location */}
        {shop.address?.city && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <FaMapMarkerAlt />
            <span>{shop.address.city}</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              isInStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart />
            {isInStock ? 'Dodaj do koszyka' : 'Niedostępny'}
          </button>
        </div>

        {/* Stock Info */}
        {isInStock && stock < 10 && (
          <div className="mt-2 text-xs text-orange-600">
            Pozostało tylko {stock} sztuk!
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <FaShieldAlt />
          <span>Bezpieczne zakupy</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 