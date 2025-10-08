import type { APIRoute } from 'astro';
import { getFooterData } from '../../../lib/contentful';
import { processFooter } from '../../../lib/contentful-helpers';

export const GET: APIRoute = async () => {
  try {
    const footerData = await getFooterData();
    
    if (!footerData) {
      return new Response(JSON.stringify({ error: 'Footer data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const processedFooter = processFooter(footerData);

    return new Response(JSON.stringify(processedFooter), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching footer data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch footer data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
