// Contentful TypeScript type definitions

export interface ContentfulSys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  contentType?: {
    sys: {
      id: string;
      linkType: string;
      type: string;
    };
  };
  space?: {
    sys: {
      id: string;
      linkType: string;
      type: string;
    };
  };
  environment?: {
    sys: {
      id: string;
      linkType: string;
      type: string;
    };
  };
}

export interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface ContentfulEntry<T = Record<string, any>> {
  sys: ContentfulSys;
  fields: T;
}

// Common field types
export interface ContentfulTextField {
  'en-US': string;
  [locale: string]: string;
}

export interface ContentfulRichTextField {
  'en-US': {
    nodeType: string;
    content: Array<{
      nodeType: string;
      content?: Array<{
        nodeType: string;
        value: string;
        marks?: Array<{
          type: string;
        }>;
      }>;
      data?: Record<string, any>;
    }>;
  };
  [locale: string]: any;
}

export interface ContentfulAssetField {
  'en-US': ContentfulAsset;
  [locale: string]: ContentfulAsset;
}

export interface ContentfulAssetArrayField {
  'en-US': ContentfulAsset[];
  [locale: string]: ContentfulAsset[];
}

export interface ContentfulEntryField<T = any> {
  'en-US': ContentfulEntry<T>;
  [locale: string]: ContentfulEntry<T>;
}

export interface ContentfulEntryArrayField<T = any> {
  'en-US': ContentfulEntry<T>[];
  [locale: string]: ContentfulEntry<T>[];
}

// Homepage Content Types
export interface Homepage {
  title: ContentfulTextField;
  heroSection: ContentfulEntryField<HeroSection>;
  missionSection: ContentfulEntryField<MissionSection>;
  challengesSection: ContentfulEntryField<ChallengesSection>;
  platformSection: ContentfulEntryField<PlatformSection>;
  businessImpactSection: ContentfulEntryField<BusinessImpactSection>;
  productSuiteSection: ContentfulEntryField<ProductSuiteSection>;
  testimonialsSection: ContentfulEntryField<TestimonialsSection>;
  certificationsSection: ContentfulEntryField<CertificationsSection>;
  contactSection: ContentfulEntryField<ContactSection>;
}

export interface HeroSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  subtitle: ContentfulTextField;
  description: ContentfulTextField;
  primaryButtonText: ContentfulTextField;
  secondaryButtonText: ContentfulTextField;
}

export interface MissionSection {
  title: ContentfulTextField;
  description: ContentfulTextField;
  comment: ContentfulTextField;
}

export interface ChallengesSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  description: ContentfulTextField;
  challenges: ContentfulEntryArrayField<Challenge>;
}

export interface Challenge {
  title: ContentfulTextField;
  description: ContentfulTextField;
}

export interface PlatformSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  description: ContentfulTextField;
  features: ContentfulEntryArrayField<PlatformFeature>;
}

export interface PlatformFeature {
  title: ContentfulTextField;
  description: ContentfulTextField;
  details?: ContentfulTextField;
  codeExample?: ContentfulTextField;
}

export interface BusinessImpactSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  description: ContentfulTextField;
  metrics: ContentfulEntryArrayField<Metric>;
}

export interface Metric {
  value: ContentfulTextField;
  title: ContentfulTextField;
  description: ContentfulTextField;
}

export interface ProductSuiteSection {
  title: ContentfulTextField;
  products: ContentfulEntryArrayField<Product>;
}

export interface Product {
  name: ContentfulTextField;
  tagline: ContentfulTextField;
  description: ContentfulTextField;
  color: ContentfulTextField;
  features: ContentfulEntryArrayField<ProductFeature>;
  demoContent: ContentfulTextField;
}

export interface ProductFeature {
  title: ContentfulTextField;
  description: ContentfulTextField;
}

export interface TestimonialsSection {
  title: ContentfulTextField;
  testimonials: ContentfulEntryArrayField<Testimonial>;
}

export interface Testimonial {
  quote: ContentfulTextField;
  authorName: ContentfulTextField;
  authorTitle: ContentfulTextField;
  authorCompany: ContentfulTextField;
}

export interface CertificationsSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  description: ContentfulTextField;
}

export interface ContactSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  description: ContentfulTextField;
}

export interface EdeProductPage {
  title: ContentfulTextField;
  edeHeroSection: ContentfulEntryField<HeroSection>;
  capabilities: ContentfulEntryField<CapabilitiesSection>;
  contactSection: ContentfulEntryField<ContactSection>;
}

// Additional content types from your Contentful space
export interface Footer {
  title?: ContentfulTextField;
  description?: ContentfulTextField;
  links: ContentfulEntryArrayField<FooterLink>;
  socialLinks: ContentfulEntryArrayField<SocialLink>;
  copyright?: ContentfulTextField;
}

export interface FooterLink {
  title: ContentfulTextField;
  url: ContentfulTextField;
  target?: ContentfulTextField;
}

export interface SocialLink {
  platform: ContentfulTextField;
  url: ContentfulTextField;
  icon?: ContentfulAssetField;
}

export interface Navigation {
  title: ContentfulTextField;
  menuItems: ContentfulEntryArrayField<MenuItem>;
}

export interface MenuItem {
  title: ContentfulTextField;
  url: ContentfulTextField;
  target?: ContentfulTextField;
  children?: ContentfulEntryArrayField<MenuItem>;
}

export interface Page {
  title: ContentfulTextField;
  slug: ContentfulTextField;
  content: ContentfulRichTextField;
  seoTitle?: ContentfulTextField;
  seoDescription?: ContentfulTextField;
  featuredImage?: ContentfulAssetField;
}

export interface Author {
  name: ContentfulTextField;
  slug: ContentfulTextField;
  bio: ContentfulTextField;
  avatar: ContentfulAssetField;
  socialLinks?: {
    'en-US': {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
    [locale: string]: any;
  };
}

export interface Tag {
  name: ContentfulTextField;
  slug: ContentfulTextField;
  description?: ContentfulTextField;
}

// Utility types for working with Contentful data
export type LocalizedField<T> = {
  'en-US': T;
  [locale: string]: T;
};

export type ContentfulCollection<T> = {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  sys: {
    type: string;
  };
};

// Helper type to extract the actual field value from localized fields
export type ExtractFieldValue<T> = T extends LocalizedField<infer U> ? U : T;

// Helper type to create a clean interface from Contentful entry fields
export type CleanContentfulEntry<T> = {
  [K in keyof T]: ExtractFieldValue<T[K]>;
} & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface CapabilitiesSection {
  title: ContentfulTextField;
  headline: ContentfulTextField;
  subtitle: ContentfulTextField;
  description: ContentfulTextField;
  capability: ContentfulEntryArrayField<Capability[]>;
}

export interface Capability {
  title: ContentfulTextField;
  description: ContentfulTextField;
}