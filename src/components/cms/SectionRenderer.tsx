"use client";

import dynamic from 'next/dynamic';

// Lazy load section components for better performance
const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: dynamic(() => import('./sections/HeroSection')),
  about_preview: dynamic(() => import('./sections/AboutPreviewSection')),
  services_grid: dynamic(() => import('./sections/ServicesGridSection')),
  services_featured: dynamic(() => import('./sections/ServicesGridSection')),
  portfolio_featured: dynamic(() => import('./sections/PortfolioFeaturedSection')),
  portfolio_grid: dynamic(() => import('./sections/PortfolioFeaturedSection')),
  blog_grid: dynamic(() => import('./sections/BlogGridSection')),
  blog_featured: dynamic(() => import('./sections/BlogGridSection')),
  blog_detail: dynamic(() => import('./sections/BlogDetailSection')),
  portfolio_detail: dynamic(() => import('./sections/PortfolioDetailSection')),
  testimonials_carousel: dynamic(() => import('./sections/TestimonialsSection')),
  stats_counter: dynamic(() => import('./sections/StatsSection')),
  cta_banner: dynamic(() => import('./sections/CTASection')),
  faq_accordion: dynamic(() => import('./sections/FAQSection')),
  text_block: dynamic(() => import('./sections/TextBlockSection')),
  contact_form: dynamic(() => import('./sections/ContactFormSection')),
  timeline: dynamic(() => import('./sections/TimelineSection')),
  about_story: dynamic(() => import('./sections/AboutStorySection')),
  about_values: dynamic(() => import('./sections/AboutValuesSection')),
  about_team: dynamic(() => import('./sections/AboutTeamSection')),
  about_partners: dynamic(() => import('./sections/AboutPartnersSection')),
};

interface SectionRendererProps {
  section: {
    id: number;
    name: string;
    section_type: string;
    content: Record<string, any>;
    settings?: Record<string, any>;
  };
  relatedData?: Record<string, any>;
  priority?: boolean;
}

export function SectionRenderer({ section, relatedData, priority }: SectionRendererProps) {
  const Component = sectionComponents[section.section_type];
  
  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Unknown section type: <strong>{section.section_type}</strong>
          </p>
          <p className="text-yellow-600 text-xs mt-1">
            Section: {section.name}
          </p>
        </div>
      );
    }
    return null;
  }
  
  // Ensure content and settings are always objects
  let safeContent = {};
  let safeSettings = {};
  
  try {
    safeContent = typeof section.content === 'string' 
      ? JSON.parse(section.content) 
      : (section.content || {});
  } catch (e) {
    console.error('Error parsing section content:', e, section);
    safeContent = {};
  }
  
  try {
    safeSettings = typeof section.settings === 'string' 
      ? JSON.parse(section.settings) 
      : (section.settings || {});
  } catch (e) {
    console.error('Error parsing section settings:', e, section);
    safeSettings = {};
  }
  
  return (
    <Component
      content={safeContent}
      settings={safeSettings}
      relatedData={relatedData}
      priority={priority}
    />
  );
}

// Render multiple sections
interface SectionsRendererProps {
  sections: SectionRendererProps['section'][];
  relatedData?: Record<string, any>;
}

export function SectionsRenderer({ sections, relatedData }: SectionsRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        // Ensure section has required properties
        if (!section || !section.section_type) {
          console.warn('Invalid section:', section);
          return null;
        }
        
        return (
          <SectionRenderer
            key={section.id || index}
            section={section}
            relatedData={relatedData}
            priority={index === 0}
          />
        );
      })}
    </>
  );
}

