"use client";

import { useState } from "react";
import { ImageInput } from "../MediaPicker";

interface AboutPreviewContent {
  heading: string;
  subheading?: string;
  description: string;
  images?: string[];
  stats?: { value: string; label: string }[];
}

interface AboutPreviewSettings {
  // Add any settings if needed
}

interface AboutPreviewEditorProps {
  content: AboutPreviewContent;
  settings: AboutPreviewSettings;
  onChange: (content: AboutPreviewContent, settings: AboutPreviewSettings) => void;
  token: string | null;
}

export default function AboutPreviewEditor({ content, settings, onChange, token }: AboutPreviewEditorProps) {
  const [localContent, setLocalContent] = useState<AboutPreviewContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    images: content.images || [],
    stats: content.stats || [],
  });
  const [localSettings, setLocalSettings] = useState<AboutPreviewSettings>(settings);

  const updateContent = (updates: Partial<AboutPreviewContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<AboutPreviewSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateStat = (index: number, field: "value" | "label", value: string) => {
    const newStats = [...(localContent.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent({ stats: newStats });
  };

  const addStat = () => {
    updateContent({ stats: [...(localContent.stats || []), { value: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    const newStats = [...(localContent.stats || [])];
    newStats.splice(index, 1);
    updateContent({ stats: newStats });
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...(localContent.images || [])];
    newImages[index] = url;
    updateContent({ images: newImages });
  };

  const addImage = () => {
    const newImages = [...(localContent.images || []), ''];
    updateContent({ images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = [...(localContent.images || [])];
    newImages.splice(index, 1);
    updateContent({ images: newImages });
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
            placeholder="Our Story"
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
            placeholder="Where Elegance Meets Excellence"
          />
          <p className="text-xs text-gray-500 mt-1">
            Text after "Meets" will be highlighted in gold
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            value={localContent.description || ""}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="For over 15 years, Siara Events has been the trusted partner..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Use new lines to separate paragraphs
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
            Statistics ({localContent.stats?.length || 0})
          </h4>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stat
          </button>
        </div>

        {(!localContent.stats || localContent.stats.length === 0) ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              No statistics yet. Click "Add Stat" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {localContent.stats.map((stat, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    Stat {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove stat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Value *
                    </label>
                    <input
                      type="text"
                      value={stat.value || ""}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="15+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Years of Excellence"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
            Images ({localContent.images?.length || 0})
          </h4>
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Image
          </button>
        </div>

        {(!localContent.images || localContent.images.length === 0) ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              No images yet. Click "Add Image" to get started. (Need 4 images for grid)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {localContent.images.map((img, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <ImageInput
                  value={img}
                  onChange={(url) => updateImage(index, url)}
                  token={token}
                  label=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

