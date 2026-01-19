import apiClient from './api';

class ProductService {
    // Get all products
    async getAllProducts(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiClient.get(`/admin/products?${queryParams}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Get single product
    async getProduct(productId) {
        try {
            const response = await apiClient.get(`/admin/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Create product with images
    async createProduct(productData, images = []) {
        try {
            const formData = new FormData();

            // Add product fields to FormData
            Object.keys(productData).forEach(key => {
                if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            // Add images
            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await apiClient.post('/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Update product
    async updateProduct(productId, productData, images = [], replaceImages = false) {
        try {
            const formData = new FormData();

            Object.keys(productData).forEach(key => {
                if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            images.forEach((image) => {
                formData.append('images', image);
            });

            const queryParam = replaceImages ? '?replaceImages=true' : '';
            const response = await apiClient.put(`/admin/products/${productId}${queryParam}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Delete product
    async deleteProduct(productId) {
        try {
            const response = await apiClient.delete(`/admin/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Update product rating
    async updateProductRating(productId, rating, reviewsCount) {
        try {
            const response = await apiClient.patch(`/admin/products/${productId}/rating`, {
                rating,
                reviewsCount
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Get admin stats
    async getStats() {
        try {
            const response = await apiClient.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

export default new ProductService();
