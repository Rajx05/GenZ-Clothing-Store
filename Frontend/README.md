# XYZ — Premium Clothing Store

A modern, visually polished e-commerce frontend prototype built with **Vite**, **React 18**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Features

### 🎨 Design & Layout

- **Sticky Glass-morphism Navbar** — Transparent blur effect on scroll with logo, navigation, search, and icons.
- **Announcement Marquee Bar** — Scrolling promotional messages for special offers.
- **Hero Section** — Full-bleed hero image with animated text and smooth transitions.
- **Features Bar** — Quick highlights of service benefits like free shipping and secure payment.
- **Shop Categories** — Intuitive category navigation with elegant hover effects.
- **Product Grid** — Dynamic collection display with filtering and sorting capabilities.
- **Testimonials & Instagram Feed** — Built-in social proof and visual inspiration.
- **Newsletter** — Sleek email subscription section for customer engagement.

### 🛒 E-Commerce Functionality

- **Product Filtering & Sorting** — Browse by category or sort by price and rating.
- **Product Detail Modal** — Quick view with color, size, and quantity selectors.
- **Shopping Cart Sidebar** — Animated slide-out cart with quantity controls and subtotal calculation.
- **Persistence** — Cart, Wishlist, and Dark Mode preferences are saved to `localStorage`.
- **Toast Notifications** — Instant feedback for user actions like adding items to the bag.

### 🌙 Dark Mode

- **Theme Support** — Fully optimized for both light and dark modes.
- **System Detection** — Automatically respects OS-level theme preferences.
- **Smooth Toggle** — Animated transition between themes.

### ✨ Tech Stack

- **Vite** — Lightning-fast build tool and development server.
- **React 18** — Component-based UI library.
- **Tailwind CSS** — Utility-first CSS framework for rapid styling.
- **Framer Motion** — Powerful library for production-ready animations.
- **Font Awesome** — Comprehensive icon set.

---

## 📂 Project Structure

```text
├── index.html          # Entry HTML file
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── src/
│   ├── main.jsx        # Application entry point
│   ├── App.jsx         # Root component & state management
│   ├── index.css       # Global styles & Tailwind directives
│   ├── components/     # Reusable UI components
│   ├── context/        # AppContext for global state
│   └── data/           # Constants and mock product data
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository.
2. Navigate to the project directory:
   ```bash
   cd e-commerce-frontend-prototype
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Create a production build in the `dist/` folder:

```bash
npm run build
```

---

## 📋 Data Persistence

The application uses the following `localStorage` keys to persist state:

- `abc-cart`: Stores items currently in the shopping bag.
- `abc-wishlist`: Stores IDs of products marked as favorites.
- `abc-dark-mode`: Stores the user's theme preference.

---
