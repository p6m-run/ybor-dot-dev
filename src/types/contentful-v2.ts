// New flexible Contentful content types
// These types support the new composable architecture

import type { Entry, Asset } from 'contentful';

// Section type options
export type SectionType = 
  | 'hero' 
  | 'mission' 
  | 'challenges' 
  | 'platform' 
  | 'business-impact'
  | 'product-suite'
  | 'testimonials'
  | 'certifications'
  | 'contact'
  | 'capabilities'
  | 'features'
  | 'cta'
  | 'how-it-works'
  | 'use-cases'
  | 'security-compliance'
  | 'comparison';

// Component type options
export type ComponentType = 
  | 'challenge'
  | 'feature'
  | 'metric'
  | 'capability'
  | 'card'
  | 'code-example'
  | 'use-case'
  | 'step';

// Link type options
export type LinkType = 'footer' | 'social' | 'navigation';

// ============================================================================
// Raw Contentful Field Interfaces
// ============================================================================

export interface PageFields {
  title: string;
  slug: string;
  metaDescription?: string;
  metaImage?: Asset;
  sections: Entry<SectionFields>[];
}

export interface SectionFields {
  internalName: string;
  type: SectionType;
  title?: string;
  headline?: string;
  subtitle?: string;
  description?: any; // Rich text
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundColor?: string;
  items?: Entry<ComponentFields | ProductFields | TestimonialFields>[];
  media?: Asset;
  metadata?: Record<string, any>;
}

export interface ComponentFields {
  internalName: string;
  type: ComponentType;
  title?: string;
  subtitle?: string;
  description?: any; // Rich text
  value?: string;
  icon?: Asset;
  image?: Asset;
  url?: string;
  metadata?: Record<string, any>;
}

export interface ProductFields {
  name: string;
  tagline?: string;
  description?: any; // Rich text
  color?: string;
  features?: Entry<ComponentFields>[];
  demoContent?: any; // Rich text
  slug?: string;
  page?: Entry<PageFields>;
}

export interface TestimonialFields {
  quote: any; // Rich text
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorImage?: Asset;
  rating?: number;
}

export interface LinkFields {
  label: string;
  url: string;
  icon?: Asset;
  type?: LinkType;
}

export interface NavigationFields {
  brandName: string;
  menuItems?: Entry<MenuItemFields>[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface MenuItemFields {
  label: string;
  url: string;
  hasDropdown?: boolean;
  dropdownItems?: Entry<MenuItemFields>[];
}

export interface FooterFields {
  copyrightText?: string;
  companyName?: string;
  companyUrl?: string;
  footerLinks?: Entry<LinkFields>[];
  socialLinks?: Entry<LinkFields>[];
  certificationImages?: Asset[];
}

export interface SiteSettingsFields {
  siteName: string;
  logo?: Asset;
  favicon?: Asset;
  navigation?: Entry<NavigationFields>;
  footer?: Entry<FooterFields>;
  defaultMetaDescription?: string;
  socialImage?: Asset;
}

// ============================================================================
// Processed/Clean Interfaces (for use in components)
// ============================================================================

export interface ProcessedButton {
  text: string;
  url: string;
}

export interface ProcessedMedia {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProcessedSection {
  id: string;
  internalName: string;
  type: SectionType;
  title?: string;
  headline?: string;
  subtitle?: string;
  description?: any;
  primaryButton?: ProcessedButton;
  secondaryButton?: ProcessedButton;
  backgroundColor?: string;
  items?: ProcessedComponent[];
  media?: ProcessedMedia;
  metadata?: Record<string, any>;
}

export interface ProcessedComponent {
  id: string;
  type: ComponentType | 'product' | 'testimonial';
  title?: string;
  subtitle?: string;
  description?: any;
  value?: string;
  icon?: string;
  image?: ProcessedMedia;
  url?: string;
  metadata?: Record<string, any>;
}

export interface ProcessedPage {
  id: string;
  title: string;
  slug: string;
  metaDescription?: string;
  metaImage?: string;
  sections: ProcessedSection[];
}

export interface ProcessedLink {
  label: string;
  url: string;
  icon?: string;
  type?: LinkType;
}

export interface ProcessedMenuItem {
  label: string;
  url: string;
  hasDropdown: boolean;
  dropdownItems?: ProcessedMenuItem[];
}

export interface ProcessedNavigation {
  brandName: string;
  menuItems: ProcessedMenuItem[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface ProcessedFooter {
  copyrightText?: string;
  companyName?: string;
  companyUrl?: string;
  footerLinks: ProcessedLink[];
  socialLinks: ProcessedLink[];
  certificationImages: string[];
}

// ============================================================================
// Type Guards
// ============================================================================

export function isComponentEntry(entry: Entry<any>): entry is Entry<ComponentFields> {
  return entry.sys.contentType.sys.id === 'component';
}

export function isProductEntry(entry: Entry<any>): entry is Entry<ProductFields> {
  return entry.sys.contentType.sys.id === 'product';
}

export function isTestimonialEntry(entry: Entry<any>): entry is Entry<TestimonialFields> {
  return entry.sys.contentType.sys.id === 'testimonial';
}

