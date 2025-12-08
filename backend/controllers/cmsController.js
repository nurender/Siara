const { pool } = require('../config/db');

// =============================================
// PAGES
// =============================================

// Get all pages
const getPages = async (req, res) => {
  try {
    const { status, page_type } = req.query;
    let query = 'SELECT id, slug, page_type, title, status, updated_at FROM pages WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (page_type) {
      query += ' AND page_type = ?';
      params.push(page_type);
    }

    query += ' ORDER BY updated_at DESC';

    const [pages] = await pool.query(query, params);
    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pages' });
  }
};

// Get page by slug (public)
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Get page
    const [pages] = await pool.query(
      'SELECT * FROM pages WHERE slug = ? AND status = "published"',
      [slug]
    );

    if (pages.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const page = pages[0];
    
    // Get sections if page has them
    let sections = [];
    if (page.sections && page.sections.length > 0) {
      try {
        // Handle both string and already-parsed JSON
        const sectionIds = typeof page.sections === 'string' 
          ? JSON.parse(page.sections) 
          : page.sections;
        
        if (Array.isArray(sectionIds) && sectionIds.length > 0) {
          const [sectionData] = await pool.query(
            `SELECT * FROM sections WHERE id IN (${sectionIds.join(',')}) AND status = 'active'`
          );
          // Sort by order in page.sections
          sections = sectionIds.map(id => sectionData.find(s => s.id === id)).filter(Boolean);
        }
      } catch (parseError) {
        console.error('Error parsing page sections:', parseError.message);
        // Continue with empty sections
      }
    }

    // Get related data based on page type
    const relatedData = await getRelatedData(page.page_type);

    res.json({
      success: true,
      data: {
        page: {
          ...page,
          sections: undefined // Don't send raw section IDs
        },
        sections: sections.map(s => ({
          ...s,
          content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content,
          settings: s.settings ? (typeof s.settings === 'string' ? JSON.parse(s.settings) : s.settings) : {}
        })),
        relatedData
      },
      cache: {
        revalidate: 60,
        tags: [`page:${slug}`]
      }
    });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch page' });
  }
};

// Get related data for page types
const getRelatedData = async (pageType) => {
  const data = {};

  try {
    // Featured services
    if (['home', 'services'].includes(pageType)) {
      const [services] = await pool.query(
        'SELECT id, slug, name, short_description, icon, featured_image FROM services WHERE status = "published" AND is_featured = 1 ORDER BY display_order LIMIT 6'
      );
      data.featuredServices = services;
    }

    // Featured portfolio
    if (['home', 'portfolio'].includes(pageType)) {
      const [portfolio] = await pool.query(
        'SELECT id, slug, title, subtitle, event_type, location, venue, featured_image FROM portfolio WHERE status = "published" AND is_featured = 1 ORDER BY event_date DESC LIMIT 6'
      );
      data.featuredPortfolio = portfolio;
    }

    // Featured testimonials
    if (['home', 'about'].includes(pageType)) {
      const [testimonials] = await pool.query(
        'SELECT * FROM testimonials WHERE status = "active" AND is_featured = 1 ORDER BY display_order LIMIT 6'
      );
      data.featuredTestimonials = testimonials;
    }

    // Recent blogs
    if (['home', 'blog'].includes(pageType)) {
      const [blogs] = await pool.query(
        'SELECT b.id, b.slug, b.title, b.excerpt, b.featured_image, b.category, b.published_at, b.read_time, b.content, u.name as author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.status = "published" ORDER BY b.published_at DESC LIMIT 3'
      );
      data.recentBlogs = blogs;
    }
  } catch (error) {
    console.error('Get related data error:', error);
  }

  return data;
};

