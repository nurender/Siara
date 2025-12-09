// CMS API utilities for fetching dynamic content

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Cache configuration
const CACHE_CONFIG = {
  revalidate: process.env.NODE_ENV === 'development' ? 0 : 60, // No cache in development, 60 seconds for production
  tags: {
    page: (slug: string) => [`page:${slug}`],
    services: ["services"],
    portfolio: ["portfolio"],
    blogs: ["blogs"],
    testimonials: ["testimonials"],
    settings: ["settings"],
  },
};

// Types
export interface CMSPage {
  id: number;
  slug: string;
  page_type: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
  structured_data?: Record<string, unknown>;
  status: string;
  published_at?: string;
}

export interface CMSSection {
  id: number;
  name: string;
  section_type: string;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export interface CMSService {
  id: number;
  slug: string;
  name: string;
  short_description?: string;
  full_description?: string;
  icon?: string;
  featured_image?: string;
  gallery?: string[];
  pricing?: Record<string, unknown>;
  inclusions?: unknown[];
  process_steps?: unknown[];
  faqs?: unknown[];
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
  status: string;
}

export interface CMSPortfolio {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  event_type?: string;
  location?: string;
  venue?: string;
  event_date?: string;
  client_name?: string;
  summary?: string;
  story?: string;
  featured_image?: string;
  gallery?: string[];
  services_delivered?: number[];
  testimonial?: Record<string, unknown>;
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
  status: string;
}

export interface CMSBlog {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author_id?: number;
  author_name?: string;
  author_avatar?: string;
  category?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  read_time?: number;
  views?: number;
  status: string;
  published_at?: string;
}

export interface CMSTestimonial {
  id: number;
  client_name: string;
  client_title?: string;
  client_image?: string;
  quote: string;
  rating: number;
  event_type?: string;
  location?: string;
  is_featured?: boolean;
  display_order?: number;
  status: string;
}

export interface CMSSetting {
  setting_key: string;
  setting_value: string;
  setting_group: string;
}

export interface CMSNavigation {
  menu_location: string;
  items: unknown[];
}

// API Response types
interface PageResponse {
  success: boolean;
  data: {
    page: CMSPage;
    sections: CMSSection[];
    relatedData?: Record<string, unknown>;
  };
  cache?: {
    revalidate: number;
    tags: string[];
  };
}

interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface SingleResponse<T> {
  success: boolean;
  data: T;
  relatedData?: Record<string, unknown>;
}

// Fetch utilities with error handling
async function fetchCMS<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}/api/cms${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 0 : CACHE_CONFIG.revalidate,
      },
    });

    if (!response.ok) {
      console.error(`CMS API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`CMS fetch error for ${endpoint}:`, error);
    return null;
  }
}

// =============================================
// PAGE APIs
// =============================================

/**
 * Get a page by slug with its sections and related data
 */
export async function getPage(slug: string): Promise<PageResponse | null> {
  try {
    const result = await fetchCMS<PageResponse>(`/pages/${slug}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`getPage(${slug}):`, result ? 'Success' : 'Failed');
    }
    return result;
  } catch (error) {
    console.error(`getPage(${slug}) error:`, error);
    return null;
  }
}

/**
 * Get page metadata for SEO
 */
export async function getPageMeta(slug: string) {
  const response = await getPage(slug);
  if (!response?.data?.page) return null;

  const page = response.data.page;
  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description,
      images: page.og_image ? [{ url: page.og_image }] : [],
    },
    robots: page.no_index ? { index: false, follow: false } : undefined,
    alternates: page.canonical_url ? { canonical: page.canonical_url } : undefined,
  };
}

// =============================================
// SERVICES APIs
// =============================================

/**
 * Get all services
 */
export async function getServices(options?: {
  featured?: boolean;
  status?: string;
}): Promise<CMSService[]> {
  const params = new URLSearchParams();
  if (options?.featured) params.append("featured", "true");
  if (options?.status) params.append("status", options.status);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetchCMS<ListResponse<CMSService>>(`/services${query}`);
  return response?.data || [];
}

/**
 * Get a service by slug
 */
export async function getService(slug: string): Promise<CMSService | null> {
  const response = await fetchCMS<SingleResponse<CMSService>>(`/services/${slug}`);
  return response?.data || null;
}

// =============================================
// PORTFOLIO APIs
// =============================================

/**
 * Get all portfolio items
 */
