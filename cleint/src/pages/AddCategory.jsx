import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast'
import * as Yup from 'yup';

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    category: Yup.string()
      .trim()
      .required('Category name is required')
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name must not exceed 50 characters'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      onAdd(values.category);
      resetForm();
      onClose();
    } catch (error) {
      toast.error(`Error adding category ${error}`)
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-medium mb-4">Add Category</h2>

        <Formik
          initialValues={{ category: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="category"
                  placeholder="Category name"
                  className="w-full border rounded-md p-2"
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5A524] text-white rounded-md hover:bg-[#e09620] transition-colors"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCategoryModal;
