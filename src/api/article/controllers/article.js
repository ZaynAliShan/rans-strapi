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
    
    // Check if this is a Content Manager request (admin panel)
    const isAdminPanel = ctx.request.url?.includes('/content-manager') || 
                         ctx.request.url?.includes('/admin');
    
    const entity = await strapi.entityService.findOne('api::article.article', id, {
      populate: isAdminPanel ? ['author', 'heroImage', 'seo'] : '*',
    });
    
    if (!entity) {
      return ctx.notFound('Article not found');
    }
    
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
    
    // Only increment view count for public API calls (not admin panel)
    if (!isAdminPanel && entity.publishedAt) {
      // Increment view count asynchronously to not block the response
      strapi.entityService.update('api::article.article', id, {
        data: {
          viewCount: (entity.viewCount || 0) + 1,
        },
      }).catch(err => {
        // Log error but don't fail the request
        strapi.log.error('Failed to increment view count:', err);
      });
    }
    
    return { data: entity };
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

  /**
   * Search articles by query string
   * Searches across title, description, content, and tags
   * GET /api/articles/search?q=search+term
   */
  async search(ctx) {
    const { q } = ctx.query;
    const { user } = ctx.state;
    
    if (!q || q.trim().length === 0) {
      return ctx.badRequest('Search query is required');
    }
    
    const searchTerm = q.trim();
    
    // Build filters for published articles (unless admin)
    const filters = {
      $or: [
        { title: { $containsi: searchTerm } },
        { description: { $containsi: searchTerm } },
        { content: { $containsi: searchTerm } },
      ],
    };
    
    // Only show published articles for non-admin users
    if (!user || user.role?.type !== 'admin') {
      filters.publishedAt = { $notNull: true };
    }
    
    // Handle tag search (tags is JSON, so we need to search differently)
    // Note: Strapi's JSON field search is limited, so we'll search in title/description/content
    // For better tag search, consider using a relation or separate tag entity
    
    const articles = await strapi.entityService.findMany('api::article.article', {
      filters,
      populate: ['author', 'heroImage', 'seo', 'category'],
      sort: { publishedAt: 'desc' },
      pagination: {
        page: ctx.query.pagination?.page || 1,
        pageSize: ctx.query.pagination?.pageSize || 10,
      },
    });
    
    return { data: articles, meta: { query: searchTerm } };
  },

  /**
   * Get analytics for a specific article
   * GET /api/articles/:id/analytics
   */
  async analytics(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to view analytics');
    }
    
    const entity = await strapi.entityService.findOne('api::article.article', id, {
      populate: ['author', 'analytics'],
    });
    
    if (!entity) {
      return ctx.notFound('Article not found');
    }
    
    // Check permissions: admin can see all, author can see own
    const userRole = user.role?.type;
    const isAdmin = userRole === 'admin';
    const isAuthor = entity.author?.id === user.id;
    
    if (!isAdmin && !isAuthor) {
      return ctx.forbidden('You can only view analytics for your own articles');
    }
    
    // Build analytics response
    const analytics = {
      articleId: entity.id,
      articleTitle: entity.title,
      viewCount: entity.viewCount || 0,
      socialShares: entity.socialShares || {
        facebook: 0,
        twitter: 0,
        linkedin: 0,
        whatsapp: 0,
        email: 0,
        total: 0,
      },
      analytics: entity.analytics || {
        uniqueViews: 0,
        totalViews: 0,
        averageTimeOnPage: 0,
        bounceRate: 0,
        engagementScore: 0,
      },
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    
    return { data: analytics };
  },

  /**
   * Track social share for an article
   * POST /api/articles/:id/share
   * Body: { platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' }
   */
  async trackShare(ctx) {
    const { id } = ctx.params;
    const { platform } = ctx.request.body;
    
    const validPlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'];
    
    if (!platform || !validPlatforms.includes(platform)) {
      return ctx.badRequest(`Platform must be one of: ${validPlatforms.join(', ')}`);
    }
    
    const entity = await strapi.entityService.findOne('api::article.article', id);
    
    if (!entity) {
      return ctx.notFound('Article not found');
    }
    
    // Only track shares for published articles
    if (!entity.publishedAt) {
      return ctx.badRequest('Cannot share unpublished articles');
    }
    
    // Get current shares or initialize
    const currentShares = entity.socialShares || {
      facebook: 0,
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
      email: 0,
      total: 0,
    };
    
    // Increment the specific platform and total
    currentShares[platform] = (currentShares[platform] || 0) + 1;
    currentShares.total = (currentShares.total || 0) + 1;
    
    // Update the article
    await strapi.entityService.update('api::article.article', id, {
      data: {
        socialShares: currentShares,
      },
    });
    
    return { 
      data: { 
        platform, 
        count: currentShares[platform],
        total: currentShares.total,
      },
    };
  },
}));
