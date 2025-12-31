module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
  path: '/admin', // Explicitly set to override any ADMIN_PATH env var issues
});
  