import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ChevronRight, Plus, Minus, Edit } from "lucide-react";
import { getProductById } from "../services/productService";
import toast from "react-hot-toast";
import { CartContext } from "../components/Contexts";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedRam, setSelectedRam] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(CartContext);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        if (response?.success) {
          const productData = response.data;
          setProduct(productData);
          setSelectedRam(productData.variants?.[0]?.ram || "");
        }
      } catch (error) {
        toast.error(`Error fetching product ${error}`);
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase") setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="absolute top-4 right-4 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 flex items-center space-x-2">
        {isLoggedIn ? (
          <Link to={`/edit-product/${id}`}>
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
        ) : null}
      </div>

      <nav className="flex items-center space-x-2 mb-8 text-sm">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-white">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex space-x-4">
            {product?.images?.map((image, index) => (
              <button
                key={index}
                className={`border rounded-lg p-2 bg-white ${
                  selectedImage === index
                    ? "border-orange-400"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-24 h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          <div className="text-2xl font-bold mb-6">${product.price}</div>

          <div className="mb-6">
            <span className="font-medium mb-2 block">Variant:</span>
            <div className="flex space-x-2">
              {product?.variants?.map((variant) => (
                <button
                  key={variant.ram}
                  className={`px-4 py-2 border rounded-md ${
                    selectedRam === variant.ram
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 hover:border-orange-400"
                  }`}
                  onClick={() => setSelectedRam(variant.ram)}
                >
                  {variant.ram}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <span className="font-medium mb-2 block">Quantity:</span>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 border rounded-md hover:border-orange-400"
                onClick={() => handleQuantityChange("decrease")}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                className="p-2 border rounded-md hover:border-orange-400"
                onClick={() => handleQuantityChange("increase")}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">
              Add to cart
            </button>
            <button className="px-6 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">
              Buy it now
            </button>
            <button className="p-2 border rounded-md hover:border-orange-400">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
