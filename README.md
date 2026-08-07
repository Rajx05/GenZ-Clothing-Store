# 🛍️ Online Shopping Store

A full-stack premium clothing e-commerce application with **React + Tailwind + framer motion** on the frontend and **Node.js + Express + MongoDB** on the backend — complete with secure JWT/session authentication, email (OTP) verification, a full cart & wishlist flow, and **Razorpay** payment integration.

> **GenZ Clothings** — shop dresses, outerwear, tops, and bottoms with search, filtering, sorting, infinite scroll, dark mode, and a secure checkout experience.

---

## ✨ Features

### 🔐 Authentication & Security

- **Register / Login** with username or email.
- **Email (OTP) verification** sent via Gmail OAuth2 (Nodemailer).
- **JWT access tokens** (15 min) + **refresh tokens** (7 days) stored in an **httpOnly cookie**.
- **Refresh token rotation** — every refresh issues a new token and revokes the old one.
- **Server-side sessions** — refresh tokens are stored _hashed_ in MongoDB and can be revoked individually (`logout`) or globally (`logout from all devices`).
- **Persistent login** on the frontend with automatic token refresh via an Axios interceptor.

### 🛒 Shopping Experience

- **Product catalog** seeded with 12 products across 4 categories (Dresses, Outerwear, Tops, Bottoms).
- **Search, filter & sort** — by category, badge (New / Sale / Best Seller / Premium), free-text search, and price/rating sorting.
- **Infinite scroll** with server-side pagination (IntersectionObserver).
- **Product detail modal** with **size & color** selectors.
- **Cart** — add / remove / update quantity, merge identical (product + size + color) lines, animated slide-out sidebar.
- **Wishlist** persisted to `localStorage`.

### 💳 Payments

- **Razorpay checkout** — orders created on the server, paid via the Razorpay JS checkout, and **verified server-side with signature validation** before the cart is cleared.
- Automatic order total calculation (subtotal + 8% tax + shipping, free shipping above ₹150).

### 🎨 UI/UX

- Light / **dark mode** (system-detected, persisted), fully responsive.
- **Framer Motion** animations, glassmorphism navbar, toasts, skeletons, back-to-top.
- Marketing sections: hero, features bar, categories, testimonials, Instagram feed, newsletter.

---

## 🧱 Tech Stack

### Frontend — `Frontend/`