// Create page (Admin)
const createPage = async (req, res) => {
  try {
    const { slug, page_type, title, meta_title, meta_description, og_image, sections, status } = req.body;

    const [result] = await pool.query(
      `INSERT INTO pages (slug, page_type, title, meta_title, meta_description, og_image, sections, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, page_type, title, meta_title, meta_description, og_image, JSON.stringify(sections || []), status || 'draft', req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ success: false, message: 'Failed to create page' });
  }
};

// Update page (Admin)
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, meta_title, meta_description, og_image, canonical_url, no_index, structured_data, sections, status } = req.body;

    await pool.query(
      `UPDATE pages SET 
       title = COALESCE(?, title),
       meta_title = COALESCE(?, meta_title),
       meta_description = COALESCE(?, meta_description),
       og_image = COALESCE(?, og_image),
       canonical_url = COALESCE(?, canonical_url),
       no_index = COALESCE(?, no_index),
       structured_data = COALESCE(?, structured_data),
       sections = COALESCE(?, sections),
       status = COALESCE(?, status),
       published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
       updated_at = NOW()
       WHERE id = ?`,
      [title, meta_title, meta_description, og_image, canonical_url, no_index, 
       structured_data ? JSON.stringify(structured_data) : null,
       sections ? JSON.stringify(sections) : null, 
       status, status, id]
    );

    res.json({ success: true, message: 'Page updated successfully' });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ success: false, message: 'Failed to update page' });
  }
};

// Get page by ID (Admin)
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [pages] = await pool.query('SELECT * FROM pages WHERE id = ?', [id]);

    if (pages.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const page = pages[0];
    // Parse sections if string
    if (page.sections && typeof page.sections === 'string') {
      page.sections = JSON.parse(page.sections);
    }

    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Get page by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch page' });
  }
};

// Delete page (Admin)
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting home page
    const [page] = await pool.query('SELECT slug FROM pages WHERE id = ?', [id]);
    if (page.length > 0 && page[0].slug === 'home') {
      return res.status(400).json({ success: false, message: 'Cannot delete home page' });
    }

    await pool.query('DELETE FROM pages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete page' });
  }
};

// =============================================
// SECTIONS
// =============================================

// Get all sections
const getSections = async (req, res) => {
  try {
    const { section_type, is_global } = req.query;
    let query = 'SELECT * FROM sections WHERE 1=1';
    const params = [];

    if (section_type) {
      query += ' AND section_type = ?';
      params.push(section_type);
    }
    if (is_global !== undefined) {
      query += ' AND is_global = ?';
      params.push(is_global === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const [sections] = await pool.query(query, params);
    res.json({
      success: true,
      data: sections.map(s => ({
        ...s,
        content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content,
        settings: s.settings ? (typeof s.settings === 'string' ? JSON.parse(s.settings) : s.settings) : {}
      }))
    });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sections' });
  }
};

// Get section by ID
const getSection = async (req, res) => {
  try {
    const { id } = req.params;
    const [sections] = await pool.query('SELECT * FROM sections WHERE id = ?', [id]);

    if (sections.length === 0) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    const section = sections[0];
    res.json({
      success: true,
      data: {
        ...section,
        content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content,
        settings: section.settings ? (typeof section.settings === 'string' ? JSON.parse(section.settings) : section.settings) : {}
      }
    });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch section' });
  }
};

// Create section
const createSection = async (req, res) => {
  try {
    const { name, section_type, content, settings, is_global } = req.body;

    const [result] = await pool.query(
      'INSERT INTO sections (name, section_type, content, settings, is_global) VALUES (?, ?, ?, ?, ?)',
      [name, section_type, JSON.stringify(content), settings ? JSON.stringify(settings) : null, is_global || false]
    );

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ success: false, message: 'Failed to create section' });
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, settings, is_global, status } = req.body;

    await pool.query(
      `UPDATE sections SET 
       name = COALESCE(?, name),
       content = COALESCE(?, content),
       settings = COALESCE(?, settings),
       is_global = COALESCE(?, is_global),
       status = COALESCE(?, status),
       updated_at = NOW()
       WHERE id = ?`,
      [name, content ? JSON.stringify(content) : null, settings ? JSON.stringify(settings) : null, is_global, status, id]
    );

    res.json({ success: true, message: 'Section updated successfully' });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ success: false, message: 'Failed to update section' });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sections WHERE id = ?', [id]);
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete section' });
  }
};

// =============================================
// SETTINGS
// =============================================

// Get all settings
const getSettings = async (req, res) => {
  try {
    const { group } = req.query;
    let query = 'SELECT * FROM site_settings';
    const params = [];

    if (group) {
      query += ' WHERE setting_group = ?';
      params.push(group);
    }

    const [settings] = await pool.query(query, params);
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(s => {
      try {
        // Try to parse as JSON, fallback to raw value
        settingsObj[s.setting_key] = typeof s.setting_value === 'string' 
          ? JSON.parse(s.setting_value) 
          : s.setting_value;
      } catch {
        // If JSON parse fails, use the raw string value
        settingsObj[s.setting_key] = s.setting_value;
      }
    });

    res.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    let updates = req.body;

    // Handle array format from admin panel: { settings: [{ setting_key, setting_value, setting_group }, ...] }
    if (updates.settings && Array.isArray(updates.settings)) {
      for (const setting of updates.settings) {
        // setting_value is already a JSON string from frontend, so use it directly
        await pool.query(
          `INSERT INTO site_settings (setting_key, setting_value, setting_group) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_group = VALUES(setting_group)`,
          [setting.setting_key, setting.setting_value, setting.setting_group || null]
        );
      }
    } else {
      // Handle flat object format: { navbar_links: [...], navbar_logo_text: "..." }
      for (const [key, value] of Object.entries(updates)) {
        await pool.query(
          `INSERT INTO site_settings (setting_key, setting_value) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [key, JSON.stringify(value)]
        );
      }
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// =============================================
// NAVIGATION
// =============================================

// Get navigation
const getNavigation = async (req, res) => {
  try {
    const { location } = req.query;
    let query = 'SELECT * FROM navigation';
    const params = [];

    if (location) {
      query += ' WHERE menu_location = ?';
      params.push(location);
    }

    const [nav] = await pool.query(query, params);
    
    const navObj = {};
    nav.forEach(n => {
      navObj[n.menu_location] = typeof n.items === 'string' ? JSON.parse(n.items) : n.items;
    });

    res.json({ success: true, data: navObj });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch navigation' });
  }
};

// Update navigation
const updateNavigation = async (req, res) => {
  try {
    const { location, items } = req.body;

    await pool.query(
      `INSERT INTO navigation (menu_location, items) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE items = VALUES(items)`,
      [location, JSON.stringify(items)]
    );

    res.json({ success: true, message: 'Navigation updated successfully' });
  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).json({ success: false, message: 'Failed to update navigation' });
  }
};

