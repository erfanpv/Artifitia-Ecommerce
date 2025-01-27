import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  getUsers,
  getProducts,
  getCart,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  getCategories,
  loginUser,
  addToWishList,
  removeFromWishList,
  getWishList,
  addCategory,
  addProduct,
  addSubcategory,
  registerUser,
} from "../communication/productService.js";
import { startCronJob } from "../services/cronJob.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterItems, setFilterItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const id = localStorage.getItem("id");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    const fetchProducts = async (page = 1, limit = 10) => {
      try {
        const response = await getProducts({ page, limit });
        setProducts(response.data.products);
        setAllProducts(response.data.prducts);
        setTotalItems(response.data.totalItems);
        // console.log(response)
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    if (localStorage.getItem("id")) {
      setIsLoggedIn(true);
    }
    startCronJob();
    fetchUsers();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishList(id);
      setWishlist(data.data);
    } catch (error) {
      toast.dismiss("Failed to fetch wishlist");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchCart = async () => {
        try {
          const data = await getCart(id);
          setCart(data.data);
        } catch (error) {
          toast.dismiss("Failed to fetch cart");
        }
      };

      fetchWishlist();
      fetchCart();
    }
  }, [id]);

  const signup = async (userData, route) => {
    try {
      const user = await registerUser(userData);
      localStorage.setItem("id", user.data.id);
      localStorage.setItem("token", user.token);
      setIsLoggedIn(true);
      toast.success("Registration successful!");
      route("/");
    } catch (error) {
      console.log(error, "afna");
      console.error("Signup failed:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        toast.error("Email already exists");
        route("/login");
      } else {
        toast.error("Signup failed. Please try again later.");
      }
    }
  };

  const login = async (credentials, route) => {
    try {
      const user = await loginUser(credentials);
      localStorage.setItem("id", user.data.id);
      localStorage.setItem("token", user.token);
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
      route("/");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("No user found. Please create an account");
        route("/signup");
      } else if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      }
    }
  };

  const logout = async () => {
    try {
      // await logoutUser();
      localStorage.clear();
      setIsLoggedIn(false);
      setCart([]);
      setWishlist([]);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const fetchProductsPaginated = async (page, limit) => {
    try {
      const response = await getProducts({ page, limit });
      setProducts(response.data.products);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      toast.error("Failed to fetch paginated products");
    }
  };

  const addNewCategory = async (categoryName) => {
    try {
      const response = await addCategory({ name: categoryName });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      toast.success("Category added successfully");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Category already exists");
      } else {
        toast.error("Failed to add category");
      }
    }
  };

  const addNewSubcategory = async (subcategoryData) => {
    try {
      const data = await addSubcategory(subcategoryData);
      setSubCategory([...subCategory, data]);
      toast.success("Subcategory added successfully");
    } catch (error) {
      toast.error("Failed to add subcategory");
    }
  };

  const addNewProduct = async (formData) => {
    try {
      const response = await addProduct(formData);
      setProducts((prevProducts) => [...prevProducts, response.product]);
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const addToCart = async (product) => {
    try {
      const updatedCart = [...cart];
      const existingItem = updatedCart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        updatedCart.push(product);
      }

      const data = await addToCartAPI(id, { cart: updatedCart });
      setCart(data.cart);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== productId);
      const data = await removeFromCartAPI(id, { cart: updatedCart });
      setCart(data.cart);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove from cart");
    }
  };

  const addWishList = async (product) => {
    try {
      const id = localStorage.getItem("id");
      await addToWishList(id, product._id);
      fetchWishlist();
      toast.success("Added to wishlist");
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        toast.error("Product already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const removeWishList = async (productId) => {
    try {
      const data = await removeFromWishList(id, productId);
      setWishlist(data.data);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const searchFilter = (searchValue) => {
    setSearchQuery(searchValue);
    if (searchValue.trim() === "") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setProducts(filtered);
    }
  };

  const filterBySubcategory = useCallback(
    (selectedFilters) => {
      const filteredProducts = allProducts?.filter((product) => {
        if (selectedFilters.length === 0) return true;
        return selectedFilters.every((filter) => {
          const [categoryName, subcategoryName] = filter.split(":");
          const category = categories.find((cat) => cat.name === categoryName);
          if (category) {
            const subcategory = category.subcategories.find(
              (sub) => sub.name === subcategoryName
            );
            return subcategory && product.category.includes(category._id);
          }
          return false;
        });
      });
      setProducts(filteredProducts);
    },
    [allProducts, categories]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        searchFilter,
        filterItems,
        isLoggedIn,
        searchQuery,
        addNewProduct,
        login,
        signup,
        logout,
        products,
        setFilterItems,
        setFilterUsers,
        filterUsers,
        category,
        setCategory,
        users,
        addNewCategory,
        addNewSubcategory,
        wishlist,
        addWishList,
        removeWishList,
        totalItems,
        fetchProductsPaginated,
        categories,
        filterBySubcategory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(CartContext);
};
