"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface BlogSidebarProps {
  categories?: Category[];
  popularPosts?: {
    slug: string;
    title: string;
    image: string;
    date: string;
  }[];
}

const defaultCategories: Category[] = [
  { name: "Wedding Planning", slug: "wedding-planning", count: 12 },
  { name: "Venues & Destinations", slug: "venues-destinations", count: 8 },
  { name: "Budget & Finance", slug: "budget-finance", count: 6 },
  { name: "Trends & Inspiration", slug: "trends-inspiration", count: 10 },
  { name: "Guest Experience", slug: "guest-experience", count: 5 },
  { name: "Cultural Traditions", slug: "cultural-traditions", count: 7 },
];

const defaultPopularPosts = [
  {
    slug: "top-wedding-venues-rajasthan",
    title: "Top Wedding Venues in Rajasthan for Dream Celebrations",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&auto=format&fit=crop&q=80",
    date: "Nov 20, 2024",
  },
  {
    slug: "choose-best-wedding-planner-jaipur",
    title: "How to Choose the Best Wedding Planner in Jaipur",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&auto=format&fit=crop&q=80",
    date: "Nov 15, 2024",
  },
  {
    slug: "latest-trends-north-indian-weddings",
    title: "Latest Trends in North Indian Destination Weddings",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=200&auto=format&fit=crop&q=80",
    date: "Nov 10, 2024",
  },
];

export default function BlogSidebar({
  categories = defaultCategories,
  popularPosts = defaultPopularPosts,
}: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log("Search:", searchQuery);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-siara-purple-100/30">
        <h3 className="font-cormorant text-xl font-semibold text-siara-purple-950 mb-4">
          Search Articles
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-3 pr-12 rounded-xl border border-siara-purple-200 bg-siara-soft-white font-dm-sans text-sm text-siara-purple-800 placeholder:text-siara-purple-400 focus:outline-none focus:border-siara-gold-400 focus:ring-2 focus:ring-siara-gold-100 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-siara-gold-500 flex items-center justify-center text-siara-purple-950 hover:bg-siara-gold-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-siara-purple-900 to-siara-purple-950 rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-siara-gold-500/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 className="font-cormorant text-xl font-semibold text-white mb-2">
            Wedding Planning Tips
          </h3>
          <p className="font-dm-sans text-sm text-siara-purple-200/70">
            Get exclusive wedding tips and Rajasthan venue insights delivered to your inbox.
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 rounded-xl border border-siara-purple-700 bg-siara-purple-800/50 font-dm-sans text-sm text-white placeholder:text-siara-purple-400 focus:outline-none focus:border-siara-gold-400 transition-all"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 font-dm-sans text-sm font-semibold hover:from-siara-gold-400 hover:to-siara-gold-300 transition-all"
          >
            {isSubscribed ? "✓ Subscribed!" : "Subscribe Free"}
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-siara-purple-100/30">
        <h3 className="font-cormorant text-xl font-semibold text-siara-purple-950 mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-siara-purple-50 transition-colors group"
              >
                <span className="font-dm-sans text-sm text-siara-purple-700 group-hover:text-siara-gold-600 transition-colors">
                  {category.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-siara-purple-100 text-siara-purple-600 font-dm-sans text-xs">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-siara-purple-100/30">
        <h3 className="font-cormorant text-xl font-semibold text-siara-purple-950 mb-4">
          Popular Articles
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <div
                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${post.image})` }}
              ></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-dm-sans text-sm font-medium text-siara-purple-800 group-hover:text-siara-gold-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <span className="font-dm-sans text-xs text-siara-purple-500 mt-1 block">
                  {post.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Free Guide CTA */}
      <div className="bg-siara-cream rounded-2xl p-6 border border-siara-gold-200/50">
        <div className="text-center">
          <span className="text-3xl mb-3 block">📖</span>
          <h3 className="font-cormorant text-lg font-semibold text-siara-purple-950 mb-2">
            Free Wedding Planning Guide
          </h3>
          <p className="font-dm-sans text-xs text-siara-purple-600 mb-4">
            Download our comprehensive guide to planning a luxury wedding in Rajasthan.
          </p>
          <Link
            href="#download"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-900 text-white font-dm-sans text-sm font-medium hover:bg-siara-purple-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Free
          </Link>
        </div>
      </div>
    </aside>
  );
}

