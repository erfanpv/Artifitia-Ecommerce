import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import API from '../communication/api';
import { getProductById, updateProduct, getCategories } from '../communication/productService';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, "Minimum 3 characters required"),
    variants: Yup.array().of(
        Yup.object({
            ram: Yup.string().required('RAM is required'),
            price: Yup.string().required('Price is required'),
            qty: Yup.number()
                .min(1, 'Quantity must be at least 1')
                .required('Quantity is required')
                .typeError('Quantity must be a number'),
        })
    ),
    category: Yup.string().required('Category is required'),
    subCategory: Yup.string().required('Sub-category is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array()
        .of(Yup.mixed())
        .min(1, 'At least one image is required'),
});

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropImage, setCropImage] = useState('');
    const [tempFile, setTempFile] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        title: '',
        variants: [{ qty: 1, ram: '', price: '' }],
        category: '',
        subCategory: '',
        description: '',
        images: [],
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productRes, categoriesRes] = await Promise.all([
                    getProductById(id),
                    getCategories()
                ]);

                if (productRes?.data) {
                    const product = productRes.data;
                    // console.log(categories)
                    setInitialValues({
                        title: product.name || '',
                        variants: product.variants.length > 0 ? product.variants : [{ qty: 1, ram: '', price: '' }],
                        category: '',
                        subCategory: '',
                        description: product.description || '',
                        images: product.images || [],
                    });

                    if (categoriesRes?.data) {
                        setCategories(categoriesRes.data);
                        // If we have a category, find its ID and fetch subcategories
                        if (product.category) {
                            const categoryObj = categoriesRes.data.find(cat => cat.name === product.category);
                            if (categoryObj) {
                                await handleCategoryChange(categoryObj._id);
                            }
                        }
                    }
                }
            } catch (error) {
                toast.error('Failed to load product data');
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCategoryChange = async (categoryId) => {
        try {
            const selectedCategory = categories.find(cat => cat._id === categoryId);
            if (!selectedCategory) {
                console.error('Category not found for ID:', categoryId);
                return;
            }

            const res = await API.get(`/categories/subcategories/${selectedCategory.name}`);
            if (res.data.success) {
                setSubCategories(res.data.data || []);
            } else {
                setSubCategories([]);
                toast.error('Failed to fetch subcategories');
            }
        } catch (error) {
            setSubCategories([]);
            toast.error('Failed to fetch subcategories');
            console.error('Error fetching subcategories:', error);
        }
    };

    const onImageLoad = useCallback((img) => {
        setImgRef(img);
    }, []);

    const handleImageChange = (e, setFieldValue, values) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setTempFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setCropImage(reader.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('Please upload a valid image file');
        }
    };

    const generateCroppedImage = async (image, crop) => {
        if (!crop || !image) return null;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = tempFile.name;
                    resolve(blob);
                },
                'image/jpeg',
                1
            );
        });
    };

    const handleCropComplete = async (setFieldValue, values) => {
        try {
            if (!imgRef || !completedCrop) {
                toast.error('Please select an area to crop');
                return;
            }

            const croppedImageBlob = await generateCroppedImage(imgRef, completedCrop);
            if (croppedImageBlob) {
                const croppedFile = new File([croppedImageBlob], tempFile.name, { type: 'image/jpeg' });
                const updatedImages = [...values.images, croppedFile];
                setFieldValue('images', updatedImages);
                setShowCropModal(false);
                setCropImage('');
                setTempFile(null);
                setCompletedCrop(null);
            }
        } catch (error) {
            toast.error('Failed to crop image');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append('name', values.title);
            formData.append('category', values.category);
            formData.append('subCategory', values.subCategory);
            formData.append('description', values.description);
            formData.append('variants', JSON.stringify(values.variants));

            values.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append('images', image);
                } else {
                    formData.append('existingImages', image);
                }
            });

            const response = await updateProduct(id, formData);

            if (response?.success) {
                toast.success('Product updated successfully');
                navigate(`/${id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };


    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ setFieldValue, values }) => (
                        <Form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <Field
                                    name="title"
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Variants</label>
                                {values.variants.map((variant, index) => (
                                    <div key={index} className="flex gap-4 mb-4">
                                        <Field
                                            name={`variants.${index}.ram`}
                                            type="text"
                                            placeholder="RAM"
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <Field
                                            name={`variants.${index}.price`}
                                            type="text"
                                            placeholder="Price"
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <div className="flex items-center border rounded">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const qty = values.variants[index].qty;
                                                    setFieldValue(`variants.${index}.qty`, Math.max(1, qty - 1));
                                                }}
                                                className="px-3 py-2 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="px-3">{variant.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const qty = values.variants[index].qty;
                                                    setFieldValue(`variants.${index}.qty`, qty + 1);
                                                }}
                                                className="px-3 py-2 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {values.variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newVariants = values.variants.filter((_, i) => i !== index);
                                                    setFieldValue('variants', newVariants);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFieldValue('variants', [
                                            ...values.variants,
                                            { ram: '', price: '', qty: 1 }
                                        ]);
                                    }}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    + Add Variant
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <Field
                                        as="select"
                                        name="category"
                                        className="w-full p-2 border rounded"
                                        onChange={(e) => {
                                            const categoryId = e.target.value;
                                            const selectedCategory = categories.find(cat => cat._id === categoryId);
                                            if (selectedCategory) {
                                                setFieldValue('category', selectedCategory.name);
                                                handleCategoryChange(categoryId);
                                            }
                                        }}
                                        value={categories.find(cat => cat.name === values.category)?._id || ''}
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                                </div>


                                <div>
                                    <label className="block text-sm font-medium mb-2">Sub-category</label>
                                    <Field
                                        as="select"
                                        name="subCategory"
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Sub-category</option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory._id} value={subCategory.name}>
                                                {subCategory.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="subCategory" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Images</label>
                                <div className="flex flex-wrap gap-4">
                                    {values.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image instanceof File ? URL.createObjectURL(image) : image}
                                                alt={`Product ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = values.images.filter((_, i) => i !== index);
                                                    setFieldValue('images', newImages);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-blue-500">
                                        <input
                                            type="file"
                                            onChange={(e) => handleImageChange(e, setFieldValue, values)}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <span className="text-4xl text-gray-400">+</span>
                                    </label>
                                </div>
                                <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/${id}`)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            {showCropModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Crop Image</h3>
                            <button
                                onClick={() => {
                                    setShowCropModal(false);
                                    setShowCropModal(false);
                                    setCropImage('');
                                    setTempFile(null);
                                    setCompletedCrop(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-auto">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                            >
                                <img
                                    src={cropImage}
                                    alt="Crop preview"
                                    onLoad={(e) => onImageLoad(e.currentTarget)}
                                    className="max-w-full"
                                />
                            </ReactCrop>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCropModal(false);
                                    setCropImage('');
                                    setTempFile(null);
                                    setCompletedCrop(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={(e, setFieldValue, values) => handleCropComplete(setFieldValue, values)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProduct;