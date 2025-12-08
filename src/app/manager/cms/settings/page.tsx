"use client";

import { useState, useEffect, useCallback } from "react";
import { useManagerAuth } from "@/context/ManagerAuthContext";
import Link from "next/link";
import { ImageInput } from "@/components/cms/MediaPicker";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Setting {
  setting_key: string;
  setting_value: string;
  setting_group: string;
}

const settingGroups = [
  { key: "general", label: "General Settings", icon: "⚙️" },
  { key: "navigation", label: "Navigation & Header", icon: "🧭" },
  { key: "footer", label: "Footer Settings", icon: "📄" },
  { key: "contact", label: "Contact Information", icon: "📞" },
  { key: "social", label: "Social Media Links", icon: "🔗" },
  { key: "seo", label: "SEO Settings", icon: "🔍" },
  { key: "portfolio", label: "Portfolio Page", icon: "🖼️" },
  { key: "services", label: "Services Page", icon: "💼" },
  { key: "blog", label: "Blog Page", icon: "📝" },
  { key: "about", label: "About Page", icon: "ℹ️" },
  { key: "contact_page", label: "Contact Page", icon: "✉️" },
];

const defaultSettings = {
  // General
  site_name: "Siara Events",
  site_tagline: "Crafting Extraordinary Moments",
  site_description: "Luxury wedding and event planning services in Rajasthan",
  logo_url: "",
  favicon_url: "",
  
  // Contact
  contact_email: "hello@siaraevents.com",
  contact_phone: "+91 98765 43210",
  contact_whatsapp: "+91 98765 43210",
  contact_address: "Jaipur, Rajasthan, India",
  
  // Social
  social_instagram: "",
  social_facebook: "",
  social_twitter: "",
  social_linkedin: "",
  social_youtube: "",
  social_pinterest: "",
  
  // SEO
  seo_title: "Siara Events | Best Wedding Planner in Rajasthan",
  seo_description: "Luxury wedding and event planning services in Jaipur, Udaipur & Rajasthan",
  seo_keywords: "wedding planner, Rajasthan, Jaipur, luxury weddings",
  google_analytics_id: "",
  google_tag_manager_id: "",
  
  // Portfolio Page
  portfolio_hero_badge: "Our Work",
  portfolio_hero_title: "Wedding",
  portfolio_hero_highlight: "Portfolio",
  portfolio_hero_description: "Discover our collection of luxury destination weddings.",
  portfolio_featured_badge: "Featured Celebrations",
  portfolio_featured_title: "Signature",
  portfolio_featured_highlight: "Events",
  portfolio_other_badge: "More Celebrations",
  portfolio_other_title: "Explore Our",
  portfolio_other_highlight: "Collection",
  portfolio_empty_title: "Portfolio Coming Soon",
  portfolio_empty_description: "Our portfolio is being updated. Please check back soon!",
  
  // Services Page
  services_hero_badge: "Our Expertise",
  services_hero_title: "Exceptional",
  services_hero_highlight: "Services",
  services_hero_description: "From intimate celebrations to grand productions.",
  services_empty_title: "Services Coming Soon",
  services_empty_description: "Our services are being updated. Please check back soon!",
  
  // Blog Page
  blog_hero_badge: "Our Blog",
  blog_hero_title: "Wedding Planning",
  blog_hero_highlight: "Insights",
  blog_hero_description: "Expert tips, venue guides, and inspiration.",
  blog_empty_title: "Blog Coming Soon",
  blog_empty_description: "Our blog articles are being prepared.",
  
  // About Page - Hero
  about_hero_badge: "Since 2008",
  about_hero_title: "Meet Siara Events:",
  about_hero_highlight: "Rajasthan's Premier Wedding Planners",
  about_hero_description: "Trusted luxury event management in Jaipur, Udaipur, and Jodhpur.",
  about_hero_image: "",
  about_cta_text: "Book Consultation",
  about_cta_secondary_text: "View Our Work",
  
  // About Page - Story
  about_story_badge: "Our Story",
  about_story_title: "A Legacy of Creating",
  about_story_highlight: "Unforgettable Moments",
  about_story_paragraph1: "",
  about_story_paragraph2: "",
  about_story_paragraph3: "",
  about_years_count: "16+",
  about_founder_name: "Rajesh Sharma",
  about_founder_title: "Founder & Creative Director",
  about_founder_image: "",
  about_story_image1: "",
  about_story_image2: "",
  about_story_image3: "",
  about_story_image4: "",
  
  // About Page - Values
  about_values_badge: "Why Choose Us",
  about_values_title: "The Siara Events",
  about_values_highlight: "Difference",
  about_values_description: "What sets the best wedding planner in Rajasthan apart?",
  
  // About Page - Stats
  about_stats_badge: "Our Achievements",
  about_stats_title: "Numbers That Speak",
  about_stats_highlight: "Excellence",
  about_stats_description: "Over 16 years, we've built a legacy of trust and excellence.",
  
  // About Page - Team
  about_team_badge: "Our Leadership",
  about_team_title: "Meet the",
  about_team_highlight: "Visionaries",
  about_team_description: "Our leadership team combines decades of experience.",
  about_team_note: "Plus a dedicated team of 50+ professionals.",
  
  // About Page - Timeline
  about_timeline_badge: "Our Journey",
  about_timeline_title: "Milestones of",
  about_timeline_highlight: "Excellence",
  about_timeline_description: "From our humble beginnings in Jaipur to becoming Rajasthan's most trusted.",
  about_timeline_future: "Coming 2025: International expansion to Dubai & Thailand",
  
  // About Page - Partners
  about_partners_badge: "Trusted Partners",
  about_partners_title: "Partnerships &",
  about_partners_highlight: "Recognition",
  about_partners_description: "We're proud to partner with India's finest hospitality brands.",
  
  // Contact Page
  contact_hero_badge: "Get in Touch",
  contact_hero_title: "Let's Plan Your",
  contact_hero_highlight: "Dream Event",
  contact_hero_description: "Ready to start planning? Our team is here to help.",
  
  // Navigation & Header
  navbar_logo_text: "Siara Events",
  navbar_cta_text: "Book Consultation",
  navbar_links: JSON.stringify([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]),
  
  // Footer Settings
  footer_quick_links: JSON.stringify([
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]),
  footer_services_heading: "Our Services",
  footer_newsletter_heading: "Stay Inspired",
  footer_newsletter_text: "Subscribe to our newsletter for exclusive insights, event inspiration, and special offers.",
  footer_newsletter_placeholder: "Enter your email",
  footer_newsletter_button: "Subscribe",
  
  // Team Members (JSON array)
  about_team_members: JSON.stringify([
    {
      name: "Rajesh Sharma",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      bio: "20+ years in luxury hospitality. Former Taj Hotels executive turned wedding visionary.",
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Priya Mehta",
      role: "Lead Wedding Designer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Award-winning designer specializing in Rajasthani heritage aesthetics and contemporary fusion.",
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Amit Verma",
      role: "Operations Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Logistics expert managing 100+ weddings annually across Rajasthan's most prestigious venues.",
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Kavita Singh",
      role: "Head of Client Relations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bio: "Dedicated to creating personalized experiences and ensuring every client feels like royalty.",
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Vikram Rathore",
      role: "Udaipur Office Head",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
      bio: "Native Udaipur expert with exclusive access to Lake Pichola's most coveted venues.",
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Ananya Joshi",
      role: "Jodhpur Office Head",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80",
      bio: "Specialist in fort weddings and desert celebrations with deep Marwar cultural knowledge.",
      linkedin: "#",
      instagram: "#",
    },
  ]),
};

