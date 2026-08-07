// ---- Data ----
export const PRODUCTS = [
  {
    id: 1,
    name: "Cashmere Overcoat",
    price: 289,
    originalPrice: 349,
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#2d2d2d", "#8b7355", "#c4a882"],
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Silk Midi Dress",
    price: 179,
    originalPrice: null,
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#1a1a2e", "#e8d5c4", "#6b4226"],
    rating: 4.9,
    reviews: 89,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Tailored Wool Blazer",
    price: 229,
    originalPrice: 279,
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#1a1a1a", "#4a4a4a", "#8b7355"],
    rating: 4.7,
    reviews: 201,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Organic Cotton Tee",
    price: 49,
    originalPrice: null,
    category: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#ffffff", "#1a1a1a", "#97c1a9", "#d4a574"],
    rating: 4.6,
    reviews: 342,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 5,
    name: "High-Rise Wide Leg Pants",
    price: 119,
    originalPrice: 149,
    category: "Bottoms",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#1a1a1a", "#f5f5dc", "#4a4a4a"],
    rating: 4.5,
    reviews: 167,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Linen Summer Dress",
    price: 159,
    originalPrice: null,
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#f5e6d3", "#bcd4e6", "#fadadd"],
    rating: 4.8,
    reviews: 93,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Merino Wool Sweater",
    price: 139,
    originalPrice: null,
    category: "Tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#f5f5dc", "#8b4513", "#2f4f4f"],
    rating: 4.7,
    reviews: 215,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Pleated Midi Skirt",
    price: 99,
    originalPrice: 129,
    category: "Bottoms",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#1a1a1a", "#d4a574", "#6b4226"],
    rating: 4.4,
    reviews: 78,
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Denim Jacket Classic",
    price: 169,
    originalPrice: null,
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#4169e1", "#1a1a1a", "#f5f5dc"],
    rating: 4.6,
    reviews: 256,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Relaxed Linen Shirt",
    price: 89,
    originalPrice: null,
    category: "Tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#ffffff", "#bcd4e6", "#f5e6d3"],
    rating: 4.5,
    reviews: 134,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 11,
    name: "Velvet Evening Gown",
    price: 349,
    originalPrice: 429,
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#800020", "#1a1a2e", "#2f4f4f"],
    rating: 4.9,
    reviews: 47,
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 12,
    name: "Stretch Slim Jeans",
    price: 109,
    originalPrice: null,
    category: "Bottoms",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#1a1a2e", "#4a4a4a", "#1a1a1a"],
    rating: 4.6,
    reviews: 389,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=80",
  },
];

export const CATEGORIES = [
  {
    name: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop&q=80",
    count: 48,
  },
  {
    name: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop&q=80",
    count: 35,
  },
  {
    name: "Tops",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&q=80",
    count: 62,
  },
  {
    name: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&q=80",
    count: 41,
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    text: "Absolutely in love with the quality. The cashmere overcoat is worth every penny!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Emily R.",
    text: "Fast shipping and the silk dress fits perfectly. My new go-to store.",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "Jessica L.",
    text: "The attention to detail is incredible. Customer service was also fantastic!",
    rating: 4,
    avatar: "JL",
  },
];
