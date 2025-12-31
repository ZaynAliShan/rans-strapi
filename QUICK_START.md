# Quick Start Guide - Strapi CMS Setup

This is a simplified checklist to get your Strapi CMS running quickly.

## Local Development (5 minutes)

### 1. Install Dependencies

```bash
cd /Users/macbookpro/Desktop/Rans/Strapi
npm install
```

### 2. Generate Security Keys

Run these commands and **save the output**:

```bash
# Generate 4 APP_KEYS
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Generate secrets
openssl rand -base64 32  # ADMIN_JWT_SECRET
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # API_TOKEN_SALT
openssl rand -base64 32  # TRANSFER_TOKEN_SALT
```

### 3. Create .env File

```bash
cp .env.example .env
```

Edit `.env` and add:
- Your generated security keys
- Database credentials (use SQLite for local dev or PostgreSQL)

**For SQLite (quick start):**
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**For PostgreSQL:**
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_articles
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
```

### 4. Start Development Server

```bash
npm run develop
```

### 5. Create Admin User

1. Open `http://localhost:1337/admin`
2. Fill in the registration form
3. Create your first admin account

### 6. Test API

```bash
curl http://localhost:1337/api/hello
```

Should return:
```json
{
  "message": "Hello World from Rans Strapi CMS!",
  "status": "success",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## Create Your First Article

1. Go to **Content Manager** → **Article**
2. Click **Create new entry**
3. Fill in:
   - Title: "Welcome to Rans Articles"
   - Description: "This is our first article"
   - Content: "Full article content here..."
   - Category: Select one (e.g., "News")
4. Click **Save**
5. Click **Publish**

## Test Article API

```bash
curl http://localhost:1337/api/articles
```

Should return your article in the response.

## Configure Permissions

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **Public** role
3. Under **Article**, check:
   - ✅ `find`
   - ✅ `findOne`
4. Click **Save**

Now your articles are accessible via the public API!

## Next Steps

- See `README.md` for detailed documentation
- See `COOLIFY_DEPLOYMENT.md` for production deployment
- Configure CORS for your frontend

## Troubleshooting

**Port already in use?**
- Change `PORT=1337` to another port in `.env`

**Database errors?**
- For SQLite: Ensure `.tmp` directory exists
- For PostgreSQL: Verify database exists and credentials are correct

**Build errors?**
- Delete `node_modules` and `.cache`, then `npm install` again
- Check Node.js version: `node --version` (should be 18+)

