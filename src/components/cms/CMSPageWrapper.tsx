"use client";

import { ReactNode } from "react";
import { SectionsRenderer } from "./SectionRenderer";

interface CMSSection {
  id: number;
  name: string;
  section_type: string;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

interface CMSPageWrapperProps {
  // CMS data
  sections?: CMSSection[];
  relatedData?: Record<string, unknown>;
  // Fallback static content
  fallback?: ReactNode;
  // Force CMS even if sections are empty
  forceCMS?: boolean;
}

/**
 * Wrapper component that renders CMS sections when available,
 * or falls back to static content.
 * 
 * This allows gradual migration from static to dynamic content.
 */
export function CMSPageWrapper({
  sections,
  relatedData,
  fallback,
  forceCMS = false,
}: CMSPageWrapperProps) {
  // Use CMS sections if available and has content
  const hasCMSSections = sections && sections.length > 0;
  
  if (hasCMSSections || forceCMS) {
    return (
      <SectionsRenderer 
        sections={sections || []} 
        relatedData={relatedData} 
      />
    );
  }
  
  // Fall back to static content
  return <>{fallback}</>;
}

/**
 * Hybrid component that can render either CMS or static content per section
 */
interface HybridSectionProps {
  sectionType: string;
  cmsSection?: CMSSection;
  relatedData?: Record<string, unknown>;
  children: ReactNode;
}

export function HybridSection({
  sectionType,
  cmsSection,
  relatedData,
  children,
}: HybridSectionProps) {
  // If we have a CMS section of this type, render it
  if (cmsSection && cmsSection.section_type === sectionType) {
    return (
      <SectionsRenderer
        sections={[cmsSection]}
        relatedData={relatedData}
      />
    );
  }
  
  // Otherwise render static children
  return <>{children}</>;
}

