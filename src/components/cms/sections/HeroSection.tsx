"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroContent {
  heading: string;
  subheading: string;
  category_badge?: string;
  background_image?: string;
  background_video?: string;
  cta_primary?: { text: string; url: string };
  cta_secondary?: { text: string; url: string };
  stats?: { value: string; label: string }[];
  highlight_text?: string; // For About Hero: "Rajasthan's Premier Wedding Planners"
  breadcrumb?: { show: boolean; items?: { label: string; url: string }[] };
}

interface HeroSettings {
  height?: "full" | "large" | "medium";
  overlay_opacity?: number;
}

interface HeroSectionProps {
  content: HeroContent;
  settings: HeroSettings;
  priority?: boolean;
}

export default function HeroSection({ content, settings }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Default values for missing content
  const heading = content?.heading || "Welcome to Siara Events";
  const subheading = content?.subheading || "Crafting Extraordinary Celebrations";
  const safeContent = {
    ...content,
    heading,
    subheading,
  };

  // Check if this is About Hero
  const isAboutHero = heading.includes("Meet Siara Events") || heading.includes("Meet Siara");

  const heightClass = {
    full: "min-h-screen",
    large: isAboutHero ? "min-h-[70vh]" : "min-h-[80vh]",
    medium: "min-h-[60vh]",
  }[(settings?.height) || (isAboutHero ? "large" : "full")];

  return (
    <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      <div className="absolute inset-0">
        {safeContent.background_video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={safeContent.background_video} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: safeContent.background_image
                ? `url(${safeContent.background_image})`
                : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            }}
          />
        )}
        
        {/* Gradient Overlay - Different for About Hero */}
        {isAboutHero ? (
          <div className="absolute inset-0 bg-gradient-to-b from-siara-purple-950/85 via-siara-purple-950/75 to-siara-purple-950"></div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-b from-siara-purple-950/80 via-siara-purple-900/60 to-siara-purple-950/90"
            style={{ opacity: settings?.overlay_opacity || 0.7 }}
          />
        )}
        
        {/* Decorative pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a855' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Decorative elements - Different for About Hero */}
      {isAboutHero ? (
        <>
          <div className="absolute top-32 right-20 w-64 h-64 border border-siara-gold-500/10 rounded-full hidden lg:block"></div>
          <div className="absolute bottom-32 left-20 w-48 h-48 border border-siara-purple-400/10 rotate-45 hidden lg:block"></div>
        </>
      ) : (
        <>
          <div className="absolute top-20 right-20 hidden lg:block">
            <div className="w-32 h-32 border border-siara-gold-500/20 rounded-full animate-spin-slow"></div>
          </div>
          <div className="absolute bottom-32 left-16 hidden lg:block">
            <div className="w-24 h-24 border border-siara-purple-400/20 rotate-45"></div>
          </div>
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-siara-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-siara-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-siara-purple-800/10 rounded-full blur-3xl"></div>
        </>
      )}

      {/* Content */}
      <div className={`relative z-10 ${isAboutHero ? 'max-w-5xl' : 'max-w-7xl'} mx-auto px-6 lg:px-8 text-center ${isAboutHero ? 'py-24 lg:py-32' : ''}`}>
        {isAboutHero ? (
          <>
            {/* Breadcrumb */}
            <nav
              className={`mb-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center justify-center gap-2 font-dm-sans text-sm">
                <li>
                  <Link href="/" className="text-siara-purple-300/70 hover:text-siara-gold-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-siara-purple-400">/</li>
                <li className="text-siara-gold-400">About Us</li>
              </ol>
            </nav>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-siara-purple-800/50 backdrop-blur-sm border border-siara-purple-600/30 mb-6 transition-all duration-1000 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-siara-gold-400"></span>
              <span className="font-dm-sans text-sm text-siara-gold-300 font-medium tracking-wide">
                {safeContent.category_badge || "Since 2008"}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className={`font-cormorant text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-6 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              Meet Siara Events:{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                {safeContent.highlight_text || "Rajasthan's Premier Wedding Planners"}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`font-dm-sans text-lg md:text-xl text-siara-purple-200/70 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              dangerouslySetInnerHTML={{
                __html: subheading
                  .replace(/<strong>(.*?)<\/strong>/g, '<strong class="text-white">$1</strong>')
                  .replace(/<strong class="text-siara-gold-400">(.*?)<\/strong>/g, '<strong class="text-siara-gold-400">$1</strong>')
              }}
            />

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              {safeContent.cta_primary?.url && (
                <Link
                  href={safeContent.cta_primary.url}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-siara-gold-500 via-siara-gold-400 to-siara-gold-500 bg-[length:200%_100%] text-siara-purple-950 font-dm-sans font-semibold transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-siara-gold-500/30"
                >
                  <span>{safeContent.cta_primary.text || "Book Consultation"}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}

              {safeContent.cta_secondary?.url && (
                <Link
                  href={safeContent.cta_secondary.url}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-siara-purple-500 text-white font-dm-sans font-semibold hover:bg-siara-purple-800/50 transition-all"
                >
                  <span>{safeContent.cta_secondary.text || "View Our Work"}</span>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Category Badge */}
            {safeContent.category_badge && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-siara-purple-800/40 backdrop-blur-sm border border-siara-purple-600/30 mb-8">
                <span className="w-2 h-2 rounded-full bg-siara-gold-400 animate-pulse"></span>
                <span className="font-dm-sans text-sm text-siara-gold-300 tracking-wide">
                  {safeContent.category_badge}
                </span>
              </div>
            )}

          {/* Heading */}
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white leading-tight mb-6 whitespace-pre-line">
            {(() => {
              // Check if heading contains newline
              if (heading.includes('\n')) {
                const lines = heading.split('\n');
                return lines.map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line.split(" ").map((word, wordIndex, words) => {
                      // Highlight "Portfolio" if present
                      if (word.toLowerCase().includes("portfolio")) {
                        return (
                          <span key={wordIndex}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                              {word}
                            </span>
                            {wordIndex < words.length - 1 ? " " : ""}
                          </span>
                        );
                      }
                      return <span key={wordIndex}>{word}{wordIndex < words.length - 1 ? " " : ""}</span>;
                    })}
                    {lineIndex < lines.length - 1 ? "\n" : ""}
                  </span>
                ));
              }
              
              // Original logic for single line headings
              const words = heading.split(" ");
              // Check for highlight words: "unforgettable", "services", or use highlight_text
              const highlightWord = safeContent.highlight_text || 
                words.find(w => w.toLowerCase().includes("unforgettable") || w.toLowerCase().includes("services"));
              const shouldHighlight = highlightWord !== undefined;
              
              return words.map((word, i) => {
                const shouldHighlightThis = shouldHighlight && (
                  word.toLowerCase().includes(highlightWord?.toLowerCase() || "") ||
                  (highlightWord && word.toLowerCase() === highlightWord.toLowerCase())
                );
                
                if (shouldHighlightThis) {
                  return (
                    <span key={i}>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                        {word}
                      </span>
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  );
                }
                return <span key={i}>{word}{i < words.length - 1 ? " " : ""}</span>;
              });
            })()}
          </h1>

          {/* Subheading */}
          <p className="font-dm-sans text-lg md:text-xl text-siara-purple-200/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            {subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            {safeContent.cta_primary?.url && (
              <Link
                href={safeContent.cta_primary.url}
                className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden rounded-full bg-gradient-to-r from-siara-gold-500 via-siara-gold-400 to-siara-gold-500 bg-[length:200%_100%] text-siara-purple-950 font-dm-sans font-semibold tracking-wide transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl hover:shadow-siara-gold-500/30 hover:scale-105"
              >
                <span>{safeContent.cta_primary.text || "Explore Services"}</span>
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

            {safeContent.cta_secondary?.url && (
              <Link
                href={safeContent.cta_secondary.url}
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-siara-purple-400/40 text-white font-dm-sans font-semibold tracking-wide transition-all duration-300 hover:border-siara-gold-400/60 hover:bg-siara-purple-800/30 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5 text-siara-gold-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{safeContent.cta_secondary.text || "View Portfolio"}</span>
              </Link>
            )}
          </div>

          {/* Stats Bar - Only for non-About Hero */}
          {!isAboutHero && safeContent.stats && safeContent.stats.length > 0 && (
            <div
              className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {safeContent.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-siara-purple-800/20 backdrop-blur-sm border border-siara-purple-600/20"
                >
                  <div className="font-cormorant text-3xl md:text-4xl font-bold text-siara-gold-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="font-dm-sans text-sm text-siara-purple-200/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {isAboutHero ? (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      ) : (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-dm-sans text-xs text-siara-purple-300/60 tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-siara-gold-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

