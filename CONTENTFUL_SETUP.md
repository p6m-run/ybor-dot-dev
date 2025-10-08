# Contentful Integration Setup

This document explains how to set up and use Contentful with your Astro project.

## Prerequisites

- Contentful account with a space
- Space ID: `ifcxuhm7o7o1` (already configured)
- Content Delivery API access token

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Contentful Configuration
CONTENTFUL_SPACE_ID=ifcxuhm7o7o1
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_token_here
CONTENTFUL_ENVIRONMENT=master
```

### Getting Your Access Tokens

1. Go to your Contentful space
2. Navigate to **Settings** → **API keys**
3. Copy the **Content Delivery API - access token**
4. For preview token, go to **Settings** → **API keys** → **Content Preview API - access token**

## Content Model Setup

The integration expects the following content types in your Contentful space:

### Homepage Content Types

#### Homepage (`homepage`)
- `title` (Short text)
- `heroSection` (Reference to HeroSection)
- `missionSection` (Reference to MissionSection)
- `challengesSection` (Reference to ChallengesSection)
- `platformSection` (Reference to PlatformSection)
- `businessImpactSection` (Reference to BusinessImpactSection)
- `productSuiteSection` (Reference to ProductSuiteSection)
- `testimonialsSection` (Reference to TestimonialsSection)
- `certificationsSection` (Reference to CertificationsSection)
- `contactSection` (Reference to ContactSection)

#### HeroSection (`heroSection`)
- `headline` (Short text)
- `subtitle` (Short text)
- `description` (Short text)
- `primaryButtonText` (Short text)
- `secondaryButtonText` (Short text)

#### MissionSection (`missionSection`)
- `title` (Short text)
- `description` (Long text)

#### ChallengesSection (`challengesSection`)
- `title` (Short text)
- `headline` (Short text)
- `description` (Long text)
- `challenges` (References to Challenge)

#### Challenge (`challenge`)
- `title` (Short text)
- `description` (Short text)

#### PlatformSection (`platformSection`)
- `title` (Short text)
- `headline` (Short text)
- `description` (Long text)
- `features` (References to PlatformFeature)

#### PlatformFeature (`platformFeature`)
- `title` (Short text)
- `description` (Long text)
- `details` (Short text, optional)
- `codeExample` (Long text, optional)

#### BusinessImpactSection (`businessImpactSection`)
- `title` (Short text)
- `headline` (Short text)
- `description` (Long text)
- `metrics` (References to Metric)

#### Metric (`metric`)
- `value` (Short text)
- `title` (Short text)
- `description` (Long text)

#### ProductSuiteSection (`productSuiteSection`)
- `title` (Short text)
- `products` (References to Product)

#### Product (`product`)
- `name` (Short text)
- `tagline` (Short text)
- `description` (Long text)
- `color` (Short text)
- `features` (References to ProductFeature)
- `demoContent` (Long text)

#### ProductFeature (`productFeature`)
- `title` (Short text)
- `description` (Long text)

#### TestimonialsSection (`testimonialsSection`)
- `title` (Short text)
- `testimonials` (References to Testimonial)

#### Testimonial (`testimonial`)
- `quote` (Long text)
- `authorName` (Short text)
- `authorTitle` (Short text)
- `authorCompany` (Short text)

#### CertificationsSection (`certificationsSection`)
- `title` (Short text)
- `headline` (Short text)
- `description` (Long text)

#### ContactSection (`contactSection`)
- `title` (Short text)
- `headline` (Short text)
- `description` (Long text)

#### Footer (`footer`)
- `title` (Short text, optional)
- `description` (Long text, optional)
- `links` (References to FooterLink)
- `socialLinks` (References to SocialLink)
- `copyright` (Short text, optional)

#### FooterLink (`footerLink`)
- `title` (Short text)
- `url` (Short text)
- `target` (Short text, optional)

#### SocialLink (`socialLink`)
- `platform` (Short text)
- `url` (Short text)
- `icon` (Media, optional)

#### Navigation (`navigation`)
- `title` (Short text)
- `menuItems` (References to MenuItem)

#### MenuItem (`menuItem`)
- `title` (Short text)
- `url` (Short text)
- `target` (Short text, optional)
- `children` (References to MenuItem, optional)

### Blog Content Types (for future use)

#### Blog Post (`blogPost`)
- `title` (Short text)
- `slug` (Short text, unique)
- `excerpt` (Short text)
- `content` (Rich text)
- `featuredImage` (Media)
- `author` (Reference to Author)
- `tags` (References to Tags)
- `publishDate` (Date & time)
- `seoTitle` (Short text, optional)
- `seoDescription` (Long text, optional)

### Page (`page`)
- `title` (Short text)
- `slug` (Short text, unique)
- `content` (Rich text)
- `seoTitle` (Short text, optional)
- `seoDescription` (Long text, optional)
- `featuredImage` (Media, optional)

### Author (`author`)
- `name` (Short text)
- `slug` (Short text, unique)
- `bio` (Long text)
- `avatar` (Media)
- `socialLinks` (JSON object, optional)

### Tag (`tag`)
- `name` (Short text)
- `slug` (Short text, unique)
- `description` (Long text, optional)

## Usage Examples

### Fetching Homepage Data

```typescript
import { getHomepageData } from '../lib/contentful';
import { processHeroSection, processMissionSection } from '../lib/contentful-helpers';

