import type { Homepage } from '@/types/contentful';
import { createClient } from 'contentful';


// Contentful configuration
const config = {
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
};

// Create Contentful client
export const contentfulClient = createClient(config);

// Type definitions for common Contentful fields
export interface ContentfulAsset {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
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

export interface ContentfulEntry {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    contentType: {
      sys: {
        id: string;
        linkType: string;
        type: string;
      };
    };
  };
  fields: Record<string, any>;
}

// Utility function to get asset URL
export function getAssetUrl(asset: ContentfulAsset): string {
  return `https:${asset.fields.file.url}`;
}

// Utility function to get optimized image URL
export function getOptimizedImageUrl(
  asset: ContentfulAsset,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  const baseUrl = getAssetUrl(asset);
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', 'webp');
  
  return `${baseUrl}?${params.toString()}`;
}

// Homepage-specific functions
export async function getHomepageData(): Promise<any> {
  try {
    // First, try to get any homepage entry (in case the ID is different)
    const { items } = await contentfulClient.getEntries<{
      contentTypeId: "homepage",
      fields: Homepage
    }>({
      content_type: 'homepage',
      limit: 1,
    });
    
    if (items.length === 0) {
      console.warn('No homepage entries found in Contentful');
      return null;
    }
    
    const homepageEntry = items[0];
    
    // Process all the sections with their nested content
    const processedHomepage = {
      id: homepageEntry.sys.id,
      title: homepageEntry.fields.title || '',
      heroSection: await processSection(homepageEntry.fields.heroSection),
      missionSection: await processSection(homepageEntry.fields.missionSection),
      // challengesSection: await processSection(homepageEntry.fields.challengesSection),
      platformSection: await processSection(homepageEntry.fields.platformSection),
      businessImpactSection: await processSection(homepageEntry.fields.businessImpactSection),
      productSuiteSection: await processSection(homepageEntry.fields.productSuiteSection),
      testimonialsSection: await processSection(homepageEntry.fields.testimonialsSection),
      certificationsSection: await processSection(homepageEntry.fields.certificationsSection),
      contactSection: await processSection(homepageEntry.fields.contactSection),
    };
    
    return processedHomepage;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null; // Return null instead of throwing to allow fallback content
  }
}

// // Navigation and Footer functions
// export async function getNavigationData(): Promise<any> {
//   try {
//     const { items } = await getEntries('navigation', { limit: 1 });
//     return items.length > 0 ? items[0] : null;
//   } catch (error) {
//     console.error('Error fetching navigation data:', error);
//     return null; // Return null instead of throwing
//   }
// }

// export async function getFooterData(): Promise<any> {
//   try {
//     const { items } = await getEntries('footer', { limit: 1 });
//     return items.length > 0 ? items[0] : null;
//   } catch (error) {
//     console.error('Error fetching footer data:', error);
//     return null; // Return null instead of throwing
//   }
// }

// Helper function to process sections with their nested content
async function processSection(sectionRef: any): Promise<any> {
  if (!sectionRef || !sectionRef.sys) return null;
  
  try {
    const section = await contentfulClient.getEntry<any>(sectionRef.sys.id, { include: 10 });
    return section;
  } catch (error) {
    console.error(`Error processing section ${sectionRef.sys.id}:`, error);
    return null;
  }
}

// // Rich text rendering utility
// export function renderRichText(document: any): string {
//   // This is a basic implementation - you might want to use @contentful/rich-text-html-renderer
//   // for more complex rich text rendering
//   if (!document || !document.content) return '';
  
//   return document.content
//     .map((node: any) => {
//       if (node.nodeType === 'paragraph') {
//         return `<p>${node.content?.map((text: any) => text.value || '').join('') || ''}</p>`;
//       }
//       if (node.nodeType === 'heading-1') {
//         return `<h1>${node.content?.map((text: any) => text.value || '').join('') || ''}</h1>`;
//       }
//       if (node.nodeType === 'heading-2') {
//         return `<h2>${node.content?.map((text: any) => text.value || '').join('') || ''}</h2>`;
//       }
//       if (node.nodeType === 'heading-3') {
//         return `<h3>${node.content?.map((text: any) => text.value || '').join('') || ''}</h3>`;
//       }
//       return '';
//     })
//     .join('');
// }