export async function getPortfolio(options?: {
  featured?: boolean;
  event_type?: string;
  location?: string;
  limit?: number;
}): Promise<CMSPortfolio[]> {
  const params = new URLSearchParams();
  if (options?.featured) params.append("featured", "true");
  if (options?.event_type) params.append("event_type", options.event_type);
  if (options?.location) params.append("location", options.location);
  if (options?.limit) params.append("limit", options.limit.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetchCMS<ListResponse<CMSPortfolio>>(`/portfolio${query}`);
  return response?.data || [];
}

/**
 * Get a portfolio item by slug
 */
export async function getPortfolioItem(slug: string): Promise<{
  item: CMSPortfolio | null;
  relatedItems?: CMSPortfolio[];
}> {
  const response = await fetchCMS<SingleResponse<CMSPortfolio> & { relatedItems?: CMSPortfolio[] }>(
    `/portfolio/${slug}`
  );
  return {
    item: response?.data || null,
    relatedItems: response?.relatedItems,
  };
}

// =============================================
// BLOG APIs
// =============================================

/**
 * Get all blog posts
 */
export async function getBlogs(options?: {
  category?: string;
  limit?: number;
  page?: number;
}): Promise<{
  blogs: CMSBlog[];
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (options?.category) params.append("category", options.category);
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.page) params.append("page", options.page.toString());

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetchCMS<ListResponse<CMSBlog>>(`/blogs${query}`);
  const pagination = response?.pagination;
  return {
    blogs: response?.data || [],
    pagination: pagination ? {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: (pagination as any).totalPages || Math.ceil(pagination.total / pagination.limit),
    } : undefined,
  };
}

/**
 * Get a blog post by slug
 */
export async function getBlog(slug: string): Promise<{
  blog: CMSBlog | null;
  relatedBlogs?: CMSBlog[];
}> {
  const response = await fetchCMS<SingleResponse<CMSBlog> & { relatedBlogs?: CMSBlog[] }>(
    `/blogs/${slug}`
  );
  return {
    blog: response?.data || null,
    relatedBlogs: response?.relatedBlogs,
  };
}

// =============================================
// TESTIMONIALS APIs
// =============================================

/**
 * Get all testimonials
 */
export async function getTestimonials(options?: {
  featured?: boolean;
}): Promise<CMSTestimonial[]> {
  const params = new URLSearchParams();
  if (options?.featured) params.append("featured", "true");

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await fetchCMS<ListResponse<CMSTestimonial>>(`/testimonials${query}`);
  return response?.data || [];
}

// =============================================
// SETTINGS APIs
// =============================================

/**
 * Get site settings
 */
export async function getSettings(): Promise<Record<string, string>> {
  const response = await fetchCMS<{ data: Record<string, unknown> }>("/settings");
  if (!response?.data) return {};

  // Backend returns settings as key-value object directly
  const settings: Record<string, string> = {};
  for (const [key, value] of Object.entries(response.data)) {
    settings[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }
  return settings;
}

/**
 * Get navigation menus
 */
export async function getNavigation(): Promise<Record<string, unknown[]>> {
  const response = await fetchCMS<{ data: CMSNavigation[] | Record<string, unknown> }>("/navigation");
  if (!response?.data) return {};

  const navigation: Record<string, unknown[]> = {};
  
  // Handle both array and object responses
  if (Array.isArray(response.data)) {
    response.data.forEach((nav) => {
      navigation[nav.menu_location] = typeof nav.items === "string" ? JSON.parse(nav.items) : nav.items;
    });
  } else {
    // Backend might return object directly
    for (const [key, value] of Object.entries(response.data)) {
      navigation[key] = Array.isArray(value) ? value : [];
    }
  }
  return navigation;
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Build structured data for SEO
 */
export function buildStructuredData(
  type: "Organization" | "WebPage" | "Article" | "Event" | "LocalBusiness",
  data: Record<string, unknown>
) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
  return JSON.stringify(baseData);
}

/**
 * Get all page slugs for static generation
 */
export async function getAllPageSlugs(): Promise<string[]> {
  // This would be called from generateStaticParams
  const pages = [
    "home",
    "about",
    "services",
    "portfolio",
    "blog",
    "contact",
  ];
  return pages;
}

/**
 * Get all service slugs for static generation
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((s) => s.slug);
}

/**
 * Get all portfolio slugs for static generation
 */
export async function getAllPortfolioSlugs(): Promise<string[]> {
  const portfolio = await getPortfolio();
  return portfolio.map((p) => p.slug);
}

/**
 * Get all blog slugs for static generation
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const { blogs } = await getBlogs({ limit: 1000 });
  return blogs.map((b) => b.slug);
}
