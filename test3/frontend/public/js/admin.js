import { fetchAllUsersCarts } from './api.js';
import { state } from './state.js';

function formatPrice(value) {
  return `A$${value.toFixed(2)}`;
}

function renderAdminCarts(groups) {
  const container = document.getElementById('admin-carts-output');

  if (!groups.length) {
    container.innerHTML = '<p class="admin-empty">No user carts found.</p>';
    return;
  }

  container.innerHTML = groups
    .map((group) => {
      const total = group.items.reduce((acc, item) => {
        const price = item.productId?.price || 0;
        return acc + (price * item.quantity);
      }, 0);

      const itemsHtml = group.items
        .map((item) => {
          const productName = item.productId?.name || 'Unknown Product';
          const linePrice = (item.productId?.price || 0) * item.quantity;
          return `<li>${productName} x ${item.quantity} - ${formatPrice(linePrice)}</li>`;
        })
        .join('');

      return `
        <section class="admin-cart-group">
          <h4>${group.user.name} (${group.user.email})</h4>
          <ul>${itemsHtml}</ul>
          <p class="admin-cart-total">Total: ${formatPrice(total)}</p>
        </section>
      `;
    })
    .join('');
}

export function setupAdminActions() {
  const refreshBtn = document.getElementById('refresh-admin-carts-btn');

  refreshBtn.addEventListener('click', async () => {
    const container = document.getElementById('admin-carts-output');
    container.innerHTML = '<p class="admin-loading">Loading all user carts...</p>';

    try {
      const groups = await fetchAllUsersCarts();
      state.allUserCarts = groups;
      renderAdminCarts(groups);
    } catch (error) {
      container.innerHTML = `<p class="admin-error">${error.message}</p>`;
    }
  });
}
