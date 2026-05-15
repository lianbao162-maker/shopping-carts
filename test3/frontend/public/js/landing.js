import { fetchCurrentUser, loginUser, registerUser } from './api.js';

function setLandingMessage(message, isError = false) {
  const status = document.getElementById('landing-status');
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle('auth-error', isError);
}

function goToShop() {
  window.location.href = './shop.html';
}

async function redirectIfLoggedIn() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return;
  }

  try {
    await fetchCurrentUser();
    goToShop();
  } catch (error) {
    localStorage.removeItem('authToken');
  }
}

function setupChoiceToggle() {
  const customerButton = document.getElementById('choose-customer');
  const customerLoginButton = document.getElementById('choose-customer-login');
  const adminButton = document.getElementById('choose-admin');
  const customerSection = document.getElementById('customer-entry');
  const customerLoginSection = document.getElementById('customer-login-entry');
  const adminSection = document.getElementById('admin-entry');

  customerButton.addEventListener('click', () => {
    customerSection.style.display = 'block';
    customerLoginSection.style.display = 'none';
    adminSection.style.display = 'none';
  });

  customerLoginButton.addEventListener('click', () => {
    customerSection.style.display = 'none';
    customerLoginSection.style.display = 'block';
    adminSection.style.display = 'none';
  });

  adminButton.addEventListener('click', () => {
    customerSection.style.display = 'none';
    customerLoginSection.style.display = 'none';
    adminSection.style.display = 'block';
  });
}

function setupForms() {
  const customerForm = document.getElementById('customer-register-form');
  const customerLoginForm = document.getElementById('customer-login-form');
  const adminForm = document.getElementById('admin-login-form');

  customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const password = document.getElementById('customer-password').value;

    try {
      const { token } = await registerUser(name, email, password);
      localStorage.setItem('authToken', token);
      setLandingMessage('Customer account created. Redirecting to ShopHub...');
      goToShop();
    } catch (error) {
      setLandingMessage(error.message, true);
    }
  });

  customerLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('customer-login-email').value.trim();
    const password = document.getElementById('customer-login-password').value;

    try {
      const { token, user } = await loginUser(email, password);
      if (user.role !== 'user') {
        setLandingMessage('This form is for customer login only.', true);
        return;
      }

      localStorage.setItem('authToken', token);
      setLandingMessage('Customer login successful. Redirecting to ShopHub...');
      goToShop();
    } catch (error) {
      setLandingMessage(error.message, true);
    }
  });

  adminForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    try {
      const { token, user } = await loginUser(email, password);
      if (user.role !== 'admin') {
        setLandingMessage('This form is for admin login only.', true);
        return;
      }

      localStorage.setItem('authToken', token);
      setLandingMessage('Admin login successful. Redirecting to ShopHub...');
      goToShop();
    } catch (error) {
      setLandingMessage(error.message, true);
    }
  });
}

async function initLanding() {
  await redirectIfLoggedIn();
  setupChoiceToggle();
  setupForms();
}

initLanding();
