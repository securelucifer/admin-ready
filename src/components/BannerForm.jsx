import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bannerService from '../services/bannerService';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    order: 0,
    primaryImageIndex: 0,
    keepExistingImages: false
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchBanner();
    }
  }, [id, isEditMode]);

  const fetchBanner = async () => {
    try {
      const response = await bannerService.getBanner(id);
      if (response.success) {
        const banner = response.data;
        setFormData({
          title: banner.title || '',
          description: banner.description || '',
          isActive: banner.isActive,
          order: banner.order || 0,
          primaryImageIndex: banner.images?.findIndex(img => img.isPrimary) || 0,
          keepExistingImages: false
        });
        setExistingImages(banner.images || []);
      }
    } catch (error) {
      setError('Failed to fetch banner details');
      console.error('Error fetching banner:', error);
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
    if (!files.length) return;

    // Validate files
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select only valid image files');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        continue;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file,
          url: e.target.result,
          name: file.name
        });

        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removePreviewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await bannerService.deleteBannerImage(id, imageId);
      setExistingImages(prev => prev.filter(img => img._id !== imageId));
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const setPrimaryImage = (index, isExisting = false) => {
    if (isExisting) {
      // Update existing images primary status
      setExistingImages(prev => 
        prev.map((img, i) => ({
          ...img,
          isPrimary: i === index
        }))
      );
    } else {
      setFormData(prev => ({
        ...prev,
        primaryImageIndex: index
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!isEditMode && imageFiles.length === 0) {
      setError('At least one banner image is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isEditMode) {
        response = await bannerService.updateBanner(id, formData, imageFiles);
      } else {
        response = await bannerService.createBanner(formData, imageFiles);
      }

      if (response.success) {
        alert(`Banner ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/admin/banners');
      } else {
        setError(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      
      if (error.message.includes('timeout')) {
        setError('Upload timed out. Please try with smaller images or check your internet connection.');
      } else {
        setError(error.message || 'Failed to save banner. Please try again.');
      }
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
              {isEditMode ? 'Edit Banner' : 'Create New Banner'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditMode ? 'Update banner information' : 'Add a new promotional banner with multiple images'}
            </p>
          </div>
          <Link
            to="/admin/banners"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Banners</span>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Banner Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter banner title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter banner description (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active Banner (display on website)
                    </label>
                  </div>
                </div>

                {isEditMode && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="keepExistingImages"
                      name="keepExistingImages"
                      checked={formData.keepExistingImages}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="keepExistingImages" className="ml-2 block text-sm text-gray-900">
                      Keep existing images when adding new ones
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Existing Images (Edit Mode) */}
            {isEditMode && existingImages.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image._id} className="relative group">
                      <img
                        src={image.imageUrl}
                        alt={`Banner image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      
                      {/* Primary Image Badge */}
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Primary
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index, true)}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                          title="Set as primary"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image._id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Delete image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Images Upload */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isEditMode ? 'Add New Images' : 'Banner Images'}
              </h3>
              
              {/* Image Upload Guidelines */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Multiple Image Upload:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-1 list-disc list-inside">
                      <li>Select multiple images (up to 10)</li>
                      <li>Dimensions: 1920 x 700 pixels (ideal for web banners)</li>
                      <li>Format: JPG, PNG, or WebP</li>
                      <li>File size: Maximum 5MB per image</li>
                      <li>First image will be set as primary by default</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                  {isEditMode ? 'Additional Images' : 'Banner Images *'}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload multiple files</span>
                        <input 
                          id="images" 
                          name="images" 
                          type="file" 
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                          multiple
                          disabled={loading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each (max 10 files)</p>
                  </div>
                </div>
              </div>

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview.url} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        
                        {/* Primary Image Badge */}
                        {index === formData.primaryImageIndex && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            Primary
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                            title="Set as primary"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-1 truncate">{preview.name}</p>
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
                  onClick={() => navigate('/admin/banners')}
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
                  <span>
                    {loading 
                      ? (isEditMode ? 'Updating...' : 'Creating...') 
                      : (isEditMode ? 'Update Banner' : 'Create Banner')
                    }
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
