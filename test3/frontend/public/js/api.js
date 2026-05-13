export const API_URL = window.location.protocol.startsWith('http')
  ? window.location.origin
  : 'http://localhost:3000';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) {
    throw new Error(`Products request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_URL}/cart`);
  if (!res.ok) {
    throw new Error(`Cart request failed with status ${res.status}`);
  }
  return res.json();
}

export async function addItemToCart(productId, quantity = 1) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });

  if (!res.ok) {
    throw new Error(`Update cart failed with status ${res.status}`);
  }

  return res.json();
}

export async function deleteCartItem(id) {
  const res = await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Delete failed with status ${res.status}`);
  }

  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_URL}/cart`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Clear cart failed with status ${res.status}`);
  }

  return res.json();
}
