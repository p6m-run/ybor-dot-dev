// New Contentful client with flexible architecture
// Supports the composable Page -> Section -> Component structure

import type { Entry } from 'contentful';
import { contentfulClient, getAssetUrl } from './contentful';
import type {
  PageFields,
  SectionFields,
  ComponentFields,
  ProductFields,
  TestimonialFields,
  LinkFields,
  NavigationFields,
  MenuItemFields,
  FooterFields,
  PageSkeleton,
  SectionSkeleton,
  ComponentSkeleton,
  ProductSkeleton,
  TestimonialSkeleton,
  LinkSkeleton,
  NavigationSkeleton,
  MenuItemSkeleton,
  FooterSkeleton,
  ProcessedPage,
  ProcessedSection,
  ProcessedComponent,
  ProcessedLink,
  ProcessedMenuItem,
  ProcessedNavigation,
  ProcessedFooter,
} from '@/types/contentful-v2';

// ============================================================================
// Page Functions
// ============================================================================

/**
 * Fetch page data by slug
 * @param slug - Page slug (e.g., "/", "/products/ede")
 * @returns Processed page data or null if not found
 */
export async function getPageBySlug(slug: string): Promise<ProcessedPage | null> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 10,
      limit: 1,
    } as any) as { items: Entry<PageSkeleton>[] };

    if (items.length === 0) {
      console.warn(`No page found with slug: ${slug}`);
      return null;
    }

    return processPage(items[0]);
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all pages (useful for generating static paths)
 * @returns Array of processed pages
 */
export async function getAllPages(): Promise<ProcessedPage[]> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'page',
      include: 10,
    }) as { items: Entry<PageSkeleton>[] };

    return Promise.all(items.map(processPage));
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}

/**
 * Get all page slugs (for static path generation)
 * @returns Array of slug strings
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'page',
      select: ['fields.slug'] as any,
    }) as { items: Entry<PageSkeleton>[] };

    return items.map(item => (item.fields as PageFields).slug);
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    return [];
  }
}

// ============================================================================
// Convenience Functions for Common Pages
// ============================================================================

/**
 * Get homepage data
 */
export async function getHomepageData(): Promise<ProcessedPage | null> {
  return getPageBySlug('/');
}

/**
 * Get EDE product page data
 */
export async function getEdePageData(): Promise<ProcessedPage | null> {
  return getPageBySlug('/products/ede');
}

// ============================================================================
// Navigation & Footer Functions
// ============================================================================

/**
 * Get navigation data
 */
export async function getNavigationData(): Promise<ProcessedNavigation | null> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'navigation',
      include: 3,
      limit: 1,
    }) as { items: Entry<NavigationSkeleton>[] };

    if (items.length === 0) {
      console.warn('No navigation found');
      return null;
    }

    return processNavigation(items[0]);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return null;
  }
}

/**
 * Get footer data
 */
export async function getFooterData(): Promise<ProcessedFooter | null> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'footer',
      include: 3,
      limit: 1,
    }) as { items: Entry<FooterSkeleton>[] };

    if (items.length === 0) {
      console.warn('No footer found');
      return null;
    }

    return processFooter(items[0]);
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

// ============================================================================
// Processing Functions
// ============================================================================

/**
 * Process a page entry into a clean format
 */
function processPage(entry: Entry<PageSkeleton>): ProcessedPage {
  const fields = entry.fields as PageFields;

  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    metaDescription: fields.metaDescription,
    metaImage: fields.metaImage ? getAssetUrl(fields.metaImage as any) : undefined,
    sections: fields.sections?.map(processSection) || [],
  };
}

/**
 * Process a section entry
 */
function processSection(entry: Entry<SectionSkeleton>): ProcessedSection {
  const fields = entry.fields as SectionFields;

  return {
    id: entry.sys.id,
    internalName: fields.internalName,
    type: fields.type,
    title: fields.title,
    headline: fields.headline,
    subtitle: fields.subtitle,
    description: fields.description,
    primaryButton: fields.primaryButtonText && fields.primaryButtonUrl
      ? {
          text: fields.primaryButtonText,
          url: fields.primaryButtonUrl,
        }
      : undefined,
    secondaryButton: fields.secondaryButtonText && fields.secondaryButtonUrl
      ? {
          text: fields.secondaryButtonText,
          url: fields.secondaryButtonUrl,
        }
      : undefined,
    backgroundColor: fields.backgroundColor,
    items: fields.items?.map(processItem) || [],
    media: fields.media
      ? {
          url: getAssetUrl(fields.media as any),
          alt: (fields.media.fields as any)?.title || fields.title || '',
          width: (fields.media.fields as any)?.file?.details?.image?.width,
          height: (fields.media.fields as any)?.file?.details?.image?.height,
        }
      : undefined,
    metadata: fields.metadata,
  };
}

/**
 * Process an item (could be Component, Product, or Testimonial)
 */
