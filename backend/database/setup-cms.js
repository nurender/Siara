const mysql = require('mysql2/promise');
require('dotenv').config();

const setupCMS = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Create CMS Tables
    console.log('\n📦 Creating CMS tables...\n');

    // CMS Pages
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cms_pages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        page_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        meta_title VARCHAR(70),
        meta_description VARCHAR(160),
        meta_keywords VARCHAR(255),
        og_image VARCHAR(500),
        canonical_url VARCHAR(500),
        no_index BOOLEAN DEFAULT FALSE,
        structured_data JSON,
        template VARCHAR(50) DEFAULT 'default',
        header_style VARCHAR(20) DEFAULT 'transparent',
        status VARCHAR(20) DEFAULT 'draft',
        published_at DATETIME,
        created_by INT,
        updated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ cms_pages table created');

    // CMS Sections
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cms_sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        page_id INT,
        name VARCHAR(100) NOT NULL,
        section_type VARCHAR(50) NOT NULL,
        content JSON NOT NULL,
        settings JSON,
        display_order INT DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ cms_sections table created');

    // CMS Navigation
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cms_navigation (
        id INT PRIMARY KEY AUTO_INCREMENT,
        menu_location VARCHAR(20) NOT NULL,
        label VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        target VARCHAR(10) DEFAULT '_self',
        icon VARCHAR(50),
        parent_id INT,
        display_order INT DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ cms_navigation table created');

    // CMS Settings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSON NOT NULL,
        setting_group VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ cms_settings table created');

    // Insert default data
    console.log('\n📝 Inserting default data...\n');

    // Default Settings
    const defaultSettings = [
      ['site_name', '"Siara Events"', 'general'],
      ['site_tagline', '"Crafting Extraordinary Moments"', 'general'],
      ['contact_email', '"hello@siaraevents.com"', 'contact'],
      ['contact_phone', '"+91 98765 43210"', 'contact'],
      ['contact_whatsapp', '"+91 98765 43210"', 'contact'],
      ['social_instagram', '"https://instagram.com/siaraevents"', 'social'],
      ['social_facebook', '"https://facebook.com/siaraevents"', 'social'],
      ['social_pinterest', '"https://pinterest.com/siaraevents"', 'social'],
    ];

    for (const [key, value, group] of defaultSettings) {
      await connection.query(
        `INSERT IGNORE INTO cms_settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)`,
        [key, value, group]
      );
    }
    console.log('✅ Default settings added');

    // Default Navigation
    const headerNav = [
      ['header', 'Home', '/', 1],
      ['header', 'About', '/about', 2],
      ['header', 'Services', '/services', 3],
      ['header', 'Portfolio', '/portfolio', 4],
      ['header', 'Blog', '/blog', 5],
      ['header', 'Contact', '/contact', 6],
    ];

    for (const [location, label, url, order] of headerNav) {
      await connection.query(
        `INSERT IGNORE INTO cms_navigation (menu_location, label, url, display_order) VALUES (?, ?, ?, ?)`,
        [location, label, url, order]
      );
    }
    console.log('✅ Default navigation added');

    // Default Home Page
    const [existingHome] = await connection.query(
      `SELECT id FROM cms_pages WHERE slug = 'home'`
    );

    let homePageId;
    if (existingHome.length === 0) {
      const [homeResult] = await connection.query(
        `INSERT INTO cms_pages (slug, page_type, title, meta_title, meta_description, status, published_at)
         VALUES ('home', 'home', 'Home', 'Siara Events | Luxury Wedding & Event Planner in Rajasthan', 
                 'Siara Events - Premier luxury wedding and event management company in Jaipur, Udaipur & Jodhpur.', 
                 'published', NOW())`
      );
      homePageId = homeResult.insertId;
      console.log('✅ Home page created');
    } else {
      homePageId = existingHome[0].id;
      console.log('✅ Home page already exists');
    }

    // Home Page Sections
    const [existingSections] = await connection.query(
      `SELECT id FROM cms_sections WHERE page_id = ?`,
      [homePageId]
    );

    if (existingSections.length === 0) {
      const sections = [
        {
          name: 'Hero Section',
          type: 'hero',
          content: {
            heading: "Crafting Extraordinary Moments",
            subheading: "Where Dreams Become Breathtaking Realities",
            background_image: "/images/hero-bg.jpg",
            cta_primary: { text: "Plan Your Event", url: "/contact" },
            cta_secondary: { text: "View Portfolio", url: "/portfolio" },
            stats: [
              { value: "500+", label: "Events Crafted" },
              { value: "15+", label: "Years Experience" },
              { value: "50+", label: "Expert Team" },
              { value: "100%", label: "Client Satisfaction" }
            ]
          },
          settings: { height: "full", overlay_opacity: 0.4 },
          order: 1
        },
        {
          name: 'Services Section',
          type: 'services_grid',
          content: {
            heading: "Our Services",
            subheading: "Exceptional Event Experiences",
            description: "From intimate celebrations to grand galas, we offer comprehensive event management services.",
            display_mode: "featured",
            cta: { text: "View All Services", url: "/services" }
          },
          settings: { columns: 3 },
          order: 2
        },
        {
          name: 'Portfolio Section',
          type: 'portfolio_featured',
          content: {
            heading: "Our Portfolio",
            subheading: "Celebrations We Have Crafted",
            display_count: 3,
            cta: { text: "View All Events", url: "/portfolio" }
          },
          settings: { layout: "masonry" },
          order: 3
        },
        {
          name: 'Testimonials Section',
          type: 'testimonials_carousel',
          content: {
            heading: "Client Stories",
            subheading: "What Our Clients Say",
            display_count: 6
          },
          settings: { autoplay: true },
          order: 4
        },
        {
          name: 'CTA Section',
          type: 'cta_banner',
          content: {
            heading: "Ready to Create Something Extraordinary?",
            subheading: "Let us bring your vision to life",
            cta_primary: { text: "Schedule Consultation", url: "/contact" }
          },
          settings: { style: "gradient" },
          order: 5
        }
      ];

      for (const section of sections) {
        await connection.query(
          `INSERT INTO cms_sections (page_id, name, section_type, content, settings, display_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [homePageId, section.name, section.type, JSON.stringify(section.content), JSON.stringify(section.settings), section.order]
        );
      }
      console.log('✅ Home page sections created');
    }

    // Create other pages
    const otherPages = [
      ['about', 'about', 'About Us', 'About Siara Events | Our Story & Team'],
      ['services', 'services', 'Our Services', 'Event Planning Services | Siara Events'],
      ['portfolio', 'portfolio', 'Our Portfolio', 'Event Portfolio | Siara Events'],
      ['blog', 'blog', 'Blog', 'Wedding & Event Planning Blog | Siara Events'],
      ['contact', 'contact', 'Contact Us', 'Contact Siara Events | Get in Touch'],
    ];

    for (const [slug, type, title, metaTitle] of otherPages) {
      await connection.query(
        `INSERT IGNORE INTO cms_pages (slug, page_type, title, meta_title, status, published_at)
         VALUES (?, ?, ?, ?, 'published', NOW())`,
        [slug, type, title, metaTitle]
      );
    }
    console.log('✅ Other pages created');

    console.log('\n========================================');
    console.log('🎉 CMS SETUP COMPLETE!');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Setup error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
};

setupCMS();

