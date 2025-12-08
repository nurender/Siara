/**
 * Seed default CMS data for Siara Events
 * Run: node database/seed-cms.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'siara_events',
};

async function seedCMS() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    // =============================================
    // CLEANUP DUPLICATES FIRST
    // =============================================
    console.log('🧹 Cleaning up duplicates...');
    
    // Remove duplicate sections (keep latest by ID)
    await connection.query(`
      DELETE s1 FROM sections s1
      INNER JOIN sections s2 
      WHERE s1.id < s2.id AND s1.name = s2.name AND s1.section_type = s2.section_type
    `);
    console.log('  ✓ Duplicate sections removed');
    
    // Remove duplicate blog posts (keep latest by ID)
    await connection.query(`
      DELETE b1 FROM blog_posts b1
      INNER JOIN blog_posts b2 
      WHERE b1.id < b2.id AND b1.slug = b2.slug
    `);
    console.log('  ✓ Duplicate blog posts removed');
    
    // Remove duplicate portfolio items (keep latest by ID)
    await connection.query(`
      DELETE p1 FROM portfolio p1
      INNER JOIN portfolio p2 
      WHERE p1.id < p2.id AND p1.slug = p2.slug
    `);
    console.log('  ✓ Duplicate portfolio items removed');
    
    // Remove duplicate services (keep latest by ID)
    await connection.query(`
      DELETE s1 FROM services s1
      INNER JOIN services s2 
      WHERE s1.id < s2.id AND s1.slug = s2.slug
    `);
    console.log('  ✓ Duplicate services removed');
    
    // Remove duplicate testimonials (keep latest by ID)
    await connection.query(`
      DELETE t1 FROM testimonials t1
      INNER JOIN testimonials t2 
      WHERE t1.id < t2.id AND t1.client_name = t2.client_name AND t1.quote = t2.quote
    `);
    console.log('  ✓ Duplicate testimonials removed\n');

    // =============================================
    // SEED SITE SETTINGS
    // =============================================
    console.log('⚙️ Seeding site settings...');

    const settings = [
      // General
      { key: 'site_name', value: 'Siara Events', group: 'general' },
      { key: 'site_tagline', value: 'Crafting Extraordinary Moments', group: 'general' },
      { key: 'site_description', value: 'India\'s Premier Luxury Event Management Company specializing in destination weddings across Rajasthan', group: 'general' },
      { key: 'logo_url', value: '', group: 'general' },
      { key: 'favicon_url', value: '', group: 'general' },
      
      // Contact
      { key: 'contact_email', value: 'hello@siaraevents.com', group: 'contact' },
      { key: 'contact_phone', value: '+91 90240 55545', group: 'contact' },
      { key: 'contact_whatsapp', value: '919024055545', group: 'contact' },
      { key: 'contact_address', value: 'Plot No. 123, C-Scheme, Near Rambagh Palace, Jaipur, Rajasthan 302001', group: 'contact' },
      
      // Social
      { key: 'social_instagram', value: 'https://instagram.com/siaraevents', group: 'social' },
      { key: 'social_facebook', value: 'https://facebook.com/siaraevents', group: 'social' },
      { key: 'social_pinterest', value: 'https://pinterest.com/siaraevents', group: 'social' },
      { key: 'social_youtube', value: 'https://youtube.com/siaraevents', group: 'social' },
      { key: 'social_twitter', value: '', group: 'social' },
      { key: 'social_linkedin', value: '', group: 'social' },
      
      // SEO
      { key: 'seo_title', value: 'Siara Events | Best Wedding Planner in Rajasthan', group: 'seo' },
      { key: 'seo_description', value: 'Luxury wedding and event planning services in Jaipur, Udaipur & Rajasthan', group: 'seo' },
      { key: 'seo_keywords', value: 'wedding planner, Rajasthan, Jaipur, Udaipur, luxury weddings', group: 'seo' },
      { key: 'google_analytics_id', value: '', group: 'seo' },
      { key: 'google_tag_manager_id', value: '', group: 'seo' },
      
      // Portfolio Page Content
      { key: 'portfolio_hero_badge', value: 'Our Work', group: 'portfolio' },
      { key: 'portfolio_hero_title', value: 'Wedding', group: 'portfolio' },
      { key: 'portfolio_hero_highlight', value: 'Portfolio', group: 'portfolio' },
      { key: 'portfolio_hero_description', value: 'Discover our collection of luxury destination weddings at Rajasthan\'s most prestigious palaces—crafted by the best wedding planner in India.', group: 'portfolio' },
      { key: 'portfolio_featured_badge', value: 'Featured Celebrations', group: 'portfolio' },
      { key: 'portfolio_featured_title', value: 'Signature', group: 'portfolio' },
      { key: 'portfolio_featured_highlight', value: 'Events', group: 'portfolio' },
      { key: 'portfolio_other_badge', value: 'More Celebrations', group: 'portfolio' },
      { key: 'portfolio_other_title', value: 'Explore Our', group: 'portfolio' },
      { key: 'portfolio_other_highlight', value: 'Collection', group: 'portfolio' },
      { key: 'portfolio_empty_title', value: 'Portfolio Coming Soon', group: 'portfolio' },
      { key: 'portfolio_empty_description', value: 'Our portfolio is being updated. Please check back soon!', group: 'portfolio' },
      
      // Services Page Content
      { key: 'services_hero_badge', value: 'Our Expertise', group: 'services' },
      { key: 'services_hero_title', value: 'Exceptional', group: 'services' },
      { key: 'services_hero_highlight', value: 'Services', group: 'services' },
      { key: 'services_hero_description', value: 'From intimate celebrations to grand productions, discover our comprehensive range of luxury event planning services.', group: 'services' },
      { key: 'services_empty_title', value: 'Services Coming Soon', group: 'services' },
      { key: 'services_empty_description', value: 'Our services are being updated. Please check back soon!', group: 'services' },
      
      // Blog Page Content
      { key: 'blog_hero_badge', value: 'Our Blog', group: 'blog' },
      { key: 'blog_hero_title', value: 'Wedding Planning', group: 'blog' },
      { key: 'blog_hero_highlight', value: 'Insights', group: 'blog' },
      { key: 'blog_hero_description', value: 'Expert tips, venue guides, and inspiration from Rajasthan\'s premier wedding planners.', group: 'blog' },
      { key: 'blog_empty_title', value: 'Blog Coming Soon', group: 'blog' },
      { key: 'blog_empty_description', value: 'Our blog articles are being prepared. Please check back soon!', group: 'blog' },
      
      // About Page Content - Hero
      { key: 'about_hero_badge', value: 'Since 2008', group: 'about' },
      { key: 'about_hero_title', value: 'Meet Siara Events:', group: 'about' },
      { key: 'about_hero_highlight', value: 'Rajasthan\'s Premier Wedding Planners', group: 'about' },
      { key: 'about_hero_description', value: 'Trusted luxury event management in Jaipur, Udaipur, and Jodhpur. Crafting extraordinary celebrations that honor tradition while embracing modern elegance.', group: 'about' },
      { key: 'about_hero_image', value: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1920&auto=format&fit=crop&q=80', group: 'about' },
      { key: 'about_cta_text', value: 'Book Consultation', group: 'about' },
      { key: 'about_cta_secondary_text', value: 'View Our Work', group: 'about' },
      
      // About Page - Story Section
      { key: 'about_story_badge', value: 'Our Story', group: 'about' },
      { key: 'about_story_title', value: 'A Legacy of Creating', group: 'about' },
      { key: 'about_story_highlight', value: 'Unforgettable Moments', group: 'about' },
      { key: 'about_story_paragraph1', value: 'Founded in 2008 in the heart of Jaipur, Siara Events began with a simple yet profound mission: to transform the traditional Indian wedding into an extraordinary, personalized celebration. What started as a small team of passionate planners has grown into Rajasthan\'s most trusted luxury wedding planning company, with offices across Jaipur, Udaipur, and Jodhpur.', group: 'about' },
      { key: 'about_story_paragraph2', value: 'Our journey is rooted in deep respect for the rich cultural heritage of Rajasthan. We\'ve spent over 16 years building relationships with the region\'s most prestigious venues—from the historic Rambagh Palace to the floating Taj Lake Palace, from the magnificent Mehrangarh Fort to boutique heritage properties hidden in the Aravallis.', group: 'about' },
      { key: 'about_story_paragraph3', value: 'Today, Siara Events is synonymous with excellence in destination wedding planning in North India. We blend timeless traditions with contemporary elegance, creating celebrations that are as unique as the couples we serve. Every wedding we plan tells a story—your story—set against the backdrop of India\'s most romantic landscapes.', group: 'about' },
      { key: 'about_years_count', value: '16+', group: 'about' },
      { key: 'about_founder_name', value: 'Rajesh Sharma', group: 'about' },
      { key: 'about_founder_title', value: 'Founder & Creative Director', group: 'about' },
      { key: 'about_founder_image', value: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', group: 'about' },
      { key: 'about_story_image1', value: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80', group: 'about' },
      { key: 'about_story_image2', value: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80', group: 'about' },
      { key: 'about_story_image3', value: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=80', group: 'about' },
      { key: 'about_story_image4', value: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80', group: 'about' },
      
      // About Page - Values Section
      { key: 'about_values_badge', value: 'Why Choose Us', group: 'about' },
      { key: 'about_values_title', value: 'The Siara Events', group: 'about' },
      { key: 'about_values_highlight', value: 'Difference', group: 'about' },
      { key: 'about_values_description', value: 'What sets the best wedding planner in Rajasthan apart? It\'s our unwavering commitment to these core values.', group: 'about' },
      
      // About Page - Stats Section
      { key: 'about_stats_badge', value: 'Our Achievements', group: 'about' },
      { key: 'about_stats_title', value: 'Numbers That Speak', group: 'about' },
      { key: 'about_stats_highlight', value: 'Excellence', group: 'about' },
      { key: 'about_stats_description', value: 'Over 16 years, we\'ve built a legacy of trust and excellence as Rajasthan\'s leading wedding planners.', group: 'about' },
      
      // About Page - Team Section
      { key: 'about_team_badge', value: 'Our Leadership', group: 'about' },
      { key: 'about_team_title', value: 'Meet the', group: 'about' },
      { key: 'about_team_highlight', value: 'Visionaries', group: 'about' },
      { key: 'about_team_description', value: 'Our leadership team combines decades of experience in luxury hospitality, event design, and deep expertise in Rajasthan\'s wedding culture.', group: 'about' },
      { key: 'about_team_note', value: 'Plus a dedicated team of 50+ professionals including designers, coordinators, and specialists across our three offices.', group: 'about' },
      
      // About Page - Timeline Section
      { key: 'about_timeline_badge', value: 'Our Journey', group: 'about' },
      { key: 'about_timeline_title', value: 'Milestones of', group: 'about' },
      { key: 'about_timeline_highlight', value: 'Excellence', group: 'about' },
      { key: 'about_timeline_description', value: 'From our humble beginnings in Jaipur to becoming Rajasthan\'s most trusted wedding planners—here\'s our story.', group: 'about' },
      { key: 'about_timeline_future', value: 'Coming 2025: International expansion to Dubai & Thailand', group: 'about' },
      
      // About Page - Partners Section
      { key: 'about_partners_badge', value: 'Trusted Partners', group: 'about' },
      { key: 'about_partners_title', value: 'Partnerships &', group: 'about' },
      { key: 'about_partners_highlight', value: 'Recognition', group: 'about' },
      { key: 'about_partners_description', value: 'We\'re proud to partner with India\'s finest hospitality brands and be recognized by leading media outlets.', group: 'about' },
      
      // Contact Page Content
      { key: 'contact_hero_badge', value: 'Get in Touch', group: 'contact_page' },
      { key: 'contact_hero_title', value: 'Let\'s Plan Your', group: 'contact_page' },
      { key: 'contact_hero_highlight', value: 'Dream Event', group: 'contact_page' },
      { key: 'contact_hero_description', value: 'Ready to start planning? Our team is here to help bring your vision to life.', group: 'contact_page' },
    ];

    for (const setting of settings) {
      await connection.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_group) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [setting.key, JSON.stringify(setting.value), setting.group]
      );
      console.log(`  ✓ Setting: ${setting.key}`);
    }

    // =============================================
    // SEED PAGES
    // =============================================
    console.log('\n📄 Seeding pages...');

    const pages = [
      {
        slug: 'home',
        page_type: 'home',
        title: 'Home',
        meta_title: 'Siara Events | Best Wedding Planner in Jaipur, Udaipur & Rajasthan',
        meta_description: 'India\'s Premier Luxury Event Management Company. Destination weddings, corporate events, and private celebrations across Rajasthan.',
        status: 'published',
      },
      {
        slug: 'about',
        page_type: 'about',
        title: 'About Us',
        meta_title: 'About Us | Siara Events - Rajasthan\'s Premier Wedding Planners',
        meta_description: 'Meet Siara Events—trusted luxury wedding planners in Jaipur, Udaipur, and Jodhpur with 16+ years of excellence.',
        status: 'published',
      },
      {
        slug: 'services',
        page_type: 'services',
        title: 'Our Services',
        meta_title: 'Our Services | Siara Events - Luxury Event Planning',
        meta_description: 'Discover our comprehensive range of luxury event planning services including weddings, corporate galas, destination events, and private celebrations.',
        status: 'published',
      },
      {
        slug: 'portfolio',
        page_type: 'portfolio',
        title: 'Portfolio',
        meta_title: 'Portfolio | Siara Events - Best Wedding Planner in Rajasthan',
        meta_description: 'Explore our stunning portfolio of luxury destination weddings in Rajasthan. Discover royal celebrations at Jaipur, Udaipur, and Jodhpur palaces.',
        status: 'published',
      },
      {
        slug: 'blog',
        page_type: 'blog',
        title: 'Blog',
        meta_title: 'Wedding Planning Blog | Siara Events - Tips & Inspiration',
        meta_description: 'Expert wedding planning tips, Rajasthan venue guides, and inspiration from North India\'s premier wedding planners.',
        status: 'published',
      },
      {
        slug: 'contact',
        page_type: 'contact',
        title: 'Contact Us',
        meta_title: 'Contact Us | Siara Events - Wedding Planner Rajasthan',
        meta_description: 'Get in touch with Siara Events—Rajasthan\'s premier wedding planners.',
        status: 'published',
      },
    ];

    for (const page of pages) {
      await connection.query(
        `INSERT INTO pages (slug, page_type, title, meta_title, meta_description, status, sections) 
         VALUES (?, ?, ?, ?, ?, ?, '[]')
         ON DUPLICATE KEY UPDATE meta_title = VALUES(meta_title), meta_description = VALUES(meta_description)`,
        [page.slug, page.page_type, page.title, page.meta_title, page.meta_description, page.status]
      );
      console.log(`  ✓ Page: ${page.slug}`);
    }

    // =============================================
    // SEED SECTIONS
    // =============================================
    console.log('\n📦 Seeding sections...');

    const sections = [
      // Hero Section
      {
        name: 'Homepage Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Crafting Unforgettable Moments',
          subheading: 'Where dreams transform into breathtaking celebrations. We curate bespoke experiences that captivate the senses and create memories that last a lifetime.',
          category_badge: 'Luxury Event Management',
          background_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&auto=format&fit=crop&q=80',
          cta_primary: { text: 'Explore Services', url: '/services' },
          cta_secondary: { text: 'View Portfolio', url: '/portfolio' },
          stats: [
            { value: '500+', label: 'Events Crafted' },
            { value: '15', label: 'Years Experience' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '50+', label: 'Industry Awards' }
          ]
        }),
        settings: JSON.stringify({ height: 'full', overlay_opacity: 0.7 }),
        is_global: true,
      },
      // About Preview Section
      {
        name: 'Homepage About',
        section_type: 'about_preview',
        content: JSON.stringify({
          heading: 'Where Elegance Meets Excellence',
          subheading: 'Our Story',
          description: 'For over 15 years, Siara Events has been the trusted partner for discerning clients seeking extraordinary celebrations. Our team of visionary planners, designers, and coordinators bring unparalleled expertise and passion to every event we create.\n\nFrom intimate gatherings to grand galas, we believe every celebration deserves the same attention to detail, creative vision, and flawless execution that has become the hallmark of Siara Events.',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80'
          ],
          stats: [
            { value: '15+', label: 'Years of Excellence' },
            { value: '500+', label: 'Events Curated' },
            { value: '50+', label: 'Awards Won' },
            { value: '3', label: 'Global Offices' },
            { value: '98%', label: 'Client Satisfaction' }
          ]
        }),
        settings: JSON.stringify({ layout: 'split' }),
        is_global: true,
      },
      // Services Grid
      {
        name: 'Homepage Services',
        section_type: 'services_grid',
        content: JSON.stringify({
          heading: 'Services Tailored to Perfection',
          subheading: '',
          description: 'Every event is a masterpiece waiting to unfold. Our comprehensive services ensure your vision becomes an extraordinary reality.',
          display_mode: 'all',
          cta: { text: 'View All Services', url: '/services' }
        }),
        settings: JSON.stringify({ columns: 3 }),
        is_global: true,
      },
      // Portfolio Featured
      {
        name: 'Homepage Portfolio',
        section_type: 'portfolio_featured',
        content: JSON.stringify({
          heading: 'Our Portfolio',
          subheading: '',
          description: 'A glimpse into the extraordinary events we\'ve brought to life. Each celebration tells a unique story of elegance and unforgettable moments.',
          display_count: 4,
          cta: { text: 'View Full Portfolio', url: '/portfolio' }
        }),
        settings: JSON.stringify({ layout: 'grid' }),
        is_global: true,
      },
      // Testimonials Carousel
      {
        name: 'Homepage Testimonials',
        section_type: 'testimonials_carousel',
        content: JSON.stringify({
          heading: 'Words from Our Cherished Clients',
          subheading: '',
          description: 'Discover why discerning clients trust Siara Events to bring their most important celebrations to life.'
        }),
        settings: JSON.stringify({ autoplay: true, slides_per_view: 2 }),
        is_global: true,
      },
      // Blog Grid
      {
        name: 'Homepage Blog',
        section_type: 'blog_grid',
        content: JSON.stringify({
          heading: 'From Our Journal',
          subheading: 'Insights & Inspiration',
          description: 'Expert insights, inspiring stories, and the latest trends in luxury event design and planning.',
          display_count: 3,
          display_mode: 'featured',
          cta: { text: 'View All Articles', url: '/blog' }
        }),
        settings: JSON.stringify({ columns: 3 }),
        is_global: true,
      },
      // CTA Banner
      {
        name: 'Homepage CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Ready to Start Planning?',
          subheading: 'Let us transform your vision into an extraordinary celebration. Book a complimentary consultation and discover how Siara Events can make your dreams a reality.',
          cta_primary: { text: 'Schedule Consultation', url: '/contact' },
          cta_secondary: { text: '', url: '' },
          background_style: 'gradient'
        }),
        settings: JSON.stringify({}),
        is_global: true,
      },
      // FAQ Section (NOT global - only for Services page)
      {
        name: 'Service FAQ',
        section_type: 'faq_accordion',
        content: JSON.stringify({
          heading: 'Frequently Asked Questions',
          items: [
            {
              question: 'How far in advance should I book your services?',
              answer: 'We recommend booking at least 6-12 months in advance for weddings and large events. For corporate events, 3-6 months is ideal.'
            },
            {
              question: 'Do you work with specific budgets?',
              answer: 'Yes, we work with a range of budgets and can customize our services to match your requirements while maintaining our high standards.'
            },
            {
              question: 'What areas do you serve?',
              answer: 'We primarily serve Rajasthan (Jaipur, Udaipur, Jodhpur) and North India, but we also organize destination events across India and internationally.'
            },
            {
              question: 'Can you handle multiple events on the same day?',
              answer: 'Our dedicated team structure ensures each event receives undivided attention. We limit the number of events to maintain our quality standards.'
            }
          ]
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'services',
      },
      
      // =============================================
      // ABOUT PAGE SECTIONS
      // =============================================
      {
        name: 'About Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Meet Siara Events',
          highlight_text: 'Rajasthan\'s Premier Wedding Planners',
          subheading: 'Trusted <strong>luxury event management</strong> in <strong class="text-siara-gold-400">Jaipur, Udaipur, and Jodhpur</strong>. Crafting extraordinary celebrations that honor tradition while embracing modern elegance.',
          category_badge: 'Since 2008',
          background_image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1920&auto=format&fit=crop&q=80',
          cta_primary: { text: 'Book Consultation', url: '/contact' },
          cta_secondary: { text: 'View Our Work', url: '/portfolio' },
        }),
        settings: JSON.stringify({ height: 'large', overlay_opacity: 0.85 }),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Story',
        section_type: 'about_story',
        content: JSON.stringify({
          subheading: '• Our Story',
          heading: 'A Legacy of Creating',
          highlight: 'Unforgettable Moments',
          paragraph1: 'Founded in 2008 in the heart of **Jaipur**, Siara Events began with a simple yet profound mission: to transform the traditional Indian wedding into an extraordinary, personalized celebration. What started as a small team of passionate planners has grown into **Rajasthan\'s most trusted luxury wedding planning company**, with offices across Jaipur, Udaipur, and Jodhpur.',
          paragraph2: 'Our journey is rooted in deep respect for the rich cultural heritage of Rajasthan. We\'ve spent over 16 years building relationships with the region\'s most prestigious venues—from the historic Rambagh Palace to the floating Taj Lake Palace, from the magnificent Mehrangarh Fort to boutique heritage properties hidden in the Aravallis.',
          paragraph3: 'Today, Siara Events is synonymous with excellence in **destination wedding planning in North India**. We blend timeless traditions with contemporary elegance, creating celebrations that are as unique as the couples we serve. Every wedding we plan tells a story—your story—set against the backdrop of India\'s most romantic landscapes.',
          years_count: '16+',
          founder_name: 'Rajesh Sharma',
          founder_title: 'Founder & Creative Director',
          founder_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80',
          ],
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Values',
        section_type: 'about_values',
        content: JSON.stringify({
          heading: 'The Siara Events Difference',
          subheading: 'Why Choose Us',
          description: 'What sets the <strong>best wedding planner in Rajasthan</strong> apart? It\'s our unwavering commitment to these core values.',
          values: [
            {
              icon: 'heart',
              title: 'Personalized Planning',
              description: 'Every celebration is unique. We craft bespoke experiences that reflect your personality, heritage, and love story—never cookie-cutter, always extraordinary.',
            },
            {
              icon: 'location',
              title: 'Local Knowledge',
              description: 'With 16+ years in Rajasthan, we know every palace, every tradition, every hidden gem. Our local expertise unlocks exclusive experiences others simply can\'t offer.',
            },
            {
              icon: 'team',
              title: 'Expert Team',
              description: 'Our team of 50+ professionals includes designers, coordinators, and specialists who bring world-class expertise to every event, big or small.',
            },
            {
              icon: 'check',
              title: 'Flawless Execution',
              description: 'We obsess over details so you don\'t have to. From the first meeting to the final farewell, every moment is meticulously planned and perfectly executed.',
            },
            {
              icon: 'money',
              title: 'Transparent Pricing',
              description: 'No hidden fees, no surprises. We believe in complete transparency, providing detailed breakdowns so you always know exactly where your investment goes.',
            },
            {
              icon: 'star',
              title: 'Creative Excellence',
              description: 'Our award-winning design team creates stunning visual experiences—from décor concepts to floral artistry—that transform venues into magical wonderlands.',
            },
          ],
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Timeline',
        section_type: 'timeline',
        content: JSON.stringify({
          subheading: '• Our Journey',
          heading: 'Milestones of Excellence',
          description: 'From our humble beginnings in Jaipur to becoming Rajasthan\'s most trusted wedding planners—here\'s our story.',
          items: [
            {
              year: '2008',
              icon: 'star',
              title: 'Founded in Jaipur',
              description: 'Started with a vision to transform weddings into extraordinary experiences.',
            },
            {
              year: '2012',
              icon: 'palace',
              title: 'First Palace Wedding',
              description: 'Executed our first wedding at Rambagh Palace, setting a new standard for luxury.',
            },
            {
              year: '2015',
              icon: 'location',
              title: 'Udaipur Office Opens',
              description: 'Expanded to the City of Lakes to serve destination wedding couples.',
            },
            {
              year: '2017',
              icon: 'confetti',
              title: '100th Wedding Milestone',
              description: 'Celebrated our 100th successful wedding with a 100% satisfaction record.',
            },
            {
              year: '2019',
              icon: 'mountain',
              title: 'Jodhpur Office Opens',
              description: 'Extended our reach to the Blue City, adding fort weddings to our portfolio.',
            },
          ],
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Stats',
        section_type: 'stats_counter',
        content: JSON.stringify({
          heading: 'Numbers That Speak Excellence',
          subheading: 'Our Achievements',
          description: 'Over 16 years, we\'ve built a legacy of trust and excellence as <strong>Rajasthan\'s leading wedding planners</strong>.',
          stats: [
            { value: '16+', label: 'Years of Excellence', icon: '🏆', description: 'Trusted since 2008' },
            { value: '500+', label: 'Events Curated', icon: '💍', description: 'Across India & abroad' },
            { value: '50+', label: 'Venue Partners', icon: '🏰', description: 'Exclusive access' },
            { value: '98%', label: 'Client Satisfaction', icon: '⭐', description: '5-star reviews' },
            { value: '25+', label: 'Industry Awards', icon: '🎖️', description: 'National & international' },
            { value: '3', label: 'Regional Offices', icon: '📍', description: 'Jaipur, Udaipur, Jodhpur' },
          ],
          trust_indicators: [
            { platform: 'WedMeGood', rating: '4.9/5' },
            { platform: 'WeddingWire', rating: '5.0/5' },
            { platform: 'Google', rating: '4.8/5' },
            { platform: 'Zomato Events', rating: '4.9/5' },
          ],
        }),
        settings: JSON.stringify({ style: 'dark' }),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Team',
        section_type: 'about_team',
        content: JSON.stringify({
          heading: 'Meet the Visionaries',
          subheading: 'Our Leadership',
          description: 'Our leadership team combines decades of experience in luxury hospitality, event design, and deep expertise in Rajasthan\'s wedding culture.',
          team: [
            {
              name: 'Rajesh Sharma',
              role: 'Founder & Creative Director',
              image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
              bio: '20+ years in luxury hospitality. Former Taj Hotels executive turned wedding visionary.',
              linkedin: '#',
              instagram: '#',
            },
            {
              name: 'Priya Mehta',
              role: 'Lead Wedding Designer',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
              bio: 'Award-winning designer specializing in Rajasthani heritage aesthetics and contemporary fusion.',
              linkedin: '#',
              instagram: '#',
            },
            {
              name: 'Amit Verma',
              role: 'Operations Director',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
              bio: 'Logistics expert managing 100+ weddings annually across Rajasthan\'s most prestigious venues.',
              linkedin: '#',
              instagram: '#',
            },
            {
              name: 'Kavita Singh',
              role: 'Head of Client Relations',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
              bio: 'Dedicated to creating personalized experiences and ensuring every client feels like royalty.',
              linkedin: '#',
              instagram: '#',
            },
            {
              name: 'Vikram Rathore',
              role: 'Udaipur Office Head',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
              bio: 'Native Udaipur expert with exclusive access to Lake Pichola\'s most coveted venues.',
              linkedin: '#',
              instagram: '#',
            },
            {
              name: 'Ananya Joshi',
              role: 'Jodhpur Office Head',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
              bio: 'Specialist in fort weddings and desert celebrations with deep Marwar cultural knowledge.',
              linkedin: '#',
              instagram: '#',
            },
          ],
          team_note: 'Plus a dedicated team of <strong>50+ professionals</strong> including designers, coordinators, and specialists across our three offices.',
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Testimonials',
        section_type: 'testimonials_carousel',
        content: JSON.stringify({
          heading: 'What Our Clients Say',
          subheading: 'Client Love',
          description: 'Hear from the couples and families who trusted us with their most precious moments.'
        }),
        settings: JSON.stringify({ autoplay: true, slides_per_view: 2 }),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About Partners',
        section_type: 'about_partners',
        content: JSON.stringify({
          heading: 'Partnerships & Recognition',
          subheading: 'Trusted Partners',
          description: 'We\'re proud to partner with India\'s finest hospitality brands and be recognized by leading media outlets.',
          venue_partners: [
            { name: 'Taj Hotels', logo: '🏨' },
            { name: 'Oberoi Hotels', logo: '⭐' },
            { name: 'Leela Palaces', logo: '👑' },
            { name: 'ITC Hotels', logo: '🌟' },
            { name: 'Rambagh Palace', logo: '🏰' },
            { name: 'Umaid Bhawan', logo: '🏯' },
          ],
          press_features: [
            { name: 'Vogue India', type: 'Featured' },
            { name: 'WedMeGood', type: 'Top Rated' },
            { name: 'Wedding Wire', type: 'Awarded' },
            { name: 'Elle India', type: 'Featured' },
            { name: 'Femina', type: 'Expert Panel' },
            { name: 'The Times of India', type: 'Interviewed' },
          ],
          awards: [
            {
              award: 'Best Destination Wedding Planner',
              org: 'Asian Wedding Awards 2023',
              icon: '🏆',
            },
            {
              award: 'Top Wedding Planner in Rajasthan',
              org: 'WedMeGood Awards 2024',
              icon: '⭐',
            },
            {
              award: 'Excellence in Event Design',
              org: 'India Event Excellence 2023',
              icon: '🎨',
            },
          ],
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      {
        name: 'About CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Contact Rajasthan\'s Best Wedding Planners Today!',
          subheading: 'Whether you dream of a palace wedding in Jaipur, a lakeside celebration in Udaipur, or a fort wedding in Jodhpur—Siara Events is ready to bring your vision to life.',
          cta_primary: { text: 'Book Consultation', url: '/contact' },
          cta_secondary: { text: 'View Portfolio', url: '/portfolio' },
          badge_text: 'Start Your Journey Today',
          background_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80',
          contact_phone: '+91 90240 55545',
          contact_email: 'hello@siaraevents.com',
          contact_whatsapp: '919024055545',
          trust_indicators: [
            { icon: '⭐', text: '5-Star Rated' },
            { icon: '🏆', text: 'Award Winning' },
            { icon: '💍', text: '500+ Weddings' },
            { icon: '🏰', text: '50+ Venue Partners' },
          ],
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'about',
      },
      
      // =============================================
      // SERVICES PAGE SECTIONS
      // =============================================
      {
        name: 'Services Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Exceptional Services',
          subheading: 'From intimate celebrations to grand productions, discover our comprehensive range of luxury event planning services.',
          category_badge: 'Our Expertise',
          highlight_text: 'Services',
          background_image: '',
          cta_primary: { text: 'Get Quote', url: '/contact' },
          cta_secondary: { text: 'View Portfolio', url: '/portfolio' },
        }),
        settings: JSON.stringify({ height: 'large', overlay_opacity: 0.8 }),
        is_global: false,
        page_slug: 'services',
      },
      {
        name: 'Services Grid',
        section_type: 'services_grid',
        content: JSON.stringify({
          heading: 'Services Tailored to Perfection',
          subheading: 'Our Expertise',
          description: 'From intimate celebrations to grand productions, discover our comprehensive range of luxury event planning services.',
          display_mode: 'all',
          cta: { text: 'View All Services', url: '/services' }
        }),
        settings: JSON.stringify({ columns: 3, show_description: true }),
        is_global: false,
        page_slug: 'services',
      },
      {
        name: 'Services FAQ',
        section_type: 'faq_accordion',
        content: JSON.stringify({
          heading: 'Frequently Asked Questions',
          subheading: 'Have Questions?',
          items: [
            {
              question: 'What is included in your wedding planning packages?',
              answer: 'Our packages include venue selection, vendor coordination, design & decor, timeline management, guest coordination, and day-of execution. Each package can be customized to your needs.'
            },
            {
              question: 'Do you offer destination wedding services?',
              answer: 'Yes! We specialize in destination weddings across Rajasthan and can help plan events at palaces, forts, and luxury resorts in Jaipur, Udaipur, Jodhpur, and beyond.'
            },
            {
              question: 'How do you handle budgets?',
              answer: 'We work with various budgets and provide transparent pricing. Our team helps optimize your budget to maximize value while maintaining quality.'
            },
          ]
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'services',
      },
      {
        name: 'Services CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Ready to Plan Your Dream Event?',
          subheading: 'Get in touch for a free consultation.',
          cta_primary: { text: 'Contact Us', url: '/contact' },
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'services',
      },
      
      // =============================================
      // PORTFOLIO PAGE SECTIONS
      // =============================================
      {
        name: 'Portfolio Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Our Wedding\nPortfolio',
          subheading: 'Discover our collection of luxury destination weddings at Rajasthan\'s most prestigious palaces—crafted by the best wedding planner in India.',
          background_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80',
          cta_primary: { text: 'Start Planning', url: '/contact' },
        }),
        settings: JSON.stringify({ height: 'large', overlay_opacity: 0.8 }),
        is_global: false,
        page_slug: 'portfolio',
      },
      {
        name: 'Portfolio Featured',
        section_type: 'portfolio_featured',
        content: JSON.stringify({
          heading: 'Our Signature Portfolio',
          subheading: 'Featured Celebrations',
          description: 'A glimpse into the extraordinary events we\'ve brought to life. Each celebration tells a unique story of elegance and unforgettable moments.',
          display_count: 6,
          display_mode: 'featured',
          cta: { text: 'View Full Portfolio', url: '/portfolio' }
        }),
        settings: JSON.stringify({ columns: 3, show_details: true }),
        is_global: false,
        page_slug: 'portfolio',
      },
      {
        name: 'Portfolio CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Ready to Create Your Own Story?',
          subheading: 'Let us plan your dream wedding.',
          cta_primary: { text: 'Get Started', url: '/contact' },
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'portfolio',
      },
      
      // =============================================
      // BLOG PAGE SECTIONS
      // =============================================
      {
        name: 'Blog Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Wedding Planning Insights',
          subheading: 'Expert tips, venue guides, and inspiration from Rajasthan\'s premier wedding planners.',
          background_image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920&auto=format&fit=crop&q=80',
        }),
        settings: JSON.stringify({ height: 'large', overlay_opacity: 0.8 }),
        is_global: false,
        page_slug: 'blog',
      },
      {
        name: 'Blog Grid',
        section_type: 'blog_grid',
        content: JSON.stringify({
          heading: 'Blog Articles',
          subheading: 'Insights & Inspiration',
          description: 'Expert insights, inspiring stories, and the latest trends in luxury event design and planning. Stay updated with our latest wedding planning tips, venue guides, and inspiration from Rajasthan\'s premier wedding planners.',
          display_count: 6,
          display_mode: 'all',
          show_sidebar: true,
        }),
        settings: JSON.stringify({ columns: 3 }),
        is_global: false,
        page_slug: 'blog',
      },
      {
        name: 'Blog CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Ready to Start Planning?',
          subheading: 'Our team is here to help bring your vision to life.',
          cta_primary: { text: 'Contact Us', url: '/contact' },
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'blog',
      },
      
      // =============================================
      // CONTACT PAGE SECTIONS
      // =============================================
      {
        name: 'Contact Hero',
        section_type: 'hero',
        content: JSON.stringify({
          heading: 'Let\'s Plan Your Dream Event',
          subheading: 'Ready to start planning? Our team is here to help bring your vision to life.',
          background_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&auto=format&fit=crop&q=80',
        }),
        settings: JSON.stringify({ height: 'large', overlay_opacity: 0.8 }),
        is_global: false,
        page_slug: 'contact',
      },
      {
        name: 'Contact Form',
        section_type: 'contact_form',
        content: JSON.stringify({
          heading: 'Get in Touch',
          subheading: 'SEND US A MESSAGE',
          description: '',
        }),
        settings: JSON.stringify({ show_offices: false }),
        is_global: false,
        page_slug: 'contact',
      },
      {
        name: 'Contact FAQ',
        section_type: 'faq_accordion',
        content: JSON.stringify({
          heading: 'Frequently Asked Questions',
          items: [
            {
              question: 'What are your office hours?',
              answer: 'We\'re available Monday-Friday 10am-7pm and Saturday 10am-5pm. For urgent matters, you can reach us via WhatsApp anytime.'
            },
            {
              question: 'How quickly do you respond to inquiries?',
              answer: 'We aim to respond to all inquiries within 24 hours during business days.'
            },
            {
              question: 'Do you offer virtual consultations?',
              answer: 'Yes! We offer video consultations via Zoom or Google Meet for clients who prefer remote meetings.'
            },
          ]
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'contact',
      },
      {
        name: 'Contact CTA',
        section_type: 'cta_banner',
        content: JSON.stringify({
          heading: 'Ready to Begin Your Wedding Journey?',
          subheading: 'Let\'s create something extraordinary together.',
          cta_primary: { text: 'Call Us', url: 'tel:+919024055545' },
          cta_secondary: { text: 'WhatsApp Us', url: 'https://wa.me/919024055545' },
        }),
        settings: JSON.stringify({}),
        is_global: false,
        page_slug: 'contact',
      },
    ];

    // First, delete ALL existing sections to avoid duplicates
    console.log('  🗑️  Cleaning up existing sections...');
    
    // Delete duplicates by keeping only the latest one per name
    await connection.query(`
      DELETE s1 FROM sections s1
      INNER JOIN sections s2 
      WHERE s1.id < s2.id AND s1.name = s2.name
    `);
    
    // Then delete all and re-insert fresh
    await connection.query('DELETE FROM sections');
    console.log('  ✓ All existing sections deleted');

    // Now insert fresh sections
    for (const section of sections) {
      await connection.query(
        `INSERT INTO sections (name, section_type, content, settings, is_global, status) 
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [section.name, section.section_type, section.content, section.settings, section.is_global ? 1 : 0]
      );
      console.log(`  ✓ Section: ${section.name}`);
    }

    // =============================================
    // SEED TESTIMONIALS
    // =============================================
    console.log('\n💬 Seeding testimonials...');

    const testimonials = [
      {
        client_name: 'Priya & Rahul Sharma',
        client_title: 'Jaipur Palace Wedding',
        quote: 'Siara Events transformed our wedding into a fairy tale. Every detail was perfect, from the traditional ceremonies to the grand reception. They understood our vision and exceeded all expectations.',
        rating: 5,
        event_type: 'Luxury Wedding',
        location: 'Jaipur',
        is_featured: true,
        display_order: 1,
      },
      {
        client_name: 'Ananya & Vikram Mehra',
        client_title: 'Lake Palace Celebration',
        quote: 'Our Udaipur wedding was nothing short of magical. The Siara team handled everything with such grace and professionalism. Our guests are still talking about it!',
        rating: 5,
        event_type: 'Destination Wedding',
        location: 'Udaipur',
        is_featured: true,
        display_order: 2,
      },
      {
        client_name: 'Rajesh Kumar',
        client_title: 'CEO, TechCorp India',
        quote: 'We\'ve worked with Siara Events for our annual corporate galas for 5 years now. Their attention to detail and ability to create impressive corporate experiences is unmatched.',
        rating: 5,
        event_type: 'Corporate Gala',
        location: 'Delhi',
        is_featured: true,
        display_order: 3,
      },
      {
        client_name: 'Meera & Arjun Singh',
        client_title: 'Royal Heritage Wedding',
        quote: 'From the moment we met the Siara team, we knew we were in good hands. They created a wedding that honored our traditions while adding modern elegance.',
        rating: 5,
        event_type: 'Luxury Wedding',
        location: 'Jodhpur',
        is_featured: true,
        display_order: 4,
      },
    ];

    for (const testimonial of testimonials) {
      await connection.query(
        `INSERT INTO testimonials (client_name, client_title, quote, rating, event_type, location, is_featured, display_order, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
         ON DUPLICATE KEY UPDATE quote = VALUES(quote)`,
        [
          testimonial.client_name,
          testimonial.client_title,
          testimonial.quote,
          testimonial.rating,
          testimonial.event_type,
          testimonial.location,
          testimonial.is_featured ? 1 : 0,
          testimonial.display_order
        ]
      );
      console.log(`  ✓ Testimonial: ${testimonial.client_name}`);
    }

    // =============================================
    // SEED SERVICES
    // =============================================
    console.log('\n🎯 Seeding services...');
    
    // Remove old "Luxury Weddings" service if it exists
    await connection.query('DELETE FROM services WHERE slug = "luxury-weddings"');

    const services = [
      {
        slug: 'weddings-ceremonies',
        name: 'Weddings & Ceremonies',
        short_description: 'From intimate garden ceremonies to grand ballroom celebrations, we orchestrate every detail of your perfect day with meticulous precision and artistic flair.',
        full_description: 'From intimate garden ceremonies to grand ballroom celebrations, we orchestrate every detail of your perfect day with meticulous precision and artistic flair. Our comprehensive wedding planning services ensure your special day is nothing short of extraordinary.',
        icon: 'wedding',
        featured_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({
          basic: { name: 'Essential', price: '₹15L+', features: ['Venue Selection', 'Basic Decor', 'Coordination'] },
          premium: { name: 'Premium', price: '₹35L+', features: ['Custom Theme', 'Premium Vendors', 'Full Planning'] },
          luxury: { name: 'Luxury', price: '₹75L+', features: ['Bespoke Design', 'Celebrity Vendors', 'White Glove Service'] }
        }),
        inclusions: JSON.stringify(['Venue Selection', 'Décor Design', 'Coordination']),
        is_featured: true,
        display_order: 1,
      },
      {
        slug: 'corporate-galas',
        name: 'Corporate Galas',
        short_description: 'Elevate your brand with sophisticated corporate events that leave lasting impressions. From product launches to annual celebrations, we deliver excellence.',
        full_description: 'Elevate your brand with sophisticated corporate events that leave lasting impressions. From product launches to annual celebrations, we deliver excellence. Our corporate event planning ensures your brand message is communicated with style and impact.',
        icon: 'corporate',
        featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({}),
        inclusions: JSON.stringify(['Brand Integration', 'AV Production', 'VIP Management']),
        is_featured: true,
        display_order: 2,
      },
      {
        slug: 'private-celebrations',
        name: 'Private Celebrations',
        short_description: 'Birthdays, anniversaries, and milestones deserve extraordinary attention. We create intimate gatherings that reflect your unique story and style.',
        full_description: 'Birthdays, anniversaries, and milestones deserve extraordinary attention. We create intimate gatherings that reflect your unique story and style. Every celebration is personalized to honor your special moments.',
        icon: 'private',
        featured_image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({}),
        inclusions: JSON.stringify(['Theme Development', 'Catering Design', 'Entertainment']),
        is_featured: true,
        display_order: 3,
      },
      {
        slug: 'fashion-shows',
        name: 'Fashion Shows',
        short_description: 'Transform runway dreams into stunning reality. Our expertise in fashion event production ensures your collection makes the statement it deserves.',
        full_description: 'Transform runway dreams into stunning reality. Our expertise in fashion event production ensures your collection makes the statement it deserves. From concept to execution, we bring your fashion vision to life.',
        icon: 'fashion',
        featured_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({}),
        inclusions: JSON.stringify(['Stage Design', 'Model Coordination', 'Media Relations']),
        is_featured: true,
        display_order: 4,
      },
      {
        slug: 'destination-events',
        name: 'Destination Events',
        short_description: 'From Tuscan vineyards to Caribbean beaches, we bring your vision to life in the world\'s most breathtaking locations with seamless logistics.',
        full_description: 'From Tuscan vineyards to Caribbean beaches, we bring your vision to life in the world\'s most breathtaking locations with seamless logistics. Our destination event expertise ensures flawless execution no matter where your celebration takes place.',
        icon: 'destination',
        featured_image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({}),
        inclusions: JSON.stringify(['Location Scouting', 'Travel Management', 'Local Liaisons']),
        is_featured: true,
        display_order: 5,
      },
      {
        slug: 'conference-summits',
        name: 'Conference & Summits',
        short_description: 'Command attention with impeccably organized conferences that inspire thought leadership and foster meaningful connections across industries.',
        full_description: 'Command attention with impeccably organized conferences that inspire thought leadership and foster meaningful connections across industries. We create professional environments that facilitate learning, networking, and business growth.',
        icon: 'conference',
        featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        pricing: JSON.stringify({}),
        inclusions: JSON.stringify(['Speaker Management', 'Tech Integration', 'Networking Design']),
        is_featured: true,
        display_order: 6,
      },
    ];

    for (const service of services) {
      await connection.query(
        `INSERT INTO services (slug, name, short_description, full_description, icon, featured_image, pricing, inclusions, is_featured, display_order, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           short_description = VALUES(short_description),
           full_description = VALUES(full_description),
           icon = VALUES(icon),
           featured_image = VALUES(featured_image),
           pricing = VALUES(pricing),
           inclusions = VALUES(inclusions),
           is_featured = VALUES(is_featured),
           display_order = VALUES(display_order)`,
        [
          service.slug,
          service.name,
          service.short_description,
          service.full_description,
          service.icon,
          service.featured_image,
          service.pricing,
          service.inclusions,
          service.is_featured ? 1 : 0,
          service.display_order
        ]
      );
      console.log(`  ✓ Service: ${service.name}`);
    }

    // =============================================
    // SEED PORTFOLIO
    // =============================================
    console.log('\n🖼️ Seeding portfolio...');

    const portfolioItems = [
      {
        slug: 'royal-jaipur-palace-wedding',
        title: 'The Royal Jaipur Palace Wedding',
        subtitle: 'A Celebration of Love and Tradition',
        event_type: 'Destination Wedding',
        location: 'Jaipur, Rajasthan',
        venue: 'Rambagh Palace',
        event_date: '2024-12-15',
        client_name: 'Priya & Rahul',
        summary: 'A magnificent three-day celebration honoring Rajasthani royal traditions at the iconic Rambagh Palace.',
        featured_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
        is_featured: true,
      },
      {
        slug: 'udaipur-lake-palace-wedding',
        title: 'The Lake Palace Dream',
        subtitle: 'Romance on the Waters of Pichola',
        event_type: 'Destination Wedding',
        location: 'Udaipur, Rajasthan',
        venue: 'Taj Lake Palace',
        event_date: '2024-11-20',
        client_name: 'Ananya & Vikram',
        summary: 'An ethereal wedding celebration on the serene waters of Lake Pichola at the floating palace.',
        featured_image: 'https://images.unsplash.com/photo-1585223990561-e48f3e6a5c42?w=800&auto=format&fit=crop&q=80',
        is_featured: true,
      },
      {
        slug: 'jodhpur-mehrangarh-celebration',
        title: 'Mehrangarh Fort Magnificence',
        subtitle: 'A Wedding Above the Blue City',
        event_type: 'Royal Wedding',
        location: 'Jodhpur, Rajasthan',
        venue: 'Mehrangarh Fort',
        event_date: '2024-10-10',
        client_name: 'Meera & Arjun',
        summary: 'A majestic wedding under the stars at one of India\'s most impressive fortress palaces.',
        featured_image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
        is_featured: true,
      },
    ];

    for (const item of portfolioItems) {
      await connection.query(
        `INSERT INTO portfolio (slug, title, subtitle, event_type, location, venue, event_date, client_name, summary, featured_image, is_featured, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
         ON DUPLICATE KEY UPDATE 
           title = VALUES(title),
           subtitle = VALUES(subtitle),
           event_type = VALUES(event_type),
           location = VALUES(location),
           venue = VALUES(venue),
           summary = VALUES(summary),
           featured_image = VALUES(featured_image),
           is_featured = VALUES(is_featured)`,
        [
          item.slug,
          item.title,
          item.subtitle,
          item.event_type,
          item.location,
          item.venue,
          item.event_date,
          item.client_name,
          item.summary,
          item.featured_image,
          item.is_featured ? 1 : 0
        ]
      );
      console.log(`  ✓ Portfolio: ${item.title}`);
    }

    // =============================================
    // SEED BLOGS
    // =============================================
    console.log('\n📝 Seeding blog posts...');

    // Get admin user ID
    const [adminUser] = await connection.query(
      'SELECT id FROM users WHERE role = "admin" LIMIT 1'
    );
    const authorId = adminUser.length > 0 ? adminUser[0].id : 1;

    const blogs = [
      {
        slug: 'ultimate-wedding-planning-checklist',
        title: 'The Ultimate Wedding Planning Checklist: Your 12-Month Guide',
        excerpt: 'Planning a wedding can feel overwhelming, but with our comprehensive 12-month checklist, you\'ll stay organized and stress-free. From booking venues to finalizing details, we\'ve got you covered.',
        content: '<p>Planning your dream wedding requires careful organization and attention to detail. This comprehensive guide will walk you through every step of the process, ensuring nothing is overlooked.</p><h2>12 Months Before</h2><p>Start by setting your budget and creating a guest list. Book your venue early, especially if you\'re planning a destination wedding in Rajasthan.</p><h2>6 Months Before</h2><p>Finalize your vendors, send save-the-dates, and begin dress fittings. This is also the time to book your photographer and videographer.</p><h2>3 Months Before</h2><p>Send out invitations, finalize menu selections, and schedule hair and makeup trials. Confirm all vendor bookings.</p><h2>1 Month Before</h2><p>Finalize seating arrangements, confirm final guest count, and have your final dress fitting. Create a day-of timeline.</p>',
        featured_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        category: 'Wedding Planning',
        tags: JSON.stringify(['wedding planning', 'checklist', 'tips', 'guide']),
        status: 'published',
        read_time: 8,
        published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
      {
        slug: 'best-wedding-venues-rajasthan',
        title: 'Top 10 Luxury Wedding Venues in Rajasthan: Palaces & Heritage Properties',
        excerpt: 'Discover the most stunning wedding venues in Rajasthan, from royal palaces in Jaipur to lakeside properties in Udaipur. Our curated list features the best heritage venues for your special day.',
        content: '<p>Rajasthan offers some of the most breathtaking wedding venues in India. From royal palaces to heritage hotels, each venue tells a story of grandeur and elegance.</p><h2>Jaipur - The Pink City</h2><p>Jaipur boasts magnificent palaces like Rambagh Palace and Samode Palace, perfect for royal celebrations.</p><h2>Udaipur - The City of Lakes</h2><p>Lake Pichola and Fateh Sagar Lake provide stunning backdrops for destination weddings. The Oberoi Udaivilas and Taj Lake Palace are among the most sought-after venues.</p><h2>Jodhpur - The Blue City</h2><p>Umaid Bhawan Palace and Mehrangarh Fort offer unparalleled views and royal experiences.</p>',
        featured_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
        category: 'Venues',
        tags: JSON.stringify(['venues', 'rajasthan', 'palaces', 'heritage']),
        status: 'published',
        read_time: 10,
        published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
      {
        slug: 'wedding-trends-2024',
        title: 'Wedding Trends 2024: What\'s Hot in Luxury Celebrations',
        excerpt: 'From sustainable decor to intimate micro-weddings, discover the latest trends shaping luxury weddings in 2024. Stay ahead of the curve with these innovative ideas.',
        content: '<p>2024 brings exciting new trends to the wedding industry. Couples are embracing sustainability, personalization, and intimate celebrations.</p><h2>Sustainable Weddings</h2><p>Eco-friendly decor, locally sourced flowers, and zero-waste celebrations are becoming increasingly popular.</p><h2>Micro-Weddings</h2><p>Intimate celebrations with 50-100 guests allow for more personalized experiences and meaningful connections.</p><h2>Fusion Themes</h2><p>Blending traditional and modern elements creates unique, memorable celebrations that reflect the couple\'s personality.</p>',
        featured_image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
        category: 'Trends',
        tags: JSON.stringify(['trends', '2024', 'luxury', 'wedding ideas']),
        status: 'published',
        read_time: 6,
        published_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
      {
        slug: 'budget-friendly-wedding-tips',
        title: 'How to Plan a Luxury Wedding on a Budget: Smart Tips & Tricks',
        excerpt: 'You don\'t have to break the bank to have a beautiful wedding. Learn expert tips for creating a luxurious celebration while staying within your budget.',
        content: '<p>Planning a luxury wedding doesn\'t mean you have to spend a fortune. With smart planning and strategic choices, you can create an unforgettable celebration within your budget.</p><h2>Prioritize Your Must-Haves</h2><p>Identify the elements that matter most to you and allocate your budget accordingly. Whether it\'s the venue, photography, or entertainment, focus on what will create lasting memories.</p><h2>Choose the Right Season</h2><p>Off-season weddings can save you 20-30% on venue and vendor costs while still providing beautiful experiences.</p><h2>DIY Where Possible</h2><p>Personal touches and DIY elements can add charm while reducing costs. Consider making your own centerpieces or favors.</p>',
        featured_image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
        category: 'Budget Tips',
        tags: JSON.stringify(['budget', 'tips', 'saving money', 'planning']),
        status: 'published',
        read_time: 7,
        published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
      {
        slug: 'rajasthani-wedding-traditions',
        title: 'Rajasthani Wedding Traditions: A Complete Guide to Royal Customs',
        excerpt: 'Explore the rich traditions and customs of Rajasthani weddings. From Pithi Dastoor to Pheras, understand the significance of each ceremony in this royal celebration.',
        content: '<p>Rajasthani weddings are known for their grandeur, vibrant colors, and rich traditions that have been passed down through generations.</p><h2>Pre-Wedding Ceremonies</h2><p>Pithi Dastoor, Mehendi, and Sangeet mark the beginning of wedding celebrations, each with its own significance and rituals.</p><h2>Wedding Day</h2><p>The main wedding ceremony includes Baraat, Jaimala, Kanyadaan, and Pheras - each step filled with meaning and tradition.</p><h2>Post-Wedding</h2><p>Vidaai and Griha Pravesh complete the wedding journey, marking the bride\'s transition to her new home.</p>',
        featured_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
        category: 'Traditions',
        tags: JSON.stringify(['traditions', 'rajasthan', 'customs', 'culture']),
        status: 'published',
        read_time: 9,
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
      {
        slug: 'destination-wedding-guide',
        title: 'Planning Your Dream Destination Wedding: Complete Guide',
        excerpt: 'Everything you need to know about planning a destination wedding in Rajasthan. From venue selection to guest management, make your dream wedding a reality.',
        content: '<p>Destination weddings offer unique experiences but require careful planning. This guide covers everything from choosing the perfect location to managing guest logistics.</p><h2>Choosing Your Destination</h2><p>Consider accessibility, weather, and local regulations when selecting your destination. Rajasthan offers year-round options with different experiences each season.</p><h2>Guest Management</h2><p>Provide clear information about travel, accommodation, and local customs. Consider creating a wedding website with all details.</p><h2>Local Vendors</h2><p>Working with local vendors who understand the destination can save time and ensure authentic experiences.</p>',
        featured_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
        category: 'Destinations',
        tags: JSON.stringify(['destination wedding', 'travel', 'planning', 'rajasthan']),
        status: 'published',
        read_time: 12,
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      },
    ];

    for (const blog of blogs) {
      await connection.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, author_id, category, tags, status, read_time, published_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content)`,
        [
          blog.slug,
          blog.title,
          blog.excerpt,
          blog.content,
          blog.featured_image,
          authorId,
          blog.category,
          blog.tags,
          blog.status,
          blog.read_time,
          blog.published_at,
        ]
      );
      console.log(`  ✓ Blog: ${blog.title}`);
    }

    // =============================================
    // LINK SECTIONS TO PAGES
    // =============================================
    console.log('\n🔗 Linking sections to pages...');

    // Get home page global sections in order (Hero first) - Only Homepage sections
    const homeSectionNames = [
      'Homepage Hero',
      'Homepage About',
      'Homepage Services',
      'Homepage Portfolio',
      'Homepage Testimonials',
      'Homepage Blog',
      'Homepage CTA'
    ];
    
    // Get one section per name (highest ID if duplicates exist)
    const [homeSectionRows] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.is_global = 1
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [homeSectionNames, homeSectionNames]
    );
    
    const uniqueSectionIds = homeSectionRows.map(s => s.id);
    
    await connection.query(
      'UPDATE pages SET sections = ? WHERE slug = "home"',
      [JSON.stringify(uniqueSectionIds)]
    );
    console.log('  ✓ Home page sections linked (', uniqueSectionIds.length, 'sections):', homeSectionRows.map(s => s.name).join(', '));
    
    // Link About page sections - specific names only (get only latest one per name)
    // Order: 1. Meet Siara Events, 2. A Legacy of Creating Unforgettable Moments, 3. The Siara Events Difference, 4. Numbers That Speak Excellence, 5. Meet the Visionaries, 6. Milestones of Excellence, 7. What Our Clients Say, 8. Partnerships & Recognition, 9. Contact Rajasthan's Best Wedding
    const aboutSectionNames = ['About Hero', 'About Story', 'About Values', 'About Stats', 'About Team', 'About Timeline', 'About Testimonials', 'About Partners', 'About CTA'];
    const [aboutSections] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [aboutSectionNames, aboutSectionNames]
    );
    if (aboutSections.length > 0) {
      const uniqueAboutIds = [...new Set(aboutSections.map(s => s.id))];
      await connection.query(
        'UPDATE pages SET sections = ? WHERE slug = "about"',
        [JSON.stringify(uniqueAboutIds)]
      );
      console.log('  ✓ About page sections linked (', uniqueAboutIds.length, 'sections):', aboutSections.map(s => s.name).join(', '));
    }
    
    // Link Services page sections - specific names only (get only latest one per name)
    const servicesSectionNames = ['Services Hero', 'Services Grid', 'Services FAQ', 'Services CTA'];
    const [servicesSections] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [servicesSectionNames, servicesSectionNames]
    );
    if (servicesSections.length > 0) {
      const uniqueServicesIds = [...new Set(servicesSections.map(s => s.id))];
      await connection.query(
        'UPDATE pages SET sections = ? WHERE slug = "services"',
        [JSON.stringify(uniqueServicesIds)]
      );
      console.log('  ✓ Services page sections linked (', uniqueServicesIds.length, 'sections):', servicesSections.map(s => s.name).join(', '));
    }
    
    // Link Portfolio page sections - specific names only (get only latest one per name)
    const portfolioSectionNames = ['Portfolio Hero', 'Portfolio Featured', 'Portfolio CTA'];
    const [portfolioSections] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [portfolioSectionNames, portfolioSectionNames]
    );
    if (portfolioSections.length > 0) {
      const uniquePortfolioIds = [...new Set(portfolioSections.map(s => s.id))];
      await connection.query(
        'UPDATE pages SET sections = ? WHERE slug = "portfolio"',
        [JSON.stringify(uniquePortfolioIds)]
      );
      console.log('  ✓ Portfolio page sections linked (', uniquePortfolioIds.length, 'sections):', portfolioSections.map(s => s.name).join(', '));
    }
    
    // Link Blog page sections - specific names only (get only latest one per name)
    const blogSectionNames = ['Blog Hero', 'Blog Grid', 'Blog CTA'];
    const [blogSections] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [blogSectionNames, blogSectionNames]
    );
    if (blogSections.length > 0) {
      const uniqueBlogIds = [...new Set(blogSections.map(s => s.id))];
      await connection.query(
        'UPDATE pages SET sections = ? WHERE slug = "blog"',
        [JSON.stringify(uniqueBlogIds)]
      );
      console.log('  ✓ Blog page sections linked (', uniqueBlogIds.length, 'sections):', blogSections.map(s => s.name).join(', '));
    }
    
    // Link Contact page sections - specific names only (get only latest one per name)
    const contactSectionNames = ['Contact Hero', 'Contact Form', 'Contact FAQ', 'Contact CTA'];
    const [contactSections] = await connection.query(
      `SELECT s1.id, s1.name 
       FROM sections s1
       WHERE s1.name IN (?) 
         AND s1.id = (SELECT MAX(s2.id) FROM sections s2 WHERE s2.name = s1.name)
       ORDER BY FIELD(s1.name, ?)`,
      [contactSectionNames, contactSectionNames]
    );
    if (contactSections.length > 0) {
      const uniqueContactIds = [...new Set(contactSections.map(s => s.id))];
      await connection.query(
        'UPDATE pages SET sections = ? WHERE slug = "contact"',
        [JSON.stringify(uniqueContactIds)]
      );
      console.log('  ✓ Contact page sections linked (', uniqueContactIds.length, 'sections):', contactSections.map(s => s.name).join(', '));
    }

    console.log('\n========================================');
    console.log('🎉 CMS DATA SEEDED SUCCESSFULLY!');
    console.log('========================================\n');

    console.log('Pages created:');
    console.log('  - Home (/)', '');
    console.log('  - About (/about)');
    console.log('  - Services (/services)');
    console.log('  - Portfolio (/portfolio)');
    console.log('  - Blog (/blog)');
    console.log('  - Contact (/contact)');
    console.log('\nYou can now access your website!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedCMS();
