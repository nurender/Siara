"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface NavLink {
  name: string;
  href: string;
}

export default function SiaraNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoText, setLogoText] = useState("Siara");
  const [logoSubtext, setLogoSubtext] = useState("Events");
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]);
  const [ctaText, setCtaText] = useState("Book Consultation");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch settings from CMS
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/settings?t=${Date.now()}`, {
          cache: 'no-store', // Prevent caching
        });
        const data = await res.json();
        if (data.success && data.data) {
          const settings = data.data;
          
          // Logo text
          if (settings.navbar_logo_text) {
            const parts = String(settings.navbar_logo_text).split(' ');
            setLogoText(parts[0] || "Siara");
            setLogoSubtext(parts.slice(1).join(' ') || "Events");
          } else if (settings.site_name) {
            const parts = String(settings.site_name).split(' ');
            setLogoText(parts[0] || "Siara");
            setLogoSubtext(parts.slice(1).join(' ') || "Events");
          }
          
          // Navigation links - handle multiple formats
          if (settings.navbar_links) {
            try {
              let links;
              if (typeof settings.navbar_links === 'string') {
                // Try to parse as JSON
                try {
                  links = JSON.parse(settings.navbar_links);
                } catch {
                  // If parse fails, it might already be a string representation
                  links = settings.navbar_links;
                }
              } else if (Array.isArray(settings.navbar_links)) {
                // Already an array
                links = settings.navbar_links;
              } else {
                links = settings.navbar_links;
              }
              
              // Ensure it's an array
              if (Array.isArray(links) && links.length > 0) {
                setNavLinks(links);
              }
            } catch (e) {
              console.error("Error parsing navbar links:", e, settings.navbar_links);
            }
          }
          
          // CTA button text
          if (settings.navbar_cta_text) {
            setCtaText(String(settings.navbar_cta_text));
          }
        }
      } catch (err) {
        console.error("Failed to fetch navbar settings:", err);
      }
    };
    
    fetchSettings();
    
    // Re-fetch when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-siara-purple-950/95 backdrop-blur-xl shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siara-gold-400 via-siara-gold-500 to-siara-gold-600 flex items-center justify-center shadow-lg group-hover:shadow-siara-gold-500/30 transition-all duration-300">
                <span className="font-cormorant text-2xl font-bold text-siara-purple-950">S</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-siara-gold-400 to-siara-gold-600 opacity-0 blur group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-cormorant text-2xl font-semibold tracking-wide text-white">
                {logoText}
              </span>
              <span className="font-dm-sans text-[10px] uppercase tracking-[0.3em] text-siara-gold-400 -mt-1">
                {logoSubtext}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-dm-sans text-sm font-medium text-white/80 hover:text-siara-gold-400 transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-siara-gold-400 to-siara-gold-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 overflow-hidden rounded-full bg-gradient-to-r from-siara-gold-500 via-siara-gold-400 to-siara-gold-500 bg-[length:200%_100%] text-siara-purple-950 font-dm-sans text-sm font-semibold tracking-wide transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-lg hover:shadow-siara-gold-500/30"
            >
              <span>{ctaText}</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-siara-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-siara-purple-700/30">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-dm-sans text-base font-medium text-white/80 hover:text-siara-gold-400 transition-colors duration-300 py-2"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 font-dm-sans text-sm font-semibold"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

