'use strict';

/**
 * article router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::article.article', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
  routes: [
    {
      method: 'GET',
      path: '/articles/search',
      handler: 'article.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/articles/:id/analytics',
      handler: 'article.analytics',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/articles/:id/share',
      handler: 'article.trackShare',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});

