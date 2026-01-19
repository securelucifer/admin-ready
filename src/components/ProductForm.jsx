import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/productService';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mrp: '',
        dmartPrice: '',
        weight: '',
        brand: '',
        category: '',
        isVeg: true,
        tags: '',
        stockQuantity: '',
        featured: false,
        rating: '4.0',
        reviewsCount: '0',
        badge: ''
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id, isEditMode]);

    const fetchProduct = async () => {
        try {
            const response = await productService.getProduct(id);
            if (response.success) {
                const product = response.data;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    mrp: product.mrp || '',
                    dmartPrice: product.dmartPrice || '',
                    weight: product.weight || '',
                    brand: product.brand || '',
                    category: product.category || '',
                    isVeg: product.isVeg || true,
                    tags: product.tags?.join(', ') || '',
                    stockQuantity: product.stockQuantity || '',
                    featured: product.featured || false,
                    rating: product.rating || '4.0',
                    reviewsCount: product.reviewsCount || '0',
                    badge: product.badge || ''
                });
                setExistingImages(product.images || []);
            }
        } catch (error) {
            setError('Failed to fetch product details');
            console.error('Error fetching product:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.description || !formData.mrp || !formData.dmartPrice) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;

            if (isEditMode) {
                response = await productService.updateProduct(id, formData, images);
            } else {
                response = await productService.createProduct(formData, images);
            }

            if (response.success) {
                alert(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
                navigate('/admin/products');
            } else {
                setError(response.message || 'Operation failed');
            }
        } catch (error) {
            setError(error.message || 'Operation failed');
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {isEditMode ? 'Update product information' : 'Fill in the details to create a new product'}
                        </p>
                    </div>
                    <Link
                        to="/admin/products"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Products</span>
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="Enter brand name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Grocery & Staples">Grocery & Staples</option>
                                        <option value="Snacks & Branded Foods">Snacks & Branded Foods</option>
                                        <option value="Beverages">Beverages</option>
                                        <option value="Personal Care">Personal Care</option>
                                        <option value="Home Care">Home Care</option>
                                        <option value="Frozen Food">Frozen Food</option>
                                        <option value="Biscuits & Cookies">Biscuits & Cookies</option>
                                        <option value="Instant Food">Instant Food</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight/Size
                                    </label>
                                    <input
                                        type="text"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="e.g., 1 kg, 500 g, 250 ml"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="Enter product description"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-2">
                                        MRP (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="mrp"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dmartPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                        D-Mart Price (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="dmartPrice"
                                        name="dmartPrice"
                                        value={formData.dmartPrice}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            {/* Discount Preview */}
                            {formData.mrp && formData.dmartPrice && formData.mrp > formData.dmartPrice && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                Discount: ₹{(formData.mrp - formData.dmartPrice).toFixed(2)}
                                                ({Math.round(((formData.mrp - formData.dmartPrice) / formData.mrp) * 100)}% off)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reviewsCount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Reviews Count
                                    </label>
                                    <input
                                        type="number"
                                        id="reviewsCount"
                                        name="reviewsCount"
                                        value={formData.reviewsCount}
                                        onChange={handleInputChange}
                                        min="0"
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-2">
                                        Badge
                                    </label>
                                    <select
                                        id="badge"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                    >
                                        <option value="">No Badge</option>
                                        <option value="FRESH">FRESH</option>
                                        <option value="BESTSELLER">BESTSELLER</option>
                                        <option value="TOP RATED">TOP RATED</option>
                                        <option value="GREAT VALUE">GREAT VALUE</option>
                                        <option value="LIMITED TIME">LIMITED TIME</option>
                                        <option value="NEW">NEW</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                        placeholder="e.g., healthy, organic, spicy, vegetarian"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Options */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Options</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isVeg"
                                        name="isVeg"
                                        checked={formData.isVeg}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isVeg" className="ml-2 block text-sm text-gray-900">
                                        Vegetarian Product
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                        Featured Product
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                            <div>
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Images
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload files</span>
                                                <input
                                                    id="images"
                                                    name="images"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleImageChange}
                                                    multiple
                                                    accept="image/*"
                                                    disabled={loading}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB (Max 5 files)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {imagePreview.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {imagePreview.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing Images in Edit Mode */}
                            {isEditMode && existingImages.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={img.url}
                                                    alt={`Current ${index + 1}`}
                                                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/products')}
                                    disabled={loading}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {loading && (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <span>{loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
