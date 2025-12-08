"use client";

import { useEffect, useRef, useState } from "react";

interface Partner {
  name: string;
  logo?: string;
  logo_url?: string;
}

interface PressFeature {
  name: string;
  type: string;
}

interface Award {
  award: string;
  org: string;
  icon?: string;
}

interface AboutPartnersContent {
  heading?: string;
  subheading?: string;
  description?: string;
  venue_partners?: Partner[];
  press_features?: PressFeature[];
  awards?: Award[];
}

interface AboutPartnersProps {
  content: AboutPartnersContent;
  settings?: Record<string, any>;
  relatedData?: Record<string, any>;
}

export default function AboutPartnersSection({ content, settings, relatedData }: AboutPartnersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Default data
  const heading = content?.heading || "Partnerships & Recognition";
  const subheading = content?.subheading || "Trusted Partners";
  const description = content?.description || "We're proud to partner with India's finest hospitality brands and be recognized by leading media outlets.";

  const venuePartners: Partner[] = content?.venue_partners || [
    { name: "Taj Hotels", logo: "🏨" },
    { name: "Oberoi Hotels", logo: "⭐" },
    { name: "Leela Palaces", logo: "👑" },
    { name: "ITC Hotels", logo: "🌟" },
    { name: "Rambagh Palace", logo: "🏰" },
    { name: "Umaid Bhawan", logo: "🏯" },
  ];

  const pressFeatures: PressFeature[] = content?.press_features || [
    { name: "Vogue India", type: "Featured" },
    { name: "WedMeGood", type: "Top Rated" },
    { name: "Wedding Wire", type: "Awarded" },
    { name: "Elle India", type: "Featured" },
    { name: "Femina", type: "Expert Panel" },
    { name: "The Times of India", type: "Interviewed" },
  ];

  const awards: Award[] = content?.awards || [
    {
      award: "Best Destination Wedding Planner",
      org: "Asian Wedding Awards 2023",
      icon: "🏆",
    },
    {
      award: "Top Wedding Planner in Rajasthan",
      org: "WedMeGood Awards 2024",
      icon: "⭐",
    },
    {
      award: "Excellence in Event Design",
      org: "India Event Excellence 2023",
      icon: "🎨",
    },
  ];

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
      className="relative py-24 lg:py-32 bg-siara-soft-white overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
            <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
              {subheading}
            </span>
          </div>
          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-siara-purple-950 mb-6">
            {heading.includes("Partnerships") ? (
              <>
                Partnerships &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                  Recognition
                </span>
              </>
            ) : (
              heading
            )}
          </h2>
          {description && (
            <p className="font-dm-sans text-lg text-siara-purple-700/70 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Venue Partners */}
        {venuePartners.length > 0 && (
          <div
            className={`mb-16 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="font-cormorant text-2xl font-semibold text-siara-purple-950 text-center mb-8">
              Preferred Venue Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {venuePartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-lg shadow-siara-purple-100/20 hover:shadow-xl hover:shadow-siara-purple-200/30 hover:-translate-y-1 transition-all duration-300"
                >
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-12 w-auto mx-auto mb-3 object-contain"
                    />
                  ) : (
                    <div className="text-4xl mb-3">{partner.logo || "🏨"}</div>
                  )}
                  <div className="font-dm-sans text-sm font-medium text-siara-purple-800">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press Features */}
        {pressFeatures.length > 0 && (
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="font-cormorant text-2xl font-semibold text-siara-purple-950 text-center mb-8">
              As Featured In
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {pressFeatures.map((press, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg shadow-siara-purple-100/20"
                >
                  <span className="font-cormorant text-lg font-semibold text-siara-purple-950">
                    {press.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-xs font-medium">
                    {press.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div
            className={`mt-16 transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-gradient-to-r from-siara-purple-900 via-siara-purple-800 to-siara-purple-900 rounded-3xl p-8 lg:p-12">
              <h3 className="font-cormorant text-2xl font-semibold text-white text-center mb-8">
                Awards & Accolades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {awards.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl bg-siara-purple-800/50 backdrop-blur-sm border border-siara-purple-700/30"
                  >
                    <div className="text-4xl mb-3">{item.icon || "🏆"}</div>
                    <h4 className="font-cormorant text-lg font-semibold text-white mb-1">
                      {item.award}
                    </h4>
                    <p className="font-dm-sans text-sm text-siara-purple-300/70">
                      {item.org}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

