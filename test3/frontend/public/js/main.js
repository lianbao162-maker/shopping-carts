import { loadProducts, setupLiveSearch } from './products.js';
import {
  loadCart,
  setupCartInteractions,
  handleAddToCart,
  handleCheckout
} from './cart.js';
import { setupModal, showProductModal } from './modal.js';
import { bootstrapAuth, setupAuthForm } from './auth.js';
import { setupAdminActions } from './admin.js';

async function refreshUserState() {
  await loadCart();
}

function setupLayoutInteractions() {
  const cartToggle = document.getElementById('cart-toggle');
  const cart = document.getElementById('cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartToggle.addEventListener('click', () => {
    cart.style.display = cart.style.display === 'none' ? 'flex' : 'none';
  });

  checkoutBtn.addEventListener('click', handleCheckout);
}

async function init() {
  setupLayoutInteractions();
  setupCartInteractions();
  setupModal({ onAddToCart: handleAddToCart });
  setupAdminActions();
  setupAuthForm({ onAuthChanged: refreshUserState });

  await loadProducts({
    onCardClick: showProductModal,
    onAddToCart: handleAddToCart
  });

  setupLiveSearch({
    onCardClick: showProductModal,
    onAddToCart: handleAddToCart
  });

  await bootstrapAuth(refreshUserState);
}

init();
