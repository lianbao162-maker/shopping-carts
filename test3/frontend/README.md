# ShopHub Frontend (React + Vite)

This is the React frontend for the ShopHub shopping cart application.

## Quick Start

### 1. Install Dependencies

From the frontend directory:

```bash
npm install
```

Or from the root directory:

```bash
npm run install:all
```

### 2. Start Development Server

From the frontend directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx       # Authentication and login/register
│   │   ├── ShopPage.jsx        # Main shopping page
│   │   ├── Products.jsx        # Product grid with search
│   │   ├── Cart.jsx            # Shopping cart sidebar
│   │   ├── ProfileSection.jsx  # User profile and password change
│   │   └── AdminPanel.jsx      # Admin view of all user carts
│   ├── api.js                   # API calls to backend
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies

```

## Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript

## Features

✅ **Authentication**
- Customer registration
- Customer login
- Admin login
- JWT token-based auth

✅ **Shopping**
- Browse products
- Search products
- Add to cart
- Manage cart items (add, remove, change quantity)

✅ **User Profile**
- Update name and email
- Change password

✅ **Admin Features**
- View all user carts
- Monitor shopping activity

## API Integration

The frontend connects to the backend API at `http://localhost:3000`

Key endpoints used:
- `/auth/register` - Register new customer
- `/auth/login` - Login customer or admin
- `/auth/me` - Get current user
- `/auth/password` - Update password
- `/products` - Get all products
- `/cart` - Get, add, update, delete cart items
- `/admin/users-carts` - Get all user carts (admin only)

## Environment

No `.env` file needed for local development. The frontend is configured to connect to `http://localhost:3000` by default.

## Notes

- The backend must be running for the frontend to work
- Make sure backend is running on port 3000
- Frontend runs on port 5173 by default
