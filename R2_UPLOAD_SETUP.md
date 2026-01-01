# Cloudflare R2 Upload Configuration

This document explains how to configure Strapi to upload files to Cloudflare R2 instead of the local `public/uploads` directory.

## Prerequisites

1. A Cloudflare account with R2 enabled
2. An R2 bucket created
3. R2 API credentials (Access Key ID and Secret Access Key)

## Installation

The required package `@strapi/provider-upload-aws-s3` has already been installed. This package is compatible with Cloudflare R2 since R2 uses the S3 API.

## Configuration

### 1. Get Your R2 Credentials

1. Log in to your Cloudflare dashboard
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Create a new API token with:
   - **Permissions**: Object Read & Write
   - **TTL**: Set expiration (or leave blank for no expiration)
4. Save the **Access Key ID** and **Secret Access Key**

### 2. Get Your R2 Endpoint

Your R2 endpoint URL format is:
```
https://<account-id>.r2.cloudflarestorage.com
```

You can find your account ID in the Cloudflare dashboard under **R2** → **Overview**.

### 3. Get Your R2 Public URL (Optional but Recommended)

If you've set up a custom domain or public URL for your R2 bucket, use that. Otherwise, you can use:
```
https://<bucket-name>.<account-id>.r2.cloudflarestorage.com
```

Or if you've configured a custom domain:
```
https://your-custom-domain.com
```

### 4. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_REGION=auto
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_BUCKET=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
# OR if using R2 default URL:
# R2_PUBLIC_URL=https://<bucket-name>.<account-id>.r2.cloudflarestorage.com
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `R2_ACCESS_KEY_ID` | Your R2 API Access Key ID | `abc123def456...` |
| `R2_SECRET_ACCESS_KEY` | Your R2 API Secret Access Key | `xyz789uvw012...` |
| `R2_REGION` | Region (use `auto` for R2) | `auto` |
| `R2_ENDPOINT` | R2 API endpoint URL | `https://abc123.r2.cloudflarestorage.com` |
| `R2_BUCKET` | Your R2 bucket name | `strapi-uploads` |
| `R2_PUBLIC_URL` | Public URL for accessing files | `https://cdn.yourdomain.com` |

## Configuration Files

The following files have been configured:

### `config/plugins.js`
- Changed provider from `local` to `aws-s3`
- Configured with R2-specific settings including `s3ForcePathStyle: true`

### `config/middlewares.js`
- Updated CSP headers to allow images and media from R2 public URL

## Testing the Configuration

1. Restart your Strapi server:
   ```bash
   npm run develop
   # or
   npm start
   ```

2. Log in to the Strapi admin panel

3. Navigate to **Media Library**

4. Upload a test image

5. Check that:
   - The upload succeeds without errors
   - The file URL points to your R2 bucket (not `public/uploads`)
   - The image is accessible via the public URL

## Troubleshooting

### Issue: "Access Denied" or "403 Forbidden"
- **Solution**: Verify your R2 credentials are correct and the API token has the right permissions

### Issue: "Bucket not found"
- **Solution**: Check that `R2_BUCKET` matches your exact bucket name (case-sensitive)

### Issue: Images not displaying
- **Solution**: 
  - Verify `R2_PUBLIC_URL` is correct
  - Check that your R2 bucket has public access enabled (if using public URLs)
  - Ensure CORS is configured on your R2 bucket if accessing from a different domain

### Issue: "Endpoint URL is incorrect"
- **Solution**: Verify `R2_ENDPOINT` format: `https://<account-id>.r2.cloudflarestorage.com`

## R2 Bucket CORS Configuration (if needed)

If you need to access R2 files from your frontend, you may need to configure CORS on your R2 bucket. You can do this via the Cloudflare dashboard or using the R2 API.

Example CORS configuration:
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Migrating Existing Files

If you have existing files in `public/uploads`, you'll need to migrate them to R2:

1. Use the Cloudflare dashboard to upload files directly
2. Or use a migration script to upload files programmatically
3. Update your database records to point to the new R2 URLs

## Security Best Practices

1. **Never commit `.env` file** - Keep your R2 credentials secure
2. **Use environment-specific buckets** - Separate buckets for development, staging, and production
3. **Set up R2 bucket policies** - Restrict access as needed
4. **Rotate API tokens regularly** - Update credentials periodically
5. **Use custom domains** - Set up a custom domain for your R2 bucket for better control

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Strapi Upload Plugin Documentation](https://docs.strapi.io/dev-docs/plugins/upload)
- [AWS S3 Provider for Strapi](https://github.com/strapi/strapi/tree/main/packages/providers/upload-aws-s3)


