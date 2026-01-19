import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../services/bannerService';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getAllBanners();

            if (response.success) {
                setBanners(response.data);
            } else {
                setError('Failed to fetch banners');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch banners');
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBanner = async (bannerId, bannerTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${bannerTitle}"?`)) {
            return;
        }

        try {
            const response = await bannerService.deleteBanner(bannerId);

            if (response.success) {
                fetchBanners();
                alert('Banner deleted successfully!');
            } else {
                alert('Failed to delete banner');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message || 'Failed to delete banner');
        }
    };

    const handleToggleStatus = async (bannerId) => {
        try {
            const response = await bannerService.toggleBannerStatus(bannerId);

            if (response.success) {
                fetchBanners();
                alert(response.message);
            } else {
                alert('Failed to toggle banner status');
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            alert(error.message || 'Failed to toggle banner status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-lg text-gray-600">Loading banners...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">Error: {error}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
                        <p className="mt-2 text-gray-600">Manage website banners and promotional content</p>
                    </div>
                    <Link
                        to="/admin/banners/create"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Banner</span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Banners</p>
                                <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Banners</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {banners.filter(banner => banner.isActive).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Inactive Banners</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {banners.filter(banner => !banner.isActive).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banners Grid */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    {banners.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No banners found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating your first banner.</p>
                            <div className="mt-6">
                                <Link
                                    to="/admin/banners/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Banner
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                            {banners.map((banner) => (
                                <div key={banner._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                   
                                
                                    {/* Banner Image */}
                                    <div className="relative h-40 bg-gray-200">
                                        <img
                                            src={banner.images?.[0]?.imageUrl || banner.primaryImage?.imageUrl}
                                            alt={banner.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${banner.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="absolute top-2 left-2 flex space-x-1">
                                            {banner.order > 0 && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Order: {banner.order}
                                                </span>
                                            )}
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {banner.images?.length || 0} images
                                            </span>
                                        </div>
                                    </div>


                                    {/* Banner Content */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {banner.title}
                                                </h3>
                                                {banner.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {banner.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Created: {new Date(banner.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/admin/banners/edit/${banner._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm transition-colors duration-200"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(banner._id)}
                                                    className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${banner.isActive
                                                        ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                                                        : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {banner.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteBanner(banner._id, banner.title)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;
