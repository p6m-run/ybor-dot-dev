// Test script to verify Contentful integration
// Run with: node src/scripts/test-contentful.js

import { getHomepageData, getNavigationData, getFooterData, getEntries } from '../lib/contentful.js';
import { processHeroSection, processNavigation, processFooter } from '../lib/contentful-helpers.js';

async function testContentfulIntegration() {
  try {
    console.log('🚀 Testing Contentful integration...\n');
    
    // First, let's see what entries exist
    console.log('🔍 Checking available entries...');
    
    const contentTypes = ['homepage', 'heroSection', 'navigation', 'footer'];
    
    for (const contentType of contentTypes) {
      try {
        const { items } = await getEntries(contentType, { limit: 5 });
        if (items.length > 0) {
          console.log(`✅ ${contentType}: ${items.length} entries found`);
          items.forEach(item => {
            const title = item.fields.title?.['en-US'] || item.fields.headline?.['en-US'] || item.fields.name?.['en-US'] || 'No title';
            console.log(`   - ID: ${item.sys.id} | Title: ${title}`);
          });
        } else {
          console.log(`⚠️  ${contentType}: No entries found`);
        }
      } catch (error) {
        console.log(`❌ ${contentType}: ${error.message}`);
      }
    }
    
    console.log('\n📋 Testing data fetching...');
    
    // Test homepage data fetching
    const homepageData = await getHomepageData();
    if (homepageData) {
      console.log('✅ Homepage data fetched successfully');
      console.log('Homepage ID:', homepageData.id);
      console.log('Homepage Title:', homepageData.title);
      
      // Test hero section processing
      if (homepageData.heroSection) {
        const heroSection = processHeroSection(homepageData.heroSection);
        console.log('✅ Hero section processed successfully');
        console.log('Hero Headline:', heroSection.headline);
        console.log('Hero Subtitle:', heroSection.subtitle);
      }
    } else {
      console.log('⚠️ No homepage data found');
    }
    
    // Test navigation data fetching
    const navigationData = await getNavigationData();
    if (navigationData) {
      const processedNavigation = processNavigation(navigationData);
      console.log('✅ Navigation data processed successfully');
      console.log('Navigation Title:', processedNavigation.title);
      console.log('Menu Items Count:', processedNavigation.processedMenuItems.length);
    } else {
      console.log('⚠️ No navigation data found');
    }
    
    // Test footer data fetching
    const footerData = await getFooterData();
    if (footerData) {
      const processedFooter = processFooter(footerData);
      console.log('✅ Footer data processed successfully');
      console.log('Footer Title:', processedFooter.title);
      console.log('Footer Links Count:', processedFooter.processedLinks.length);
      console.log('Social Links Count:', processedFooter.processedSocialLinks.length);
    } else {
      console.log('⚠️ No footer data found');
    }
    
    console.log('\n🎉 Contentful integration test complete!');
    
  } catch (error) {
    console.error('❌ Contentful integration test failed:', error.message);
    console.error('Make sure you have:');
    console.error('1. Set up your .env file with CONTENTFUL_ACCESS_TOKEN');
    console.error('2. Created the content types in your Contentful space');
    console.error('3. Added content entries with the correct structure');
  }
}

testContentfulIntegration();
