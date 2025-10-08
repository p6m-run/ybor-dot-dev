import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { 
  ContentfulEntry, 
  ContentfulAsset, 
  LocalizedField, 
  ExtractFieldValue,
  CleanContentfulEntry,
  Homepage,
  HeroSection,
  MissionSection,
  ChallengesSection,
  Challenge,
  PlatformSection,
  PlatformFeature,
  BusinessImpactSection,
  Metric,
  ProductSuiteSection,
  Product,
  ProductFeature,
  TestimonialsSection,
  Testimonial,
  CertificationsSection,
  ContactSection,
  Footer,
  FooterLink,
  SocialLink,
  Navigation,
  MenuItem,
  BlogPost,
  Page,
  Author,
  Tag
} from '../types/contentful';

// Utility function to extract localized field values
export function getLocalizedValue<T>(field: LocalizedField<T>, locale: string = 'en-US'): T {
  return field[locale] || field['en-US'] || field[Object.keys(field)[0]];
}

// Utility function to clean Contentful entry data
export function cleanContentfulEntry<T extends Record<string, any>>(
  entry: ContentfulEntry<T>
): CleanContentfulEntry<T> {
  const cleanedFields: any = {};
  
  for (const [key, value] of Object.entries(entry.fields)) {
    if (value && typeof value === 'object' && 'en-US' in value) {
      // It's a localized field
      cleanedFields[key] = getLocalizedValue(value as LocalizedField<any>);
    } else {
      cleanedFields[key] = value;
    }
  }
  
  return {
    ...cleanedFields,
    id: entry.sys.id,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
  };
}

// Rich text rendering with proper HTML output
export function renderRichText(document: any, locale: string = 'en-US'): string {
  if (!document) return '';
  
  try {
    return documentToHtmlString(document);
  } catch (error) {
    console.error('Error rendering rich text:', error);
    return '';
  }
}

// Asset URL helpers
export function getAssetUrl(asset: ContentfulAsset, locale: string = 'en-US'): string {
  const assetData = getLocalizedValue(asset.fields, locale);
  return `https:${assetData.file.url}`;
}

export function getOptimizedImageUrl(
  asset: ContentfulAsset,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
    locale?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'fill',
    locale = 'en-US'
  } = options;
  
  const baseUrl = getAssetUrl(asset, locale);
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', format);
  params.append('fit', fit);
  
  return `${baseUrl}?${params.toString()}`;
}

// Homepage content type helpers
export function processHomepage(entry: ContentfulEntry<Homepage>): CleanContentfulEntry<Homepage> {
  return cleanContentfulEntry(entry);
}

export function processHeroSection(entry: ContentfulEntry<HeroSection>): CleanContentfulEntry<HeroSection> {
  return cleanContentfulEntry(entry);
}

export function processMissionSection(entry: ContentfulEntry<MissionSection>): CleanContentfulEntry<MissionSection> {
  return cleanContentfulEntry(entry);
}

