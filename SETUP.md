# Handcrafted Haven - Complete Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Using psql
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE handcrafted_haven;

# Exit psql
\q
```

#### Option B: Using createdb command
```bash
createdb handcrafted_haven
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=handcrafted_haven
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_SSL=false

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 4. Initialize Database Schema

The database schema will be automatically created when you make your first API call. Alternatively, you can manually initialize it by running:

```bash
# Make sure your .env.local is configured first
npx ts-node scripts/init-db.ts
```

### 5. Start Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

The application automatically creates these tables:

- **users** - User accounts (customers and artisans)
- **artisans** - Artisan profiles linked to users
- **products** - Product catalog
- **cart_items** - Shopping cart items
- **orders** - Order records
- **order_items** - Order line items
- **reviews** - Product reviews and ratings

## Testing the Application

### 1. Create a Test User

1. Go to `/register`
2. Fill in the registration form
3. You'll be automatically logged in

### 2. Create an Artisan Account

1. Go to `/register?role=artisan`
2. Register as an artisan
3. Access seller dashboard at `/seller`

### 3. Test Shopping Flow

1. Browse products on `/shop` or home page
2. Click on a product to view details
3. Add products to cart
4. Go to `/cart` to review items
5. Proceed to `/checkout`
6. Fill in shipping/billing info
7. Place order
8. View order history in `/account`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (query params: category, featured, search, artisan_id)
- `GET /api/products/[id]` - Get product by ID with reviews

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart (body: { productId, quantity })
- `DELETE /api/cart` - Remove item from cart (body: { productId })

### Orders
- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create new order (body: { shippingAddress, billingAddress, paymentMethod })

## Features Implemented

✅ **Frontend Pages:**
- Home page with featured products
- Shop page with filtering and search
- Product detail pages
- Shopping cart
- Checkout process
- User login/register
- User account dashboard
- Seller dashboard
- About page
- Contact page

✅ **Backend API:**
- User authentication (JWT-based)
- Product management
- Cart management
- Order processing
- Database integration (PostgreSQL)

✅ **Features:**
- User roles (customer/artisan)
- Shopping cart persistence
- Order history
- Product reviews system
- Search and filtering
- Responsive design
- Secure password hashing

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Check your `.env.local` credentials match your PostgreSQL setup

3. Test connection:
   ```bash
   psql -U postgres -d handcrafted_haven
   ```

### Build Errors

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   pnpm run build
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### API Errors

1. Check database is initialized (tables exist)
2. Verify environment variables are set correctly
3. Check browser console and server logs for errors

## Production Deployment

1. Set up PostgreSQL database on your hosting provider
2. Update `.env.local` with production database credentials
3. Set a strong, unique `JWT_SECRET` (minimum 32 characters)
4. Enable SSL for database if required (`DB_SSL=true`)
5. Build the application:
   ```bash
   pnpm run build
   pnpm start
   ```

## Next Steps

- Add product images to `/public/assets/`
- Seed database with sample products
- Configure email service for order confirmations
- Add payment gateway integration (Stripe, PayPal, etc.)
- Implement product image uploads
- Add admin dashboard
- Implement product reviews submission
- Add email notifications

