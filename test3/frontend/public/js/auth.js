import { fetchCurrentUser, loginUser, registerUser } from './api.js';
import { state } from './state.js';

function setAuthMessage(message, isError = false) {
  const authStatus = document.getElementById('auth-status');
  authStatus.textContent = message;
  authStatus.classList.toggle('auth-error', isError);
}

function updateAuthUi(onAuthChanged) {
  const guestView = document.getElementById('guest-auth');
  const userView = document.getElementById('user-auth');
  const userLabel = document.getElementById('current-user-label');
  const adminPanel = document.getElementById('admin-panel');

  if (!state.currentUser) {
    guestView.style.display = 'flex';
    userView.style.display = 'none';
    adminPanel.style.display = 'none';
    setAuthMessage('Login to manage your cart.');
    return;
  }

  guestView.style.display = 'none';
  userView.style.display = 'flex';
  userLabel.textContent = `${state.currentUser.name} (${state.currentUser.role})`;
  adminPanel.style.display = state.currentUser.role === 'admin' ? 'block' : 'none';
  setAuthMessage(`Signed in as ${state.currentUser.email}`);

  if (typeof onAuthChanged === 'function') {
    onAuthChanged();
  }
}

export async function bootstrapAuth(onAuthChanged) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    updateAuthUi(onAuthChanged);
    return;
  }

  try {
    const user = await fetchCurrentUser();
    state.currentUser = user;
  } catch (error) {
    localStorage.removeItem('authToken');
    state.currentUser = null;
  }

  updateAuthUi(onAuthChanged);
}

export function setupAuthForm({ onAuthChanged }) {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try {
      const { token, user } = await registerUser(name, email, password);
      localStorage.setItem('authToken', token);
      state.currentUser = user;
      registerForm.reset();
      updateAuthUi(onAuthChanged);
    } catch (error) {
      setAuthMessage(error.message, true);
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const { token, user } = await loginUser(email, password);
      localStorage.setItem('authToken', token);
      state.currentUser = user;
      loginForm.reset();
      updateAuthUi(onAuthChanged);
    } catch (error) {
      setAuthMessage(error.message, true);
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    state.currentUser = null;
    updateAuthUi(onAuthChanged);
    if (typeof onAuthChanged === 'function') {
      onAuthChanged();
    }
  });
}
