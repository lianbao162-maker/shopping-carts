const API_URL = window.location.protocol.startsWith('http')
  ? window.location.origin
  : 'http://localhost:3000';

// Store current product for modal
let currentProduct = null;
let productsById = {};

function renderProductsStatus(title, detail, actionText = 'Run npm start, then open http://localhost:3000') {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = `
    <div class="products-status">
      <h2>${title}</h2>
      <p>${detail}</p>
      <p class="products-status-action">${actionText}</p>
    </div>
  `;
}

function setCartStatus(detail) {
  const cartEmpty = document.getElementById('cart-empty');
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartItems.innerHTML = '';
  cartEmpty.style.display = 'block';
  cartEmpty.innerHTML = `<p>${detail}</p>`;
  total.textContent = '0.00';
  checkoutBtn.textContent = 'Checkout (A$0.00)';
}

// Fetch and display products
async function loadProducts() {
  const productsDiv = document.getElementById('products');
  renderProductsStatus('Loading products...', 'Trying to reach the local store server.');

  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) {
      throw new Error(`Products request failed with status ${res.status}`);
    }

    const products = await res.json();
    productsById = Object.fromEntries(products.map(p => [p._id, p]));
    productsDiv.innerHTML = '';

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      const imageUrl = p.imageURL;
      div.innerHTML = `
        <img src="${imageUrl}" alt="${p.name}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23CCCCCC%22/%3E%3C/svg%3E'">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>A$${p.price}</p>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      `;
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => showProductModal(p));
      productsDiv.appendChild(div);
    });

    if (products.length === 0) {
      renderProductsStatus('No products found', 'The server is running, but the catalog is empty.', 'Run the seeder or restart the server to auto-populate products.');
    }
  } catch (error) {
    console.error('Failed to load products:', error);
    renderProductsStatus(
      'Cannot load the shop page',
      'The frontend cannot reach the product API. This usually means the page was opened directly or the backend is not running.'
    );
  }
}

// Add item to cart
async function addToCart(productId) {
  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (!res.ok) {
      throw new Error(`Add to cart failed with status ${res.status}`);
    }

    loadCart();
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    alert('The cart is unavailable right now. Start the backend and reload the page.');
  }
}

// Fetch and display cart
async function loadCart() {
  try {
    const res = await fetch(`${API_URL}/cart`);
    if (!res.ok) {
      throw new Error(`Cart request failed with status ${res.status}`);
    }

    const cartItems = await res.json();
    renderCart(cartItems);
  } catch (error) {
    console.error('Failed to load cart:', error);
    setCartStatus('Cart unavailable. Start the backend and reload the page.');
  }
}

// Render cart from data and recalculate total
function renderCart(cartItems) {
  const cartUl = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartUl.innerHTML = '';

  if (cartItems.length === 0) {
    cartEmpty.style.display = 'block';
    document.getElementById('total').textContent = '0.00';
    checkoutBtn.textContent = 'Checkout (A$0.00)';
    return;
  }

  cartEmpty.style.display = 'none';
  let total = 0;
  let renderedItems = 0;

  cartItems.forEach(item => {
    const product = typeof item.productId === 'object'
      ? item.productId
      : productsById[item.productId];

    if (!product || typeof product.price !== 'number') {
      return;
    }

    const li = document.createElement('li');
    li.dataset.id = item._id;
    li.dataset.price = product.price;
    li.dataset.quantity = item.quantity;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    li.innerHTML = `
      <div class="item-name">${product.name}</div>
      <div class="item-price">A$<span class="item-total">${itemTotal.toFixed(2)}</span></div>
      <div class="item-controls">
        <button onclick="changeQuantity('${item._id}', ${item.quantity + 1}, this)">+</button>
        <span class="item-qty" style="flex: 1; text-align: center; font-weight: 600;">${item.quantity}</span>
        <button onclick="changeQuantity('${item._id}', ${item.quantity - 1}, this)">−</button>
        <button onclick="deleteCart('${item._id}')">Remove</button>
      </div>
    `;
    cartUl.appendChild(li);
    renderedItems += 1;
  });

  if (renderedItems === 0) {
    cartEmpty.style.display = 'block';
    document.getElementById('total').textContent = '0.00';
    checkoutBtn.textContent = 'Checkout (A$0.00)';
    return;
  }

  document.getElementById('total').textContent = total.toFixed(2);
  checkoutBtn.textContent = `Checkout (A$${total.toFixed(2)})`;
}

