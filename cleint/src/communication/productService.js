import API from "./api";

// Auth APIs
export const registerUser = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// Cart APIs
export const getCart = async (id) => {
  const res = await API.get(`/cart/${id}`);
  return res.data;
};

export const addToCart = async (id, cartData) => {
  const res = await API.post(`/cart/${id}`, cartData);
  return res.data;
};

export const removeFromCart = async (id) => {
  const res = await API.delete(`/cart/${id}`);
  return res.data;
};

// Category APIs
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

export const addCategory = async (categoryData) => {
  const res = await API.post("/categories", categoryData);
  return res.data;
};

export const addSubcategory = async (subcategoryData) => {
  const res = await API.post("/categories/subcategory", subcategoryData);
  return res.data;
};

// Product APIs
export const getProducts = async ({ page, limit }) => {
  const res = await API.get(`/products?page=${page}&limit=${limit}`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const addProduct = async (productData) => {
  const res = await API.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// User APIs
export const getUsers = async () => {
  const res = await API.get("/user");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/user/${id}`);
  return res.data;
};

// Wishlist APIs
export const getWishList = async (id) => {
  const res = await API.get(`/wishlist/${id}`);
  return res.data;
};

export const  addToWishList = async (id, productId) => {
  const res = await API.post(`/wishlist/${id}`, { productId });
  return res.data;
};

export const removeFromWishList = async (userId, productId) => {
  const res = await API.delete(`/wishlist/${userId}`, { data: { productId } });
  return res.data;
};
