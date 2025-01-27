import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const AddSubCategoryModal = ({ isOpen, onClose, onAdd, categories }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    subCategoryName: Yup.string()
      .trim()
      .required('Subcategory name is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const subCategoryData = {
        category: values.category,
        subCategoryName: values.subCategoryName,
      };

      onAdd(subCategoryData);
      resetForm();
      onClose();
    } catch (error) {
      toast.error(`Error adding subcategory ${error}`)
      console.error("Error adding subcategory:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add Sub Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <Formik
          initialValues={{ category: '', subCategoryName: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-left flex justify-between items-center bg-white"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={values.category ? 'text-gray-900' : 'text-gray-400'}>
                    {values.category || 'Select category'}
                  </span>
                  <ChevronDown className="text-gray-400" size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto z-10">
                    {categories?.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setFieldValue('category', category.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No categories available</div>
                    )}
                  </div>
                )}
              </div>
              <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
              <Field
                type="text"
                name="subCategoryName"
                placeholder="Enter sub category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <ErrorMessage
                name="subCategoryName"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium"
                >
                  ADD
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
