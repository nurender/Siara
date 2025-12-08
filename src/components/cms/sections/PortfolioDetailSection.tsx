"use client";

import Image from "next/image";
import Link from "next/link";

interface Portfolio {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  event_type: string;
  location: string;
  venue?: string;
  event_date?: string;
  client_name?: string;
  summary?: string;
  description?: string;
  featured_image?: string;
  gallery?: string[];
  services_delivered?: string[];
  highlights?: string[];
}

interface RelatedPortfolio {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  event_type: string;
  location: string;
  featured_image?: string;
}

interface PortfolioDetailContent {
  show_related?: boolean;
  related_heading?: string;
}

interface PortfolioDetailProps {
  content: PortfolioDetailContent;
  settings: Record<string, any>;
  relatedData?: {
    portfolio?: Portfolio;
    relatedPortfolio?: RelatedPortfolio[];
  };
}

export default function PortfolioDetailSection({ content, relatedData }: PortfolioDetailProps) {
  const portfolio = relatedData?.portfolio;
  const relatedPortfolio = relatedData?.relatedPortfolio || [];

  if (!portfolio) {
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

  // Parse gallery if it's a string
  const gallery = Array.isArray(portfolio.gallery) 
    ? portfolio.gallery 
    : (typeof portfolio.gallery === 'string' ? JSON.parse(portfolio.gallery || '[]') : []);

  return (
    <article className="py-20 lg:py-28 bg-gradient-to-b from-white to-siara-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          {/* Event Type Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-sm font-semibold uppercase tracking-wider">
              {portfolio.event_type}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-900 mb-4">
            {portfolio.title}
          </h1>

          {/* Subtitle */}
          {portfolio.subtitle && (
            <p className="font-dm-sans text-xl text-siara-charcoal/70 mb-8 italic">
              {portfolio.subtitle}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-siara-charcoal/60 mb-8 pb-8 border-b border-siara-purple-100">
            {portfolio.location && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-dm-sans">{portfolio.location}</span>
              </div>
            )}
            {portfolio.venue && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-dm-sans">{portfolio.venue}</span>
              </div>
            )}
            {portfolio.event_date && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-dm-sans">{formatDate(portfolio.event_date)}</span>
              </div>
            )}
            {portfolio.client_name && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-dm-sans">{portfolio.client_name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {portfolio.featured_image && (
            <div className="relative w-full h-96 md:h-[600px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={portfolio.featured_image.startsWith('http') ? portfolio.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${portfolio.featured_image}`}
                alt={portfolio.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Summary */}
          {portfolio.summary && (
            <p className="font-dm-sans text-xl text-siara-charcoal/70 leading-relaxed mb-8">
              {portfolio.summary}
            </p>
          )}
        </header>

        {/* Description */}
        {portfolio.description && (
          <div className="mb-12">
            <div
              className="prose prose-lg max-w-none prose-headings:font-cormorant prose-headings:text-siara-purple-900 prose-p:text-siara-charcoal/80 prose-p:font-dm-sans prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: portfolio.description }}
            />
          </div>
        )}

        {/* Highlights */}
        {portfolio.highlights && portfolio.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl font-semibold text-siara-purple-900 mb-6">
              Event Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-siara-gold-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-dm-sans text-siara-charcoal/80">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Delivered */}
        {portfolio.services_delivered && portfolio.services_delivered.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl font-semibold text-siara-purple-900 mb-6">
              Services Delivered
            </h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.services_delivered.map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-siara-purple-100 text-siara-purple-700 font-dm-sans text-sm font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl font-semibold text-siara-purple-900 mb-6">
              Event Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <Image
                    src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${image}`}
                    alt={`${portfolio.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Portfolio */}
        {content.show_related !== false && relatedPortfolio.length > 0 && (
          <div className="mt-16 pt-12 border-t border-siara-purple-200">
            <h2 className="font-cormorant text-3xl md:text-4xl font-semibold text-siara-purple-900 mb-8">
              {content.related_heading || "Related Events"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPortfolio.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {item.featured_image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={item.featured_image.startsWith('http') ? item.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.featured_image}`}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-xs font-semibold uppercase mb-2">
                      {item.event_type}
                    </span>
                    <h3 className="font-cormorant text-xl font-semibold text-siara-purple-900 mb-2 group-hover:text-siara-gold-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-siara-charcoal/60 font-dm-sans text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Portfolio Link */}
        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-siara-purple-500 text-siara-purple-600 font-dm-sans font-semibold hover:bg-siara-purple-500 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

