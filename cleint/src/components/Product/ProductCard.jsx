import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../Contexts';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addWishList } = useContext(CartContext)

  const handleAddWishList = (product) => {
    addWishList(product)
    // toast.success(`Wishlist added successfully`);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-[#F5A524]">
        <svg onClick={() => handleAddWishList(product)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <Link to={`/${product._id}`} className="text-blue-500">
        <div className="flex justify-center mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg" // Fixed size and aspect ratio handling
          />
        </div>
        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
        <div className="text-[#F5A524] font-bold mb-2">${product.price}</div>
      </Link>
    </div>
  );
};

export default ProductCard;