// Instantly update quantity + total in DOM, then sync server
function changeQuantity(id, newQty, btn) {
  if (newQty <= 0) {
    deleteCart(id);
    return;
  }

  // Find the list item and update DOM immediately
  const li = document.querySelector(`li[data-id="${id}"]`);
  const price = parseFloat(li.dataset.price);
  li.dataset.quantity = newQty;
  li.querySelector('.item-qty').textContent = newQty;
  li.querySelector('.item-total').textContent = (price * newQty).toFixed(2);

  // Update inline onclick values so subsequent clicks use new qty
  const btns = li.querySelectorAll('.item-controls button');
  btns[0].setAttribute('onclick', `changeQuantity('${id}', ${newQty + 1}, this)`);
  btns[1].setAttribute('onclick', `changeQuantity('${id}', ${newQty - 1}, this)`);

  // Recalculate grand total from all items instantly
  recalculateTotal();

  // Sync with server in background
  fetch(`${API_URL}/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQty })
  });
}

// Recalculate total from current DOM state
function recalculateTotal() {
  let total = 0;
  document.querySelectorAll('#cart-items li').forEach(li => {
    const price = parseFloat(li.dataset.price);
    const qty = parseInt(li.dataset.quantity);
    total += price * qty;
  });
  document.getElementById('total').textContent = total.toFixed(2);
  document.getElementById('checkout-btn').textContent = `Checkout (A$${total.toFixed(2)})`;
}

// Update cart quantity (used by server sync path)
async function updateCart(id, quantity) {
  if (quantity <= 0) {
    deleteCart(id);
    return;
  }
  await fetch(`${API_URL}/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  loadCart();
}

// Delete cart item — remove from DOM instantly, then sync server
async function deleteCart(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();

  // Show empty state if no items left
  if (document.querySelectorAll('#cart-items li').length === 0) {
    document.getElementById('cart-empty').style.display = 'block';
  }

  recalculateTotal();

  try {
    const res = await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Delete failed with status ${res.status}`);
    }
  } catch (error) {
    console.error('Failed to delete cart item:', error);
    loadCart();
  }
}

// Show product detail modal
function showProductModal(product) {
  currentProduct = product;
  const imageUrl = product.imageURL;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductDescription').textContent = product.description;
  document.getElementById('modalProductPrice').textContent = parseFloat(product.price).toFixed(2);
  document.getElementById('modalProductStock').textContent = product.stock || 'N/A';
  document.getElementById('modalProductImage').src = imageUrl;
  document.getElementById('modalProductImage').alt = product.name;
  document.getElementById('productModal').classList.add('show');
}

// Close product detail modal
function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
  currentProduct = null;
}

// Add to cart from modal
async function addToCartFromModal() {
  if (currentProduct) {
    await addToCart(currentProduct._id);
    closeProductModal();
  }
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  const addToCartBtn = document.getElementById('modalAddToCart');
  
  closeBtn.addEventListener('click', closeProductModal);
  modalOverlay.addEventListener('click', closeProductModal);
  addToCartBtn.addEventListener('click', addToCartFromModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeProductModal();
    }
  });
});

// Toggle cart view on mobile
function toggleCartView() {
  const cart = document.querySelector('.cart');
  cart.style.display = cart.style.display === 'none' ? 'flex' : 'none';
}

// Checkout function
function checkout() {
  const totalPrice = parseFloat(document.getElementById('total').textContent);
  if (totalPrice === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert(`Checkout amount: A$${totalPrice.toFixed(2)}\n\nThank you for your purchase!\nThis is a demo - payment would be processed here.`);
  // Clear cart
  fetch(`${API_URL}/cart`, { method: 'DELETE' }).then(() => {
    loadCart();
  });
}

// Initialize
loadProducts();
loadCart();