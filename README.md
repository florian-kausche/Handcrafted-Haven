# Handcrafted Haven - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js, TypeScript, and PostgreSQL for handcrafted products.

## Features

### Frontend

- ✅ Home page with featured products
- ✅ Shop page with category filtering and search
- ✅ Product detail pages with reviews
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ User authentication (login/register)
- ✅ User account dashboard with order history
- ✅ Seller dashboard for artisans
- ✅ About and Contact pages
- ✅ Responsive design
- ✅ Professional UI/UX

### Backend

- ✅ PostgreSQL database with full schema
- ✅ RESTful API routes
- ✅ JWT-based authentication
- ✅ User management
- ✅ Product management
- ✅ Cart management
- ✅ Order processing
- ✅ Secure password hashing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with CSS Variables
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm (install with `npm install -g pnpm`)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
pnpm install
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
createdb handcrafted_haven
```

Or using psql:

```sql
CREATE DATABASE handcrafted_haven;
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=handcrafted_haven
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 4. Initialize Database Schema

The database schema will be automatically created on first API call, or you can run:

```bash
# Create a script to initialize (optional)
npx ts-node scripts/init-db.ts
```

### 5. Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes the following tables:

- **users** - User accounts (customers and artisans)
- **artisans** - Artisan profiles
- **products** - Product catalog
- **cart_items** - Shopping cart items
- **orders** - Order records
- **order_items** - Order line items
- **reviews** - Product reviews

## API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get product by ID

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## Project Structure

```
├── src/
│   ├── components/      # Reusable React components
│   ├── contexts/        # React contexts (Auth, Cart)
│   ├── lib/            # Utilities (DB, Auth, API)
│   ├── pages/          # Next.js pages and API routes
│   │   ├── api/        # API endpoints
│   │   ├── shop.tsx    # Shop page
│   │   ├── product/    # Product detail pages
│   │   ├── cart.tsx    # Cart page
│   │   ├── checkout.tsx # Checkout page
│   │   ├── account.tsx # User account
│   │   ├── login.tsx   # Login page
│   │   ├── register.tsx # Register page
│   │   └── ...
│   └── styles/         # Global styles
├── public/             # Static assets
└── scripts/            # Utility scripts
```

## Features in Detail

### User Roles

- **Customer**: Can browse, purchase, and review products
- **Artisan**: Can create and manage products, view sales

### Shopping Flow

1. Browse products on home or shop page
2. View product details
3. Add to cart
4. Review cart
5. Checkout with shipping/billing info
6. Place order
7. View order history in account

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

1. Set up PostgreSQL database on your hosting provider
2. Update environment variables with production values
3. Set secure JWT_SECRET
4. Enable SSL for database connection if required
5. Build and deploy the application

## License

This project is for educational purposes.
