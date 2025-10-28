// New flexible Contentful content types
// These types support the new composable architecture

import type { Entry, Asset, EntrySkeletonType } from 'contentful';

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
  sections: Entry<SectionSkeleton>[];
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
  items?: Entry<ComponentSkeleton | ProductSkeleton | TestimonialSkeleton>[];
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
  features?: Entry<ComponentSkeleton>[];
  demoContent?: any; // Rich text
  slug?: string;
  page?: Entry<PageSkeleton>;
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
  menuItems?: Entry<MenuItemSkeleton>[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface MenuItemFields {
  label: string;
  url: string;
  hasDropdown?: boolean;
  dropdownItems?: Entry<MenuItemSkeleton>[];
}

export interface FooterFields {
  copyrightText?: string;
  companyName?: string;
  companyUrl?: string;
  footerLinks?: Entry<LinkSkeleton>[];
  socialLinks?: Entry<LinkSkeleton>[];
  certificationImages?: Asset[];
}

export interface SiteSettingsFields {
  siteName: string;
  logo?: Asset;
  favicon?: Asset;
  navigation?: Entry<NavigationSkeleton>;
  footer?: Entry<FooterSkeleton>;
  defaultMetaDescription?: string;
  socialImage?: Asset;
}

// ============================================================================
// Entry Skeleton Types (for Contentful SDK)
// ============================================================================

export interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: 'page';
  fields: PageFields;
}

export interface SectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'section';
  fields: SectionFields;
}

export interface ComponentSkeleton extends EntrySkeletonType {
  contentTypeId: 'component';
  fields: ComponentFields;
}

export interface ProductSkeleton extends EntrySkeletonType {
  contentTypeId: 'product';
  fields: ProductFields;
}

export interface TestimonialSkeleton extends EntrySkeletonType {
  contentTypeId: 'testimonial';
  fields: TestimonialFields;
}

export interface LinkSkeleton extends EntrySkeletonType {
  contentTypeId: 'link';
  fields: LinkFields;
}

export interface NavigationSkeleton extends EntrySkeletonType {
  contentTypeId: 'navigation';
  fields: NavigationFields;
}

export interface MenuItemSkeleton extends EntrySkeletonType {
  contentTypeId: 'menuItem';
  fields: MenuItemFields;
}

export interface FooterSkeleton extends EntrySkeletonType {
  contentTypeId: 'footer';
  fields: FooterFields;
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
  internalName?: string;
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

export function isComponentEntry(entry: Entry<any>): entry is Entry<ComponentSkeleton> {
  return entry.sys.contentType.sys.id === 'component';
}

export function isProductEntry(entry: Entry<any>): entry is Entry<ProductSkeleton> {
  return entry.sys.contentType.sys.id === 'product';
}

export function isTestimonialEntry(entry: Entry<any>): entry is Entry<TestimonialSkeleton> {
  return entry.sys.contentType.sys.id === 'testimonial';
}

