"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogPagination from "@/components/blog/BlogPagination";

interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  author_name?: string;
  category?: string;
  read_time?: number;
  published_at?: string;
  content?: string;
}

interface BlogGridContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
  display_mode?: "all" | "featured";
  cta?: { text: string; url: string };
  show_sidebar?: boolean;
}

interface BlogGridProps {
  content: BlogGridContent;
  settings?: { columns?: number };
  relatedData?: { 
    blogs?: Blog[]; 
    recentBlogs?: Blog[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages?: number;
    };
  };
}

export default function BlogGridSection({ content, settings, relatedData }: BlogGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Support both 'blogs' and 'recentBlogs' keys
  let blogs = (relatedData?.blogs || relatedData?.recentBlogs || []);
  const displayCount = content?.display_count || 3;
  const displayMode = content?.display_mode || "all";
  const pagination = relatedData?.pagination;
  
  // Filter by display mode (only if not showing sidebar/pagination)
  const showSidebar = content?.show_sidebar === true;
  // Don't slice if pagination is enabled (API handles it)
  if (!showSidebar && !pagination) {
    if (displayMode === "featured") {
      blogs = blogs.slice(0, displayCount);
    } else {
      blogs = blogs.slice(0, displayCount);
    }
  }
  
  // Safe defaults
  const heading = content?.heading || "From Our Journal";
  const subheading = content?.subheading || "Insights & Inspiration";
  const description = content?.description || "Expert insights, inspiring stories, and the latest trends in luxury event design and planning.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (blogs.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    } catch {
      return "";
    }
  };

  const getReadTime = (blog: Blog) => {
    if (blog.read_time) {
      return `${blog.read_time} min read`;
    }
    if (blog.content) {
      const readTime = Math.ceil(blog.content.length / 1000);
      return `${readTime} min read`;
    }
    return "5 min read";
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return "";
    }
  };

  // Convert Blog to BlogPost format for BlogCard
  const convertToBlogPost = (blog: Blog, index: number): BlogPost => {
    const featuredImage = blog.featured_image?.startsWith('http')
      ? blog.featured_image
      : blog.featured_image
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${blog.featured_image}`
      : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80';

    return {
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      featuredImage,
      category: blog.category || "Wedding Planning",
      author: {
        name: blog.author_name || "Siara Events",
      },
      publishDate: formatDateShort(blog.published_at) || "Recent",
      readTime: getReadTime(blog),
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-soft-white overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-siara-purple-50/50 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header - Only show if not blog listing page */}
        {!showSidebar && (
          <div
            className={`flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-8 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
                <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
                <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
                  {subheading}
                </span>
              </div>

              <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-950 mb-4">
                {heading.includes("Journal") ? (
                  <>
                    From Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                      Journal
                    </span>
                  </>
                ) : (
                  heading
                )}
              </h2>

              <p className="font-dm-sans text-lg text-siara-purple-700/70 max-w-xl">
                {description}
              </p>
            </div>

            {content.cta && (
              <Link
                href={content.cta.url || "/blog"}
                className="group inline-flex items-center gap-2 font-dm-sans font-semibold text-siara-purple-700 hover:text-siara-gold-600 transition-colors"
              >
                <span>{content.cta.text || "View All Articles"}</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        )}

        {/* Blog Grid with Sidebar Layout */}
        {showSidebar ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog, index) => (
                    <div
                      key={blog.id}
                      className={`transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                      } ${index === 0 ? "md:col-span-2" : ""}`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <BlogCard post={convertToBlogPost(blog, index)} featured={index === 0} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <BlogSidebar />
                </div>
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages && pagination.totalPages > 1 && (
              <div className="mt-12">
                <BlogPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}
          </>
        ) : (
          /* Default Grid Layout (for homepage) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <BlogCard post={convertToBlogPost(blog, index)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

