# 🛍️ Online Shopping Store

A full-stack premium clothing e-commerce application with **React + Tailwind + Framer Motion** on the frontend and **Node.js + Express + MongoDB** on the backend — complete with secure JWT/session authentication, email (OTP) verification, a full cart & wishlist flow, **Razorpay** payment integration, **buyer & seller roles**, and a role-based dashboard for both.

> **GenZ Clothings** — shop dresses, outerwear, tops, and bottoms with search, filtering, sorting, infinite scroll, dark mode, and a secure checkout experience.

---

## ✨ Features

### 🔐 Authentication & Security

- **Register / Login** with email or username, and a **full name** field.
- **Role-based accounts** — `buyer` or `seller` (chosen at registration).
- **Email (OTP) verification** delivered via the **Brevo (Sendinblue) HTTP API**.
- **JWT access tokens** (15 min) + **refresh tokens** (7 days) stored in an **httpOnly cookie**.
- **Refresh token rotation** — every refresh issues a new token and revokes the old one.
- **Server-side sessions** — refresh tokens are stored _hashed_ in MongoDB and can be revoked individually (`logout`) or globally (`logout from all devices`).
- **Persistent login** on the frontend with automatic token refresh via a private Axios interceptor (`axiosPrivate.js`).

### 🛒 Shopping Experience

- **Product catalog** seeded with 24 products across categories.
- **Search, filter & sort** — by category, badge, free-text search, and price/rating sorting.
- **Infinite scroll** with server-side pagination (IntersectionObserver).
- **Product detail modal** with **size & color** selectors.
- **Cart** — add / remove / update quantity, merge identical (product + size + color) lines, animated slide-out sidebar.
- **Wishlist** persisted to `localStorage`.

### 👥 Seller Role

- **Seller dashboard** — overview with revenue trends & charts (Chart.js), product management (**add / edit / delete**), customers, and order listings.
- **Add products** with image upload (via **Multer → Cloudinary**, stored as **WebP**).
- **Stock**, badges, and pricing managed per product.
- **Revenue analytics** computed from the seller's orders.

### 💳 Payments

- **Razorpay checkout** — orders created on the server, paid via the Razorpay JS checkout, and **verified server-side with signature validation** before the cart is cleared.
- Automatic order total calculation (subtotal + 8% tax + shipping, free shipping above ₹150).

### 🎨 UI/UX

- Light / **dark mode** (system-detected, persisted), fully responsive.
- **Framer Motion** animations, glassmorphism navbar, toasts, skeletons, back-to-top.
- **Code-split routes** (React.lazy) for faster loads.
- Sales/marketing sections: hero, features bar, categories, testimonials, Instagram feed, newsletter.

---

## 🧱 Tech Stack

### Frontend — `Frontend/`

