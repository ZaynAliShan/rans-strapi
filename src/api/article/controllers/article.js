'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    // Only return published articles for non-admin users
    const { user } = ctx.state;
    
    // Map main app roles to Strapi permissions
    // admin = can see all, agent/customer = only published
    if (!user || user.role?.type !== 'admin') {
      ctx.query.filters = {
        ...ctx.query.filters,
        publishedAt: { $notNull: true },
      };
    }
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    const entity = await strapi.entityService.findOne('api::article.article', id, {
      populate: '*',
    });
    
    // Check if article is published or user has permission
    // admin can see all, agent can see own drafts, customer/public only published
    if (!entity.publishedAt) {
      if (!user) {
        return ctx.unauthorized('Article not found or not published');
      }
      const isAdmin = user.role?.type === 'admin';
      const isAuthor = entity.author?.id === user.id;
      if (!isAdmin && !isAuthor) {
        return ctx.unauthorized('Article not found or not published');
      }
    }
    
    return super.findOne(ctx);
  },

  async create(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to create articles');
    }
    
    // Only admin and agent can create articles
    const userRole = user.role?.type;
    if (userRole !== 'admin' && userRole !== 'agent') {
      return ctx.forbidden('Only admins and agents can create articles');
    }
    
    // Set author to current user
    ctx.request.body.data.author = user.id;
    
    // Agents can only create drafts (cannot publish)
    if (userRole === 'agent') {
      ctx.request.body.data.publishedAt = null;
    }
    
    return super.create(ctx);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    const entity = await strapi.entityService.findOne('api::article.article', id);
    
    if (!entity) {
      return ctx.notFound('Article not found');
    }
    
    const userRole = user?.role?.type;
    const isAdmin = userRole === 'admin';
    const isAuthor = entity.author?.id === user?.id;
    
    // Agents can only update their own articles
    if (userRole === 'agent' && !isAuthor) {
      return ctx.forbidden('You can only edit your own articles');
    }
    
    // Customers cannot update articles
    if (userRole === 'customer') {
      return ctx.forbidden('Customers cannot edit articles');
    }
    
    // Agents cannot publish articles (only admins can)
    if (userRole === 'agent' && ctx.request.body.data.publishedAt) {
      return ctx.forbidden('Agents cannot publish articles. Please submit for review.');
    }
    
    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to delete articles');
    }
    
    const userRole = user.role?.type;
    
    // Only admins can delete articles
    if (userRole !== 'admin') {
      return ctx.forbidden('Only admins can delete articles');
    }
    
    return super.delete(ctx);
  },
}));

