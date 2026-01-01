module.exports = ({ env }) => ({
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('R2_ACCESS_KEY_ID'),
            secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
          },
          region: env('R2_REGION', 'auto'),
          endpoint: env('R2_ENDPOINT'), // Cloudflare R2 endpoint
          forcePathStyle: true, // Required for R2 (note: not s3ForcePathStyle)
        },
        params: {
          Bucket: env('R2_BUCKET_NAME'),
          ACL: 'public-read', // Optional: set ACL for uploaded files
        },
        baseUrl: env('R2_PUBLIC_URL'), // Public URL for accessing files
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      sizeLimit: 100 * 1024 * 1024, // 100MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
});