// Get complete homepage data
const homepageData = await getHomepageData();

// Process individual sections
const heroSection = processHeroSection(homepageData.heroSection);
const missionSection = processMissionSection(homepageData.missionSection);
```

### Using the Homepage API Endpoint

```javascript
// Fetch homepage data via API
const response = await fetch('/api/contentful/homepage');
const homepageData = await response.json();
console.log(homepageData.heroSection);
```

### Fetching Navigation and Footer Data

```typescript
import { getNavigationData, getFooterData } from '../lib/contentful';
import { processNavigation, processFooter } from '../lib/contentful-helpers';

// Get navigation data
const navigationData = await getNavigationData();
const processedNavigation = navigationData ? processNavigation(navigationData) : null;

// Get footer data
const footerData = await getFooterData();
const processedFooter = footerData ? processFooter(footerData) : null;
```

### Fetching Blog Posts

```typescript
import { getEntries } from '../lib/contentful';
import { processBlogPost } from '../lib/contentful-helpers';

// Get all blog posts
const { items } = await getEntries('blogPost', {
  limit: 10,
  order: '-fields.publishDate'
});

// Process the posts
const processedPosts = items.map(processBlogPost);
```

### Fetching a Single Entry

```typescript
import { getEntryBySlug } from '../lib/contentful';
import { processBlogPost } from '../lib/contentful-helpers';

// Get a specific blog post by slug
const post = await getEntryBySlug('blogPost', 'my-blog-post-slug');
if (post) {
  const processedPost = processBlogPost(post);
}
```

### Using the API Endpoint

```javascript
// Fetch blog posts via API
const response = await fetch('/api/contentful/entries?contentType=blogPost&limit=5');
const data = await response.json();
console.log(data.items);
```

## File Structure

```
src/
├── lib/
│   ├── contentful.ts          # Main Contentful client and utilities
│   └── contentful-helpers.ts  # Helper functions for processing data
├── types/
│   └── contentful.ts          # TypeScript type definitions
└── pages/
    ├── blog/
    │   ├── index.astro        # Blog listing page
    │   └── [...slug].astro    # Individual blog post page
    └── api/
        └── contentful/
            └── entries.ts     # API endpoint for fetching entries
```

## Key Features

- **Type Safety**: Full TypeScript support with proper type definitions
- **Rich Text Rendering**: Automatic conversion of Contentful rich text to HTML
- **Image Optimization**: Built-in image URL generation with optimization parameters
- **Localization Support**: Handles multiple locales (defaults to 'en-US')
- **SEO Ready**: Built-in SEO helpers for meta tags and descriptions
- **Static Generation**: Works with Astro's static site generation
- **API Endpoints**: RESTful API for dynamic content fetching

## Helper Functions

### Image Optimization
```typescript
import { getOptimizedImageUrl } from '../lib/contentful-helpers';

const optimizedUrl = getOptimizedImageUrl(asset, {
  width: 800,
  height: 400,
  quality: 80,
  format: 'webp'
});
```

### Rich Text Rendering
```typescript
import { renderRichText } from '../lib/contentful-helpers';

const htmlContent = renderRichText(richTextDocument);
```

### Date Formatting
```typescript
import { formatContentfulDate } from '../lib/contentful-helpers';

const formattedDate = formatContentfulDate('2024-01-15T10:00:00Z');
```

## Development Tips

1. **Preview Mode**: Use `contentfulPreviewClient` to fetch draft content during development
2. **Error Handling**: All functions include proper error handling and logging
3. **Caching**: Consider implementing caching for better performance in production
4. **Webhooks**: Set up Contentful webhooks to trigger rebuilds when content changes

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required environment variables are set
2. **Content Type Mismatch**: Verify your content types match the expected structure
3. **Access Token Issues**: Check that your access token has the correct permissions
4. **Rich Text Rendering**: Ensure you have the `@contentful/rich-text-html-renderer` package installed

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=contentful:*
```

This will help you troubleshoot any issues with the Contentful integration.
