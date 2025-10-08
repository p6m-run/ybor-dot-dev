import type { APIRoute } from 'astro';
import { getHomepageData } from '../../../lib/contentful';
import { 
  processHeroSection, 
  processMissionSection, 
  processChallengesSection,
  processPlatformSection,
  processBusinessImpactSection,
  processProductSuiteSection,
  processTestimonialsSection,
  processCertificationsSection,
  processContactSection
} from '../../../lib/contentful-helpers';

export const GET: APIRoute = async () => {
  try {
    const homepageData = await getHomepageData();
    
    if (!homepageData) {
      return new Response(JSON.stringify({ error: 'Homepage data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process all sections
    const processedHomepage = {
      id: homepageData.id,
      title: homepageData.title,
      heroSection: homepageData.heroSection ? processHeroSection(homepageData.heroSection) : null,
      missionSection: homepageData.missionSection ? processMissionSection(homepageData.missionSection) : null,
      challengesSection: homepageData.challengesSection ? processChallengesSection(homepageData.challengesSection) : null,
      platformSection: homepageData.platformSection ? processPlatformSection(homepageData.platformSection) : null,
      businessImpactSection: homepageData.businessImpactSection ? processBusinessImpactSection(homepageData.businessImpactSection) : null,
      productSuiteSection: homepageData.productSuiteSection ? processProductSuiteSection(homepageData.productSuiteSection) : null,
      testimonialsSection: homepageData.testimonialsSection ? processTestimonialsSection(homepageData.testimonialsSection) : null,
      certificationsSection: homepageData.certificationsSection ? processCertificationsSection(homepageData.certificationsSection) : null,
      contactSection: homepageData.contactSection ? processContactSection(homepageData.contactSection) : null,
    };

    return new Response(JSON.stringify(processedHomepage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch homepage data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
