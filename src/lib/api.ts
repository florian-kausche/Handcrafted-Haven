// Client-side API utilities

const API_BASE = '/api'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => apiRequest('/auth/me'),
}

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; featured?: boolean; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.category) query.append('category', params.category)
    if (params?.featured) query.append('featured', 'true')
    if (params?.search) query.append('search', params.search)
    return apiRequest(`/products?${query.toString()}`)
  },

  getById: (id: number) => apiRequest(`/products/${id}`),
}

// Cart API
export const cartAPI = {
  getItems: () => apiRequest('/cart'),
  addItem: (productId: number, quantity: number) =>
    apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateItem: (productId: number, quantity: number) =>
    apiRequest('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    }),
  removeItem: (productId: number) =>
    apiRequest('/cart', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    }),
}

// Orders API
export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  create: (data: { shippingAddress: string; billingAddress: string; paymentMethod: string }) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Seller API
export const sellerAPI = {
  getProducts: () => apiRequest('/products/seller'),
  getStats: () => apiRequest('/seller/stats'),
  createProduct: (data: any) =>
    apiRequest('/products/seller', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (data: any) =>
    apiRequest('/products/seller', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: number) =>
    apiRequest('/products/seller', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
}

