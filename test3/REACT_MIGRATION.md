# React Migration Guide

This document explains the conversion from vanilla JavaScript to React.

## What Changed

### ✅ Frontend Architecture

**Before:** Vanilla HTML/CSS/JavaScript
- Static HTML files (index.html, shop.html)
- Vanilla JS modules (api.js, auth.js, cart.js, etc.)
- DOM manipulation and event listeners
- State management via objects

**After:** React + Vite
- Single-page application (SPA)
- React components (LoginPage, ShopPage, Products, Cart, etc.)
- Declarative UI with React hooks
- Component state and props
- Vite for fast development and builds

### 📁 File Structure

Old structure:
```
frontend/public/
├── index.html
├── shop.html
├── css/style.css
└── js/
    ├── api.js, auth.js, cart.js, ...
```

New structure:
```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── ProfileSection.jsx
│   │   └── AdminPanel.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### 🔄 Component Mapping

| Vanilla JS | React Component |
|-----------|-----------------|
| index.html (login form) | LoginPage.jsx |
| shop.html (main page) | ShopPage.jsx |
| products.js | Products.jsx |
| cart.js | Cart.jsx |
| auth.js | LoginPage.jsx, ProfileSection.jsx |
| state.js | React component state & props |
| api.js | api.js (reused with minor changes) |

### 🎯 Key Improvements

1. **Better Code Organization** - Components are self-contained with their logic and styling
2. **Reusability** - Components can be easily reused and composed
3. **State Management** - React hooks make state management cleaner
4. **Performance** - Vite provides faster development and smaller production builds
5. **Modern Tooling** - Vite and npm scripts replace manual script loading
6. **Maintainability** - JSX makes the code more readable and maintainable

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
npm start
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev:frontend
```
Frontend runs on `http://localhost:5173`

### Production Build

```bash
npm run build:frontend
cd frontend
npm run preview
```

## API Integration

The API layer was reused from the vanilla version with minimal changes:
- All endpoints remain the same
- JWT token handling works the same way
- Local storage is used for auth tokens

## Testing the Migration

1. ✅ Install dependencies:
   ```bash
   npm run install:all
   ```

2. ✅ Start backend:
   ```bash
   npm start
   ```

3. ✅ In another terminal, start frontend:
   ```bash
   npm run dev:frontend
   ```

4. ✅ Open browser to `http://localhost:5173`

5. ✅ Test all features:
   - Register as customer
   - Login as customer
   - Login as admin
   - Browse and search products
   - Add items to cart
   - Manage cart
   - Update profile
   - View admin panel (if admin)

## Assignment Requirements Met

✅ **Modern Frontend Library** - React 18  
✅ **Backend Framework** - Express.js (Node.js)  
✅ **Database** - MongoDB via Mongoose  
✅ **Complex Dynamic Website** - Full shopping cart with auth, profiles, admin  
✅ **Proper Integration** - Frontend and backend properly separated with clean API layer  

## Backward Compatibility

The old vanilla JavaScript files in `frontend/public/` can be safely deleted. The new React app is fully functional and replaces them completely.

To clean up (optional):
```bash
rm -rf frontend/public/js
rm -rf frontend/public/css
rm frontend/public/index.html
rm frontend/public/shop.html
```

The Vite build will handle all assets and HTML from `frontend/index.html` and `frontend/src/`.