// =============================================
// SERVICES (Update existing)
// =============================================

// Get all services (public)
const getServices = async (req, res) => {
  try {
    const { featured } = req.query;
    let query = 'SELECT * FROM services WHERE status = "published"';
    
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }
    
    query += ' ORDER BY display_order';

    const [services] = await pool.query(query);
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

// Get service by slug (public)
const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [services] = await pool.query(
      'SELECT * FROM services WHERE slug = ? AND status = "published"',
      [slug]
    );

    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const service = services[0];
    
    // Parse JSON fields
    ['gallery', 'pricing', 'inclusions', 'process_steps', 'faqs'].forEach(field => {
      if (service[field] && typeof service[field] === 'string') {
        service[field] = JSON.parse(service[field]);
      }
    });

    // Get related services
    const [related] = await pool.query(
      'SELECT id, slug, name, short_description, featured_image FROM services WHERE status = "published" AND slug != ? LIMIT 3',
      [slug]
    );

    res.json({
      success: true,
      data: service,
      relatedServices: related
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
};

// =============================================
// PORTFOLIO (public)
// =============================================

const getPortfolio = async (req, res) => {
  try {
    const { featured, event_type, limit = 12 } = req.query;
    let query = 'SELECT * FROM portfolio WHERE status = "published"';
    const params = [];

    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }
    if (event_type) {
      query += ' AND event_type = ?';
      params.push(event_type);
    }

    query += ' ORDER BY event_date DESC LIMIT ?';
    params.push(parseInt(limit));

    const [portfolio] = await pool.query(query, params);
    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio' });
  }
};

const getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [items] = await pool.query(
      'SELECT * FROM portfolio WHERE slug = ? AND status = "published"',
      [slug]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    const item = items[0];
    
    // Parse JSON fields
    ['gallery', 'services_delivered', 'testimonial'].forEach(field => {
      if (item[field] && typeof item[field] === 'string') {
        item[field] = JSON.parse(item[field]);
      }
    });

    // Get related portfolio
    const [related] = await pool.query(
      'SELECT id, slug, title, event_type, location, featured_image FROM portfolio WHERE status = "published" AND slug != ? AND event_type = ? LIMIT 3',
      [slug, item.event_type]
    );

    res.json({
      success: true,
      data: item,
      relatedPortfolio: related
    });
  } catch (error) {
    console.error('Get portfolio item error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio item' });
  }
};

// =============================================
// BLOGS (public)
// =============================================

