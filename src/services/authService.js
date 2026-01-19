import apiClient from './api';

class AuthService {
  // Admin login
  async login(credentials) {
    try {
      const response = await apiClient.post('/admin/login', credentials);
      
      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(admin));
        return { success: true, data: admin };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  // Admin logout
  async logout() {
    try {
      await apiClient.post('/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login';
    }
  }

  // Get admin profile
  async getProfile() {
    try {
      const response = await apiClient.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    return !!(token && adminData);
  }

  // Get current admin data
  getCurrentAdmin() {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }
}

export default new AuthService();
