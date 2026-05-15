# ShopHub - Modular Shopping Cart

## Overview

ShopHub is a full-stack shopping cart web app with:

- Customer registration and login
- Admin login and admin-only all-users cart view
- Live product search
- User profile update and password change
- Per-user cart isolation with JWT authentication

The frontend and backend are separated into modular folders.

## Final Project Structure

```
test3/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── authController.js
│       │   ├── cartController.js
│       │   └── productController.js
│       ├── data/
│       │   └── sampleProducts.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── authorize.js
│       ├── models/
│       │   ├── Cart.js
│       │   ├── Product.js
│       │   └── User.js
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   ├── cartRoutes.js
│       │   └── productRoutes.js
│       ├── services/
│       │   ├── seedService.js
│       │   └── userService.js
│       ├── app.js
│       └── server.js
├── frontend/
│   └── public/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   ├── admin.js
│       │   ├── api.js
│       │   ├── auth.js
│       │   ├── cart.js
│       │   ├── landing.js
│       │   ├── main.js
│       │   ├── modal.js
│       │   ├── products.js
│       │   └── state.js
│       ├── index.html     # Account entry page
│       └── shop.html      # ShopHub page (protected)
├── package.json
├── package-lock.json
└── seed.js
```

## Removed Unnecessary Files

The following legacy files were removed because they were no longer used:

- `app.js`
- `index.html` (root duplicate)
- `style.css` (root duplicate)
- `shopping.jsx` (empty)
- `server.js` (legacy wrapper)
- `shopping cart.zip` (archive artifact)

## Authentication Flow

1. Open `http://localhost:3000/index.html`
2. Choose one option:
   - Register as Customer
   - Login as Customer
   - Login as Admin
3. On success, user is redirected to `shop.html`
4. Direct access to `shop.html` without valid token redirects to `index.html`

## Default Admin Account

- Email: `admin@shophub.local`
- Password: `admin123456`

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/profile`
- `PUT /auth/change-password`

### Products

- `GET /products`

### Cart (authenticated user only)

- `GET /cart`
- `POST /cart`
- `PUT /cart/:id`
- `DELETE /cart/:id`
- `DELETE /cart`

### Admin

- `GET /admin/carts`
- `GET /admin/shopping_cart`

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript modules
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT, bcryptjs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`

3. Start server:

```bash
npm start
```

4. Open:

- `http://localhost:3000/index.html` (entry page)
- `http://localhost:3000/shop.html` (shop page)

## Scripts

- `npm start` - start server
- `npm run dev` - start server
- `npm run seed` - clear and reseed products
- `npm run seed-and-start` - reseed then start
