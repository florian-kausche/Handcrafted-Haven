# Handcrafted Haven - Complete Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up MongoDB

You can use a local MongoDB instance or MongoDB Atlas (recommended). For Atlas, create a free cluster and copy the connection string (URI).

If using a local MongoDB server, ensure `mongod` is running. By default MongoDB listens on `mongodb://localhost:27017`.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and set your MongoDB connection and JWT secret:

```env
MONGODB_URI="your-mongodb-connection-uri"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 4. Initialize / Seed Database

The Mongoose models will ensure indexes are created on connection. To seed sample data, run:

```bash
pnpm run seed:mongo
```

Or use the TypeScript seeder:

```bash
npx ts-node scripts/seed-db.ts
```

### 5. Start Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema (MongoDB Collections)

The application uses Mongoose models which map to MongoDB collections:

- **users** - User accounts (customers and artisans)
- **artisans** - Artisan profiles linked to users
- **products** - Product catalog
- **cartitems** - Shopping cart items
- **orders** - Order records
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
- Database integration (MongoDB via Mongoose)

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

1. Verify MongoDB is running (local) or your Atlas cluster is reachable:

   ```bash
   # Windows (services)
   Get-Service mongod*

   # Linux/Mac
   sudo systemctl status mongod
   ```

2. Check your `.env.local` `MONGODB_URI` is correct and Atlas IP whitelist allows your client

3. Test connection with the mongo shell or `mongosh` (if installed):
   ```bash
   mongosh "your-mongodb-connection-uri"
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

1. Set up a MongoDB deployment (Atlas cluster or managed MongoDB) on your hosting provider
2. Update `.env.local` with a production `MONGODB_URI` and secure secrets
3. Set a strong, unique `JWT_SECRET` (minimum 32 characters)
4. Ensure your MongoDB deployment uses TLS/SSL as required by your provider
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

---

# Debugging Information

For debugging purposes, you can enable detailed logging by setting the `DEBUG` environment variable. This will print additional information to the console, which can help in identifying issues.

## Enabling Debug Logs

1. Stop the development server if it's running
2. Set the `DEBUG` environment variable:

   - On macOS/Linux:

     ```bash
     export DEBUG=app:*

     # To persist across sessions, add to ~/.bashrc or ~/.zshrc
     echo 'export DEBUG=app:*' >> ~/.bashrc
     ```

   - On Windows (Command Prompt):

     ```cmd
     set DEBUG=app:*

     # To persist, set it in System Properties > Environment Variables
     ```

   - On Windows (PowerShell):

     ```powershell
     $env:DEBUG="app:*"

     # To persist, add to your PowerShell profile script
     ```

3. Restart the development server:

   ```bash
   pnpm run dev
   ```

4. Reproduce the issue or run the tests
5. Check the console output for debug logs

## Common Debug Logs

- `[DEBUG][auth/register] headers:` - Logs request headers for authentication routes
- `[DEBUG][auth/register] body keys:` - Logs keys of the request body for authentication routes
- `[DEBUG][auth/login] user found:` - Logs if user is found during login
- `[DEBUG][auth/login] success for user id:` - Logs successful login with user ID
- `[DEBUG][auth/register] existing user:` - Logs if an existing user is found during registration
- `[DEBUG][auth/register] created user id:` - Logs the creation of a new user with their ID and role
- `[DEBUG][auth/me] headers:` - Logs request headers for auth/me route
- `[DEBUG][auth/me] authenticated user:` - Logs if user is authenticated, showing user ID, email, and role

## Disabling Debug Logs

To disable debug logs, unset the `DEBUG` environment variable and restart the server:

- On macOS/Linux:

  ```bash
  unset DEBUG
  ```

- On Windows (Command Prompt):

  ```cmd
  set DEBUG=
  ```

- On Windows (PowerShell):

  ```powershell
  $env:DEBUG=""
  ```
