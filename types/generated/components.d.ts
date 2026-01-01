import type { Attribute, Schema } from '@strapi/strapi';

export interface SharedAnalytics extends Schema.Component {
  collectionName: 'components_shared_analytics';
  info: {
    description: 'Analytics metrics for articles';
    displayName: 'Analytics';
  };
  attributes: {
    averageTimeOnPage: Attribute.Decimal & Attribute.DefaultTo<0>;
    bounceRate: Attribute.Decimal & Attribute.DefaultTo<0>;
    engagementScore: Attribute.Decimal & Attribute.DefaultTo<0>;
    lastUpdated: Attribute.DateTime;
    totalViews: Attribute.Integer & Attribute.DefaultTo<0>;
    uniqueViews: Attribute.Integer & Attribute.DefaultTo<0>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata for articles';
    displayName: 'SEO';
  };
  attributes: {
    keywords: Attribute.String;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Attribute.Media<'images'>;
    ogTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogType: Attribute.Enumeration<['article', 'website']> &
      Attribute.DefaultTo<'article'>;
    twitterCard: Attribute.Enumeration<['summary', 'summary_large_image']> &
      Attribute.DefaultTo<'summary_large_image'>;
    twitterDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    twitterImage: Attribute.Media<'images'>;
    twitterTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.analytics': SharedAnalytics;
      'shared.seo': SharedSeo;
    }
  }
}
