"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  event_type: string;
  location: string;
  venue?: string;
  featured_image: string;
  client_name?: string;
}

interface PortfolioFeaturedContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
  cta?: { text: string; url: string };
}

interface PortfolioFeaturedProps {
  content: PortfolioFeaturedContent;
  settings: { layout?: string };
  relatedData?: { portfolio?: PortfolioItem[] };
}

// Gradient options for different portfolio items
const gradientOptions = [
  "from-siara-purple-900/90 via-siara-purple-800/60 to-transparent",
  "from-siara-charcoal/90 via-siara-charcoal/60 to-transparent",
  "from-siara-gold-900/80 via-siara-gold-800/50 to-transparent",
];

export default function PortfolioFeaturedSection({ content, relatedData }: PortfolioFeaturedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Support both 'portfolio' and 'featuredPortfolio' keys
  const portfolio = ((relatedData as any)?.portfolio || (relatedData as any)?.featuredPortfolio || []).slice(0, content.display_count || 3);

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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-purple-950 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-siara-soft-white to-transparent"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-siara-purple-700 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-siara-gold-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {content.subheading && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-800/50 backdrop-blur-sm border border-siara-purple-600/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-siara-gold-400"></span>
              <span className="font-dm-sans text-sm text-siara-gold-300 font-medium tracking-wide">
                {content.subheading}
              </span>
            </div>
          )}

          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            {content.heading.includes("Portfolio") ? (
              <>
                {content.heading.split("Portfolio")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                  Portfolio
                </span>
                {content.heading.split("Portfolio")[1] || ""}
              </>
            ) : (
              content.heading
            )}
          </h2>

          {content.description && (
            <p className="font-dm-sans text-lg text-siara-purple-200/70 max-w-2xl mx-auto">
              {content.description}
            </p>
          )}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {portfolio.map((item: PortfolioItem, index: number) => {
            const gradient = gradientOptions[index % gradientOptions.length];
            const venue = item.venue || item.location;
            // Estimate guests based on event type
            const getGuestCount = (eventType: string) => {
              const type = eventType?.toLowerCase() || '';
              if (type.includes('wedding') || type.includes('ceremony')) return '450 Guests';
              if (type.includes('corporate') || type.includes('gala') || type.includes('launch')) return '800 Guests';
              if (type.includes('destination')) return '200 Guests';
              if (type.includes('private') || type.includes('celebration')) return '150 Guests';
              return '200+ Guests';
            };
            const guests = getGuestCount(item.event_type);

            return (
              <div
                key={item.id}
                className={`group relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link href={`/portfolio/${item.slug}`} className="absolute inset-0">
                  {/* Image */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
                      hoveredIndex === index ? "scale-110" : "scale-100"
                    }`}
                    style={{
                      backgroundImage: `url(${
                        item.featured_image?.startsWith('http')
                          ? item.featured_image
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.featured_image}`
                      })`,
                    }}
                  ></div>

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`}></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    {/* Event Type Badge */}
                    <div
                      className={`inline-flex self-start px-4 py-1.5 rounded-full bg-siara-gold-500/20 backdrop-blur-sm border border-siara-gold-400/30 mb-4 transition-all duration-500 ${
                        hoveredIndex === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-70"
                      }`}
                    >
                      <span className="font-dm-sans text-xs font-medium text-siara-gold-300 uppercase tracking-wider">
                        {item.event_type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-cormorant text-2xl lg:text-3xl font-semibold text-white mb-2 transition-all duration-500 ${
                        hoveredIndex === index ? "translate-y-0" : "translate-y-2"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Details */}
                    <div
                      className={`flex flex-wrap items-center gap-3 text-siara-purple-100/70 font-dm-sans text-sm transition-all duration-500 ${
                        hoveredIndex === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span>{venue}</span>
                      </div>
                      <span className="text-siara-gold-400">•</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                        <span>{guests}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div
                      className={`mt-6 transition-all duration-500 ${
                        hoveredIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 text-siara-gold-400 font-dm-sans text-sm font-medium">
                        View Project
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

                  {/* Decorative corner */}
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-siara-gold-400/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-siara-gold-400/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View Full Portfolio Button */}
        {content.cta && (
          <div
            className={`text-center mt-12 lg:mt-16 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Link
              href={content.cta.url || "/portfolio"}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-siara-gold-500/40 text-siara-gold-400 font-dm-sans font-semibold tracking-wide transition-all duration-300 hover:bg-siara-gold-500/10 hover:border-siara-gold-400/60"
            >
              <span>{content.cta.text || "View Full Portfolio"}</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


