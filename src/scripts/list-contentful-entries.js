// Script to list all entries in your Contentful space
// Run with: node src/scripts/list-contentful-entries.js

import { getEntries } from '../lib/contentful.js';

async function listContentfulEntries() {
  try {
    console.log('🔍 Listing all entries in your Contentful space...\n');
    
    // List all content types and their entries
    const contentTypes = [
      'homepage',
      'heroSection', 
      'missionSection',
      'challengesSection',
      'platformSection',
      'businessImpactSection',
      'productSuiteSection',
      'testimonialsSection',
      'certificationsSection',
      'contactSection',
      'navigation',
      'footer',
      'challenge',
      'platformFeature',
      'metric',
      'product',
      'productFeature',
      'testimonial'
    ];
    
    for (const contentType of contentTypes) {
      try {
        const { items } = await getEntries(contentType, { limit: 10 });
        
        if (items.length > 0) {
          console.log(`📋 ${contentType.toUpperCase()} (${items.length} entries):`);
          items.forEach(item => {
            const title = item.fields.title?.['en-US'] || item.fields.headline?.['en-US'] || item.fields.name?.['en-US'] || 'No title';
            console.log(`  - ID: ${item.sys.id} | Title: ${title}`);
          });
          console.log('');
        }
      } catch (error) {
        console.log(`⚠️  ${contentType}: ${error.message}`);
      }
    }
    
    console.log('✅ Content listing complete!');
    console.log('\n💡 To use these entries:');
    console.log('1. Create a homepage entry with ID "homepage-main"');
    console.log('2. Or update the getHomepageData() function to use the correct ID');
    console.log('3. Make sure all referenced sections exist in your space');
    
  } catch (error) {
    console.error('❌ Error listing entries:', error.message);
    console.error('Make sure you have:');
    console.error('1. Set up your .env file with CONTENTFUL_ACCESS_TOKEN');
    console.error('2. The token has access to your Contentful space');
  }
}

listContentfulEntries();