const getBlogs = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT b.*, u.name as author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.status = "published"';
    let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE status = "published"';
    const params = [];
    const countParams = [];

    if (category) {
      query += ' AND b.category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    query += ' ORDER BY b.published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [blogs] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [blogs] = await pool.query(
      `SELECT b.*, u.name as author_name, u.avatar as author_avatar 
       FROM blog_posts b 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.slug = ? AND b.status = "published"`,
      [slug]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const blog = blogs[0];
    
    // Parse tags
    if (blog.tags && typeof blog.tags === 'string') {
      blog.tags = JSON.parse(blog.tags);
    }

    // Increment views
    await pool.query('UPDATE blog_posts SET views = views + 1 WHERE slug = ?', [slug]);

    // Get related blogs
    const [related] = await pool.query(
      'SELECT id, slug, title, excerpt, featured_image, published_at FROM blog_posts WHERE status = "published" AND slug != ? AND category = ? LIMIT 3',
      [slug, blog.category]
    );

    res.json({
      success: true,
      data: blog,
      relatedBlogs: related
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
};

// =============================================
// TESTIMONIALS (public)
// =============================================

const getTestimonials = async (req, res) => {
  try {
    const { featured } = req.query;
    let query = 'SELECT * FROM testimonials WHERE status = "active"';
    
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }
    
    query += ' ORDER BY display_order';

    const [testimonials] = await pool.query(query);
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

// =============================================
// BLOGS ADMIN CRUD
// =============================================

const getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await pool.query(
      `SELECT b.*, u.name as author_name 
       FROM blog_posts b 
       LEFT JOIN users u ON b.author_id = u.id 
       ORDER BY b.created_at DESC`
    );
    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      slug, title, excerpt, content, featured_image,
      category, tags, meta_title, meta_description,
      read_time, status
    } = req.body;

    const author_id = req.user.id;
    const published_at = status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO blog_posts 
       (slug, title, excerpt, content, featured_image, author_id, category, tags, meta_title, meta_description, read_time, status, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title, excerpt, content, featured_image, author_id, category, JSON.stringify(tags || []), meta_title, meta_description, read_time || 5, status || 'draft', published_at]
    );

    res.json({ success: true, message: 'Blog created', id: result.insertId });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug, title, excerpt, content, featured_image,
      category, tags, meta_title, meta_description,
      read_time, status
    } = req.body;

    // Check if status changed to published
    const [existing] = await pool.query('SELECT status FROM blog_posts WHERE id = ?', [id]);
    let published_at = null;
    if (existing.length > 0 && existing[0].status !== 'published' && status === 'published') {
      published_at = new Date();
    }

    let query = `UPDATE blog_posts SET 
      slug = ?, title = ?, excerpt = ?, content = ?, featured_image = ?,
      category = ?, tags = ?, meta_title = ?, meta_description = ?,
      read_time = ?, status = ?`;
    
    const params = [slug, title, excerpt, content, featured_image, category, JSON.stringify(tags || []), meta_title, meta_description, read_time, status];

    if (published_at) {
      query += ', published_at = ?';
      params.push(published_at);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);
    res.json({ success: true, message: 'Blog updated' });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
};

// =============================================
// TESTIMONIALS ADMIN CRUD
// =============================================

const getAllTestimonials = async (req, res) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY display_order, created_at DESC');
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const {
      client_name, client_title, client_image, quote,
      rating, event_type, location, is_featured, display_order, status
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO testimonials 
       (client_name, client_title, client_image, quote, rating, event_type, location, is_featured, display_order, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_name, client_title, client_image, quote, rating || 5, event_type, location, is_featured ? 1 : 0, display_order || 0, status || 'active']
    );

    res.json({ success: true, message: 'Testimonial created', id: result.insertId });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to create testimonial' });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_name, client_title, client_image, quote,
      rating, event_type, location, is_featured, display_order, status
    } = req.body;

    await pool.query(
      `UPDATE testimonials SET 
       client_name = ?, client_title = ?, client_image = ?, quote = ?,
       rating = ?, event_type = ?, location = ?, is_featured = ?, display_order = ?, status = ?
       WHERE id = ?`,
      [client_name, client_title, client_image, quote, rating, event_type, location, is_featured ? 1 : 0, display_order, status, id]
    );

    res.json({ success: true, message: 'Testimonial updated' });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
};

module.exports = {
  // Pages
  getPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  // Sections
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  // Settings
  getSettings,
  updateSettings,
  // Navigation
  getNavigation,
  updateNavigation,
  // Services
  getServices,
  getServiceBySlug,
  // Portfolio
  getPortfolio,
  getPortfolioBySlug,
  // Blogs (public)
  getBlogs,
  getBlogBySlug,
  // Blogs (admin)
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  // Testimonials (public)
  getTestimonials,
  // Testimonials (admin)
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
