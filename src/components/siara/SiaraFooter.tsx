"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Settings {
  site_name?: string;
  site_tagline?: string;
  site_description?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_address?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_pinterest?: string;
  social_youtube?: string;
  social_twitter?: string;
  social_linkedin?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SiaraFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const [services, setServices] = useState<{ name: string; href: string }[]>([]);
  const [quickLinks, setQuickLinks] = useState<{ name: string; href: string }[]>([
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]);
  const [footerServicesHeading, setFooterServicesHeading] = useState("Our Services");
  const [newsletterHeading, setNewsletterHeading] = useState("Stay Inspired");
  const [newsletterText, setNewsletterText] = useState("Subscribe to our newsletter for exclusive insights, event inspiration, and special offers.");
  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState("Enter your email");
  const [newsletterButtonText, setNewsletterButtonText] = useState("Subscribe");

  useEffect(() => {
    // Fetch settings
    fetch(`${API_URL}/api/cms/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const fetchedSettings = data.data;
          setSettings(fetchedSettings);
          
          // Quick Links
          if (fetchedSettings.footer_quick_links) {
            try {
              const links = typeof fetchedSettings.footer_quick_links === 'string' 
                ? JSON.parse(fetchedSettings.footer_quick_links) 
                : fetchedSettings.footer_quick_links;
              if (Array.isArray(links) && links.length > 0) {
                setQuickLinks(links);
              }
            } catch (e) {
              console.error("Error parsing footer quick links:", e);
            }
          }
          
          // Footer headings and text
          if (fetchedSettings.footer_services_heading) {
            setFooterServicesHeading(fetchedSettings.footer_services_heading);
          }
          if (fetchedSettings.footer_newsletter_heading) {
            setNewsletterHeading(fetchedSettings.footer_newsletter_heading);
          }
          if (fetchedSettings.footer_newsletter_text) {
            setNewsletterText(fetchedSettings.footer_newsletter_text);
          }
          if (fetchedSettings.footer_newsletter_placeholder) {
            setNewsletterPlaceholder(fetchedSettings.footer_newsletter_placeholder);
          }
          if (fetchedSettings.footer_newsletter_button) {
            setNewsletterButtonText(fetchedSettings.footer_newsletter_button);
          }
        }
      })
      .catch(err => console.error("Failed to fetch settings:", err));

    // Fetch services
    fetch(`${API_URL}/api/cms/services`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const serviceLinks = data.data.slice(0, 6).map((s: { name: string; slug: string }) => ({
            name: s.name,
            href: `/services/${s.slug}`,
          }));
          setServices(serviceLinks);
        }
      })
      .catch(err => console.error("Failed to fetch services:", err));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Build social links from settings
  const socialLinks = [
    settings.social_instagram && {
      name: "Instagram",
      href: settings.social_instagram,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    settings.social_facebook && {
      name: "Facebook",
      href: settings.social_facebook,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    settings.social_pinterest && {
      name: "Pinterest",
      href: settings.social_pinterest,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    settings.social_youtube && {
      name: "YouTube",
      href: settings.social_youtube,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    settings.social_linkedin && {
      name: "LinkedIn",
      href: settings.social_linkedin,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ].filter(Boolean) as { name: string; href: string; icon: React.ReactElement }[];

  const siteName = settings.site_name || "";
  const siteDescription = settings.site_description || "";
  const address = settings.contact_address || "";

  return (
    <footer className="relative bg-siara-purple-950 overflow-hidden">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-siara-gold-500 to-transparent"></div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-siara-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-siara-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1: Logo & About */}
            <div className="lg:col-span-1">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siara-gold-400 via-siara-gold-500 to-siara-gold-600 flex items-center justify-center shadow-lg">
                    <span className="font-cormorant text-2xl font-bold text-siara-purple-950">
                      {siteName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-cormorant text-2xl font-semibold tracking-wide text-white">
                    {siteName.split(' ')[0]}
                  </span>
                  <span className="font-dm-sans text-[10px] uppercase tracking-[0.3em] text-siara-gold-400 -mt-1">
                    {siteName.split(' ')[1] || 'Events'}
                  </span>
                </div>
              </Link>

              <p className="font-dm-sans text-siara-purple-300/70 mb-6 leading-relaxed">
                {siteDescription}
              </p>

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-siara-purple-800/50 flex items-center justify-center text-siara-purple-300 hover:bg-siara-gold-500 hover:text-siara-purple-950 transition-all duration-300"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-cormorant text-xl font-semibold text-white mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-dm-sans text-siara-purple-300/70 hover:text-siara-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-[1px] bg-siara-gold-400 group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h4 className="font-cormorant text-xl font-semibold text-white mb-6">
                {footerServicesHeading}
              </h4>
              {services.length > 0 ? (
                <ul className="space-y-3">
                  {services.map((service) => (
                    <li key={service.name}>
                      <Link
                        href={service.href}
                        className="font-dm-sans text-siara-purple-300/70 hover:text-siara-gold-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                      >
                        <span className="w-0 h-[1px] bg-siara-gold-400 group-hover:w-4 transition-all duration-300"></span>
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-dm-sans text-siara-purple-300/50 text-sm">
                  Services coming soon...
                </p>
              )}
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-cormorant text-xl font-semibold text-white mb-6">
                {newsletterHeading}
              </h4>
              <p className="font-dm-sans text-siara-purple-300/70 mb-6 leading-relaxed">
                {newsletterText}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterPlaceholder}
                    className="w-full px-5 py-3.5 rounded-full bg-siara-purple-800/50 border border-siara-purple-600/30 text-white placeholder-siara-purple-400 font-dm-sans text-sm focus:outline-none focus:border-siara-gold-500/50 focus:ring-2 focus:ring-siara-gold-500/20 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 font-dm-sans font-semibold text-sm hover:shadow-lg hover:shadow-siara-gold-500/30 transition-all duration-300"
                >
                  {isSubscribed ? "Thank You! ✓" : newsletterButtonText}
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-siara-purple-300/70">
                  <svg className="w-4 h-4 text-siara-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="font-dm-sans text-sm">{address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-siara-purple-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-dm-sans text-sm text-siara-purple-400">
                © {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="#"
                  className="font-dm-sans text-sm text-siara-purple-400 hover:text-siara-gold-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="font-dm-sans text-sm text-siara-purple-400 hover:text-siara-gold-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
