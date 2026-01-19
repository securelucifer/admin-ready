import apiClient from './api';

class BannerService {
    // Get all banners
    async getAllBanners(activeOnly = false) {
        try {
            const params = activeOnly ? '?active=true' : '';
            const response = await apiClient.get(`/banners${params}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Get single banner
    async getBanner(bannerId) {
        try {
            const response = await apiClient.get(`/banners/${bannerId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Create banner with multiple images
    async createBanner(bannerData, imageFiles) {
        try {
            const formData = new FormData();

            // Add banner fields to FormData
            Object.keys(bannerData).forEach(key => {
                if (bannerData[key] !== null && bannerData[key] !== undefined) {
                    formData.append(key, bannerData[key]);
                }
            });

            // Add multiple image files
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    formData.append('images', file);
                });
            }

            const response = await apiClient.post('/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 120000, // 2 minutes timeout for multiple image upload
            });

            return response.data;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Upload timeout - Please try with smaller images or check your connection');
            }
            throw error.response?.data || error;
        }
    }

    // Update banner
    async updateBanner(bannerId, bannerData, imageFiles = null) {
        try {
            const formData = new FormData();

            Object.keys(bannerData).forEach(key => {
                if (bannerData[key] !== null && bannerData[key] !== undefined) {
                    formData.append(key, bannerData[key]);
                }
            });

            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach((file) => {
                    formData.append('images', file);
                });
            }

            const response = await apiClient.put(`/banners/${bannerId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 120000,
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Delete banner
    async deleteBanner(bannerId) {
        try {
            const response = await apiClient.delete(`/banners/${bannerId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Delete specific image from banner
    async deleteBannerImage(bannerId, imageId) {
        try {
            const response = await apiClient.delete(`/banners/${bannerId}/images/${imageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // Toggle banner status
    async toggleBannerStatus(bannerId) {
        try {
            const response = await apiClient.patch(`/banners/${bannerId}/toggle`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
}

export default new BannerService();
