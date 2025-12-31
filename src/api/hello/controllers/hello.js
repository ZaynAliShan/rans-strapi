'use strict';

/**
 * hello controller
 */

module.exports = {
  async index(ctx) {
    ctx.body = {
      message: 'Hello World from Rans Strapi CMS!',
      status: 'success',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  },
};

