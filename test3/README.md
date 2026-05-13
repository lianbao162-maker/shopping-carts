# E-Commerce Shopping Cart

## Problem Solved

This website addresses the need for a functional online shopping experience with a clean user interface. Users can browse products, view detailed information, manage their shopping cart in real-time, and simulate checkout functionality. It demonstrates full-stack development by combining a responsive frontend with a robust backend and database.

## Technical Stack

```
Frontend:
├── HTML5 (Markup)
├── CSS3 (Styling & Responsive Design)
└── Vanilla JavaScript (Interactivity)

Backend:
└── Express.js (Node.js Framework)

Database:
└── MongoDB (NoSQL database for products & cart)

Data Flow:
├── API Endpoints (/products, /cart)
├── Real-time DOM updates
└── Server-side data persistence

Deployment: Local server (http://localhost:3000)
```

## Features

- ✓ Browse products with images and descriptions
- ✓ View detailed product information in modal popup
- ✓ Add/remove items from shopping cart
- ✓ Adjust item quantities with +/- buttons
- ✓ Real-time total price calculation
- ✓ Shopping cart shows/hides on mobile
- ✓ Responsive design (works on desktop and mobile)
# E-Commerce Shopping Cart

## Architecture

This project is now separated into frontend and backend layers with modular code.

```
test3/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── cartController.js
│       │   └── productController.js
│       ├── data/
│       │   └── sampleProducts.js
│       ├── models/
│       │   ├── Cart.js
│       │   └── Product.js
│       ├── routes/
│       │   ├── cartRoutes.js
│       │   └── productRoutes.js
│       ├── services/
│       │   └── seedService.js
│       ├── app.js
│       └── server.js
├── frontend/
│   └── public/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   ├── api.js
│       │   ├── cart.js
│       │   ├── main.js
│       │   ├── modal.js
│       │   ├── products.js
│       │   └── state.js
│       └── index.html
├── package.json
├── seed.js
└── server.js
```

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript modules
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## API

- GET /products
- GET /cart
- POST /cart
- PUT /cart/:id
- DELETE /cart/:id
- DELETE /cart

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Ensure MongoDB is running locally on port 27017.

3. Start app:

   ```bash
   npm start
   ```

4. Open http://localhost:3000

## Commands

- npm start: start modular backend server
- npm run dev: same as start
- npm run seed: clear and re-seed products
- npm run seed-and-start: re-seed then start server
