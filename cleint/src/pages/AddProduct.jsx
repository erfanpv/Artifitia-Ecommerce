import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import API from "../communication/api.js";
import { getCategories } from "../communication/productService.js";
import ReactCrop from "react-image-crop";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Minimum 3 Character required"),
  variants: Yup.array().of(
    Yup.object({
      ram: Yup.string().required("RAM is required"),
      price: Yup.string().required("Price is required"),
      qty: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required")
        .typeError("Quantity must be a number"),
    })
  ),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("Sub-category is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array().of(Yup.mixed()).min(1, "At least one image is required"),
});

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [tempFile, setTempFile] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // console.log(data)
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryChange = async (categoryId) => {
    try {
      // console.log(categoryId)
      const res = await API.get(`/categories/subcategories/${categoryId}`);
      // console.log(res)
      setSubCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories");
    }
  };

  const onImageLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setTempFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setCropImage(reader.result);
          setShowCropModal(true);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const generateCroppedImage = async (image, crop) => {
    if (!crop || !image) return null;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

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
            console.error("Canvas is empty");
            return;
          }
          blob.name = tempFile.name;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleCropComplete = async (setFieldValue, values) => {
    try {
      if (!imgRef || !completedCrop) {
        toast.error("Please select an area to crop");
        return;
      }

      const croppedImageBlob = await generateCroppedImage(
        imgRef,
        completedCrop
      );

      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], tempFile.name, {
          type: "image/jpeg",
        });

        const updatedImages = [...values.images, croppedFile];
        setFieldValue("images", updatedImages);
        setShowCropModal(false);
        setCropImage("");
        setTempFile(null);
        setCompletedCrop(null);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.title);
    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);
    formData.append("description", values.description);
    formData.append("variants", JSON.stringify(values.variants));

    values.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await onSubmit(formData);
      onClose();
      // toast.success('Product added successfully');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  if (!isOpen) return null;

  return (
    <Formik
      initialValues={{
        title: "",
        variants: [{ qty: 1, ram: "", price: "" }],
        category: "",
        subCategory: "",
        description: "",
        images: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-semibold">Add Product</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <Form>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Title:
                    </label>
                    <Field
                      type="text"
                      name="title"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Enter Title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Variants:
                    </label>
                    {values.variants.map((variant, index) => (
                      <div key={index} className="flex gap-4 mb-2">
                        <Field
                          type="text"
                          name={`variants[${index}].ram`}
                          className="w-1/3 p-2 border border-gray-300 rounded"
                          placeholder="Enter variants"
                        />
                        <Field
                          type="text"
                          name={`variants[${index}].price`}
                          className="w-1/3 p-2 border border-gray-300 rounded"
                          placeholder="Enter Price"
                        />
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue(
                                `variants[${index}].qty`,
                                Math.max(1, values.variants[index].qty - 1)
                              )
                            }
                            className="px-3 py-2 border-r border-gray-300"
                          >
                            -
                          </button>
                          <span className="px-3">{variant.qty}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue(
                                `variants[${index}].qty`,
                                values.variants[index].qty + 1
                              )
                            }
                            className="px-3 py-2 border-l border-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("variants", [
                          ...values.variants,
                          { qty: 1, ram: "", price: "" },
                        ])
                      }
                      className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Category:
                      </label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => {
                          setFieldValue("category", e.target.value);
                          handleCategoryChange(e.target.value);
                        }}
                      >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Sub-category:
                      </label>
                      <Field
                        as="select"
                        name="subCategory"
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select a Sub-category</option>
                        {subCategories.map((subCategory) => (
                          <option key={subCategory._id} value={subCategory._id}>
                            {subCategory.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="subCategory"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Description:
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full p-2 border border-gray-300 rounded h-24"
                      placeholder="Write Description..."
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-2">
                      Upload Image:
                    </label>
                    <div className="flex gap-4 items-center flex-wrap">
                      {values.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              typeof img === "string"
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = values.images.filter(
                                (_, i) => i !== index
                              );
                              setFieldValue("images", updatedImages);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="hidden"
                          accept="image/*"
                        />
                        <span className="text-4xl text-gray-400">+</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="images"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      Add Product
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          {showCropModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
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
                      setCropImage("");
                      setTempFile(null);
                      setCompletedCrop(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCropComplete(setFieldValue, values)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Formik>
  );
};

export default AddProductModal;
