import { state } from './state.js';

export function showProductModal(product) {
  state.currentProduct = product;

  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductDescription').textContent = product.description;
  document.getElementById('modalProductPrice').textContent = parseFloat(product.price).toFixed(2);
  document.getElementById('modalProductStock').textContent = product.stock || 'N/A';
  document.getElementById('modalProductImage').src = product.imageURL;
  document.getElementById('modalProductImage').alt = product.name;
  document.getElementById('productModal').classList.add('show');
}

export function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
  state.currentProduct = null;
}

export function setupModal({ onAddToCart }) {
  const modal = document.getElementById('productModal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  const addToCartBtn = document.getElementById('modalAddToCart');

  closeBtn.addEventListener('click', closeProductModal);
  modalOverlay.addEventListener('click', closeProductModal);

  addToCartBtn.addEventListener('click', async () => {
    if (!state.currentProduct) {
      return;
    }

    await onAddToCart(state.currentProduct._id);
    closeProductModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeProductModal();
    }
  });
}
