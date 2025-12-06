# Handcrafted Haven - Technical Documentation

**Version:** 2.0.0  
**Last Updated:** December 6, 2025  
**Status:** Production Ready  
**Author:** Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Core Features](#core-features)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Authentication & Security](#authentication--security)
10. [Newsletter Subscription System](#newsletter-subscription-system)
11. [Product Catalog](#product-catalog)
12. [Reviews & Ratings](#reviews--ratings)
13. [Deployment Guide](#deployment-guide)
14. [Troubleshooting](#troubleshooting)
15. [Contributing Guidelines](#contributing-guidelines)

---

## Overview

**Handcrafted Haven** is a full-stack e-commerce platform designed to connect independent artisans with customers seeking authentic, handcrafted products. The platform emphasizes sustainability, quality, and direct artisan-to-customer relationships.

### Key Objectives

- Provide a seamless marketplace for handcrafted goods
- Enable artisans to manage and sell their products
- Ensure secure transactions and user data protection
- Deliver a professional, responsive user experience
- Support customer engagement through newsletter subscriptions
- Facilitate product discovery with reviews and ratings

### Target Users

- **Customers**: Browse 62+ products across 6 categories, purchase, and review
- **Artisans**: Create profiles, upload products, track sales
- **Administrators**: Manage platform operations and content

### Current Statistics

- **62+ Products** across 6 handcrafted categories
- **Product Reviews** with 1-5 star ratings
- **Newsletter Subscription** with animated confirmation modal
- **Multiple Support Pages** (Contact, FAQs, Shipping, Privacy)

---

## Technology Stack

### Frontend

| Technology     | Version  | Purpose                          |
| -------------- | -------- | -------------------------------- |
| **Next.js**    | 13.5.6   | React framework with SSR and SSG |
| **React**      | 18.2.0   | UI component library             |
| **TypeScript** | Latest   | Type-safe JavaScript             |
| **CSS3**       | Native   | Styling with custom properties   |
| **Next Image** | Built-in | Image optimization               |

### Backend

| Technology             | Version | Purpose                      |
| ---------------------- | ------- | ---------------------------- |
| **Node.js**            | 22.11.0 | JavaScript runtime           |
| **Next.js API Routes** | 13.5.6  | Serverless backend endpoints |
| **MongoDB**            | Latest  | NoSQL database               |
| **Mongoose**           | Latest  | MongoDB ODM                  |
| **JWT**                | Latest  | Authentication tokens        |

### Development Tools

| Tool           | Purpose                           |
| -------------- | --------------------------------- |
| **pnpm**       | Package manager (faster than npm) |
| **TypeScript** | Static type checking              |
| **ESLint**     | Code linting (optional)           |
| **Prettier**   | Code formatting (optional)        |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                        │
│  (React Components, Pages, Static Assets, CSS)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Next.js API Routes                         │
│  (Authentication, Products, Cart, Orders)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                          │
│  (Users, Products, Orders, Cart Items, Reviews)            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: Credentials → API → MongoDB → JWT Token
2. **Product Management**: Form Input → Validation → API → MongoDB → Response
3. **Shopping Cart**: Client State (localStorage/server) → Sync → API → Database
4. **Checkout**: Cart Data → Order Creation → Payment Processing → Email Notification

---

## Installation & Setup

### Prerequisites

- Node.js v20 or higher
- pnpm (recommended) or npm
- MongoDB instance (local or cloud)
- Git for version control

### Step 1: Clone Repository

```bash
git clone https://github.com/florian-kausche/Handcrafted-Haven.git
cd Handcrafted-Haven
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/handcrafted-haven?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Optional: Cloudinary for Image Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset

# Optional: Email Service (for order notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 4: Initialize Database

```bash
# Database collections are created automatically on first use
# Optional: Run seed script if available
pnpm run seed-db
```

### Step 5: Start Development Server

```bash
pnpm dev
```

Server will be available at `http://localhost:3000`

### Step 6: Verify Installation

- Navigate to `http://localhost:3000`
- Check that home page loads without errors
- Try registering a test user account

---

## Project Structure

```
handcrafted-haven/
│
├── src/
│   ├── pages/                          # Next.js pages (routing)
│   │   ├── _app.tsx                   # Application wrapper
│   │   ├── _document.tsx              # Global HTML document
│   │   ├── index.tsx                  # Home page
│   │   ├── shop.tsx                   # Products listing
│   │   ├── product/[id].tsx           # Product detail page
│   │   ├── cart.tsx                   # Shopping cart
│   │   ├── checkout.tsx               # Checkout flow
│   │   ├── about.tsx                  # About page
│   │   ├── contact.tsx                # Contact page
│   │   ├── login.tsx                  # Login page
│   │   ├── register.tsx               # Registration page
│   │   ├── account.tsx                # User account page
│   │   ├── seller.tsx                 # Seller dashboard
│   │   └── api/                       # Backend API routes
│   │       ├── auth/                  # Authentication endpoints
│   │       ├── products/              # Product management
│   │       ├── cart/                  # Cart operations
│   │       └── orders/                # Order management
│   │
│   ├── components/                    # Reusable React components
│   │   ├── Header.tsx                # Navigation header
│   │   ├── Footer.tsx                # Footer with category links
│   │   ├── ProductCard.tsx           # Product card display
│   │   ├── Modal.tsx                 # Modal dialogs
│   │   ├── SubscriptionModal.tsx    # Newsletter confirmation modal
│   │   └── PageLoader.tsx           # Loading component
│   │
│   ├── contexts/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── CartContext.tsx           # Shopping cart state
│   │   └── SubscriptionContext.tsx  # Newsletter subscription hook
│   │
│   ├── models/                        # Mongoose models
│   │   ├── User.ts                   # User accounts
│   │   ├── Artisan.ts               # Artisan profiles
│   │   ├── Product.ts               # Product catalog
│   │   ├── CartItem.ts              # Cart items
│   │   ├── Order.ts                 # Orders
│   │   └── Review.ts                # Product reviews
│   │
│   ├── lib/                           # Utility functions
│   │   ├── api.ts                    # API client functions
│   │   ├── auth.ts                   # Authentication helpers
│   │   ├── mongoose.ts              # MongoDB connection
│   │   ├── db.ts                     # Database utilities
│   │   └── mailer.ts                # Email utilities
│   │
│   ├── styles/                        # Global styles
│   │   └── globals.css               # CSS custom properties & styles
│   │
│   └── types/                         # TypeScript type definitions
│       └── types.ts
│
├── public/                            # Static assets
│   └── assets/
│       ├── profile/                  # User avatar images
│       ├── pottery/                  # Pottery & Ceramics (22 products)
│       ├── Candles/                 # Candles (10 products)
│       ├── Jewelry/                 # Jewelry (10 products)
│       ├── Leather/                 # Leather goods (10 products)
│       ├── Textiles&Weaving/       # Textiles (10 products)
│       └── Woodwork/                # Woodwork (10 products)
│
├── scripts/                           # Utility scripts
│   ├── init-db.ts                    # Database initialization
│   ├── seed-db.ts                    # Sample data generation
│   ├── seed-mongo.ts                 # MongoDB seeding
│   ├── add-candles.js               # Add candle products
│   ├── add-jewelry.js               # Add jewelry products
│   ├── add-leather.js               # Add leather products
│   ├── add-pottery.js               # Add pottery products
│   ├── add-textiles.js              # Add textile products
│   ├── add-woodwork.js              # Add woodwork products
│   └── add-reviews.js               # Add product reviews
│
├── .env.local                         # Environment variables (not in git)
├── .gitignore                         # Git ignore rules
├── tsconfig.json                      # TypeScript configuration
├── next.config.js                     # Next.js configuration
├── package.json                       # Project metadata & dependencies
└── pnpm-lock.yaml                    # Dependency lock file
```

---

## Core Features

### 1. User Authentication

**Functionality**:

- User registration with role selection (Customer/Artisan)
- Secure login with JWT tokens
- Auto-logout after 30 minutes of inactivity
- Password validation and hashing

**Files**:

- `src/pages/api/auth/login.ts`
- `src/pages/api/auth/register.ts`
- `src/pages/api/auth/logout.ts`
- `src/contexts/AuthContext.tsx`

**Flow**:

```
User Input → Validation → Hash Password → Store in DB → Generate JWT → Return Token
```

### 2. Product Management

**Functionality**:

- Create/Read/Update/Delete (CRUD) products
- Auto-create artisan profile on first product
- Featured products display
- Product search and filtering
- Image upload support

**Files**:

- `src/pages/api/products/index.ts`
- `src/pages/api/products/[id].ts`
- `src/pages/api/products/seller.ts`

### 3. Shopping Cart

**Functionality**:

- Add/Remove items from cart
- Update item quantities
- Guest cart persistence (localStorage)
- Server-side cart for authenticated users
- Cart synchronization on login
- Dual ID matching for robust updates

**Files**:

- `src/pages/api/cart/index.ts`
- `src/contexts/CartContext.tsx`

**Storage Mechanism**:

- Guests: `localStorage['hh_guest_cart']`
- Authenticated: MongoDB CartItem collection

### 4. Checkout & Orders

**Functionality**:

- Multiple payment methods (Credit Card, PayPal, Bank Transfer, Mobile Money, COD)
- Order creation and tracking
- Receipt storage and display
- Email confirmation
- Order history

**Files**:

- `src/pages/checkout.tsx`
- `src/pages/api/orders/index.ts`

**Order Storage**:

```javascript
// localStorage['hh_last_order'] structure
{
  items: [
    { product, title, price, quantity },
    ...
  ],
  total_amount: number,
  guestToken?: string,
  guest_email?: string,
  emailSent: boolean
}
```

### 5. Seller Dashboard

**Functionality**:

- Product upload and management
- Sales statistics and metrics
- Auto-profile creation with business name
- Product listing management

**Files**:

- `src/pages/seller.tsx`
- `src/pages/api/products/seller.ts`

### 6. Inactivity Timeout

**Functionality**:

- 30-minute inactivity threshold
- Auto-logout with redirect to login
- Activity detection on mouse, keyboard, scroll, touch
- User notification on timeout

**Files**:

- `src/contexts/AuthContext.tsx` (lines 44-72)
- `src/pages/login.tsx` (timeout message)

### 7. Support Pages

**Contact Page** (`/contact`):

- Contact form with validation
- Business information (email, phone, address)
- Business hours display
- FAQs section with anchor link (`#faqs`)
- Shipping & Returns policy section (`#shipping`)

**Privacy Policy** (`/privacy`):

- Comprehensive privacy information
- Data collection and usage policies
- User rights and choices
- Cookie and tracking information
- Contact information for privacy concerns

**About Page** (`/about`):

- Company mission and values
- "What We Stand For" principles
- Call-to-action buttons
- Supporting local artisans message

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer" | "artisan"
}
```

**Response** (201):

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  }
}
```

#### POST /api/auth/login

Authenticate user and receive JWT token.

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200):

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### POST /api/auth/logout

Logout user and invalidate session.

**Response** (200):

```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me

Get current authenticated user.

**Headers**:

```
Authorization: Bearer {jwt_token}
```

**Response** (200):

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

---

### Product Endpoints

#### GET /api/products

Retrieve products with optional filtering.

**Query Parameters**:

- `featured`: boolean - Get only featured products
- `category`: string - Filter by category
- `limit`: number - Max results (default: 50)

**Response** (200):

```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Product Name",
      "price": 99.99,
      "image_url": "url",
      "description": "description",
      "featured": true,
      "artisan_name": "Artisan Name"
    }
  ]
}
```

#### POST /api/products

Create a new product (Artisan only).

**Headers**:

```
Authorization: Bearer {jwt_token}
```

**Request**:

```json
{
  "title": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "images": ["url1", "url2"],
  "featured": true,
  "businessName": "Business Name"
}
```

#### GET /api/products/[id]

Get single product details.

**Response** (200):

```json
{
  "product": {
    "_id": "product_id",
    "title": "Product Name",
    "price": 99.99,
    "images": ["url"],
    "description": "description",
    "artisan_name": "Artisan Name"
  }
}
```

---

### Cart Endpoints

#### GET /api/cart

Get user's shopping cart.

**Headers**:

```
Authorization: Bearer {jwt_token}
```

**Response** (200):

```json
{
  "cart": [
    {
      "_id": "cart_item_id",
      "product": "product_id",
      "quantity": 2,
      "title": "Product Name",
      "price": 99.99
    }
  ]
}
```

#### POST /api/cart

Add item to cart.

**Headers**:

```
Authorization: Bearer {jwt_token}
```

**Request**:

```json
{
  "productId": "product_id",
  "quantity": 1
}
```

#### PUT /api/cart

Update cart item quantity.

**Request**:

```json
{
  "productId": "product_id",
  "quantity": 3
}
```

**Note**: Accepts both cart-item `_id` and `product` id for robustness.

#### DELETE /api/cart

Remove item from cart.

**Request**:

```json
{
  "productId": "product_id"
}
```

---

### Order Endpoints

#### POST /api/orders

Create new order.

**Headers**:

```
Authorization: Bearer {jwt_token}
```

**Request**:

```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 1,
      "price": 99.99
    }
  ],
  "total_amount": 99.99,
  "payment_method": "credit_card",
  "guest_email": "customer@example.com"
}
```

#### GET /api/orders

Get user's order history.

**Response** (200):

```json
{
  "orders": [
    {
      "_id": "order_id",
      "items": [...],
      "total_amount": 99.99,
      "status": "completed",
      "createdAt": "2025-12-05T10:00:00Z"
    }
  ]
}
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String ("customer" | "artisan"),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  price: Number (required),
  images: [String],
  image_url: String,
  category: String,
  featured: Boolean,
  artisan: ObjectId (ref: Artisan),
  artisan_name: String,
  rating: Number,
  reviews: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### CartItem Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  quantity: Number (required, min: 1),
  title: String,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, nullable for guests),
  items: [
    {
      product: ObjectId,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  total_amount: Number (required),
  payment_method: String,
  status: String ("pending" | "completed" | "failed"),
  guest_email: String,
  guestToken: String,
  emailSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Artisan Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  businessName: String (required),
  bio: String,
  avatar: String,
  rating: Number,
  products: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  product: ObjectId (ref: Product, required),
  rating: Number (required, min: 1, max: 5),
  comment: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

- `product`: For efficient product review queries
- `user`: For user review history
- `createdAt`: For sorting by date

---

## Authentication & Security

### JWT Token Management

**Token Structure**:

- **Algorithm**: HS256
- **Expiration**: Configurable (default: 24 hours)
- **Storage**: HTTP-only cookies (secure by default)

**Token Generation**:

```typescript
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);
```

### Session Security

1. **Inactivity Timeout**: 30 minutes
2. **Event Listeners**: Mouse, keyboard, scroll, touch
3. **Auto-Logout**: Redirect to login with notification
4. **CSRF Protection**: Next.js built-in protection

### Password Security

```typescript
// Hashing (bcrypt)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Best Practices

✅ **Never store passwords in plain text**  
✅ **Use HTTPS only in production**  
✅ **Validate all user inputs**  
✅ **Sanitize data before storing**  
✅ **Use environment variables for secrets**  
✅ **Implement rate limiting on auth endpoints**  
✅ **Log authentication events**

---

## Newsletter Subscription System

### Overview

The newsletter subscription system allows users to subscribe to receive updates about new artisans, products, and exclusive offers. Features a beautiful animated confirmation modal.

### Components

#### SubscriptionModal Component

**Location**: `src/components/SubscriptionModal.tsx`

**Features**:

- Animated checkmark with SVG stroke animation
- Smooth fade-in and slide-down animations
- Email confirmation display
- Close button and auto-dismiss functionality
- Responsive design with mobile support

**Animations**:

```typescript
- fadeIn: 0.3s ease-out (modal background)
- slideInDown: 0.4s ease-out (modal content)
- checkmark: 0.6s ease-out (SVG path animation)
```

#### useSubscription Hook

**Location**: `src/contexts/SubscriptionContext.tsx`

**Provides**:

- `subscribed`: Boolean state
- `subscribedEmail`: Stored email address
- `showSubscriptionModal`: Modal visibility state
- `handleSubscribe`: Async subscription handler

**Usage Example**:

```typescript
const { subscribed, subscribedEmail, showSubscriptionModal,
        setShowSubscriptionModal, handleSubscribe } = useSubscription()

<Footer onSubscribe={handleSubscribe} subscribed={subscribed} />
<SubscriptionModal
  isOpen={showSubscriptionModal}
  email={subscribedEmail}
  onClose={() => setShowSubscriptionModal(false)}
/>
```

### API Endpoint

#### POST /api/newsletter

Subscribe user to newsletter.

**Request**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter",
  "email": "user@example.com"
}
```

**Error Response** (400):

```json
{
  "error": "Invalid email address"
}
```

**Implementation**:

- Email validation (regex pattern)
- In-memory storage (can be upgraded to MongoDB collection)
- Duplicate prevention
- Error handling with detailed messages

### Integration

The subscription system is integrated across all pages:

- index.tsx (Home)
- shop.tsx
- about.tsx
- contact.tsx
- privacy.tsx
- login.tsx
- register.tsx
- seller.tsx

---

## Product Catalog

### Overview

Handcrafted Haven features a comprehensive product catalog with 62+ handcrafted items organized across 6 categories.

### Product Categories

| Category               | Product Count | Examples                                                      |
| ---------------------- | ------------- | ------------------------------------------------------------- |
| **Pottery & Ceramics** | 22            | Ornate Vase, Decorative Pots, Tajines, Planters, Tea Sets     |
| **Leather**            | 10            | Tote Bags, Belts, Wallets, Jackets, Shoes, Hand Drums         |
| **Candles**            | 10            | Lavender, Rose, Vanilla, Citrus, Pine, Jasmine, Sandalwood    |
| **Jewelry**            | 10            | Gold Necklace, Silver Bracelet, Gemstone Earrings, Pearl Ring |
| **Textiles & Weaving** | 10            | Scarves, Blankets, Rugs, Woven Baskets, Tote Bags             |
| **Woodwork**           | 10            | Rustic Bench, Minimalist Desk, Bowls, Trays, Cutting Boards   |

### Product Data Structure

Each product includes:

- **Basic Info**: title, description, category, price
- **Images**: Array of image URLs with fallback support
- **Artisan**: Reference to artisan profile
- **Ratings**: Average rating (1-5 stars)
- **Reviews**: Count and collection of customer reviews
- **Metadata**: SKU, slug, featured status, variants
- **Timestamps**: Created and updated dates

### Image Management

**Storage Location**: `/public/assets/[Category]/`

**Categories**:

- `/public/assets/Candles/` - 10 candle product images
- `/public/assets/Jewelry/` - 10 jewelry product images
- `/public/assets/Leather/` - 10 leather goods images
- `/public/assets/pottery/` - 22 pottery & ceramics images
- `/public/assets/Textiles&Weaving/` - 10 textile images
- `/public/assets/Woodwork/` - 10 woodwork images

**Image Formats**: JPG, PNG, JPEG
**Naming Convention**: Descriptive names (e.g., `lavender-candle.jpg`, `ornate-vase.jpg`)

### Product Seeding Scripts

Located in `/scripts/`:

```bash
node scripts/add-candles.js      # Seeds 10 candle products
node scripts/add-jewelry.js      # Seeds 10 jewelry products
node scripts/add-leather.js      # Seeds 10 leather products
node scripts/add-pottery.js      # Seeds 10 pottery products
node scripts/add-textiles.js     # Seeds 10 textile products
node scripts/add-woodwork.js     # Seeds 10 woodwork products
```

Each script:

1. Connects to MongoDB
2. Creates products with proper data structure
3. Sets appropriate image paths
4. Inserts into products collection
5. Confirms insertion count

### Shop Page Features

**Location**: `src/pages/shop.tsx`

**Functionality**:

- Category filtering (All + 6 categories)
- Product search
- Server-side rendering (SSR) with getServerSideProps
- Product count display per category
- Responsive grid layout
- "View All" buttons for each category

**Category Aggregation**:

```typescript
const catAgg = await ProductModel.aggregate([
  { $match: {} },
  {
    $group: {
      _id: { $ifNull: ["$category", "Uncategorized"] },
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
]);
```

---

## Reviews & Ratings

### Overview

Customers can leave reviews with ratings (1-5 stars) and comments on products they've purchased or browsed.

### Review Schema

**Location**: `src/models/Review.ts`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  product: ObjectId (ref: Product, required),
  rating: Number (required, min: 1, max: 5),
  comment: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Features

- **Star Ratings**: 1-5 stars (integer values)
- **Comments**: Text feedback from customers
- **User Attribution**: Links to user account
- **Product Association**: Links to specific product
- **Timestamps**: Track when reviews were created
- **Average Calculation**: Auto-calculated product rating

### API Endpoints

#### POST /api/products/[id]/reviews

Add a review to a product.

**Request**:

```json
{
  "rating": 5,
  "comment": "Excellent quality! Highly recommended."
}
```

**Response** (201):

```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent quality!",
    "product": "product_id",
    "user": "user_id"
  }
}
```

#### GET /api/products/[id]/reviews

Get all reviews for a product.

**Response** (200):

```json
{
  "reviews": [
    {
      "_id": "review_id",
      "rating": 5,
      "comment": "Excellent quality!",
      "user": { "firstName": "John", "lastName": "D." },
      "createdAt": "2025-12-05T10:00:00Z"
    }
  ],
  "averageRating": 4.8,
  "totalReviews": 12
}
```

### Product Rating Calculation

Products store two fields:

- `rating`: Average rating (calculated)
- `total_reviews`: Count of reviews

**Calculation Logic**:

```typescript
const reviews = await Review.find({ product: productId });
const avgRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
await Product.findByIdAndUpdate(productId, {
  rating: avgRating,
  total_reviews: reviews.length,
});
```

### Sample Reviews

Added via `scripts/add-reviews.js`:

- **Minimalist Wood Desk**: 3 reviews, avg rating 4.7
- **Rustic Wooden Bench**: 3 reviews, avg rating 5.0
- **Colorblock Woven Tote**: 4 reviews, avg rating 4.5
- **Ornate Ceramic Vase**: 2 reviews, avg rating 5.0
- **Peppermint Candle**: 2 reviews, avg rating 4.5

### Display Components

**ProductCard.tsx**: Shows star rating and review count
**Product Detail Page**: Full review list with user names and dates
**Shop Page**: Displays average rating for filtering

---

## Deployment Guide

### Prepare for Production

1. **Build the application**:

```bash
pnpm build
```

2. **Run production tests**:

```bash
pnpm start
```

3. **Verify environment variables are set**:

```bash
cat .env.production.local
```

### Deployment Platforms

#### Option 1: Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on `main` branch push

```bash
# Or deploy manually
vercel --prod
```

#### Option 2: Railway

1. Connect GitHub repository
2. Configure environment variables
3. Deploy with automatic updates

#### Option 3: Traditional Server (DigitalOcean, AWS, etc.)

```bash
# On server
git clone <repo>
cd handcrafted-haven
pnpm install
pnpm build

# Use process manager (PM2)
npm install -g pm2
pm2 start "pnpm start" --name "handcrafted-haven"
pm2 save
pm2 startup
```

### Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection secured
- [ ] JWT secret changed to unique value
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Performance monitoring enabled
- [ ] CDN configured for static assets
- [ ] Email service configured

---

## Troubleshooting

### Common Issues

#### 1. "Port 3000 is already in use"

**Solution**:

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### 2. "Cannot connect to MongoDB"

**Solution**:

- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB server is running
- Verify network access if using MongoDB Atlas
- Check connection string syntax

#### 3. "Authentication token expired"

**Solution**:

- Clear browser cookies
- Log in again to get new token
- Verify JWT_SECRET hasn't changed

#### 4. "Images not loading"

**Solution**:

- Verify image paths in `public/assets`
- Check image file permissions
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `pnpm build`

#### 5. "Cart not syncing"

**Solution**:

- Check localStorage: `localStorage.hh_guest_cart`
- Verify API endpoint returns correctly
- Check authentication token validity
- Review browser console for errors

#### 6. "Fast Refresh reload warnings"

**Solution**:

- This is normal during development
- Ensure `_document.tsx` exists
- Check for syntax errors in components

---

## Contributing Guidelines

### Code Standards

#### TypeScript

```typescript
// Always use type annotations
const getUserById = async (id: string): Promise<User> => {
  // implementation
};

// Use interfaces for object types
interface Product {
  id: string;
  title: string;
  price: number;
}
```

#### Component Structure

```typescript
import React, { useState } from "react";

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>("");

  return <div>{title}</div>;
}
```

#### API Routes

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Implementation
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Commit Messages

```
[Type] Brief description

Detailed explanation if needed.

Type: feat, fix, docs, style, refactor, test, chore
```

Example:

```
[feat] Add inactivity timeout to authentication

Implemented 30-minute session timeout with activity tracking
on mouse, keyboard, and scroll events. Users are redirected
to login page with notification message.
```

### Pull Request Process

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit with meaningful messages
3. Push to remote: `git push origin feature/description`
4. Create pull request with description
5. Request code review
6. Merge after approval

---

## Support & References

- **Next.js Documentation**: https://nextjs.org/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **React Documentation**: https://react.dev

---

**Last Updated**: December 5, 2025  
**Maintained By**: Development Team  
**Status**: Production Ready