| Technology                                                            | Purpose                                      |
| --------------------------------------------------------------------- | -------------------------------------------- |
| [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)         | UI framework & build tool                    |
| [Tailwind CSS 3](https://tailwindcss.com/)                             | Utility-first styling                        |
| [Framer Motion](https://www.framer.com/motion/)                        | Animations                                   |
| [React Router 7](https://reactrouter.com/)                             | Client-side routing (code-split)             |
| [Axios](https://axios-http.com/)                                       | HTTP client (with refresh-token interceptor) |
| [Font Awesome](https://fontawesome.com/)                               | Icons                                        |
| [Cloudinary](https://cloudinary.com/) (`@cloudinary/react`)            | Optimized image delivery (WebP)              |
| [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) | Seller dashboard charts             |

### Backend — `Backend/`

| Technology                                                           | Purpose                             |
| -------------------------------------------------------------------- | ----------------------------------- |
| [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) | Server & routing                    |
| [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/) | Database & ODM               |
| [JSON Web Tokens](https://jwt.io/)                                   | Access / refresh tokens             |
| [Brevo](https://www.brevo.com/) (HTTP API)                            | Email + OTP delivery                |
| [Cloudinary](https://cloudinary.com/) + [Multer](https://github.com/expressjs/multer) | Image upload & CDN storage    |
| [Razorpay](https://razorpay.com/)                                    | Payment gateway                     |
| cookie-parser · cors · morgan · bcryptjs · nodemailer· dotenv         | Utilities                           |

---

## 📁 Project Structure

```text
OnlineShoppingStore/
├── Backend/                         # Express REST API
│   ├── server.js                    # Entry point (port 3000)
│   ├── .env.example                 # Environment template
│   └── src/
│       ├── app.js                   # Express app, CORS, route mounting
│       ├── config/
│       │   ├── config.js            # Env validation & config
│       │   └── db.js                # MongoDB connection
│       ├── models/                  # Mongoose schemas
│       │   ├── user.model.js        # name, role (buyer/seller), listed_products
│       │   ├── product.model.js     # seller user, stock, image[] (Cloudinary)
│       │   ├── otp.model.js
│       │   ├── session.model.js
│       │   ├── cart.model.js
│       │   └── order.model.js       # status, paymentStatus, timestamps
│       ├── controllers/             # Request handlers
│       │   ├── auth.controller.js
│       │   ├── product.controller.js
│       │   ├── cart.controller.js
│       │   ├── order.controller.js
│       │   └── sellerProducts.controller.js  # seller CRUD + orders
│       ├── routes/
│       │   ├── public/              # auth, products
│       │   └── private/             # cart, order, seller-products (protect)
│       ├── middlewares/
│       │   └── auth.middleware.js   # JWT `protect` guard
│       ├── services/
│       │   └── email.service.js     # Brevo email transport
│       ├── utils/                   # OTP helpers, seed product data
│       └── seed.js                  # Database seeder (24 products)
│
└── Frontend/                        # React SPA (Vite, port 5173)
    ├── index.html
    ├── vite.config.js               # /api proxy → http://localhost:3000
    └── src/
        ├── main.jsx                 # Entry (providers + router)
        ├── App.jsx                  # Code-split routes & global layout
        ├── api/                     # axios.js (base), axiosPrivate.js (interceptor)
        ├── context/                 # AuthContext, AppContext
        ├── hooks/                   # useAuth, useApp, useRefreshToken,
        │                            # useAxiosPrivate, useInfiniteProducts
        ├── pages/                   # Home, Shop, ProductDetail, Wishlist, Auth,
        │                            # Profile, Mycart, Checkout, Verify, Orders,
        │                            # SellerDashboard, CustomerDashboard
        ├── components/              # Navbar, Footer, CartSidebar, ProductGrid,
        │                            # profile/, seller/, Toast, Skeleton, ...
        ├── data/constants.js        # Mock products/categories/testimonials
        ├── utils/dashboardData.js   # Seller revenue/analytics computations
        └── index.css                # Tailwind directives & global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A **Razorpay** account (test mode works fine), a **Brevo** API key for OTP emails, and a **Cloudinary** account for product image uploads.

### 1. Clone & install

```bash
git clone https://github.com/your-username/OnlineShoppingStore.git
cd OnlineShoppingStore
```

**Backend**

```bash
cd Backend
npm install
cp .env.example .env   # then fill in your values (see below)
```

**Frontend**

```bash
cd ../Frontend
npm install
```

### 2. Environment variables (`Backend/.env`)

```env
# Server
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database & auth
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret_here

# Gmail OAuth2 (legacy SMTP config — SMTP_PASSWORD is required)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_smtp_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER_EMAIL=your_email@gmail.com

# Email delivery (OTP) via Brevo HTTP API
BREVO_API=your_brevo_api_key

# Image storage
CLOUDINARY_URL=cloudinary://...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run

**Backend** (http://localhost:3000)

```bash
cd Backend
npm run dev        # nodemon
# or
npm start
```

Seed the product catalog (optional, first time):

```bash
node src/seed.js   # inserts 24 products
```

**Frontend** (http://localhost:5173)

```bash
cd Frontend
npm run dev
```

The Vite dev server proxies `/api` requests to the backend on port 3000, so everything works out of the box.

---

## 🔌 API Reference

Base URL: `http://localhost:3000/api`

### Auth — `/api/auth` (public)

| Method | Endpoint                | Description                                                             | Auth   |
| ------ | ----------------------- | ----------------------------------------------------------------------- | ------ |
| `POST` | `/register`             | Create account, send OTP email (`name`, `username`, `email`, `password`, `role`) | —      |
| `POST` | `/login`                | Login with email/username + password → `accessToken` + refresh cookie    | —      |
| `POST` | `/logout`               | Revoke current session, clear cookie                                    | Cookie |
| `GET`  | `/logout-all`           | Revoke all sessions for the user                                        | Cookie |
| `POST` | `/verify-otp`           | Verify email (`otp`, `email`)                                           | —      |
| `GET`  | `/verify-token`         | Validate `Authorization: Bearer <token>`, return user                   | Bearer |
| `POST` | `/get-new-access-token` | Rotate refresh token, return new `accessToken`                          | Cookie |

### Products — `/api/products` (public)

| Method | Endpoint         | Description                                                                                                               |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/get-all`       | Paginated list. Query: `page`, `limit`, `category`, `search`, `sortBy` (`price-low` \| `price-high` \| `rating`), `badge` |
| `GET`  | `/featured`      | Featured products (`isFeatured: true`)                                                                                    |
| `GET`  | `/get-by-id/:id` | Single product by MongoDB `_id`                                                                                           |

### Cart — `/api/cart` (protected)

| Method   | Endpoint            | Description                                         |
| -------- | ------------------- | --------------------------------------------------- |
| `GET`    | `/get-cart`         | Get (or create) the user's cart                     |
| `POST`   | `/add-to-cart`      | Add item (`productId`, `size`, `color`, `quantity`) |
| `PUT`    | `/update-quantity`  | Update quantity (`itemId`, `quantity`)              |
| `DELETE` | `/remove-from-cart` | Remove item (`productId` = cart item `_id`)         |

### Orders — `/api/order` (protected)

| Method | Endpoint      | Description                                                                                                          |
| ------ | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/create`     | Build Razorpay order from the cart (returns `order.id` for checkout)                                                 |
| `POST` | `/verify`     | Verify payment signature (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) → marks paid, clears cart |
| `GET`  | `/get-orders` | List the authenticated user's orders                                                                                 |

### Seller — `/api/seller-products` (protected, seller role)

| Method   | Endpoint        | Description                                                  |
| -------- | --------------- | ------------------------------------------------------------ |
| `POST`   | `/add`          | Add a product (multipart form with an `image` file upload)   |
| `GET`    | `/`             | List the current seller's products                           |
| `GET`    | `/seller-orders`| Orders that contain any of the seller's products             |
| `PUT`    | `/:id`          | Update a product owned by the seller                         |
| `DELETE` | `/:id`          | Delete a product owned by the seller (removes Cloudinary image) |

---

## 🗄️ Data Models

| Model       | Key fields                                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **User**    | `name` · `username` · `email` · `password` (SHA-256 hash) · `role` (`buyer`/`seller`) · `listed_products[]` · `verified`       |
| **Product** | `name` · `description` · `price` · `originalPrice` · `category` · `sizes[]` · `colors[]` · `stock` · `badge` · `rating` · `reviews` · `user` (seller) · `image[]` (`url`, `public_id`) |
| **OTP**     | `email` · `user` · `otpHash`                                                                                                  |
| **Session** | `userId` · `refreshTokenHash` · `ip` · `userAgent` · `revoked`                                                                |
| **Cart**    | `user` (unique) · `items[]` (`product`, `quantity`, `size`, `color`)                                                          |
| **Order**   | `razorpayOrderId` · `user` · `items[]` (with product snapshots) · `totalAmount` · `status` · `paymentStatus` · `timestamps`   |

---

## 📄 License

[ISC](https://opensource.org/licenses/ISC)

---

_Built with ❤️ by Rajeev_
