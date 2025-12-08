"use client";

import { useState } from "react";

interface Value {
  icon?: string;
  title: string;
  description: string;
}

interface AboutValuesContent {
  heading: string;
  subheading?: string;
  description?: string;
  values?: Value[];
}

interface AboutValuesSettings {
  // Add any settings if needed
}

interface AboutValuesEditorProps {
  content: AboutValuesContent;
  settings: AboutValuesSettings;
  onChange: (content: AboutValuesContent, settings: AboutValuesSettings) => void;
  token: string | null;
}

const availableIcons = [
  { value: 'heart', label: 'Heart' },
  { value: 'location', label: 'Location' },
  { value: 'team', label: 'Team' },
  { value: 'check', label: 'Check' },
  { value: 'money', label: 'Money' },
  { value: 'star', label: 'Star' },
];

export default function AboutValuesEditor({ content, settings, onChange, token }: AboutValuesEditorProps) {
  const [localContent, setLocalContent] = useState<AboutValuesContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    values: content.values || [],
  });
  const [localSettings, setLocalSettings] = useState<AboutValuesSettings>(settings);

  const updateContent = (updates: Partial<AboutValuesContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<AboutValuesSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const newValues = [...(localContent.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    updateContent({ values: newValues });
  };

  const addValue = () => {
    const newValues = [
      ...(localContent.values || []),
      { icon: 'heart', title: '', description: '' }
    ];
    updateContent({ values: newValues });
  };

  const removeValue = (index: number) => {
    const newValues = [...(localContent.values || [])];
    newValues.splice(index, 1);
    updateContent({ values: newValues });
  };

  const moveValue = (index: number, direction: 'up' | 'down') => {
    const newValues = [...(localContent.values || [])];
    if (direction === 'up' && index > 0) {
      [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
    } else if (direction === 'down' && index < newValues.length - 1) {
      [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
    }
    updateContent({ values: newValues });
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
            placeholder="Why Choose Us"
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
            placeholder="The Siara Events Difference"
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
            placeholder="What sets the best wedding planner in Rajasthan apart?"
          />
        </div>
      </div>

      {/* Values List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Values ({localContent.values?.length || 0})
          </label>
          <button
            type="button"
            onClick={addValue}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Value
          </button>
        </div>

        <div className="space-y-4">
          {(localContent.values || []).map((value, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Value {index + 1}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveValue(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveValue(index, 'down')}
                    disabled={index === (localContent.values?.length || 0) - 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Icon
                  </label>
                  <select
                    value={value.icon || 'heart'}
                    onChange={(e) => updateValue(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateValue(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Personalized Planning"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={value.description}
                    onChange={(e) => updateValue(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Every celebration is unique..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

