'use strict';

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Auto-generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Calculate reading time (approximate: 200 words per minute)
    if (data.content) {
      const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      data.readingTime = Math.ceil(wordCount / 200);
    }
    
    // Set publishedAt when status changes to published
    if (event.params.data.publishedAt === null && data.publishedAt) {
      data.publishedAt = new Date();
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    
    // Recalculate reading time on content update
    if (data.content) {
      const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      data.readingTime = Math.ceil(wordCount / 200);
    }
  },

  // REMOVED afterFindOne - this was causing performance issues
  // View count should be incremented in the controller, not lifecycle hook
  // This hook was firing on every Content Manager request
};
