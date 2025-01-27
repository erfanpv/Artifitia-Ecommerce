import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import { CartContext } from "./Contexts.jsx";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    logout,
    isLoggedIn,
    cart,
    wishlist,
    removeFromCart,
    removeWishList,
    searchFilter,
  } = useContext(CartContext);
  const [quantities, setQuantities] = useState(
    Object.fromEntries((cart || []).map((item) => [item.id, item.quantity]))
  );

  const updateQuantity = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + change),
    }));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * quantities[item.id],
      0
    );
  };

  const handleOpenModal = (modal) => {
    if (modal === "cart") {
      setIsCartOpen(true);
      setIsWishlistOpen(false);
    } else {
      setIsWishlistOpen(true);
      setIsCartOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchFilter(value);
  };

  const handleRemoveWishlist = (productId) => {
    removeWishList(productId);
  };

  return (
    <>
      <nav className="bg-[#003049] py-3 px-6 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative flex-1 max-w-lg sm:max-w-96 ms-10">
            <input
              type="text"
              placeholder="Search any things"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-2 pl-4 pr-12 rounded-full border-0 focus:ring-2 focus:ring-[#F5A524] outline-none sm:pr-16 bg-white"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-[#F5A524] text-white rounded-r-full hover:bg-[#e09620] transition-colors sm:px-6">
              Search
            </button>
          </div>

          <div className="flex items-center gap-6 ml-6">
            {isLoggedIn ? (
              <>
                <button
                  className="relative text-white hover:text-[#F5A524] transition-colors"
                  onClick={() => handleOpenModal("wishlist")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#F5A524] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist?.length}
                  </span>
                </button>

                <button
                  className="relative text-white hover:text-[#F5A524] transition-colors flex items-center gap-1"
                  onClick={() => handleOpenModal("cart")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#F5A524] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart?.length}
                  </span>
                </button>

                <Link
                  onClick={logout}
                  to={"/login"}
                  className="text-white hover:text-[#F5A524] transition-colors flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sign out
                </Link>
              </>
            ) : (
              <Link
                to={"/login"}
                className="text-white hover:text-[#F5A524] transition-colors flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
          isCartOpen || isWishlistOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(false);
        }}
      />

      <div
        className={`fixed top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Wishlist</h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          {wishlist?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your wishlist is empty
            </div>
          ) : (
            wishlist?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg mb-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={item?.productId?.images[0]}
                  alt={item.productId.name}
                  className="w-24 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.productId.name}
                  </h3>
                  <div className="text-lg font-bold text-[#003049]">
                    ${item.productId.price}
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveWishlist(item.productId._id)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 w-full md:w-[400px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 240px)" }}
        >
          {cart?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            cart?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg mb-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <div className="text-lg font-bold text-[#003049]">
                    ${item.price}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">
                      {quantities[item._id]}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => removeFromCart(item._id)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart?.length > 0 && (
          <div className="p-4 border-t">
            <div className="text-lg font-semibold text-[#003049]">
              Total: ${calculateTotal()}
            </div>
            <button className="w-full py-2 mt-4 bg-[#F5A524] text-white rounded-full hover:bg-[#e09620]">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