function processItem(
  entry: Entry<ComponentSkeleton | ProductSkeleton | TestimonialSkeleton>
): ProcessedComponent {
  const contentType = entry.sys.contentType.sys.id;

  if (contentType === 'component') {
    return processComponent(entry as Entry<ComponentSkeleton>);
  } else if (contentType === 'product') {
    return processProduct(entry as Entry<ProductSkeleton>);
  } else if (contentType === 'testimonial') {
    return processTestimonial(entry as Entry<TestimonialSkeleton>);
  }

  // Fallback
  console.warn(`Unknown item type: ${contentType}`);
  return {
    id: entry.sys.id,
    type: 'card',
  };
}

/**
 * Process a component entry
 */
function processComponent(entry: Entry<ComponentSkeleton>): ProcessedComponent {
  const fields = entry.fields as ComponentFields;

  return {
    id: entry.sys.id,
    internalName: fields.internalName,
    type: fields.type,
    title: fields.title,
    subtitle: fields.subtitle,
    description: fields.description,
    value: fields.value,
    icon: fields.icon ? getAssetUrl(fields.icon as any) : undefined,
    image: fields.image
      ? {
          url: getAssetUrl(fields.image as any),
          alt: (fields.image.fields as any)?.title || fields.title || '',
          width: (fields.image.fields as any)?.file?.details?.image?.width,
          height: (fields.image.fields as any)?.file?.details?.image?.height,
        }
      : undefined,
    url: fields.url,
    metadata: fields.metadata,
  };
}

/**
 * Process a product entry as a component
 */
function processProduct(entry: Entry<ProductSkeleton>): ProcessedComponent {
  const fields = entry.fields as ProductFields;

  return {
    id: entry.sys.id,
    type: 'product',
    title: fields.name,
    subtitle: fields.tagline,
    description: fields.description,
    metadata: {
      color: fields.color,
      slug: fields.slug,
      features: fields.features?.map((f) => processComponent(f)) || [],
      demoContent: fields.demoContent,
    },
  };
}

/**
 * Process a testimonial entry as a component
 */
function processTestimonial(entry: Entry<TestimonialSkeleton>): ProcessedComponent {
  const fields = entry.fields as TestimonialFields;

  return {
    id: entry.sys.id,
    type: 'testimonial',
    description: fields.quote,
    metadata: {
      authorName: fields.authorName,
      authorTitle: fields.authorTitle,
      authorCompany: fields.authorCompany,
      authorImage: fields.authorImage ? getAssetUrl(fields.authorImage as any) : undefined,
      rating: fields.rating,
    },
  };
}

/**
 * Process navigation entry
 */
function processNavigation(entry: Entry<NavigationSkeleton>): ProcessedNavigation {
  const fields = entry.fields as NavigationFields;

  return {
    brandName: fields.brandName,
    menuItems: fields.menuItems?.map(processMenuItem) || [],
    primaryButtonText: fields.primaryButtonText,
    secondaryButtonText: fields.secondaryButtonText,
  };
}

/**
 * Process menu item entry
 */
function processMenuItem(entry: Entry<MenuItemSkeleton>): ProcessedMenuItem {
  const fields = entry.fields as MenuItemFields;

  return {
    label: fields.label,
    url: fields.url,
    hasDropdown: fields.hasDropdown || false,
    dropdownItems: fields.dropdownItems?.map(processMenuItem) || [],
  };
}

/**
 * Process footer entry
 */
function processFooter(entry: Entry<FooterSkeleton>): ProcessedFooter {
  const fields = entry.fields as FooterFields;

  return {
    copyrightText: fields.copyrightText,
    companyName: fields.companyName,
    companyUrl: fields.companyUrl,
    footerLinks: fields.footerLinks?.map(processLink) || [],
    socialLinks: fields.socialLinks?.map(processLink) || [],
    certificationImages: fields.certificationImages?.map((asset) => getAssetUrl(asset as any)) || [],
  };
}

/**
 * Process link entry
 */
function processLink(entry: Entry<LinkSkeleton>): ProcessedLink {
  const fields = entry.fields as LinkFields;

  return {
    label: fields.label,
    url: fields.url,
    icon: fields.icon ? getAssetUrl(fields.icon as any) : undefined,
    type: fields.type,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a page exists by slug
 */
export async function pageExists(slug: string): Promise<boolean> {
  try {
    const { total } = await contentfulClient.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      limit: 1,
    });

    return total > 0;
  } catch (error) {
    console.error(`Error checking if page exists: ${slug}`, error);
    return false;
  }
}

/**
 * Get all products (for product listings)
 */
export async function getAllProducts(): Promise<ProcessedComponent[]> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'product',
      include: 3,
    }) as { items: Entry<ProductSkeleton>[] };

    return items.map(processProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProcessedComponent | null> {
  try {
    const { items } = await contentfulClient.getEntries({
      content_type: 'product',
      'fields.slug': slug,
      include: 3,
      limit: 1,
    } as any) as { items: Entry<ProductSkeleton>[] };

    if (items.length === 0) {
      return null;
    }

    return processProduct(items[0]);
  } catch (error) {
    console.error(`Error fetching product: ${slug}`, error);
    return null;
  }
}

