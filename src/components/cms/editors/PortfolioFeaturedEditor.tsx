"use client";

import { useState } from "react";

interface PortfolioFeaturedContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
  cta?: { text: string; url: string };
}

interface PortfolioFeaturedSettings {
  layout?: string;
}

interface PortfolioFeaturedEditorProps {
  content: PortfolioFeaturedContent;
  settings: PortfolioFeaturedSettings;
  onChange: (content: PortfolioFeaturedContent, settings: PortfolioFeaturedSettings) => void;
  token: string | null;
}

export default function PortfolioFeaturedEditor({ content, settings, onChange, token }: PortfolioFeaturedEditorProps) {
  const [localContent, setLocalContent] = useState<PortfolioFeaturedContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    display_count: content.display_count || 3,
    cta: content.cta || { text: '', url: '' },
  });
  const [localSettings, setLocalSettings] = useState<PortfolioFeaturedSettings>({
    layout: settings.layout || 'grid',
  });

  const updateContent = (updates: Partial<PortfolioFeaturedContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<PortfolioFeaturedSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subheading
          </label>
          <input
            type="text"
            value={localContent.subheading || ''}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Our Work"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={localContent.heading}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Our Portfolio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={localContent.description || ''}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Discover our portfolio of extraordinary events..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Count
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={localContent.display_count || 3}
            onChange={(e) => updateContent({ display_count: parseInt(e.target.value) || 3 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Number of portfolio items to display (1-12)
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Call to Action
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={localContent.cta?.text || ''}
              onChange={(e) => updateContent({ cta: { ...localContent.cta, text: e.target.value, url: localContent.cta?.url || '' } })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="View All Portfolio"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              CTA URL
            </label>
            <input
              type="url"
              value={localContent.cta?.url || ''}
              onChange={(e) => updateContent({ cta: { ...localContent.cta, text: localContent.cta?.text || '', url: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="/portfolio"
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Layout
        </label>
        <select
          value={localSettings.layout || 'grid'}
          onChange={(e) => updateSettings({ layout: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
    </div>
  );
}

