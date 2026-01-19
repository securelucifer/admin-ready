import apiClient from './api';

class ApkService {
    async getStatus() {
        try {
            const { data } = await apiClient.get('/apk/status');  // ✅ FIXED: Added /api
            return data;
        } catch (error) {
            console.error('Get APK status error:', error);
            throw error;
        }
    }

    async uploadApk(file, version = '', onProgress) {
        try {
            const formData = new FormData();
            formData.append('apk', file);
            if (version) formData.append('version', version);

            const { data } = await apiClient.post('/apk/upload', formData, {  // ✅ FIXED: Added /api
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 120000,
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                }
            });

            return data;
        } catch (error) {
            console.error('Upload APK error:', error);
            throw error;
        }
    }

    async deleteApk() {
        try {
            const { data } = await apiClient.delete('/apk/delete');  // ✅ FIXED: Added /api
            return data;
        } catch (error) {
            console.error('Delete APK error:', error);
            throw error;
        }
    }

    getDownloadUrl() {
        return `${import.meta.env.VITE_API_URL}/apk/download`;  // ✅ FIXED: Added /api
    }

    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default new ApkService();