| Technology                                                     | Purpose                                      |
| -------------------------------------------------------------- | -------------------------------------------- |
| [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | UI framework & build tool                    |
| [Tailwind CSS 3](https://tailwindcss.com/)                     | Utility-first styling                        |
| [Framer Motion](https://www.framer.com/motion/)                | Animations                                   |
| [React Router 7](https://reactrouter.com/)                     | Client-side routing                          |
| [Axios](https://axios-http.com/)                               | HTTP client (with refresh-token interceptor) |
| [Font Awesome](https://fontawesome.com/)                       | Icons                                        |

### Backend — `Backend/`

| Technology                                                                       | Purpose                             |
| -------------------------------------------------------------------------------- | ----------------------------------- |
| [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)             | Server & routing                    |
| [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/)      | Database & ODM                      |
| [JSON Web Tokens](https://jwt.io/)                                               | Access / refresh tokens             |
| [Nodemailer](https://nodemailer.com/)                                            | Email + OTP delivery (Gmail OAuth2) |
| [Razorpay](https://razorpay.com/)                                                | Payment gateway                     |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) · cookie-parser · cors · morgan | Utilities                           |

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
│       │   ├── user.model.js
│       │   ├── product.model.js
│       │   ├── otp.model.js
│       │   ├── session.model.js
│       │   ├── cart.model.js
│       │   └── order.model.js
│       ├── controllers/             # Request handlers
│       │   ├── auth.controller.js
│       │   ├── product.controller.js
│       │   ├── cart.controller.js
│       │   └── order.controller.js
│       ├── routes/
│       │   ├── public/              # auth, products
│       │   └── private/             # cart, order (protect middleware)
│       ├── middlewares/
│       │   └── auth.middleware.js   # JWT `protect` guard
│       ├── services/
│       │   └── email.service.js     # Nodemailer transporter
│       ├── utils/                   # OTP helpers, seed product data
│       └── seed.js                  # Database seeder (12 products)
│
└── Frontend/                        # React SPA (Vite, port 5173)
    ├── index.html
    ├── vite.config.js               # /api proxy → http://localhost:3000
    └── src/
        ├── main.jsx                 # Entry (providers + router)
        ├── App.jsx                  # Routes & global layout
        ├── api/axios.js             # Axios instance (baseURL, credentials)
        ├── context/                 # AuthContext, AppContext
        ├── hooks/                   # useAuth, useApp, useRefreshToken,
        │                            # useAxiosPrivate, useInfiniteProducts
        ├── pages/                   # Home, Shop, ProductDetail, Wishlist,
        │                            # Auth, Profile, MyCart, Checkout, Verify
        ├── components/              # Navbar, Footer, CartSidebar, ProductGrid,
        │                            # ProductCard, HeroSection, Toast, ...
        ├── data/constants.js        # Mock products/categories/testimonials
        └── index.css                # Tailwind directives & global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A **Razorpay** account (test mode works fine) and a **Gmail** account with an [OAuth2 App Password](https://support.google.com/mail/answer/185833).

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
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth_db

JWT_SECRET=your_jwt_secret_here

# Gmail OAuth2 (used for OTP emails)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_smtp_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER_EMAIL=your_email@gmail.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ **Note:** the server reads **these exact keys** (`MONGO_URI`, `JWT_SECRET`, `SMTP_USER`, `SMTP_PASSWORD`, `GOOGLE_*`, `RAZORPAY_*`). The current `.env.example` in the repo is out of date and lists different names — update it to match the list above, or copy it and rename the keys.

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
node src/seed.js   # inserts 12 products
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

| Method | Endpoint                | Description                                                           | Auth   |
| ------ | ----------------------- | --------------------------------------------------------------------- | ------ |
| `POST` | `/register`             | Create account, send OTP email (`username`, `email`, `password`)      | —      |
| `POST` | `/verify-otp`           | Verify email (`otp`, `email`)                                         | —      |
| `POST` | `/login`                | Login with email/username + password → `accessToken` + refresh cookie | —      |
| `POST` | `/logout`               | Revoke current session, clear cookie                                  | Cookie |
| `GET`  | `/logout-all`           | Revoke all sessions for the user                                      | Cookie |
| `GET`  | `/get-new-access-token` | Rotate refresh token, return new `accessToken`                        | Cookie |
| `GET`  | `/verify-token`         | Validate `Authorization: Bearer <token>`, return user                 | Bearer |

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

| Method | Endpoint      | Description                                                                                                           |
| ------ | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/create`     | Build Razorpay order from the cart (returns `order.id` for checkout)                                                  |
| `POST` | `/verify`     | Verify payment signature (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) → marks paid, clears cart |
| `GET`  | `/get-orders` | List user's orders _(stub — not yet implemented)_                                                                     |

---

## 🗄️ Data Models

| Model       | Key fields                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| **User**    | `username` · `email` · `password` (SHA-256 hash) · `verified`                                                       |
| **Product** | `name` · `price` · `originalPrice` · `category` · `sizes[]` · `colors[]` · `rating` · `reviews` · `badge` · `image` |
| **OTP**     | `email` · `user` · `otpHash`                                                                                        |
| **Session** | `userId` · `refreshTokenHash` · `ip` · `userAgent` · `revoked`                                                      |
| **Cart**    | `user` (unique) · `items[]` (`product`, `quantity`, `size`, `color`)                                                |
| **Order**   | `razorpayOrderId` · `user` · `items[]` · `totalAmount` · `status` · `paymentStatus`                                 |

---

## 🛠️ Available Scripts

| Location | Command            | Description                               |
| -------- | ------------------ | ----------------------------------------- |
| Backend  | `npm run dev`      | Start API with nodemon (hot reload)       |
| Backend  | `npm start`        | Start API with Node                       |
| Backend  | `node src/seed.js` | Seed the database with 12 sample products |
| Frontend | `npm run dev`      | Start Vite dev server                     |
| Frontend | `npm run build`    | Production build → `dist/`                |
| Frontend | `npm run preview`  | Preview the production build              |
| Frontend | `npm run lint`     | Run ESLint                                |

---

## 🗺️ Roadmap / Ideas

- [ ] Implement `GET /api/order/get-orders` + order history UI
- [ ] Password reset flow
- [ ] Admin panel for product/order management
- [ ] Migrate password hashing to **bcrypt** (currently SHA-256)
- [ ] Dockerize backend + frontend with `docker-compose`

---

## 📄 License

[ISC](https://opensource.org/licenses/ISC)

---

_Built with ❤️ by Rajeev_
