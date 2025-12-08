"use client";

import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  author_name?: string;
  category?: string;
  read_time?: number;
  published_at?: string;
  tags?: string[];
}

interface RelatedBlog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  category?: string;
  published_at?: string;
}

interface BlogDetailContent {
  show_related?: boolean;
  related_heading?: string;
}

interface BlogDetailProps {
  content: BlogDetailContent;
  settings: Record<string, any>;
  relatedData?: {
    blog?: Blog;
    relatedBlogs?: RelatedBlog[];
  };
}

export default function BlogDetailSection({ content, relatedData }: BlogDetailProps) {
  const blog = relatedData?.blog;
  const relatedBlogs = relatedData?.relatedBlogs || [];

  if (!blog) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Parse HTML content safely
  const renderContent = () => {
    if (!blog.content) return null;
    
    // For now, we'll render HTML content as-is
    // In production, you might want to use a sanitizer like DOMPurify
    return (
      <div
        className="prose prose-lg max-w-none prose-headings:font-cormorant prose-headings:text-siara-purple-900 prose-p:text-siara-charcoal/80 prose-p:font-dm-sans prose-p:leading-relaxed prose-a:text-siara-gold-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-siara-purple-900 prose-ul:text-siara-charcoal/80 prose-ol:text-siara-charcoal/80"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    );
  };

  return (
    <article className="py-20 lg:py-28 bg-gradient-to-b from-white to-siara-cream">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          {/* Category Badge */}
          {blog.category && (
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-sm font-semibold uppercase tracking-wider">
                {blog.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-900 mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-siara-charcoal/60 mb-8 pb-8 border-b border-siara-purple-100">
            {blog.author_name && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-dm-sans">{blog.author_name}</span>
              </div>
            )}
            {blog.published_at && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-dm-sans">{formatDate(blog.published_at)}</span>
              </div>
            )}
            {blog.read_time && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-dm-sans">{blog.read_time} min read</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={blog.featured_image.startsWith('http') ? blog.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${blog.featured_image}`}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="font-dm-sans text-xl text-siara-charcoal/70 leading-relaxed mb-8 italic">
              {blog.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="mb-12">
          {renderContent()}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-12 pt-8 border-t border-siara-purple-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-dm-sans text-sm font-semibold text-siara-purple-900">Tags:</span>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-siara-purple-100 text-siara-purple-700 font-dm-sans text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Blogs */}
        {content.show_related !== false && relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-siara-purple-200">
            <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-siara-purple-900 mb-8">
              {content.related_heading || "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {relatedBlog.featured_image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={relatedBlog.featured_image.startsWith('http') ? relatedBlog.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${relatedBlog.featured_image}`}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  {relatedBlog.category && (
                    <span className="inline-block px-2 py-1 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-xs font-semibold uppercase mb-2">
                      {relatedBlog.category}
                    </span>
                  )}
                  <h3 className="font-cormorant text-xl font-semibold text-siara-purple-900 mb-2 group-hover:text-siara-gold-600 transition-colors line-clamp-2">
                    {relatedBlog.title}
                  </h3>
                  <p className="font-dm-sans text-sm text-siara-charcoal/70 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-siara-purple-500 text-siara-purple-600 font-dm-sans font-semibold hover:bg-siara-purple-500 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

