import type { APIRoute } from 'astro';
import { getEntries } from '../../../lib/contentful';
import { processBlogPost, processPage, processAuthor, processTag } from '../../../lib/contentful-helpers';

export const GET: APIRoute = async ({ url }) => {
  try {
    const contentType = url.searchParams.get('contentType');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const order = url.searchParams.get('order') || '-sys.createdAt';

    if (!contentType) {
      return new Response(JSON.stringify({ error: 'contentType parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { items, total } = await getEntries(contentType, {
      limit,
      skip,
      order,
    });

    // Process items based on content type
    let processedItems;
    switch (contentType) {
      case 'blogPost':
        processedItems = items.map(processBlogPost);
        break;
      case 'page':
        processedItems = items.map(processPage);
        break;
      case 'author':
        processedItems = items.map(processAuthor);
        break;
      case 'tag':
        processedItems = items.map(processTag);
        break;
      default:
        processedItems = items;
    }

    return new Response(JSON.stringify({
      items: processedItems,
      total,
      skip,
      limit,
      hasMore: skip + limit < total
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching Contentful entries:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch entries',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
