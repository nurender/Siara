"use client";

import { useState } from "react";

interface ContactFormContent {
  heading: string;
  subheading?: string;
  fields?: string[];
}

interface ContactFormSettings {
  // Add any settings if needed
}

interface ContactFormEditorProps {
  content: ContactFormContent;
  settings: ContactFormSettings;
  onChange: (content: ContactFormContent, settings: ContactFormSettings) => void;
  token: string | null;
}

const availableFields = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'event_type', label: 'Event Type' },
  { value: 'event_date', label: 'Event Date' },
  { value: 'guest_count', label: 'Guest Count' },
  { value: 'budget', label: 'Budget' },
  { value: 'message', label: 'Message' },
];

export default function ContactFormEditor({ content, settings, onChange, token }: ContactFormEditorProps) {
  const [localContent, setLocalContent] = useState<ContactFormContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    fields: content.fields || ['name', 'email', 'phone', 'event_type', 'message'],
  });
  const [localSettings, setLocalSettings] = useState<ContactFormSettings>(settings);

  const updateContent = (updates: Partial<ContactFormContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<ContactFormSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const toggleField = (field: string) => {
    const currentFields = localContent.fields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter((f) => f !== field)
      : [...currentFields, field];
    updateContent({ fields: newFields });
  };

  return (
    <div className="space-y-8">
      {/* Header Fields */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Content
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Heading *
          </label>
          <input
            type="text"
            value={localContent.heading}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Let's Plan Your Dream Event"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Subheading
          </label>
          <textarea
            value={localContent.subheading || ''}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Ready to start planning? Our team is here to help bring your vision to life."
          />
        </div>
      </div>

      {/* Form Fields Selection */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Form Fields
        </h4>
        <div className="space-y-2">
          {availableFields.map((field) => (
            <label key={field.value} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={(localContent.fields || []).includes(field.value)}
                onChange={() => toggleField(field.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{field.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Select which fields should appear in the contact form
        </p>
      </div>
    </div>
  );
}

