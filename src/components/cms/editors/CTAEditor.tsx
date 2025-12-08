"use client";

import { useState } from "react";

interface CTAContent {
  heading: string;
  subheading?: string;
  cta_primary?: { text: string; url: string };
  cta_secondary?: { text: string; url: string };
  background_style?: "gradient" | "solid" | "image";
  background_image?: string;
}

interface CTASettings {
  padding?: "small" | "medium" | "large";
}

interface CTAEditorProps {
  content: CTAContent;
  settings: CTASettings;
  onChange: (content: CTAContent, settings: CTASettings) => void;
  token: string | null;
}

export default function CTAEditor({ content, settings, onChange }: CTAEditorProps) {
  const [localContent, setLocalContent] = useState<CTAContent>(content);
  const [localSettings, setLocalSettings] = useState<CTASettings>(settings);

  const updateContent = (updates: Partial<CTAContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<CTASettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Content
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
            placeholder="Ready to Get Started?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading
          </label>
          <input
            type="text"
            value={localContent.subheading || ""}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Let's create something amazing together"
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Buttons
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Button Text
            </label>
            <input
              type="text"
              value={localContent.cta_primary?.text || ""}
              onChange={(e) => updateContent({ 
                cta_primary: { ...localContent.cta_primary, text: e.target.value, url: localContent.cta_primary?.url || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contact Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Button URL
            </label>
            <input
              type="text"
              value={localContent.cta_primary?.url || ""}
              onChange={(e) => updateContent({ 
                cta_primary: { ...localContent.cta_primary, url: e.target.value, text: localContent.cta_primary?.text || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="/contact"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secondary Button Text (optional)
            </label>
            <input
              type="text"
              value={localContent.cta_secondary?.text || ""}
              onChange={(e) => updateContent({ 
                cta_secondary: { ...localContent.cta_secondary, text: e.target.value, url: localContent.cta_secondary?.url || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Call Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secondary Button URL
            </label>
            <input
              type="text"
              value={localContent.cta_secondary?.url || ""}
              onChange={(e) => updateContent({ 
                cta_secondary: { ...localContent.cta_secondary, url: e.target.value, text: localContent.cta_secondary?.text || "" } 
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="tel:+919876543210"
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Style
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Style
            </label>
            <select
              value={localContent.background_style || "gradient"}
              onChange={(e) => updateContent({ background_style: e.target.value as CTAContent["background_style"] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="gradient">Gradient</option>
              <option value="solid">Solid Color</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Padding
            </label>
            <select
              value={localSettings.padding || "medium"}
              onChange={(e) => updateSettings({ padding: e.target.value as CTASettings["padding"] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        {localContent.background_style === "image" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Image URL
            </label>
            <input
              type="url"
              value={localContent.background_image || ""}
              onChange={(e) => updateContent({ background_image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

