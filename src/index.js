'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Set up public permissions for articles API
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const permissions = await strapi
          .query('plugin::users-permissions.permission')
          .findMany({
            where: {
              role: publicRole.id,
              action: { $in: ['api::article.article.find', 'api::article.article.findOne'] },
            },
          });

        // Check if permissions already exist
        const findPermission = permissions.find(
          (p) => p.action === 'api::article.article.find'
        );
        const findOnePermission = permissions.find(
          (p) => p.action === 'api::article.article.findOne'
        );

        // Create find permission if it doesn't exist
        if (!findPermission) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action: 'api::article.article.find',
                role: publicRole.id,
              },
            });
          strapi.log.info('✅ Created public permission for api::article.article.find');
        }

        // Create findOne permission if it doesn't exist
        if (!findOnePermission) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action: 'api::article.article.findOne',
                role: publicRole.id,
              },
            });
          strapi.log.info('✅ Created public permission for api::article.article.findOne');
        }

        if (findPermission && findOnePermission) {
          strapi.log.info('✅ Public permissions for articles API are already configured');
        }
      } else {
        strapi.log.warn('⚠️  Public role not found. Permissions will need to be set manually.');
      }
    } catch (error) {
      strapi.log.error('❌ Error setting up public permissions:', error);
      strapi.log.warn('⚠️  Please set permissions manually in Strapi admin panel:');
      strapi.log.warn('   Settings → Users & Permissions Plugin → Roles → Public');
      strapi.log.warn('   Enable: Article → find, Article → findOne');
    }
  },
};
