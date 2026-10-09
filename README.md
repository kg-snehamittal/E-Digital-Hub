# E-Digital Hub

A full-stack e-commerce app: browse and filter products, add to cart, pay with Razorpay (test mode) and track orders. Includes an **admin dashboard** to manage products, view all orders and see registered users.

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite 4, Tailwind CSS, Redux Toolkit (cart), React Router 6, React Toastify, React Tabs |
| Backend  | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Auth     | Email + password, scrypt-hashed passwords, signed bearer tokens (built-in Node `crypto`, no extra packages) |
| Payments | Razorpay checkout (test keys) |

## Features

- Home page with hero section, product grid, filters (search, category, price) and testimonials
- All-products page and product detail page
- Cart (persisted in `localStorage`) and Razorpay checkout
- Signup / login with roles (`user` and `admin`)
- "My Orders" page for logged-in users
- Light / dark mode
- **Admin dashboard** (`/dashboard`, admin only):
  - Totals for products, orders and users
  - Add, edit and delete products
  - View all orders (items, address, payment id, email, date)
  - View all registered users

## Project structure

```
ecom1/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── seed.js              # Dummy data + admin account
│   ├── .env.example         # Environment variables template
│   ├── middleware/auth.js   # requireAuth / requireAdmin
│   ├── utils/auth.js        # Password hashing + token signing
│   ├── models/              # Product, User, Order (Mongoose)
│   └── routes/              # productRoutes, authRoutes, orderRoutes, userRoutes
├── src/
│   ├── components/          # Navbar, Footer, ProductCard, Filter, Modal, ...
│   ├── context/data/        # Global state (products, orders, users, theme)
│   ├── pages/               # home, allproducts, productInfo, cart, order,
│   │                        # registration (Login/Signup), admin (dashboard, add/update product)
│   ├── redux/               # Cart slice + store
│   ├── utils/api.js         # Session + auth header helpers
│   └── App.jsx              # Routes + protected routes
├── vite.config.js           # Dev server + proxy of /api -> localhost:5001
└── package.json
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

### 1. Install dependencies

```bash
# frontend (project root)
npm install

# backend
cd backend
npm install
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

| Variable     | Default                              | Description |
|--------------|--------------------------------------|-------------|
| `PORT`       | `5001`                               | API port (the Vite proxy expects 5001) |
| `MONGO_URI`  | `mongodb://127.0.0.1:27017/ecom1`    | MongoDB connection string |
| `JWT_SECRET` | `dev-secret-change-me`               | Secret used to sign login tokens. **Set a long random value in production.** |

### 3. Add the dummy data and admin

```bash
cd backend
npm run seed
```

> **Warning:** the seed script clears the `products`, `users` and `orders` collections before inserting. Run it only on a development database.

It creates:

- **16 products** across mobile, laptop, audio, watch, camera, accessories and gaming
- **1 admin** and **4 demo users**
- **8 demo orders** spread over the last few weeks

### 4. Run the app

```bash
# terminal 1 - API on http://localhost:5001
cd backend
npm run dev        # or: npm start

# terminal 2 - frontend on http://localhost:5173
npm run dev
```

## Demo accounts

| Role  | Email                    | Password    |
|-------|--------------------------|-------------|
| Admin | `admin@edigitalhub.com`  | `Admin@123` |
| User  | `rahul@example.com`      | `User@123`  |
| User  | `priya@example.com`      | `User@123`  |
| User  | `amit@example.com`       | `User@123`  |
| User  | `neha@example.com`       | `User@123`  |

Log in as the admin and you are taken straight to the dashboard (`/dashboard`); an **admin** link also appears in the navbar.

> Change the admin password (edit `ADMIN` in `backend/seed.js` and re-seed) before deploying anywhere public.

### Creating more admins

Public signup always creates normal users. To promote someone to admin, set their `role` to `admin` in MongoDB:

```js
db.users.updateOne({ email: "someone@example.com" }, { $set: { role: "admin" } })
```

## API reference

Base URL: `http://localhost:5001/api` (proxied as `/api` by Vite in development).
Authenticated routes need the header `Authorization: Bearer <token>` (returned by login/register).

| Method | Endpoint              | Access        | Description |
|--------|-----------------------|---------------|-------------|
| POST   | `/auth/register`      | Public        | Create a user account |
| POST   | `/auth/login`         | Public        | Log in, returns `{ user, token }` |
| GET    | `/products`           | Public        | List products |
| GET    | `/products/:id`       | Public        | Get one product |
| POST   | `/products`           | Admin         | Add a product |
| PUT    | `/products/:id`       | Admin         | Update a product |
| DELETE | `/products/:id`       | Admin         | Delete a product |
| GET    | `/orders`             | Logged in     | Admin: all orders. User: only their own |
| POST   | `/orders`             | Logged in     | Place an order (email and user id come from the token) |
| GET    | `/users`              | Admin         | List users (no password data returned) |

## Data models

- **Product**: `title`, `price`, `description`, `imageUrl`, `category`, `date`
- **User**: `name`, `email` (unique), `passwordHash`, `role` (`user` | `admin`), `date`
- **Order**: `cartItems[]`, `addressInfo { name, address, pincode, phoneNumber }`, `email`, `userid`, `paymentId`, `status`, `date`

## Scripts

| Location   | Command         | What it does |
|------------|-----------------|--------------|
| root       | `npm run dev`   | Start the Vite dev server |
| root       | `npm run build` | Production build into `dist/` |
| root       | `npm run preview` | Preview the production build |
| root       | `npm run lint`  | Run ESLint |
| `backend/` | `npm run dev`   | Start the API with auto-reload |
| `backend/` | `npm start`     | Start the API |
| `backend/` | `npm run seed`  | Reset the DB with dummy data and the admin |

## Notes

- **Payments:** `src/pages/cart/Cart.jsx` uses a Razorpay **test** key. Replace it with your own and keep the secret key on the server before going live. The Razorpay checkout script must be present in `index.html`.
- **Firebase:** login, users, orders and products no longer use Firebase. `src/fireabase/FirebaseConfig.jsx` is left in place but is unused by the main flows and can be removed.
- **Deployment:** `vercel.json` rewrites all routes to `index.html` for the frontend. The API must be hosted separately, and `/api` has to be routed to it (or the fetch URLs changed to its full address).
