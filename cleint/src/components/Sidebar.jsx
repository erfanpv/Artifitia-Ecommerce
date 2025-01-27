import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { CartContext } from './Contexts.jsx';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const { categories, filterBySubcategory } = useContext(CartContext);

  useEffect(() => {
    filterBySubcategory(selectedFilters);
  }, [selectedFilters, filterBySubcategory]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? '' : categoryName);
  };

  const handleCheckboxChange = (categoryName, subCategoryName) => {
    const filter = `${categoryName}:${subCategoryName}`;
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed top-0 lg:left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-auto`}
      >
        <div className="p-4 sticky top-0">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>

          <div className="my-8">
            <button className="text-gray-800 hover:text-blue-600 transition-colors">
              All categories
            </button>
          </div>
          <div className="space-y-2">
            {categories?.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between py-1 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <span>{category.name}</span>
                  {category?.subcategories?.length > 0 && (
                    expandedCategory === category.name ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )
                  )}
                </button>
                {expandedCategory === category?.name && category?.subcategories?.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category?.subcategories?.map((sub) => (
                      <div key={sub.name} className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters?.includes(`${category.name}:${sub.name}`)}
                            onChange={() => handleCheckboxChange(category.name, sub.name)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-gray-600 hover:text-blue-600 transition-colors">
                            {sub.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;