export function processChallengesSection(entry: ContentfulEntry<ChallengesSection>): CleanContentfulEntry<ChallengesSection> & {
  processedChallenges: CleanContentfulEntry<Challenge>[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const challenges = getLocalizedValue(entry.fields.challenges);
  
  return {
    ...cleaned,
    processedChallenges: challenges.map(processChallenge),
  };
}

export function processChallenge(entry: ContentfulEntry<Challenge>): CleanContentfulEntry<Challenge> {
  return cleanContentfulEntry(entry);
}

export function processPlatformSection(entry: ContentfulEntry<PlatformSection>): CleanContentfulEntry<PlatformSection> & {
  processedFeatures: CleanContentfulEntry<PlatformFeature>[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const features = getLocalizedValue(entry.fields.features);
  
  return {
    ...cleaned,
    processedFeatures: features.map(processPlatformFeature),
  };
}

export function processPlatformFeature(entry: ContentfulEntry<PlatformFeature>): CleanContentfulEntry<PlatformFeature> {
  return cleanContentfulEntry(entry);
}

export function processBusinessImpactSection(entry: ContentfulEntry<BusinessImpactSection>): CleanContentfulEntry<BusinessImpactSection> & {
  processedMetrics: CleanContentfulEntry<Metric>[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const metrics = getLocalizedValue(entry.fields.metrics);
  
  return {
    ...cleaned,
    processedMetrics: metrics.map(processMetric),
  };
}

export function processMetric(entry: ContentfulEntry<Metric>): CleanContentfulEntry<Metric> {
  return cleanContentfulEntry(entry);
}

export function processProductSuiteSection(entry: ContentfulEntry<ProductSuiteSection>): CleanContentfulEntry<ProductSuiteSection> & {
  processedProducts: (CleanContentfulEntry<Product> & { processedFeatures: CleanContentfulEntry<ProductFeature>[] })[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const products = getLocalizedValue(entry.fields.products);
  
  return {
    ...cleaned,
    processedProducts: products.map(product => ({
      ...processProduct(product),
      processedFeatures: getLocalizedValue(product.fields.features).map(processProductFeature),
    })),
  };
}

export function processProduct(entry: ContentfulEntry<Product>): CleanContentfulEntry<Product> {
  return cleanContentfulEntry(entry);
}

export function processProductFeature(entry: ContentfulEntry<ProductFeature>): CleanContentfulEntry<ProductFeature> {
  return cleanContentfulEntry(entry);
}

export function processTestimonialsSection(entry: ContentfulEntry<TestimonialsSection>): CleanContentfulEntry<TestimonialsSection> & {
  processedTestimonials: CleanContentfulEntry<Testimonial>[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const testimonials = getLocalizedValue(entry.fields.testimonials);
  
  return {
    ...cleaned,
    processedTestimonials: testimonials.map(processTestimonial),
  };
}

export function processTestimonial(entry: ContentfulEntry<Testimonial>): CleanContentfulEntry<Testimonial> {
  return cleanContentfulEntry(entry);
}

export function processCertificationsSection(entry: ContentfulEntry<CertificationsSection>): CleanContentfulEntry<CertificationsSection> {
  return cleanContentfulEntry(entry);
}

export function processContactSection(entry: ContentfulEntry<ContactSection>): CleanContentfulEntry<ContactSection> {
  return cleanContentfulEntry(entry);
}

// Additional content type helpers
export function processFooter(entry: ContentfulEntry<Footer>): CleanContentfulEntry<Footer> & {
  processedLinks: CleanContentfulEntry<FooterLink>[];
  processedSocialLinks: CleanContentfulEntry<SocialLink>[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const links = getLocalizedValue(entry.fields.links);
  const socialLinks = getLocalizedValue(entry.fields.socialLinks);
  
  return {
    ...cleaned,
    processedLinks: links.map(processFooterLink),
    processedSocialLinks: socialLinks.map(processSocialLink),
  };
}

export function processFooterLink(entry: ContentfulEntry<FooterLink>): CleanContentfulEntry<FooterLink> {
  return cleanContentfulEntry(entry);
}

export function processSocialLink(entry: ContentfulEntry<SocialLink>): CleanContentfulEntry<SocialLink> & {
  iconUrl?: string;
} {
  const cleaned = cleanContentfulEntry(entry);
  const icon = entry.fields.icon ? getLocalizedValue(entry.fields.icon) : null;
  
  return {
    ...cleaned,
    iconUrl: icon ? getAssetUrl(icon) : undefined,
  };
}

export function processNavigation(entry: ContentfulEntry<Navigation>): CleanContentfulEntry<Navigation> & {
  processedMenuItems: (CleanContentfulEntry<MenuItem> & { processedChildren?: CleanContentfulEntry<MenuItem>[] })[];
} {
  const cleaned = cleanContentfulEntry(entry);
  const menuItems = getLocalizedValue(entry.fields.menuItems);
  
  return {
    ...cleaned,
    processedMenuItems: menuItems.map(item => ({
      ...processMenuItem(item),
      processedChildren: item.fields.children ? getLocalizedValue(item.fields.children).map(processMenuItem) : undefined,
    })),
  };
}

export function processMenuItem(entry: ContentfulEntry<MenuItem>): CleanContentfulEntry<MenuItem> {
  return cleanContentfulEntry(entry);
}

// Blog content type helpers (keeping for future use)
export function processBlogPost(entry: ContentfulEntry<BlogPost>): CleanContentfulEntry<BlogPost> & {
  renderedContent: string;
  imageUrl: string;
  optimizedImageUrl: string;
} {
  const cleaned = cleanContentfulEntry(entry);
  const content = getLocalizedValue(entry.fields.content);
  const featuredImage = getLocalizedValue(entry.fields.featuredImage);
  
  return {
    ...cleaned,
    renderedContent: renderRichText(content),
    imageUrl: getAssetUrl(featuredImage),
    optimizedImageUrl: getOptimizedImageUrl(featuredImage, { width: 800, height: 400 }),
  };
}

export function processPage(entry: ContentfulEntry<Page>): CleanContentfulEntry<Page> & {
  renderedContent: string;
  imageUrl?: string;
  optimizedImageUrl?: string;
} {
  const cleaned = cleanContentfulEntry(entry);
  const content = getLocalizedValue(entry.fields.content);
  const featuredImage = entry.fields.featuredImage ? getLocalizedValue(entry.fields.featuredImage) : null;
  
  return {
    ...cleaned,
    renderedContent: renderRichText(content),
    imageUrl: featuredImage ? getAssetUrl(featuredImage) : undefined,
    optimizedImageUrl: featuredImage ? getOptimizedImageUrl(featuredImage, { width: 1200, height: 630 }) : undefined,
  };
}

export function processAuthor(entry: ContentfulEntry<Author>): CleanContentfulEntry<Author> & {
  avatarUrl: string;
  optimizedAvatarUrl: string;
} {
  const cleaned = cleanContentfulEntry(entry);
  const avatar = getLocalizedValue(entry.fields.avatar);
  
  return {
    ...cleaned,
    avatarUrl: getAssetUrl(avatar),
    optimizedAvatarUrl: getOptimizedImageUrl(avatar, { width: 200, height: 200, fit: 'thumb' }),
  };
}

export function processTag(entry: ContentfulEntry<Tag>): CleanContentfulEntry<Tag> {
  return cleanContentfulEntry(entry);
}

// Date formatting helpers
export function formatContentfulDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatContentfulDateTime(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// SEO helpers
export function generateSEOTitle(title: string, siteName: string = 'Ybor.dev'): string {
  return `${title} | ${siteName}`;
}

export function generateSEODescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

// Content filtering and sorting helpers
export function sortByDate<T extends { createdAt: string }>(items: T[], order: 'asc' | 'desc' = 'desc'): T[] {
  return items.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function filterPublished<T extends { publishDate?: string }>(items: T[]): T[] {
  const now = new Date();
  return items.filter(item => {
    if (!item.publishDate) return true; // Include items without publish date
    return new Date(item.publishDate) <= now;
  });
}

// Search helpers
export function searchContent<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;
  
  const lowercaseQuery = query.toLowerCase();
  
  return items.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseQuery);
      }
      return false;
    });
  });
}
