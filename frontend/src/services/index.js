import api from './api';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getTrending: () => api.get('/products/trending'),
  getFeatured: () => api.get('/products/featured'),
  approve: (id, data) => api.patch(`/products/${id}/approve`, data),
};

export const companyAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getBySlug: (slug) => api.get(`/companies/${slug}`),
  getMy: () => api.get('/companies/my'),
  save: (data) => api.put('/companies', data),
  uploadLogo: (formData) => api.post('/companies/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getTop: () => api.get('/companies/top'),
  getPremium: () => api.get('/companies/premium'),
  approve: (id, data) => api.patch(`/companies/${id}/approve`, data),
};

export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getSubcategories: (params) => api.get('/categories/subcategories/all', { params }),
  createSubcategory: (data) => api.post('/categories/subcategories', data),
  updateSubcategory: (id, data) => api.put(`/categories/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/categories/subcategories/${id}`),
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getMy: (params) => api.get('/inquiries/my', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  updateStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status }),
  getAll: (params) => api.get('/inquiries/all', { params }),
};

export const quotationAPI = {
  create: (data) => api.post('/quotations', data),
  getMy: () => api.get('/quotations/my'),
  updateStatus: (id, status) => api.patch(`/quotations/${id}/status`, { status }),
};

export const searchAPI = {
  global: (q) => api.get('/search', { params: { q } }),
  adminDashboard: () => api.get('/search/admin/dashboard'),
  sellerDashboard: () => api.get('/search/seller/dashboard'),
  buyerDashboard: () => api.get('/search/buyer/dashboard'),
  reports: () => api.get('/search/admin/reports'),
};

export const userAPI = {
  getWishlist: () => api.get('/users/wishlist'),
  toggleWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  getAll: (params) => api.get('/users', { params }),
  updateStatus: (id, isActive) => api.patch(`/users/${id}/status`, { isActive }),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (ids) => api.patch('/notifications/read', { ids }),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const bannerAPI = {
  getAll: (params) => api.get('/banners', { params }),
  create: (formData) => api.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/banners/${id}`),
};

export const subscriptionAPI = {
  getPlans: (params) => api.get('/subscriptions', { params }),
  subscribe: (planId) => api.post('/subscriptions/subscribe', { planId }),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  delete: (id) => api.delete(`/subscriptions/${id}`),
};

export const chatAPI = {
  getAll: () => api.get('/chats'),
  create: (data) => api.post('/chats', data),
  getMessages: (id) => api.get(`/chats/${id}/messages`),
  sendMessage: (id, content) => api.post(`/chats/${id}/messages`, { content }),
};

export const cmsAPI = {
  getPages: (params) => api.get('/cms', { params }),
  getBySlug: (slug) => api.get(`/cms/${slug}`),
  create: (data) => api.post('/cms', data),
  update: (id, data) => api.put(`/cms/${id}`, data),
  delete: (id) => api.delete(`/cms/${id}`),
  contact: (data) => api.post('/cms/contact', data),
};

export const reviewAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  getFeatured: () => api.get('/reviews/featured'),
  create: (data) => api.post('/reviews', data),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};
