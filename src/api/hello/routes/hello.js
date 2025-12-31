'use strict';

/**
 * hello router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/hello',
      handler: 'hello.index',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

