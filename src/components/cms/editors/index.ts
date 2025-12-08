export { default as HeroEditor } from './HeroEditor';
export { default as CTAEditor } from './CTAEditor';
export { default as FAQEditor } from './FAQEditor';
export { default as ServicesGridEditor } from './ServicesGridEditor';
export { default as TimelineEditor } from './TimelineEditor';
export { default as AboutStoryEditor } from './AboutStoryEditor';
export { default as AboutPreviewEditor } from './AboutPreviewEditor';
export { default as BlogGridEditor } from './BlogGridEditor';
export { default as AboutValuesEditor } from './AboutValuesEditor';
export { default as AboutTeamEditor } from './AboutTeamEditor';
export { default as AboutPartnersEditor } from './AboutPartnersEditor';
export { default as PortfolioFeaturedEditor } from './PortfolioFeaturedEditor';
export { default as TestimonialsEditor } from './TestimonialsEditor';
export { default as StatsEditor } from './StatsEditor';
export { default as ContactFormEditor } from './ContactFormEditor';

// Map section types to their editors
export const sectionEditors: Record<string, React.ComponentType<{
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  onChange: (content: Record<string, unknown>, settings: Record<string, unknown>) => void;
  token: string | null;
}>> = {
  hero: require('./HeroEditor').default,
  cta_banner: require('./CTAEditor').default,
  faq_accordion: require('./FAQEditor').default,
  services_grid: require('./ServicesGridEditor').default,
  services_featured: require('./ServicesGridEditor').default,
  timeline: require('./TimelineEditor').default,
  about_story: require('./AboutStoryEditor').default,
  about_preview: require('./AboutPreviewEditor').default,
  blog_grid: require('./BlogGridEditor').default,
  blog_featured: require('./BlogGridEditor').default,
  about_values: require('./AboutValuesEditor').default,
  about_team: require('./AboutTeamEditor').default,
  about_partners: require('./AboutPartnersEditor').default,
  portfolio_featured: require('./PortfolioFeaturedEditor').default,
  portfolio_grid: require('./PortfolioFeaturedEditor').default,
  testimonials_carousel: require('./TestimonialsEditor').default,
  testimonials: require('./TestimonialsEditor').default,
  stats_counter: require('./StatsEditor').default,
  stats: require('./StatsEditor').default,
  contact_form: require('./ContactFormEditor').default,
};

// Check if a section type has a visual editor
export function hasVisualEditor(sectionType: string): boolean {
  return sectionType in sectionEditors;
}

// Get the editor component for a section type
export function getEditorComponent(sectionType: string) {
  return sectionEditors[sectionType] || null;
}

