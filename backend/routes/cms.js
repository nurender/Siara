const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/cmsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// =============================================
// PUBLIC ROUTES (for frontend)
// =============================================

// Pages
router.get('/pages/:slug', getPageBySlug);

// Services
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);

// Portfolio
router.get('/portfolio', getPortfolio);
router.get('/portfolio/:slug', getPortfolioBySlug);

// Blogs
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);

// Testimonials
router.get('/testimonials', getTestimonials);

// Settings (public - for site config)
router.get('/settings', getSettings);

// Navigation (public - for menus)
router.get('/navigation', getNavigation);

// =============================================
// ADMIN ROUTES (protected)
// =============================================

// Pages management
router.get('/admin/pages', authMiddleware, adminMiddleware, getPages);
router.get('/admin/pages/:id', authMiddleware, adminMiddleware, getPageById);
router.post('/admin/pages', authMiddleware, adminMiddleware, createPage);
router.put('/admin/pages/:id', authMiddleware, adminMiddleware, updatePage);
router.delete('/admin/pages/:id', authMiddleware, adminMiddleware, deletePage);

// Sections management
router.get('/admin/sections', authMiddleware, adminMiddleware, getSections);
router.get('/admin/sections/:id', authMiddleware, adminMiddleware, getSection);
router.post('/admin/sections', authMiddleware, adminMiddleware, createSection);
router.put('/admin/sections/:id', authMiddleware, adminMiddleware, updateSection);
router.delete('/admin/sections/:id', authMiddleware, adminMiddleware, deleteSection);

// Settings management
router.put('/admin/settings', authMiddleware, adminMiddleware, updateSettings);

// Navigation management
router.put('/admin/navigation', authMiddleware, adminMiddleware, updateNavigation);

// Blogs management
router.get('/admin/blogs', authMiddleware, adminMiddleware, getAllBlogs);
router.post('/admin/blogs', authMiddleware, adminMiddleware, createBlog);
router.put('/admin/blogs/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/admin/blogs/:id', authMiddleware, adminMiddleware, deleteBlog);

// Testimonials management
router.get('/admin/testimonials', authMiddleware, adminMiddleware, getAllTestimonials);
router.post('/admin/testimonials', authMiddleware, adminMiddleware, createTestimonial);
router.put('/admin/testimonials/:id', authMiddleware, adminMiddleware, updateTestimonial);
router.delete('/admin/testimonials/:id', authMiddleware, adminMiddleware, deleteTestimonial);

module.exports = router;
