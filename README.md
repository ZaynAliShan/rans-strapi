# Rans Strapi CMS - Articles Module

Strapi headless CMS for managing articles, blog posts, and content for the Rans platform.

## Prerequisites

- Node.js 18.x or 20.x (20.x recommended - LTS)
- PostgreSQL database
- npm 6+ or yarn

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Generate Security Keys

Generate all required security keys:

```bash
# Generate 4 APP_KEYS (run 4 times)
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Generate JWT secrets
openssl rand -base64 32  # For ADMIN_JWT_SECRET
openssl rand -base64 32  # For JWT_SECRET

# Generate salt values
openssl rand -base64 32  # For API_TOKEN_SALT
openssl rand -base64 32  # For TRANSFER_TOKEN_SALT
```

Add these to your `.env` file:
- `APP_KEYS`: Comma-separated (no spaces): `key1,key2,key3,key4`
- `ADMIN_JWT_SECRET`: Your generated secret
- `JWT_SECRET`: Your generated secret
- `API_TOKEN_SALT`: Your generated salt
- `TRANSFER_TOKEN_SALT`: Your generated salt

### 4. Configure Database

Update `.env` with your PostgreSQL credentials:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_articles
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
```

### 5. Start Development Server

```bash
npm run develop
```

The admin panel will be available at: `http://localhost:1337/admin`

### 6. Create First Admin User

On first run, you'll be prompted to create an admin user.

## Content Types

### Article

The Article content type includes:
- **title**: Article title (required, unique)
- **slug**: URL-friendly identifier (auto-generated from title)
- **description**: Short description/excerpt (required, max 500 chars)
- **content**: Full article content in rich text (required)
- **heroImage**: Featured image
- **category**: Enum (News, Buying, Selling, Trends, Engineering, Sustainability)
- **tags**: JSON array of tags
- **author**: Relation to user
- **publishedAt**: Publication date
- **viewCount**: View counter (auto-incremented)
- **featured**: Boolean flag
- **seo**: SEO component (meta title, description, keywords, OG image)
- **relatedArticles**: Many-to-many relation to other articles
- **readingTime**: Estimated reading time in minutes (auto-calculated)

### SEO Component

Reusable SEO component with:
- **metaTitle**: SEO title (max 60 chars)
- **metaDescription**: SEO description (max 160 chars)
- **keywords**: SEO keywords
- **ogImage**: Open Graph image

## Role-Based Access Control

### Roles

1. **Admin** (`admin`)
   - Full access: create, edit, publish, delete any article
   - Can manage all articles

2. **Agent** (`agent`)
   - Can create and edit own articles
   - Articles remain in draft until admin publishes
   - Cannot publish articles

3. **Customer** (`customer`)
   - Read-only access
   - Can only view published articles

### Permission Configuration

Permissions are configured in the Strapi admin panel:
- Settings → Users & Permissions Plugin → Roles

## API Endpoints

### Public Endpoints

- `GET /api/articles` - List all published articles
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles?filters[slug][$eq]=:slug` - Get article by slug

### Protected Endpoints (Require Authentication)

- `POST /api/articles` - Create article (admin, agent)
- `PUT /api/articles/:id` - Update article (admin, agent - own only)
- `DELETE /api/articles/:id` - Delete article (admin only)

### Query Parameters

- `populate=*` - Populate all relations
- `pagination[page]=1` - Page number
- `pagination[pageSize]=10` - Items per page
- `sort[0]=publishedAt:desc` - Sort by published date
- `filters[category][$eq]=News` - Filter by category

## Production Build

```bash
npm run build
npm start
```

## Deployment to Coolify

See `COOLIFY_DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
Strapi/
├── config/              # Configuration files
│   ├── database.js     # Database configuration
│   ├── server.js        # Server configuration
│   ├── middlewares.js  # Middleware configuration
│   ├── plugins.js       # Plugin configuration
│   └── admin.js         # Admin panel configuration
├── src/
│   ├── api/            # API routes
│   │   └── article/    # Article content type
│   ├── components/     # Reusable components
│   │   └── shared/     # Shared components (SEO)
│   └── index.js         # Bootstrap file
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── README.md           # This file
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### CORS Errors

- Update `CORS_ORIGIN` in `.env` with your frontend URL
- Restart the server after changing environment variables

### Build Errors

- Ensure Node.js version is 18.x or 20.x
- Delete `node_modules` and `.cache`, then reinstall
- Check for missing environment variables

## Node.js Version

**Required:** Node.js 18.x or 20.x (20.x LTS recommended)

Strapi 4.x officially supports Node.js versions 18 and 20. Node.js 20 is the current LTS version and is recommended for production use.

## Support

For issues or questions, refer to:
- [Strapi Documentation](https://docs.strapi.io)
- [Coolify Documentation](https://coolify.io/docs)
- See `NODE24_COMPATIBILITY.md` for Node.js 24 compatibility notes

