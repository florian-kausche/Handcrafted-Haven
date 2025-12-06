# Handcrafted Haven - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js, TypeScript, and MongoDB (Mongoose) for handcrafted products.

## Features

### Frontend

- ✅ Home page with featured products
- ✅ Shop page with category filtering and search
- ✅ Product detail pages with reviews and ratings
- ✅ Shopping cart functionality
- ✅ Checkout process with PayPal simulation
- ✅ User authentication (login/register)
- ✅ User account dashboard with order history
- ✅ Seller dashboard for artisans
- ✅ About, Contact, and Privacy Policy pages
- ✅ Newsletter subscription with confirmation modal
- ✅ FAQs and Shipping & Returns information
- ✅ Responsive design
- ✅ Professional UI/UX with animations

### Backend

- ✅ MongoDB (Mongoose) database with models
- ✅ RESTful API routes
- ✅ JWT-based authentication
- ✅ User management
- ✅ Product management (62+ handcrafted products across 6 categories)
- ✅ Cart management
- ✅ Order processing
- ✅ Newsletter subscription API
- ✅ Product reviews and ratings system
- ✅ Secure password hashing

### Product Categories

- 🏺 **Pottery & Ceramics** (22 products) - Handmade vases, pots, planters, and more
- 🧥 **Leather** (10 products) - Tote bags, belts, wallets, jackets, shoes
- 🕯️ **Candles** (10 products) - Lavender, Rose, Vanilla, Citrus, and more scents
- 💍 **Jewelry** (10 products) - Necklaces, bracelets, earrings, rings
- 🧶 **Textiles & Weaving** (10 products) - Scarves, blankets, rugs, baskets
- 🪑 **Woodwork** (10 products) - Furniture, bowls, cutting boards, decor

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with CSS Variables
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- pnpm (install with `npm install -g pnpm`)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
pnpm install
```

### 2. Set Up MongoDB

You can use a local MongoDB instance or MongoDB Atlas (recommended for cloud). For Atlas, create a free cluster and obtain the connection string (URI).

If running locally, ensure `mongod` is running and reachable at `mongodb://localhost:27017` (or set `MONGODB_URI` accordingly).

### 3. Configure Environment Variables

Create a `.env.local` or `.env` file in the root directory and set your MongoDB connection string and JWT secret:

```env
MONGODB_URI="your-mongodb-connection-uri"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 4. Initialize / Seed Database

The Mongoose models build indexes on connection. To seed sample data (artisans, products, test users) run:

```bash
pnpm run seed:mongo
```

Or with TypeScript seeder:

```bash
npx ts-node scripts/seed-db.ts
```

### 5. Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cloudinary (Optional) - Browser Uploads for Sellers

This project supports uploading seller product images directly from the browser to Cloudinary using an unsigned upload preset. If you want browser uploads (recommended for production), configure Cloudinary and add the following environment variables to your `.env.local` file.

1. Create a Cloudinary account and a new unsigned upload preset:

   - Go to your Cloudinary dashboard -> Settings -> Upload
   - Under "Upload presets" create a new preset and set **Signing Mode** to **Unsigned**
   - Note the **Upload preset** name and your **Cloud name**

2. Add these to `.env.local` (used by the client at runtime):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

3. How it works

   - The seller upload page (`/seller/upload`) will detect these `NEXT_PUBLIC_` variables and perform a direct upload to Cloudinary from the browser. The returned `secure_url` will be saved as the `image_url` for the product and stored in MongoDB.
   - If Cloudinary env vars are not present, the page falls back to converting the uploaded file to a data URL and storing that in the product record. This fallback is convenient for local development but not recommended for production due to large DB size and bandwidth costs.

4. Security notes
   - Unsigned uploads are convenient but allow anyone with the preset to upload. Keep usage limited by only exposing unsigned preset for seller uploads and monitor upload usage in the Cloudinary dashboard.
   - For stricter production setups, implement signed uploads (server creates a signed signature) or use restricted upload destinations (server-side upload via signed requests).

## Database Schema (MongoDB Collections)

The application uses Mongoose models which map to MongoDB collections:

- **users** - User accounts (customers and artisans)
- **artisans** - Artisan profiles
- **products** - Product catalog (62+ handcrafted items across 6 categories)
- **cartitems** - Shopping cart items
- **orders** - Order records
- **reviews** - Product reviews with ratings (1-5 stars)

## API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products (with filters, category, search)
- `GET /api/products/[id]` - Get product by ID
- `GET /api/products/seller` - Get seller's products
- `POST /api/products/[id]/reviews` - Add product review

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders/paypal/simulate` - Simulate PayPal payment

