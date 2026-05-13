export const API_URL = window.location.protocol.startsWith('http')
  ? window.location.origin
  : 'http://localhost:3000';

function authHeaders() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) {
    throw new Error(`Products request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: {
      ...authHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`Cart request failed with status ${res.status}`);
  }
  return res.json();
}

export async function addItemToCart(productId, quantity = 1) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ productId, quantity })
  });

  if (!res.ok) {
    throw new Error(`Add to cart failed with status ${res.status}`);
  }

  return res.json();
}

export async function updateCartItem(id, quantity) {
  const res = await fetch(`${API_URL}/cart/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ quantity })
  });

  if (!res.ok) {
    throw new Error(`Update cart failed with status ${res.status}`);
  }

  return res.json();
}

export async function deleteCartItem(id) {
  const res = await fetch(`${API_URL}/cart/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`Delete failed with status ${res.status}`);
  }

  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: {
      ...authHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`Clear cart failed with status ${res.status}`);
  }

  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Registration failed');
  }

  return payload;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Login failed');
  }

  return payload;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...authHeaders()
    }
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Failed to load current user');
  }

  return payload.user;
}

export async function updateUserProfile(name, email) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ name, email })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Failed to update profile');
  }

  return payload.user;
}

export async function updatePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Failed to update password');
  }

  return payload;
}

export async function fetchAllUsersCarts() {
  const res = await fetch(`${API_URL}/admin/carts`, {
    headers: {
      ...authHeaders()
    }
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.message || 'Failed to load all user carts');
  }

  return payload;
}
