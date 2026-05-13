import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from './api.js';
import { state } from './state.js';

function checkoutButton(total) {
  return `Checkout (A$${total.toFixed(2)})`;
}

function recalculateTotalFromDom() {
  let total = 0;
  document.querySelectorAll('#cart-items li').forEach((li) => {
    const price = parseFloat(li.dataset.price);
    const qty = parseInt(li.dataset.quantity, 10);
    total += price * qty;
  });

  document.getElementById('total').textContent = total.toFixed(2);
  document.getElementById('checkout-btn').textContent = checkoutButton(total);
}

export function setCartStatus(detail) {
  const cartEmpty = document.getElementById('cart-empty');
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartItems.innerHTML = '';
  cartEmpty.style.display = 'block';
  cartEmpty.innerHTML = `<p>${detail}</p>`;
  total.textContent = '0.00';
  checkoutBtn.textContent = checkoutButton(0);
}

export async function loadCart() {
  try {
    const cartItems = await fetchCart();
    renderCart(cartItems);
  } catch (error) {
    console.error('Failed to load cart:', error);
    setCartStatus('Cart unavailable. Start the backend and reload the page.');
  }
}

export function renderCart(cartItems) {
  const cartUl = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartUl.innerHTML = '';

  if (cartItems.length === 0) {
    cartEmpty.style.display = 'block';
    document.getElementById('total').textContent = '0.00';
    checkoutBtn.textContent = checkoutButton(0);
    return;
  }

  cartEmpty.style.display = 'none';
  let total = 0;

  cartItems.forEach((item) => {
    const product = typeof item.productId === 'object'
      ? item.productId
      : state.productsById[item.productId];

    if (!product || typeof product.price !== 'number') {
      return;
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const li = document.createElement('li');
    li.dataset.id = item._id;
    li.dataset.price = product.price;
    li.dataset.quantity = item.quantity;
    li.innerHTML = `
      <div class="item-name">${product.name}</div>
      <div class="item-price">A$<span class="item-total">${itemTotal.toFixed(2)}</span></div>
      <div class="item-controls">
        <button data-action="inc">+</button>
        <span class="item-qty" style="flex: 1; text-align: center; font-weight: 600;">${item.quantity}</span>
        <button data-action="dec">−</button>
        <button data-action="remove">Remove</button>
      </div>
    `;
    cartUl.appendChild(li);
  });

  document.getElementById('total').textContent = total.toFixed(2);
  checkoutBtn.textContent = checkoutButton(total);
}

export function setupCartInteractions() {
  const cartList = document.getElementById('cart-items');

  cartList.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) {
      return;
    }

    const li = button.closest('li');
    if (!li) {
      return;
    }

    const id = li.dataset.id;
    const quantity = parseInt(li.dataset.quantity, 10);
    const action = button.dataset.action;

    if (action === 'remove') {
      li.remove();
      if (document.querySelectorAll('#cart-items li').length === 0) {
        document.getElementById('cart-empty').style.display = 'block';
      }

      recalculateTotalFromDom();

      try {
        await deleteCartItem(id);
      } catch (error) {
        console.error('Failed to delete cart item:', error);
        await loadCart();
      }
      return;
    }

    const nextQuantity = action === 'inc' ? quantity + 1 : quantity - 1;

    if (nextQuantity <= 0) {
      li.remove();
      if (document.querySelectorAll('#cart-items li').length === 0) {
        document.getElementById('cart-empty').style.display = 'block';
      }
      recalculateTotalFromDom();

      try {
        await deleteCartItem(id);
      } catch (error) {
        console.error('Failed to delete cart item:', error);
        await loadCart();
      }
      return;
    }

    const price = parseFloat(li.dataset.price);
    li.dataset.quantity = nextQuantity;
    li.querySelector('.item-qty').textContent = nextQuantity;
    li.querySelector('.item-total').textContent = (price * nextQuantity).toFixed(2);
    recalculateTotalFromDom();

    try {
      await updateCartItem(id, nextQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      await loadCart();
    }
  });
}

export async function handleAddToCart(productId) {
  try {
    await addItemToCart(productId, 1);
    await loadCart();
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    alert('The cart is unavailable right now. Start the backend and reload the page.');
  }
}

export async function handleCheckout() {
  const totalPrice = parseFloat(document.getElementById('total').textContent);
  if (totalPrice === 0) {
    alert('Your cart is empty!');
    return;
  }

  alert(`Checkout amount: A$${totalPrice.toFixed(2)}\n\nThank you for your purchase!\nThis is a demo - payment would be processed here.`);

  try {
    await clearCart();
    await loadCart();
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}