### Newsletter

- `POST /api/newsletter` - Subscribe to newsletter

## Project Structure

```
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Modal.tsx
│   │   ├── SubscriptionModal.tsx
│   │   └── PageLoader.tsx
│   ├── contexts/        # React contexts (Auth, Cart, Subscription)
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── SubscriptionContext.tsx
│   ├── lib/            # Utilities (DB, Auth, API)
│   │   ├── mongoose.ts
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── db.ts
│   │   └── mailer.ts
│   ├── models/         # Mongoose models
│   │   ├── User.ts
│   │   ├── Artisan.ts
│   │   ├── Product.ts
│   │   ├── CartItem.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   ├── pages/          # Next.js pages and API routes
│   │   ├── api/        # API endpoints
│   │   │   ├── auth/   # Authentication
│   │   │   ├── products/ # Product management
│   │   │   ├── cart/   # Cart operations
│   │   │   ├── orders/ # Order processing
│   │   │   └── newsletter.ts
│   │   ├── index.tsx   # Home page
│   │   ├── shop.tsx    # Shop page with filtering
│   │   ├── product/[id].tsx # Product details
│   │   ├── cart.tsx    # Shopping cart
│   │   ├── checkout.tsx # Checkout page
│   │   ├── account.tsx # User account
│   │   ├── login.tsx   # Login page
│   │   ├── register.tsx # Registration
│   │   ├── about.tsx   # About page
│   │   ├── contact.tsx # Contact with FAQs
│   │   ├── privacy.tsx # Privacy policy
│   │   └── seller/     # Seller dashboard
│   └── styles/         # Global styles
│       └── globals.css
├── public/             # Static assets
│   └── assets/         # Product images by category
│       ├── Candles/
│       ├── Jewelry/
│       ├── Leather/
│       ├── pottery/
│       ├── Textiles&Weaving/
│       └── Woodwork/
└── scripts/            # Database seed scripts
    ├── seed-mongo.ts
    ├── add-candles.js
    ├── add-jewelry.js
    ├── add-leather.js
    ├── add-pottery.js
    ├── add-textiles.js
    ├── add-woodwork.js
    └── add-reviews.js
```

## Features in Detail

### User Roles

- **Customer**: Can browse, purchase, review products, and subscribe to newsletter
- **Artisan**: Can create and manage products, view sales, upload images

### Shopping Flow

1. Browse products on home or shop page (filter by 6 categories)
2. View product details with reviews and ratings
3. Add to cart with quantity selection
4. Review cart and update quantities
5. Checkout with shipping/billing info
6. Simulate PayPal payment
7. View order confirmation and history in account

### Newsletter Subscription

- Beautiful animated modal popup on successful subscription
- Email validation and API endpoint
- Persistent subscription state across pages
- Reusable subscription hook for all pages

### Product Categories & Reviews

- **6 Product Categories**: Pottery & Ceramics, Leather, Candles, Jewelry, Textiles & Weaving, Woodwork
- **62+ Products**: Fully populated catalog with images, descriptions, and prices
- **Reviews System**: Customers can leave ratings (1-5 stars) and comments
- **Average Ratings**: Automatically calculated and displayed

### Support Pages

- **Contact Page**: Contact form with business information
- **FAQs Section**: Common questions and answers
- **Shipping & Returns**: Detailed shipping and return policies
- **Privacy Policy**: Comprehensive privacy information

### Authentication

- Secure password hashing with bcrypt
- JWT token-based sessions
- Protected routes
- Role-based access control

## Development

### Build for Production

```bash
pnpm run build
pnpm start
```

### Environment Variables

Make sure to set all required environment variables in `.env.local` before running the application.

## Production Deployment

1. Set up MongoDB (Atlas cluster or managed MongoDB) on your hosting provider
2. Update environment variables with production values (set `MONGODB_URI`)
3. Set secure `JWT_SECRET`
4. Ensure TLS/SSL is enabled for your MongoDB deployment if required
5. Build and deploy the application

## License

This project is for educational purposes.
