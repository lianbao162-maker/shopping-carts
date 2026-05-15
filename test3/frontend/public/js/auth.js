import { fetchCurrentUser, updateUserProfile, updatePassword } from './api.js';
import { state } from './state.js';

function redirectToEntry() {
  window.location.href = './index.html';
}

function setAuthMessage(message, isError = false) {
  const authStatus = document.getElementById('auth-status');
  if (!authStatus) {
    return;
  }

  authStatus.textContent = message;
  authStatus.classList.toggle('auth-error', isError);
}

function populateProfileForm() {
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');

  if (!nameInput || !emailInput || !state.currentUser) {
    return;
  }

  nameInput.value = state.currentUser.name || '';
  emailInput.value = state.currentUser.email || '';
}

function updateAuthUi(onAuthChanged) {
  const userView = document.getElementById('user-auth');
  const userLabel = document.getElementById('current-user-label');
  const adminPanel = document.getElementById('admin-panel');
  const profileSection = document.getElementById('profile-section');

  if (!state.currentUser) {
    redirectToEntry();
    return;
  }

  userView.style.display = 'flex';
  userLabel.textContent = `${state.currentUser.name} (${state.currentUser.role})`;
  adminPanel.style.display = state.currentUser.role === 'admin' ? 'block' : 'none';
  profileSection.style.display = 'block';
  populateProfileForm();
  setAuthMessage(`Signed in as ${state.currentUser.email}`);

  if (typeof onAuthChanged === 'function') {
    onAuthChanged();
  }
}

export async function bootstrapShopAuth(onAuthChanged) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    redirectToEntry();
    return false;
  }

  try {
    const user = await fetchCurrentUser();
    state.currentUser = user;
  } catch (error) {
    localStorage.removeItem('authToken');
    state.currentUser = null;
    redirectToEntry();
    return false;
  }

  updateAuthUi(onAuthChanged);
  return true;
}

export function setupShopAuth({ onAuthChanged }) {
  const logoutBtn = document.getElementById('logout-btn');
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    state.currentUser = null;
    if (profileForm) {
      profileForm.reset();
    }
    if (passwordForm) {
      passwordForm.reset();
    }
    updateAuthUi(onAuthChanged);
    if (typeof onAuthChanged === 'function') {
      onAuthChanged();
    }
    redirectToEntry();
  });

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();

    try {
      const user = await updateUserProfile(name, email);
      state.currentUser = user;
      updateAuthUi(onAuthChanged);
      setAuthMessage('Profile updated successfully.');
    } catch (error) {
      setAuthMessage(error.message, true);
    }
  });

  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
      setAuthMessage('New password and confirm password do not match.', true);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      passwordForm.reset();
      setAuthMessage('Password updated successfully.');
    } catch (error) {
      setAuthMessage(error.message, true);
    }
  });
}
