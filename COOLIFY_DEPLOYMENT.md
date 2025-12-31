# Strapi CMS - Coolify Deployment Guide

This guide walks you through deploying the Rans Strapi CMS to Coolify step-by-step.

## Prerequisites

- ✅ Coolify instance running and accessible
- ✅ GitHub repository created (or Git repository)
- ✅ GitHub App configured in Coolify
- ✅ PostgreSQL service available in Coolify (or create new one)
- ✅ Domain/subdomain configured for Strapi (e.g., `cms.ranssolutions.com`)

## Step 1: Push Code to GitHub

```bash
cd /Users/macbookpro/Desktop/Rans/Strapi

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial Strapi CMS setup for articles"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/rans-strapi.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create PostgreSQL Service in Coolify

1. Go to your Coolify dashboard
2. Navigate to your project
3. Click **New Resource** → **PostgreSQL**
4. Configure:
   - **Service Name**: `strapi-postgresql` (or `postgresql`)
   - **Database Name**: `strapi_production`
   - **Username**: `strapi_user` (or auto-generated)
   - **Password**: (save this securely)
5. Click **Deploy**
6. Wait until status shows **"Running"**
7. **Note down the service name** - you'll need it for `DATABASE_HOST`

## Step 3: Generate Security Keys

Run these commands locally and save the outputs:

```bash
# Generate 4 APP_KEYS (run 4 times)
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Generate JWT secrets
openssl rand -base64 32  # Save as ADMIN_JWT_SECRET
openssl rand -base64 32  # Save as JWT_SECRET

# Generate salt values
openssl rand -base64 32  # Save as API_TOKEN_SALT
openssl rand -base64 32  # Save as TRANSFER_TOKEN_SALT
```

**Save Format:**
```
APP_KEYS: key1,key2,key3,key4 (comma-separated, NO SPACES)
ADMIN_JWT_SECRET: [your-generated-secret]
JWT_SECRET: [your-generated-secret]
API_TOKEN_SALT: [your-generated-salt]
TRANSFER_TOKEN_SALT: [your-generated-salt]
```

## Step 4: Create Strapi Application in Coolify

1. In Coolify, click **New Resource** → **Application**
2. **General Settings:**
   - **Name**: `Rans Strapi CMS`
   - **Build Pack**: `Nixpacks` (auto-detected)
   - **Is it a static site?**: ❌ **Unchecked**
   - **Domains**: `https://cms.yourdomain.com` (your Strapi subdomain)
   - **Base Directory**: `/` (root)
   - **Internal Port**: `1337`

3. **Source Configuration:**
   - **Source**: Your GitHub App name in Coolify
   - **Repository**: `yourusername/rans-strapi`
   - **Branch**: `main`
   - **Auto-deploy**: ✅ **Enabled** (optional)

4. **Build Configuration:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - Leave empty if Nixpacks auto-detection works

5. Click **Save**

## Step 5: Configure Environment Variables

Navigate to your Strapi application in Coolify → **Environment Variables** section.

### Server Configuration

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://cms.yourdomain.com
PROXY=true
```

### Database Configuration

Use values from your PostgreSQL service:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=postgresql
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your-actual-password-from-postgres-service
DATABASE_SSL=false
```

**Important:** `DATABASE_HOST` must match your PostgreSQL service name exactly (e.g., `postgresql` or `strapi-postgresql`).

### Security Keys

Use the keys you generated in Step 3:

```env
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-generated-salt
ADMIN_JWT_SECRET=your-generated-secret
JWT_SECRET=your-generated-secret
TRANSFER_TOKEN_SALT=your-generated-salt
```

**Critical:** `APP_KEYS` must be comma-separated with **NO SPACES** after commas.

### CORS Configuration

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
```

### Optional

```env
CRON_ENABLED=true
```

## Step 6: Deploy

1. Click **Deploy** button in Coolify
2. Monitor build logs:
   - ✅ Node.js detected
   - ✅ `npm install` completes
   - ✅ `npm run build` completes
   - ✅ Container starts
   - ✅ Status changes to **"Running"**

## Step 7: Post-Deployment Setup

### 7.1 Access Admin Panel

1. Open `https://cms.yourdomain.com/admin`
2. Create your first admin user:
   - First Name
   - Last Name
   - Email
   - Password (strong password)

### 7.2 Verify API

Test the API endpoint:

```bash
curl https://cms.yourdomain.com/api/articles
```

Expected response: `{"data":[]}` (empty array if no articles yet)

### 7.3 Configure Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Configure **Public** role:
   - Article → `find`, `findOne` (check both)
3. Configure **Writer** role (for agents):
   - Article → `create`, `find`, `findOne`, `update` (own articles only)
4. Configure **Editor** role (for admins):
   - Article → All permissions (create, find, findOne, update, delete, publish)

### 7.4 Create Test Article

1. Go to **Content Manager** → **Article**
2. Click **Create new entry**
3. Fill in:
   - Title: "Test Article"
   - Description: "This is a test article"
   - Content: "Test content"
   - Category: Select one
4. Click **Save**
5. Click **Publish**

### 7.5 Test API Again

```bash
curl https://cms.yourdomain.com/api/articles
```

Should return your test article.

## Troubleshooting

### Services Stay "Exited"

**Check:**
1. All environment variables are set correctly
2. `APP_KEYS` format is correct (comma-separated, no spaces)
3. Database credentials are correct
4. PostgreSQL service is running

**Solution:**
- Check logs in Coolify
- Verify each environment variable
- Restart services

### Database Connection Error

**Check:**
1. `DATABASE_HOST` matches PostgreSQL service name exactly
2. Database credentials are correct
3. PostgreSQL service is running

**Solution:**
- Verify service name in Coolify
- Check PostgreSQL service logs
- Test connection manually if possible

### Build Fails

**Check:**
1. Node.js version compatibility (should be 18+)
2. All dependencies in `package.json`
3. Build logs for specific errors

**Solution:**
- Check `package.json` engines field
- Verify Node.js 18+ is available
- Review build logs for specific errors

### Admin Panel Not Accessible

**Check:**
1. `PUBLIC_URL` matches your domain
2. Port is exposed correctly (internal port 1337)
3. Domain is configured in Coolify

**Solution:**
- Verify `PUBLIC_URL` environment variable
- Check port mapping
- Verify domain configuration

## Success Criteria

✅ **Deployment is successful when:**

1. ✅ Strapi service shows "Running" status
2. ✅ PostgreSQL service shows "Running" status
3. ✅ Admin panel accessible at `/admin`
4. ✅ API endpoint returns data: `/api/articles`
5. ✅ No errors in application logs
6. ✅ First admin user created
7. ✅ Test article created and published

## Quick Reference

### Important URLs

- **Admin Panel**: `https://cms.yourdomain.com/admin`
- **API Base**: `https://cms.yourdomain.com/api`
- **Articles API**: `https://cms.yourdomain.com/api/articles`

### Important Commands

```bash
# Local development
npm run develop

# Production build
npm run build
npm start

# Generate security keys
openssl rand -base64 32
```

## Next Steps

After successful deployment:

1. Configure user roles and permissions
2. Create content types if needed
3. Set up API tokens for frontend
4. Configure media library/CDN
5. Set up monitoring and backups

---

**Last Updated:** 2024  
**Status:** Ready for Deployment

