import { fetchProducts } from './api.js';
import { state } from './state.js';

const fallbackImage = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23CCCCCC%22/%3E%3C/svg%3E";

export function renderProductsStatus(title, detail, actionText = 'Run npm start, then open http://localhost:3000') {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = `
    <div class="products-status">
      <h2>${title}</h2>
      <p>${detail}</p>
      <p class="products-status-action">${actionText}</p>
    </div>
  `;
}

export async function loadProducts({ onCardClick, onAddToCart }) {
  const productsDiv = document.getElementById('products');
  renderProductsStatus('Loading products...', 'Trying to reach the local store server.');

  try {
    const products = await fetchProducts();
    state.products = products;
    state.productsById = Object.fromEntries(products.map((product) => [product._id, product]));
    renderProductsList(products, { onCardClick, onAddToCart });

    if (products.length === 0) {
      renderProductsStatus(
        'No products found',
        'The server is running, but the catalog is empty.',
        'Run the seeder or restart the server to auto-populate products.'
      );
    }
  } catch (error) {
    console.error('Failed to load products:', error);
    renderProductsStatus(
      'Cannot load the shop page',
      'The frontend cannot reach the product API. This usually means the page was opened directly or the backend is not running.'
    );
  }
}

function renderProductsList(products, { onCardClick, onAddToCart }) {
  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <img src="${product.imageURL}" alt="${product.name}" class="product-image" onerror="this.src='${fallbackImage}'">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>A$${product.price}</p>
      <button class="add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
    `;

    card.addEventListener('click', () => onCardClick(product));
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      await onAddToCart(product._id);
    });

    productsDiv.appendChild(card);
  });
}

export function setupLiveSearch({ onCardClick, onAddToCart }) {
  const searchInput = document.getElementById('product-search');
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener('input', () => {
    state.searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = state.products.filter((product) => {
      const haystack = `${product.name} ${product.description}`.toLowerCase();
      return haystack.includes(state.searchTerm);
    });

    if (filteredProducts.length === 0) {
      renderProductsStatus('No matches', 'Try a different search keyword.');
      return;
    }

    renderProductsList(filteredProducts, { onCardClick, onAddToCart });
  });
}
