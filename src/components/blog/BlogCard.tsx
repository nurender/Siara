"use client";

import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishDate: string;
  readTime: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-siara-purple-100/30 hover:shadow-2xl hover:shadow-siara-purple-200/40 transition-all duration-500 hover:-translate-y-2 ${
        featured ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "h-64 lg:h-full" : "h-56"}`}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${post.featuredImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-siara-purple-950/60 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-siara-gold-500/90 backdrop-blur-sm text-siara-purple-950 font-dm-sans text-xs font-semibold uppercase tracking-wider">
            {post.category}
          </span>
        </div>
        {/* Read Time */}
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1.5 rounded-full bg-siara-purple-950/60 backdrop-blur-sm text-white font-dm-sans text-xs">
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? "lg:p-8 lg:flex lg:flex-col lg:justify-center" : ""}`}>
        {/* Title */}
        <h3 className={`font-cormorant font-semibold text-siara-purple-950 mb-3 group-hover:text-siara-gold-600 transition-colors leading-tight ${
          featured ? "text-2xl lg:text-3xl" : "text-xl"
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={`font-dm-sans text-siara-purple-600/70 mb-4 leading-relaxed ${
          featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
        }`}>
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-siara-purple-100">
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.author.avatar})` }}
              ></div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siara-purple-400 to-siara-purple-600 flex items-center justify-center text-white font-dm-sans text-xs font-semibold">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-dm-sans text-sm font-medium text-siara-purple-800">
                {post.author.name}
              </div>
              <div className="font-dm-sans text-xs text-siara-purple-500">
                {post.publishDate}
              </div>
            </div>
          </div>

          {/* Read More */}
          <span className="inline-flex items-center gap-1 font-dm-sans text-sm font-semibold text-siara-purple-700 group-hover:text-siara-gold-600 transition-colors">
            <span>Read</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-siara-gold-400/30 transition-colors duration-300 pointer-events-none"></div>
    </Link>
  );
}

