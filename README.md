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
- ✓ Auto-seeding of database with sample products

## Folder Structure

```
shopping/
├── index.html              # Main page with header, products grid, and cart
├── app.js                  # Frontend JavaScript (product loading, cart management)
├── server.js               # Express backend (API routes, MongoDB connection)
├── seed.js                 # Database seeder for sample products
├── style.css               # Styling for responsive design
├── package.json            # Project dependencies
├── README.md               # This file
├── images/                 # Folder for product images (if needed)
└── pic/                    # Product image folder (Wireless headphones.jpg, USB-C Cable.jpg, etc.)
```

## Challenges Overcome

1. **Database Initialization Problem:** Initially, products weren't displaying because the MongoDB database was empty. Solved by creating auto-seeding functionality in the server that populates the database with sample products on startup if it's empty.

2. **Cart State Management:** Implementing real-time cart updates without page reloads required careful handling of DOM manipulation and asynchronous fetch requests. Built a system that updates the UI immediately and syncs with the server in the background for smooth UX.

3. **Product Modal Implementation:** Creating a clickable product detail modal that properly displays and closes required careful event listener management. Solved with proper event delegation and CSS class toggling.

4. **Responsive Design:** Making the shopping cart visible on mobile with a toggle button while maintaining a side-by-side layout on desktop. Used CSS media queries and JavaScript to handle the dynamic layout switching.

5. **Image Handling:** Managing image URLs with fallback placeholders in case images don't load. Implemented onerror handlers to show SVG placeholder images when product photos are missing.

- Node.js (v14+)
- MongoDB (running locally on port 27017)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB** (if not already running):
   ```bash
   mongod
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

   The server will:
   - Automatically seed the database with 6 sample products on first run
   - Start on `http://localhost:3000`

4. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - Click on products to view details
   - Add items to your shopping cart
   - Adjust quantities or remove items
   - Click "Checkout" to complete purchase

## Available NPM Commands

- `npm start` - Start the server (auto-seeds if database is empty)
- `npm run seed` - Manually re-seed the database with sample products
- `npm run seed-and-start` - Seed the database and start the server

## Features

- ✓ Browse products with images
- ✓ View detailed product information
- ✓ Add/remove items from cart
- ✓ Adjust item quantities
- ✓ Real-time total calculation
- ✓ Responsive design (works on mobile)
- ✓ Auto-populated database on startup

## Database

The application uses MongoDB with two collections:
- **Products** - Stores product catalog (auto-seeded on startup)
- **Cart** - Stores shopping cart items
