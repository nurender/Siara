const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  let connection;
  
  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created/verified`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('admin', 'user', 'staff') DEFAULT 'user',
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create Contacts Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        event_type VARCHAR(50),
        event_date DATE,
        guest_count INT,
        budget VARCHAR(50),
        venue_preference VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('new', 'contacted', 'qualified', 'converted', 'closed') DEFAULT 'new',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table created');

    // Create Events Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_type ENUM('wedding', 'corporate', 'destination', 'private', 'other') NOT NULL,
        event_date DATE NOT NULL,
        venue VARCHAR(255),
        city VARCHAR(100),
        guest_count INT,
        budget DECIMAL(15, 2),
        client_id INT,
        status ENUM('planning', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'planning',
        created_by INT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Events table created');

    // Create Bookings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        booking_reference VARCHAR(50) UNIQUE,
        event_id INT,
        client_name VARCHAR(100) NOT NULL,
        client_email VARCHAR(100) NOT NULL,
        client_phone VARCHAR(20) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        event_date DATE NOT NULL,
        venue VARCHAR(255),
        guest_count INT,
        package_type ENUM('basic', 'premium', 'luxury', 'custom') DEFAULT 'basic',
        total_amount DECIMAL(15, 2),
        advance_amount DECIMAL(15, 2) DEFAULT 0,
        payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        special_requests TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bookings table created');

    // Create Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        short_description VARCHAR(255),
        full_description TEXT,
        icon VARCHAR(50),
        featured_image VARCHAR(500),
        gallery JSON,
        pricing JSON,
        inclusions JSON,
        process_steps JSON,
        faqs JSON,
        meta_title VARCHAR(70),
        meta_description VARCHAR(160),
        base_price DECIMAL(15, 2),
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        status ENUM('draft', 'published') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Services table created');

    // Create Portfolio Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        event_type VARCHAR(50),
        location VARCHAR(100),
        event_date DATE,
        client_name VARCHAR(100),
        testimonial TEXT,
        featured_image VARCHAR(255),
        gallery JSON,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Portfolio table created');

    // Create Subscribers Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at DATETIME
      )
    `);
    console.log('✅ Subscribers table created');

    // Create Media Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media (
        id INT PRIMARY KEY AUTO_INCREMENT,
        original_name VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_type ENUM('image', 'video', 'document') DEFAULT 'image',
        mime_type VARCHAR(100),
        file_size INT,
        folder VARCHAR(100) DEFAULT 'general',
        alt_text VARCHAR(255),
        caption TEXT,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Media table created');

    // Create Pages Table (CMS)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        page_type ENUM('home', 'about', 'services', 'service_detail', 
                       'portfolio', 'portfolio_detail', 'blog', 'blog_detail', 
                       'contact', 'custom') NOT NULL,
        title VARCHAR(255) NOT NULL,
        meta_title VARCHAR(70),
        meta_description VARCHAR(160),
        og_image VARCHAR(500),
        canonical_url VARCHAR(500),
        no_index BOOLEAN DEFAULT FALSE,
        structured_data JSON,
        sections JSON,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        published_at DATETIME,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Pages table created');

    // Create Sections Table (CMS)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        section_type VARCHAR(50) NOT NULL,
        content JSON NOT NULL,
        settings JSON,
        is_global BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Sections table created');

    // Create Navigation Table (CMS)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS navigation (
        id INT PRIMARY KEY AUTO_INCREMENT,
        menu_location VARCHAR(50) UNIQUE NOT NULL,
        items JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Navigation table created');

    // Create Site Settings Table (CMS)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value JSON NOT NULL,
        setting_group VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Site Settings table created');

    // Create Blog Posts Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        featured_image VARCHAR(500),
        author_id INT,
        category VARCHAR(50),
        tags JSON,
        meta_title VARCHAR(70),
        meta_description VARCHAR(160),
        read_time INT,
        views INT DEFAULT 0,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        published_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Blog Posts table created');

    // Create Testimonials Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_name VARCHAR(100) NOT NULL,
        client_title VARCHAR(100),
        client_image VARCHAR(500),
        quote TEXT NOT NULL,
        rating INT DEFAULT 5,
        event_type VARCHAR(50),
        location VARCHAR(100),
        is_featured BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Testimonials table created');

    // Hash password for admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Check if admin exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@siara.com']
    );

    if (existingAdmin.length > 0) {
      await connection.query(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', 'admin@siara.com']
      );
      console.log('✅ Admin user password updated');
    } else {
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Siara Admin', 'admin@siara.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created');
    }

    // Insert default services
    const services = [
      ['Luxury Weddings', 'luxury-weddings', 'Exquisite wedding experiences crafted with perfection', 1],
      ['Corporate Galas', 'corporate-galas', 'Impressive corporate events that make statements', 2],
      ['Destination Events', 'destination-events', 'Spectacular events at breathtaking locations', 3],
      ['Private Celebrations', 'private-celebrations', 'Intimate celebrations with personal touches', 4]
    ];

    for (const service of services) {
      await connection.query(
        `INSERT IGNORE INTO services (name, slug, short_description, display_order) VALUES (?, ?, ?, ?)`,
        service
      );
    }
    console.log('✅ Default services added');

    // Insert default navigation
    await connection.query(`
      INSERT INTO navigation (menu_location, items) VALUES 
      ('header', '[{"label":"Home","url":"/","order":1},{"label":"About","url":"/about","order":2},{"label":"Services","url":"/services","order":3},{"label":"Portfolio","url":"/portfolio","order":4},{"label":"Blog","url":"/blog","order":5},{"label":"Contact","url":"/contact","order":6}]'),
      ('footer', '[{"label":"Quick Links","items":[{"label":"Home","url":"/"},{"label":"About","url":"/about"},{"label":"Services","url":"/services"},{"label":"Contact","url":"/contact"}]}]')
      ON DUPLICATE KEY UPDATE items = VALUES(items)
    `);
    console.log('✅ Default navigation added');

    // Insert default site settings
    const settings = [
      ['site_name', '"Siara Events"', 'general'],
      ['site_tagline', '"Crafting Extraordinary Moments"', 'general'],
      ['contact_email', '"hello@siaraevents.com"', 'contact'],
      ['contact_phone', '"+91 98765 43210"', 'contact'],
      ['contact_whatsapp', '"+91 98765 43210"', 'contact'],
      ['social_instagram', '"https://instagram.com/siaraevents"', 'social'],
      ['social_facebook', '"https://facebook.com/siaraevents"', 'social'],
    ];

    for (const setting of settings) {
      await connection.query(
        `INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        setting
      );
    }
    console.log('✅ Default site settings added');

    // Insert default home page
    await connection.query(`
      INSERT INTO pages (slug, page_type, title, meta_title, meta_description, status, sections) VALUES 
      ('home', 'home', 'Home', 'Siara Events | Best Wedding Planner in Rajasthan', 
       'Luxury wedding and event planning services in Jaipur, Udaipur & Rajasthan.',
       'published', '[]')
      ON DUPLICATE KEY UPDATE title = VALUES(title)
    `);
    console.log('✅ Default home page added');

    console.log('\n========================================');
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('========================================');
    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email: admin@siara.com');
    console.log('   Password: admin123');
    console.log('\n');

  } catch (error) {
    console.error('❌ Setup error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
};

setupDatabase();

