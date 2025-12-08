"use client";

import { useState } from "react";

interface BlogGridContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
  display_mode?: "all" | "featured";
  cta?: { text: string; url: string };
}

interface BlogGridSettings {
  columns?: number;
}

interface BlogGridEditorProps {
  content: BlogGridContent;
  settings: BlogGridSettings;
  onChange: (content: BlogGridContent, settings: BlogGridSettings) => void;
  token: string | null;
}

export default function BlogGridEditor({ content, settings, onChange, token }: BlogGridEditorProps) {
  const [localContent, setLocalContent] = useState<BlogGridContent>({
    heading: content.heading || "From Our Journal",
    subheading: content.subheading || "Insights & Inspiration",
    description: content.description || "",
    display_count: content.display_count || 3,
    display_mode: content.display_mode || "featured",
    cta: content.cta || { text: "View All Articles", url: "/blog" },
  });
  const [localSettings, setLocalSettings] = useState<BlogGridSettings>({
    columns: settings.columns || 3,
  });

  const updateContent = (updates: Partial<BlogGridContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<BlogGridSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateCTA = (field: "text" | "url", value: string) => {
    updateContent({
      cta: {
        ...localContent.cta,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Header Content
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading
          </label>
          <input
            type="text"
            value={localContent.subheading || ""}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Insights & Inspiration"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading *
          </label>
          <input
            type="text"
            value={localContent.heading || ""}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="From Our Journal"
          />
          <p className="text-xs text-gray-500 mt-1">
            Text "Journal" will be highlighted in gold gradient
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={localContent.description || ""}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Expert insights, inspiring stories, and the latest trends in luxury event design and planning."
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Display Settings
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Count
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={localContent.display_count || 3}
            onChange={(e) => updateContent({ display_count: parseInt(e.target.value) || 3 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of blog posts to display (1-12)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Mode
          </label>
          <select
            value={localContent.display_mode || "featured"}
            onChange={(e) => updateContent({ display_mode: e.target.value as "all" | "featured" })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="featured">Featured (Latest)</option>
            <option value="all">All Posts</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose whether to show featured/latest posts or all posts
          </p>
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

      {/* CTA Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Call-to-Action
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CTA Text
          </label>
          <input
            type="text"
            value={localContent.cta?.text || ""}
            onChange={(e) => updateCTA("text", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="View All Articles"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CTA URL
          </label>
          <input
            type="text"
            value={localContent.cta?.url || ""}
            onChange={(e) => updateCTA("url", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="/blog"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL for the "View All Articles" link (e.g., /blog)
          </p>
        </div>
      </div>
    </div>
  );
}

