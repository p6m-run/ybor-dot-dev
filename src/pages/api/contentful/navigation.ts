import type { APIRoute } from 'astro';
import { getNavigationData } from '../../../lib/contentful';
import { processNavigation } from '../../../lib/contentful-helpers';

export const GET: APIRoute = async () => {
  try {
    const navigationData = await getNavigationData();
    
    if (!navigationData) {
      return new Response(JSON.stringify({ error: 'Navigation data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const processedNavigation = processNavigation(navigationData);

    return new Response(JSON.stringify(processedNavigation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching navigation data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch navigation data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
