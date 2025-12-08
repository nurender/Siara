"use client";

import { useState } from "react";

interface ServicesGridContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_mode?: "all" | "featured";
  cta?: { text: string; url: string };
}

interface ServicesGridSettings {
  columns?: number;
  show_description?: boolean;
}

interface ServicesGridEditorProps {
  content: ServicesGridContent;
  settings: ServicesGridSettings;
  onChange: (content: ServicesGridContent, settings: ServicesGridSettings) => void;
  token: string | null;
}

export default function ServicesGridEditor({ content, settings, onChange }: ServicesGridEditorProps) {
  const [localContent, setLocalContent] = useState<ServicesGridContent>(content);
  const [localSettings, setLocalSettings] = useState<ServicesGridSettings>(settings);

  const updateContent = (updates: Partial<ServicesGridContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<ServicesGridSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Section Header
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading *
          </label>
          <input
            type="text"
            value={localContent.heading || ""}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Our Services"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading (badge text)
          </label>
          <input
            type="text"
            value={localContent.subheading || ""}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="What We Offer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={localContent.description || ""}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Brief description of your services"
          />
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Display Options
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Mode
            </label>
            <select
              value={localContent.display_mode || "featured"}
              onChange={(e) => updateContent({ display_mode: e.target.value as ServicesGridContent["display_mode"] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="featured">Featured Services Only</option>
              <option value="all">All Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Columns
            </label>
            <select
              value={localSettings.columns || 3}
              onChange={(e) => updateSettings({ columns: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localSettings.show_description !== false}
            onChange={(e) => updateSettings({ show_description: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Show service descriptions
          </span>
        </label>
      </div>

      {/* CTA Button */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Call to Action (optional)
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={localContent.cta?.text || ""}
              onChange={(e) => updateContent({ 
                cta: { ...localContent.cta, text: e.target.value, url: localContent.cta?.url || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="View All Services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Button URL
            </label>
            <input
              type="text"
              value={localContent.cta?.url || ""}
              onChange={(e) => updateContent({ 
                cta: { ...localContent.cta, url: e.target.value, text: localContent.cta?.text || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="/services"
            />
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Services Data</p>
            <p className="text-blue-600 dark:text-blue-400">
              This section will automatically pull services from the CMS database. 
              Manage your services in the <strong>CMS → Services</strong> section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

