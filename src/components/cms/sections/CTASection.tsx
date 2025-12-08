"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface CTAContent {
  heading: string;
  subheading?: string;
  cta_primary?: { text: string; url: string };
  cta_secondary?: { text: string; url: string };
  background_image?: string;
  badge_text?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  trust_indicators?: Array<{ icon: string; text: string }>;
}

interface CTAProps {
  content: CTAContent;
  settings?: { style?: string };
}

export default function CTASection({ content }: CTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Safe defaults
  const heading = content?.heading || "Let's Create Something Extraordinary";
  const subheading = content?.subheading;
  const headingWords = heading.split(" ");
  const lastWord = headingWords.slice(-1).join("");
  const restWords = headingWords.slice(0, -1).join(" ");

  // Check if this is the About page CTA variant
  const isAboutPage = heading.includes("Contact Rajasthan's Best Wedding Planners");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Render About page variant
  if (isAboutPage) {
    const badgeText = content?.badge_text || "Start Your Journey Today";
    const contactPhone = content?.contact_phone || "+91 90240 55545";
    const contactEmail = content?.contact_email || "hello@siaraevents.com";
    const contactWhatsApp = content?.contact_whatsapp || "919024055545";
    const backgroundImage = content?.background_image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80";
    
    const trustIndicators = content?.trust_indicators || [
      { icon: "⭐", text: "5-Star Rated" },
      { icon: "🏆", text: "Award Winning" },
      { icon: "💍", text: "500+ Weddings" },
      { icon: "🏰", text: "50+ Venue Partners" },
    ];

    return (
      <section
        ref={sectionRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="absolute inset-0 bg-siara-purple-950/90"></div>

          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-siara-purple-700/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-siara-gold-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-siara-purple-800/40 backdrop-blur-sm border border-siara-purple-600/30 mb-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-lg">✨</span>
            <span className="font-dm-sans text-sm text-siara-gold-300 tracking-wide">
              {badgeText}
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className={`font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Contact Rajasthan&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
              Best Wedding Planners
            </span>{" "}
            Today!
          </h2>

          {/* Subheading */}
          {subheading && (
            <p
              className={`font-dm-sans text-lg md:text-xl text-siara-purple-200/70 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {subheading}
            </p>
          )}

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {content?.cta_primary?.url && (
              <Link
                href={content.cta_primary.url}
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-siara-gold-500 via-siara-gold-400 to-siara-gold-500 bg-[length:200%_100%] text-siara-purple-950 font-dm-sans text-lg font-semibold tracking-wide transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl hover:shadow-siara-gold-500/30 hover:scale-105"
              >
                <span>{content.cta_primary.text || "Book Consultation"}</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}

            {content?.cta_secondary?.url && (
              <Link
                href={content.cta_secondary.url}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full border-2 border-siara-purple-500 text-white font-dm-sans text-lg font-semibold hover:bg-siara-purple-800/50 transition-all"
              >
                <span>{content.cta_secondary.text || "View Portfolio"}</span>
              </Link>
            )}
          </div>

          {/* Quick Contact Info */}
          <div
            className={`flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-siara-purple-200/70 hover:text-siara-gold-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="font-dm-sans">{contactPhone}</span>
            </a>

            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-siara-purple-200/70 hover:text-siara-gold-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="font-dm-sans">{contactEmail}</span>
            </a>

            <a href={`https://wa.me/${contactWhatsApp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siara-purple-200/70 hover:text-green-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-dm-sans">WhatsApp Us</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-8 transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-siara-purple-300/60">
                <span className="text-xl">{item.icon}</span>
                <span className="font-dm-sans text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default variant (existing design)
  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-siara-purple-950 via-siara-purple-900 to-siara-purple-950" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 border border-siara-gold-500/10 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 border border-siara-purple-500/10 rounded-full hidden lg:block"></div>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-64 bg-gradient-to-r from-siara-gold-500/5 to-transparent"></div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-64 bg-gradient-to-l from-siara-gold-500/5 to-transparent"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-siara-purple-700/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-siara-gold-500/15 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a855' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-siara-purple-800/40 backdrop-blur-sm border border-siara-purple-600/30 mb-8">
          <svg className="w-5 h-5 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span className="font-dm-sans text-sm text-siara-gold-300 tracking-wide">
            Begin Your Journey
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-6">
          {restWords}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
            {lastWord}
          </span>
        </h2>

        {/* Subheading */}
        {subheading && (
          <p className="font-dm-sans text-lg md:text-xl text-siara-purple-200/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subheading}
          </p>
        )}

        {/* CTA Button */}
        {content?.cta_primary?.url && (
          <Link
            href={content.cta_primary.url}
            className="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden rounded-full bg-gradient-to-r from-siara-gold-500 via-siara-gold-400 to-siara-gold-500 bg-[length:200%_100%] text-siara-purple-950 font-dm-sans text-lg font-semibold tracking-wide transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl hover:shadow-siara-gold-500/30 hover:scale-105"
          >
            <span>{content.cta_primary.text || "Schedule Consultation"}</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}

        {/* Contact Info */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="flex items-center gap-3 text-siara-purple-200/70">
            <svg className="w-5 h-5 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="font-dm-sans text-sm">hello@siaraevents.com</span>
          </div>
          <div className="flex items-center gap-3 text-siara-purple-200/70">
            <svg className="w-5 h-5 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-dm-sans text-sm">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </section>
  );
}
