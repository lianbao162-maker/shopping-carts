const API_URL = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth APIs
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error(`Register failed: ${res.status}`);
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Fetch user failed: ${res.status}`);
  const data = await res.json();
  return data.user ?? data;
}

// Product APIs
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error(`Products request failed: ${res.status}`);
  return res.json();
}

// Cart APIs
export async function fetchCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Cart request failed: ${res.status}`);
  return res.json();
}

export async function addItemToCart(productId, quantity = 1) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ productId, quantity })
  });
  if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
  return res.json();
}

export async function updateCartItem(cartItemId, quantity) {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) throw new Error(`Update cart failed: ${res.status}`);
  return res.json();
}

export async function deleteCartItem(cartItemId) {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Delete cart item failed: ${res.status}`);
  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Clear cart failed: ${res.status}`);
  return res.json();
}

// User Profile APIs
export async function updateUserProfile(name, email) {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ name, email })
  });
  if (!res.ok) throw new Error(`Update profile failed: ${res.status}`);
  return res.json();
}

export async function updatePassword(oldPassword, newPassword) {
  const res = await fetch(`${API_URL}/auth/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });
  if (!res.ok) throw new Error(`Update password failed: ${res.status}`);
  return res.json();
}

// Admin APIs
export async function fetchAllUserCarts() {
  const res = await fetch(`${API_URL}/admin/carts`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Fetch all carts failed: ${res.status}`);
  return res.json();
}
