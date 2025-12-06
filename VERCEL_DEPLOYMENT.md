# Vercel Deployment Guide for Handcrafted Haven

## Prerequisites

1. GitHub repository connected to Vercel
2. MongoDB Atlas cluster (or other MongoDB hosting)
3. Vercel account

## Step-by-Step Deployment

### 1. Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### Required Variables:

| Variable Name     | Description               | Example                                                         |
| ----------------- | ------------------------- | --------------------------------------------------------------- |
| `MONGODB_URI`     | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/handcrafted-haven` |
| `JWT_SECRET`      | Secret key for JWT tokens | `your-super-secret-jwt-key-min-32-chars`                        |
| `NEXTAUTH_URL`    | Your production URL       | `https://your-app.vercel.app`                                   |
| `NEXTAUTH_SECRET` | NextAuth secret key       | `your-nextauth-secret-key`                                      |

#### Optional (for Cloudinary uploads):

| Variable Name                          | Description                 |
| -------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | Your Cloudinary cloud name  |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your unsigned upload preset |

**Important:** Set these for **Production**, **Preview**, and **Development** environments.

### 2. Configure MongoDB Atlas

1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Confirm

> **Why?** Vercel uses dynamic IPs, so you need to allow all IPs for the connection to work.

### 3. Update MongoDB Connection String

Make sure your `MONGODB_URI` includes:

- Username and password (URL-encoded if they contain special characters)
- Cluster address
- Database name
- Connection options

**Example:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/handcrafted-haven?retryWrites=true&w=majority
```

### 4. Common Issues and Solutions

#### Issue 1: "500 Internal Server Error"

**Cause:** Environment variables not set or MongoDB connection failing

**Solution:**

1. Check that all environment variables are set in Vercel
2. Test MongoDB connection string locally first
3. Check Vercel function logs: Project → Deployments → Click deployment → Functions tab

#### Issue 2: "Application Error" or Blank Page

**Cause:** Build errors or missing dependencies

**Solution:**

1. Check build logs in Vercel deployment
2. Run `pnpm build` locally to catch errors
3. Make sure all dependencies are in `package.json` (not just devDependencies)

#### Issue 3: API Routes Returning 404

**Cause:** API routes not being deployed or incorrect paths

**Solution:**

1. Ensure files are in `src/pages/api/` directory
2. Check that files are committed to Git
3. Redeploy from Vercel dashboard

#### Issue 4: Images Not Loading

**Cause:** Next.js Image component needs domain configuration

**Solution:**
Add to `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ["res.cloudinary.com"], // if using Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
```

#### Issue 5: "Module not found" Errors

**Cause:** Case-sensitive imports on Vercel (Linux) vs local (Windows)

**Solution:**

- Ensure all imports match exact file names and casing
- Example: `import Header from '../components/Header'` (not `header`)

### 5. Testing Deployment

After deployment:

1. **Test Home Page:** Visit `https://your-app.vercel.app`
2. **Test API Routes:** Try `/api/auth/me`, `/api/products`
3. **Check MongoDB:** Log in and see if data persists
4. **Test Product Upload:** If you're a seller, try uploading a product
5. **Check Browser Console:** Look for JavaScript errors

### 6. View Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments**
4. Click on the latest deployment
5. Check **Build Logs** and **Function Logs** tabs

### 7. Debugging Steps

If the site isn't working:

```bash
# 1. Clone and test locally first
git clone <your-repo>
cd handcrafted-haven
pnpm install

# 2. Set up .env.local with your production values
echo "MONGODB_URI=your-production-mongodb-uri" > .env.local
echo "JWT_SECRET=your-jwt-secret" >> .env.local

# 3. Test build
pnpm build

# 4. Test production mode locally
pnpm start
```

If it works locally but not on Vercel, the issue is likely:

- Environment variables in Vercel
- MongoDB Atlas network access
- Missing build files in Git

### 8. Redeploy

After making changes:

**Option 1 - Push to Git:**

```bash
git add .
git commit -m "Fix deployment issues"
git push origin main
```

Vercel will automatically redeploy.

**Option 2 - Manual Redeploy:**

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click three dots on latest deployment
4. Click **Redeploy**

## Vercel-Specific Optimizations

### Add Headers for Better Performance

Update `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
```

### Enable Analytics

1. Go to project in Vercel
2. Click **Analytics** tab
3. Enable Web Analytics
4. Monitor performance

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] MongoDB Atlas allows Vercel IPs (0.0.0.0/0)
- [ ] `pnpm build` runs without errors locally
- [ ] Test all major features in preview deployment
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up monitoring/error tracking (optional)

## Getting Help

1. **Vercel Logs:** Check function and build logs
2. **MongoDB Logs:** Check Atlas logs for connection issues
3. **Browser DevTools:** Check Network and Console tabs
4. **Vercel Support:** Contact via dashboard if needed

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs <deployment-url>

# Pull environment variables locally
vercel env pull
```

## Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