export default function SiteSettings() {
  const { token } = useManagerAuth();
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cms/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const settingsMap: Record<string, string> = { ...defaultSettings };
        
        // Handle both object and array format
        if (Array.isArray(data.data)) {
          // Old format: array of settings
          data.data.forEach((setting: Setting) => {
            try {
              settingsMap[setting.setting_key] = typeof setting.setting_value === 'string' 
                ? JSON.parse(setting.setting_value) 
                : setting.setting_value;
            } catch {
              settingsMap[setting.setting_key] = setting.setting_value;
            }
          });
        } else {
          // New format: object with key-value pairs
          Object.entries(data.data).forEach(([key, value]) => {
            // If value is an object or array, stringify it for textarea display
            if (typeof value === 'object' && value !== null) {
              settingsMap[key] = JSON.stringify(value, null, 2);
            } else {
              settingsMap[key] = String(value);
            }
          });
        }
        
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!token) return;
    
    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: JSON.stringify(value),
        setting_group: getGroupForKey(key),
      }));

      const res = await fetch(`${API_URL}/api/cms/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: settingsArray }),
      });

      const data = await res.json();
      if (data.success) {
        setHasChanges(false);
        alert("Settings saved successfully!");
      } else {
        alert(data.message || "Save failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const getGroupForKey = (key: string): string => {
    if (key.startsWith("navbar_")) return "navigation";
    if (key.startsWith("footer_")) return "footer";
    if (key.startsWith("portfolio_")) return "portfolio";
    if (key.startsWith("services_")) return "services";
    if (key.startsWith("blog_")) return "blog";
    if (key.startsWith("about_")) return "about";
    if (key.startsWith("contact_hero") || key.startsWith("contact_page")) return "contact_page";
    if (key.startsWith("contact_")) return "contact";
    if (key.startsWith("social_")) return "social";
    if (key.startsWith("seo_") || key.includes("analytics") || key.includes("tag_manager")) return "seo";
    return "general";
  };

  const renderSettingField = (key: string, label: string, type: "text" | "textarea" | "url" | "email" | "image" = "text") => {
    const value = settings[key] || "";
    
    // For image fields, use ImageInput with Media Library
    if (type === "image") {
      return (
        <div key={key} className="mb-4">
          <ImageInput
            value={value}
            onChange={(url) => handleChange(key, url)}
            token={token}
            label={label}
            placeholder="https://... or select from Media Library"
          />
        </div>
      );
    }
    
    return (
      <div key={key}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        )}
      </div>
    );
  };

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      {renderSettingField("site_name", "Site Name")}
      {renderSettingField("site_tagline", "Tagline")}
      {renderSettingField("site_description", "Site Description", "textarea")}
      {renderSettingField("logo_url", "Logo URL", "image")}
      {renderSettingField("favicon_url", "Favicon URL", "image")}
    </div>
  );

  const renderContactSettings = () => (
    <div className="space-y-4">
      {renderSettingField("contact_email", "Email Address", "email")}
      {renderSettingField("contact_phone", "Phone Number")}
      {renderSettingField("contact_whatsapp", "WhatsApp Number")}
      {renderSettingField("contact_address", "Address", "textarea")}
    </div>
  );

  const renderSocialSettings = () => (
    <div className="space-y-4">
      {renderSettingField("social_instagram", "Instagram URL", "url")}
      {renderSettingField("social_facebook", "Facebook URL", "url")}
      {renderSettingField("social_twitter", "Twitter/X URL", "url")}
      {renderSettingField("social_linkedin", "LinkedIn URL", "url")}
      {renderSettingField("social_youtube", "YouTube URL", "url")}
      {renderSettingField("social_pinterest", "Pinterest URL", "url")}
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-4">
      {renderSettingField("seo_title", "Default Meta Title")}
      {renderSettingField("seo_description", "Default Meta Description", "textarea")}
      {renderSettingField("seo_keywords", "Default Keywords")}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Analytics</h4>
        {renderSettingField("google_analytics_id", "Google Analytics ID")}
        {renderSettingField("google_tag_manager_id", "Google Tag Manager ID")}
      </div>
    </div>
  );

  const renderPortfolioSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Customize the text content displayed on the Portfolio page.
      </p>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hero Section</h4>
        {renderSettingField("portfolio_hero_badge", "Badge Text")}
        {renderSettingField("portfolio_hero_title", "Title (before highlight)")}
        {renderSettingField("portfolio_hero_highlight", "Highlighted Text")}
        {renderSettingField("portfolio_hero_description", "Description", "textarea")}
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Featured Section</h4>
        {renderSettingField("portfolio_featured_badge", "Badge Text")}
        {renderSettingField("portfolio_featured_title", "Title")}
        {renderSettingField("portfolio_featured_highlight", "Highlighted Text")}
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Other Events Section</h4>
        {renderSettingField("portfolio_other_badge", "Badge Text")}
        {renderSettingField("portfolio_other_title", "Title")}
        {renderSettingField("portfolio_other_highlight", "Highlighted Text")}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Empty State</h4>
        {renderSettingField("portfolio_empty_title", "Empty State Title")}
        {renderSettingField("portfolio_empty_description", "Empty State Description", "textarea")}
      </div>
    </div>
  );

  const renderServicesSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Customize the text content displayed on the Services page.
      </p>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hero Section</h4>
        {renderSettingField("services_hero_badge", "Badge Text")}
        {renderSettingField("services_hero_title", "Title (before highlight)")}
        {renderSettingField("services_hero_highlight", "Highlighted Text")}
        {renderSettingField("services_hero_description", "Description", "textarea")}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Empty State</h4>
        {renderSettingField("services_empty_title", "Empty State Title")}
        {renderSettingField("services_empty_description", "Empty State Description", "textarea")}
      </div>
    </div>
  );

  const renderBlogSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Customize the text content displayed on the Blog page.
      </p>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hero Section</h4>
        {renderSettingField("blog_hero_badge", "Badge Text")}
        {renderSettingField("blog_hero_title", "Title (before highlight)")}
        {renderSettingField("blog_hero_highlight", "Highlighted Text")}
        {renderSettingField("blog_hero_description", "Description", "textarea")}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Empty State</h4>
        {renderSettingField("blog_empty_title", "Empty State Title")}
        {renderSettingField("blog_empty_description", "Empty State Description", "textarea")}
      </div>
    </div>
  );

  const renderAboutSettings = () => {
    // Ensure about_team_members is always a JSON string for textarea
    let teamMembersValue = settings.about_team_members || "[]";
    
    // If it's not a string (i.e., it's an object/array), stringify it
    if (typeof teamMembersValue !== 'string') {
      teamMembersValue = JSON.stringify(teamMembersValue, null, 2);
      // Update the settings state with the stringified version
      if (settings.about_team_members !== teamMembersValue) {
        handleChange("about_team_members", teamMembersValue);
      }
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Customize the text content displayed on the About page.
        </p>
        
        {/* Hero Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hero Section</h4>
          {renderSettingField("about_hero_badge", "Badge Text")}
          {renderSettingField("about_hero_title", "Title (before highlight)")}
          {renderSettingField("about_hero_highlight", "Highlighted Text")}
          {renderSettingField("about_hero_description", "Description", "textarea")}
          {renderSettingField("about_hero_image", "Background Image", "image")}
          {renderSettingField("about_cta_text", "Primary CTA Text")}
          {renderSettingField("about_cta_secondary_text", "Secondary CTA Text")}
        </div>
        
        {/* Story Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Story Section</h4>
          {renderSettingField("about_story_badge", "Badge Text")}
          {renderSettingField("about_story_title", "Title (before highlight)")}
          {renderSettingField("about_story_highlight", "Highlighted Text")}
          {renderSettingField("about_story_paragraph1", "Story Paragraph 1", "textarea")}
          {renderSettingField("about_story_paragraph2", "Story Paragraph 2", "textarea")}
          {renderSettingField("about_story_paragraph3", "Story Paragraph 3", "textarea")}
          {renderSettingField("about_years_count", "Years Count (e.g., 16+)")}
          {renderSettingField("about_founder_name", "Founder Name")}
          {renderSettingField("about_founder_title", "Founder Title")}
          {renderSettingField("about_founder_image", "Founder Image", "image")}
          {renderSettingField("about_story_image1", "Story Image 1", "image")}
          {renderSettingField("about_story_image2", "Story Image 2", "image")}
          {renderSettingField("about_story_image3", "Story Image 3", "image")}
          {renderSettingField("about_story_image4", "Story Image 4", "image")}
        </div>
        
        {/* Values Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Values Section</h4>
          {renderSettingField("about_values_badge", "Badge Text")}
          {renderSettingField("about_values_title", "Title (before highlight)")}
          {renderSettingField("about_values_highlight", "Highlighted Text")}
          {renderSettingField("about_values_description", "Description", "textarea")}
        </div>
        
        {/* Stats Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Stats Section</h4>
          {renderSettingField("about_stats_badge", "Badge Text")}
          {renderSettingField("about_stats_title", "Title (before highlight)")}
          {renderSettingField("about_stats_highlight", "Highlighted Text")}
          {renderSettingField("about_stats_description", "Description", "textarea")}
        </div>
        
        {/* Team Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Team Section</h4>
          {renderSettingField("about_team_badge", "Badge Text")}
          {renderSettingField("about_team_title", "Title (before highlight)")}
          {renderSettingField("about_team_highlight", "Highlighted Text")}
          {renderSettingField("about_team_description", "Description", "textarea")}
          {renderSettingField("about_team_note", "Team Size Note", "textarea")}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Members (JSON Array)
            </label>
            <textarea
              value={teamMembersValue}
              onChange={(e) => handleChange("about_team_members", e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder='[{"name": "John Doe", "role": "CEO", "image": "url", "bio": "Bio text", "linkedin": "url", "instagram": "url"}]'
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: Array of team member objects with name, role, image, bio, linkedin, instagram
            </p>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline Section</h4>
          {renderSettingField("about_timeline_badge", "Badge Text")}
          {renderSettingField("about_timeline_title", "Title (before highlight)")}
          {renderSettingField("about_timeline_highlight", "Highlighted Text")}
          {renderSettingField("about_timeline_description", "Description", "textarea")}
          {renderSettingField("about_timeline_future", "Future Plans Note")}
        </div>
        
        {/* Partners Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Partners Section</h4>
          {renderSettingField("about_partners_badge", "Badge Text")}
          {renderSettingField("about_partners_title", "Title (before highlight)")}
          {renderSettingField("about_partners_highlight", "Highlighted Text")}
          {renderSettingField("about_partners_description", "Description", "textarea")}
        </div>
      </div>
    );
  };

  const renderContactPageSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Customize the text content displayed on the Contact page.
      </p>
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Hero Section</h4>
        {renderSettingField("contact_hero_badge", "Badge Text")}
        {renderSettingField("contact_hero_title", "Title (before highlight)")}
        {renderSettingField("contact_hero_highlight", "Highlighted Text")}
        {renderSettingField("contact_hero_description", "Description", "textarea")}
      </div>
    </div>
  );

  const renderNavigationSettings = () => {
    // Parse navigation links
    let navLinks: Array<{ name: string; href: string }> = [];
    try {
      const navLinksValue = settings.navbar_links || "[]";
      navLinks = typeof navLinksValue === 'string' 
        ? JSON.parse(navLinksValue) 
        : navLinksValue;
      if (!Array.isArray(navLinks)) navLinks = [];
    } catch (e) {
      navLinks = [];
    }

    const updateNavLinks = (newLinks: Array<{ name: string; href: string }>) => {
      handleChange("navbar_links", JSON.stringify(newLinks));
    };

    const addNavLink = () => {
      const newLinks = [...navLinks, { name: "", href: "" }];
      updateNavLinks(newLinks);
    };

    const updateNavLink = (index: number, field: "name" | "href", value: string) => {
      const newLinks = [...navLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      updateNavLinks(newLinks);
    };

    const deleteNavLink = (index: number) => {
      const newLinks = navLinks.filter((_, i) => i !== index);
      updateNavLinks(newLinks);
    };

    const moveNavLink = (index: number, direction: "up" | "down") => {
      const newLinks = [...navLinks];
      if (direction === "up" && index > 0) {
        [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      } else if (direction === "down" && index < newLinks.length - 1) {
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      }
      updateNavLinks(newLinks);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Customize the navigation bar logo text, links, and CTA button.
        </p>
        {renderSettingField("navbar_logo_text", "Logo Text (e.g., 'Siara Events' - will split automatically)")}
        {renderSettingField("navbar_cta_text", "CTA Button Text")}
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Navigation Links
            </label>
            <button
              type="button"
              onClick={addNavLink}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Link
            </button>
          </div>

          {navLinks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No navigation links yet</p>
              <button
                type="button"
                onClick={addNavLink}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Add your first link
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {navLinks.map((link, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Link Name
                        </label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateNavLink(index, "name", e.target.value)}
                          placeholder="e.g., Home, About, Services"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateNavLink(index, "href", e.target.value)}
                          placeholder="e.g., /, /about, /services"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => moveNavLink(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveNavLink(index, "down")}
                        disabled={index === navLinks.length - 1}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNavLink(index)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFooterSettings = () => {
    // Parse footer quick links
    let quickLinks: Array<{ name: string; href: string }> = [];
    try {
      const quickLinksValue = settings.footer_quick_links || "[]";
      quickLinks = typeof quickLinksValue === 'string' 
        ? JSON.parse(quickLinksValue) 
        : quickLinksValue;
      if (!Array.isArray(quickLinks)) quickLinks = [];
    } catch (e) {
      quickLinks = [];
    }

    const updateQuickLinks = (newLinks: Array<{ name: string; href: string }>) => {
      handleChange("footer_quick_links", JSON.stringify(newLinks));
    };

    const addQuickLink = () => {
      const newLinks = [...quickLinks, { name: "", href: "" }];
      updateQuickLinks(newLinks);
    };

    const updateQuickLink = (index: number, field: "name" | "href", value: string) => {
      const newLinks = [...quickLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      updateQuickLinks(newLinks);
    };

    const deleteQuickLink = (index: number) => {
      const newLinks = quickLinks.filter((_, i) => i !== index);
      updateQuickLinks(newLinks);
    };

    const moveQuickLink = (index: number, direction: "up" | "down") => {
      const newLinks = [...quickLinks];
      if (direction === "up" && index > 0) {
        [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      } else if (direction === "down" && index < newLinks.length - 1) {
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      }
      updateQuickLinks(newLinks);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Customize footer content including quick links, newsletter section, and headings.
        </p>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Links</h4>
            <button
              type="button"
              onClick={addQuickLink}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Link
            </button>
          </div>

          {quickLinks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No quick links yet</p>
              <button
                type="button"
                onClick={addQuickLink}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Add your first link
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Link Name
                        </label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => updateQuickLink(index, "name", e.target.value)}
                          placeholder="e.g., Home, About Us, Services"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateQuickLink(index, "href", e.target.value)}
                          placeholder="e.g., /, /about, /services"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => moveQuickLink(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuickLink(index, "down")}
                        disabled={index === quickLinks.length - 1}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuickLink(index)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Services Section</h4>
          {renderSettingField("footer_services_heading", "Services Heading")}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Newsletter Section</h4>
          {renderSettingField("footer_newsletter_heading", "Newsletter Heading")}
          {renderSettingField("footer_newsletter_text", "Newsletter Description", "textarea")}
          {renderSettingField("footer_newsletter_placeholder", "Email Input Placeholder")}
          {renderSettingField("footer_newsletter_button", "Subscribe Button Text")}
        </div>
      </div>
    );
  };

  const renderActiveGroup = () => {
    switch (activeGroup) {
      case "general":
        return renderGeneralSettings();
      case "navigation":
        return renderNavigationSettings();
      case "footer":
        return renderFooterSettings();
      case "contact":
        return renderContactSettings();
      case "social":
        return renderSocialSettings();
      case "seo":
        return renderSEOSettings();
      case "portfolio":
        return renderPortfolioSettings();
      case "services":
        return renderServicesSettings();
      case "blog":
        return renderBlogSettings();
      case "about":
        return renderAboutSettings();
      case "contact_page":
        return renderContactPageSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link href="/manager/cms" className="hover:text-blue-600">CMS</Link>
            <span>/</span>
            <span>Settings</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Site Settings
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            hasChanges
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {settingGroups.map((group) => (
                <button
                  key={group.key}
                  onClick={() => setActiveGroup(group.key)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    activeGroup === group.key
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className="text-lg">{group.icon}</span>
                  <span className="text-sm font-medium">{group.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {settingGroups.find((g) => g.key === activeGroup)?.label}
              </h2>
              {renderActiveGroup()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

