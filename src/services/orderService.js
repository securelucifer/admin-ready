import apiClient from './api';

class OrderService {
  // Get all orders
  async getAllOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/order/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const response = await apiClient.get(`/order/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get order by order number
  async getOrderByNumber(orderNumber) {
    try {
      const response = await apiClient.get(`/order/order/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiClient.put(`/order/order/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteOrder(orderId) {
    try {
      console.log('Deleting order with ID:', orderId);
      const response = await apiClient.delete(`/order/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Delete order error:', error);
      throw error.response?.data || error;
    }
  }



  // Get orders by user
  async getOrdersByUser(userId, params = {}) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/order/orders/${userId}?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
}

export default new OrderService();
