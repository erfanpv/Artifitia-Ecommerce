import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "../components/Product/ProductCard.jsx";
import AddCategoryModal from "../pages/AddCategory.jsx";
import AddSubCategoryModal from "../pages/AddSubCategory.jsx";
import AddProductModal from "../pages/AddProduct.jsx";
import { CartContext } from "../components/Contexts.jsx";

const HomePage = () => {
  const {
    categories,
    products,
    totalItems,
    fetchProductsPaginated,
    addNewCategory,
    addNewSubcategory,
    addNewProduct,
    isLoggedIn
  } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    fetchProductsPaginated(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return pages.filter((item, index, array) => array.indexOf(item) === index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={addNewCategory}
      />

      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        onAdd={addNewSubcategory}
        categories={categories}
      />

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={addNewProduct}
      />

      <div className="bg-white py-4 px-6 mb-6">
        {isLoggedIn && (

          <div className="max-w-7xl mx-auto flex justify-end gap-4">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2 bg-[#F5A524] text-white rounded-md hover:bg-[#e09620] transition-colors"
            >
              Add category
            </button>
            <button
              onClick={() => setIsSubCategoryModalOpen(true)}
              className="px-4 py-2 bg-[#F5A524] text-white rounded-md hover:bg-[#e09620] transition-colors"
            >
              Add sub category
            </button>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2 bg-[#F5A524] text-white rounded-md hover:bg-[#e09620] transition-colors"
            >
              Add product
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products?.map((product) => (
            <div key={product._id} className="flex flex-col h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-600">
            {`Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-1 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === page
                        ? "bg-[#F5A524] text-white"
                        : "text-gray-600 hover:text-[#F5A524]"
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="relative">
              <button
                className="flex items-center space-x-1 border rounded-md px-2 py-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-sm">{itemsPerPage} rows</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-auto">
                  {[10, 20, 30, 50].map((value) => (
                    <button
                      key={value}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100"
                      onClick={() => handleItemsPerPageChange(value)}
                    >
                      {value} rows
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
