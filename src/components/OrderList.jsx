import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: ''
    });
    const [showSensitiveData, setShowSensitiveData] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAllOrders(filters);

            if (response.success) {
                setOrders(response.data);
                setPagination(response.pagination);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId, orderNumber) => {
        if (!window.confirm(`Are you sure you want to delete order "${orderNumber}"?`)) {
            return;
        }

        try {
            const response = await orderService.deleteOrder(orderId);

            if (response.success) {
                fetchOrders();
                alert('Order deleted successfully!');
            } else {
                alert('Failed to delete order');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message || 'Failed to delete order');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${field} copied to clipboard!`);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
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
                            <span className="text-lg text-gray-600">Loading orders...</span>
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
                        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showSensitiveData}
                                onChange={(e) => setShowSensitiveData(e.target.checked)}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-red-600 font-medium">Show Sensitive Data</span>
                        </label>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                            <span className="text-sm text-gray-500">Total Orders: </span>
                            <span className="font-semibold text-gray-900">{pagination.totalOrders || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                            <select
                                value={filters.limit}
                                onChange={(e) => handleFilterChange('limit', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={fetchOrders}
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table with Complete Card Details */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order & Products</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-1">
                                            <span>Complete Card Information</span>
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Information</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        {/* Product Names */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="text-sm font-medium text-gray-700 mb-1">Products:</div>
                                                    {order.products?.map((product, index) => (
                                                        <div key={index} className="text-sm text-gray-600 mb-1">
                                                            <div className="flex items-center justify-between">
                                                                <span>• {product.name}</span>
                                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">x{product.quantity}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 ml-2">
                                                                ₹{product.dmartPrice} each → ₹{product.totalPrice}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="text-sm font-medium text-green-600 mt-2 p-2 bg-green-50 rounded">
                                                        Total: ₹{order.orderSummary?.finalTotal} ({order.orderSummary?.totalItems} items)
                                                    </div>
                                                    {order.orderSummary?.totalSavings > 0 && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            Saved: ₹{order.orderSummary.totalSavings}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Complete Card Information */}
                                        <td className="px-6 py-4">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <div className="flex items-center mb-2">
                                                    <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs font-bold text-red-600">SENSITIVE DATA</span>
                                                </div>

                                                {showSensitiveData ? (
                                                    <div className="space-y-2 text-sm">
                                                        {/* Card Type */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Card Type:</span>
                                                            <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                                                                {order.cardDetails?.cardType}
                                                            </span>
                                                        </div>

                                                        {/* Full Card Number */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Card Number:</span>
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border text-lg tracking-wider">
                                                                    {order.cardDetails?.cardNumber || `****-****-****-${order.cardDetails?.cardNumberLast4}`}
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboard(order.cardDetails?.cardNumber, 'Card Number')}
                                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                                    title="Copy card number"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* CVV */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">CVV:</span>
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border text-lg tracking-wider">
                                                                    {order.cardDetails?.cvv}
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboard(order.cardDetails?.cvv, 'CVV')}
                                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                                    title="Copy CVV"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Expiry Date */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Expiry:</span>
                                                            <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                                                                {order.cardDetails?.expiry}
                                                            </span>
                                                        </div>

                                                        {/* Cardholder Name */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Holder Name:</span>
                                                            <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                                                                {order.cardDetails?.holderName}
                                                            </span>
                                                        </div>

                                                        {/* Payment Method */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Payment Method:</span>
                                                            <span className="text-gray-900 bg-white px-2 py-1 rounded border">
                                                                {order.paymentMethod?.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        {/* Payment Status */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-700">Payment Status:</span>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'paid'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : order.paymentStatus === 'failed'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {order.paymentStatus?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <p className="text-sm text-red-600 mb-2">Sensitive data hidden for security</p>
                                                        <p className="text-xs text-gray-500">Check "Show Sensitive Data" to view complete card details</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Delivery Information */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <div className="space-y-1">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Full Name:</span>
                                                            <div className="text-gray-900 font-medium">{order.deliveryAddress?.fullName}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Phone:</span>
                                                            <div className="text-gray-900">
                                                                <a href={`tel:${order.deliveryAddress?.phone}`} className="hover:text-blue-600">
                                                                    {order.deliveryAddress?.phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Complete Address:</span>
                                                            <div className="text-gray-900 mt-1 p-2 bg-white rounded border">
                                                                {order.deliveryAddress?.address}<br />
                                                                {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br />
                                                                PIN: {order.deliveryAddress?.pincode}
                                                            </div>
                                                        </div>
                                                        <div className="pt-2">
                                                            <button
                                                                onClick={() => {
                                                                    const address = `${order.deliveryAddress?.address}, ${order.deliveryAddress?.city}, ${order.deliveryAddress?.state} ${order.deliveryAddress?.pincode}`;
                                                                    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
                                                                    window.open(mapsUrl, '_blank');
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800 text-xs underline flex items-center space-x-1"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span>View on Maps</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions - Delete Button */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                                                    className="w-full text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span>Delete Order</span>
                                                </button>

                                               
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.status ? `No orders with status "${filters.status}"` : 'No orders have been placed yet.'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        disabled={!pagination.hasPrevPage}
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={!pagination.hasNextPage}
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                                            <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalOrders} total orders)
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            disabled={!pagination.hasPrevPage}
                                            onClick={() => handleFilterChange('page', filters.page - 1)}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous
                                        </button>
                                        <button
                                            disabled={!pagination.hasNextPage}
                                            onClick={() => handleFilterChange('page', filters.page + 1)}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Next
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderList;
