"use client";

import { useState } from "react";

interface TestimonialsContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
}

interface TestimonialsSettings {
  autoplay?: boolean;
}

interface TestimonialsEditorProps {
  content: TestimonialsContent;
  settings: TestimonialsSettings;
  onChange: (content: TestimonialsContent, settings: TestimonialsSettings) => void;
  token: string | null;
}

export default function TestimonialsEditor({ content, settings, onChange, token }: TestimonialsEditorProps) {
  const [localContent, setLocalContent] = useState<TestimonialsContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    display_count: content.display_count || 6,
  });
  const [localSettings, setLocalSettings] = useState<TestimonialsSettings>({
    autoplay: settings.autoplay !== false,
  });

  const updateContent = (updates: Partial<TestimonialsContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<TestimonialsSettings>) => {
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
            placeholder="Client Stories"
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
            placeholder="Words from Our Cherished Clients"
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
            placeholder="Discover why discerning clients trust Siara Events..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Count
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={localContent.display_count || 6}
            onChange={(e) => updateContent({ display_count: parseInt(e.target.value) || 6 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Number of testimonials to display (1-20)
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localSettings.autoplay !== false}
            onChange={(e) => updateSettings({ autoplay: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Autoplay
          </span>
        </label>
      </div>
    </div>
  );
}

