-- Siara Events CMS Schema
-- Run this to add CMS tables

USE siara_events;

-- =============================================
-- PAGES: Main page management
-- =============================================
CREATE TABLE IF NOT EXISTS pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    page_type ENUM('home', 'about', 'services', 'service_detail', 
                   'portfolio', 'portfolio_detail', 'blog', 'blog_detail', 
                   'contact', 'custom') NOT NULL,
    title VARCHAR(255) NOT NULL,
    
    -- SEO Fields
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    og_image VARCHAR(500),
    canonical_url VARCHAR(500),
    no_index BOOLEAN DEFAULT FALSE,
    structured_data JSON,
    
    -- Content (array of section IDs with order)
    sections JSON,
    
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- SECTIONS: Reusable content blocks
-- =============================================
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
);

-- =============================================
-- NAVIGATION: Site navigation menus
-- =============================================
CREATE TABLE IF NOT EXISTS navigation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_location ENUM('header', 'footer', 'mobile') NOT NULL,
    items JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- SITE SETTINGS: Global configuration
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    setting_group VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Insert default navigation
-- =============================================
INSERT INTO navigation (menu_location, items) VALUES 
('header', '[
    {"label": "Home", "url": "/", "order": 1},
    {"label": "About", "url": "/about", "order": 2},
    {"label": "Services", "url": "/services", "order": 3, "children": [
        {"label": "Luxury Weddings", "url": "/services/luxury-weddings"},
        {"label": "Corporate Galas", "url": "/services/corporate-galas"},
        {"label": "Destination Events", "url": "/services/destination-events"},
        {"label": "Private Celebrations", "url": "/services/private-celebrations"}
    ]},
    {"label": "Portfolio", "url": "/portfolio", "order": 4},
    {"label": "Blog", "url": "/blog", "order": 5},
    {"label": "Contact", "url": "/contact", "order": 6}
]'),
('footer', '[
    {"label": "Quick Links", "items": [
        {"label": "Home", "url": "/"},
        {"label": "About Us", "url": "/about"},
        {"label": "Services", "url": "/services"},
        {"label": "Portfolio", "url": "/portfolio"},
        {"label": "Blog", "url": "/blog"},
        {"label": "Contact", "url": "/contact"}
    ]},
    {"label": "Services", "items": [
        {"label": "Luxury Weddings", "url": "/services/luxury-weddings"},
        {"label": "Corporate Galas", "url": "/services/corporate-galas"},
        {"label": "Destination Events", "url": "/services/destination-events"},
        {"label": "Private Celebrations", "url": "/services/private-celebrations"}
    ]}
]')
ON DUPLICATE KEY UPDATE items = VALUES(items);

-- =============================================
-- Insert default site settings
-- =============================================
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES 
('site_name', '"Siara Events"', 'general'),
('site_tagline', '"Crafting Extraordinary Moments"', 'general'),
('site_logo', '"/images/logo.png"', 'general'),
('site_favicon', '"/favicon.ico"', 'general'),
('contact_email', '"hello@siaraevents.com"', 'contact'),
('contact_phone', '"+91 98765 43210"', 'contact'),
('contact_whatsapp', '"+91 98765 43210"', 'contact'),
('address', '{"line1": "123 Event Street", "city": "Jaipur", "state": "Rajasthan", "pincode": "302001", "country": "India"}', 'contact'),
('social_links', '{"instagram": "https://instagram.com/siaraevents", "facebook": "https://facebook.com/siaraevents", "pinterest": "https://pinterest.com/siaraevents", "youtube": "https://youtube.com/siaraevents"}', 'social'),
('business_hours', '{"weekdays": "9:00 AM - 7:00 PM", "saturday": "10:00 AM - 5:00 PM", "sunday": "By Appointment"}', 'contact'),
('google_analytics', '"G-XXXXXXXXXX"', 'integrations'),
('default_og_image', '"/images/og-default.jpg"', 'seo')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- =============================================
-- Insert default home page
-- =============================================
INSERT INTO pages (slug, page_type, title, meta_title, meta_description, status, sections) VALUES 
('home', 'home', 'Home', 'Siara Events | Best Wedding Planner in Rajasthan', 
'Luxury wedding and event planning services in Jaipur, Udaipur & Rajasthan. Create unforgettable celebrations with Siara Events.',
'published', '[]')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- =============================================
-- Create indexes for performance
-- =============================================
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_type ON pages(page_type);
CREATE INDEX idx_sections_type ON sections(section_type);
CREATE INDEX idx_settings_key ON site_settings(setting_key);
