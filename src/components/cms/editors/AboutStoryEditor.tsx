"use client";

import { useState } from "react";
import { ImageInput } from "../MediaPicker";

interface AboutStoryContent {
  subheading?: string;
  heading: string;
  highlight?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  years_count?: string;
  founder_name?: string;
  founder_title?: string;
  founder_image?: string;
  images?: string[];
}

interface AboutStorySettings {
  // Add any settings if needed
}

interface AboutStoryEditorProps {
  content: AboutStoryContent;
  settings: AboutStorySettings;
  onChange: (content: AboutStoryContent, settings: AboutStorySettings) => void;
  token: string | null;
}

export default function AboutStoryEditor({ content, settings, onChange, token }: AboutStoryEditorProps) {
  const [localContent, setLocalContent] = useState<AboutStoryContent>({
    subheading: content.subheading || '',
    heading: content.heading || '',
    highlight: content.highlight || '',
    paragraph1: content.paragraph1 || '',
    paragraph2: content.paragraph2 || '',
    paragraph3: content.paragraph3 || '',
    years_count: content.years_count || '',
    founder_name: content.founder_name || '',
    founder_title: content.founder_title || '',
    founder_image: content.founder_image || '',
    images: content.images || [],
  });
  const [localSettings, setLocalSettings] = useState<AboutStorySettings>(settings);

  const updateContent = (updates: Partial<AboutStoryContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<AboutStorySettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...localContent.images || []];
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
            placeholder="• Our Story"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading (before highlight) *
          </label>
          <input
            type="text"
            value={localContent.heading || ""}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="A Legacy of Creating"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Highlighted Text (will be shown in gold) *
          </label>
          <input
            type="text"
            value={localContent.highlight || ""}
            onChange={(e) => updateContent({ highlight: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Unforgettable Moments"
          />
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Story Content
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paragraph 1 *
          </label>
          <textarea
            value={localContent.paragraph1 || ""}
            onChange={(e) => updateContent({ paragraph1: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Founded in 2008 in the heart of **Jaipur**, Siara Events began..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Use <strong>**text**</strong> to make text bold
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paragraph 2
          </label>
          <textarea
            value={localContent.paragraph2 || ""}
            onChange={(e) => updateContent({ paragraph2: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Our journey is rooted in deep respect..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paragraph 3
          </label>
          <textarea
            value={localContent.paragraph3 || ""}
            onChange={(e) => updateContent({ paragraph3: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Today, Siara Events is synonymous with excellence..."
          />
        </div>
      </div>

      {/* Years Badge */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Years Badge
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Years Count
          </label>
          <input
            type="text"
            value={localContent.years_count || ""}
            onChange={(e) => updateContent({ years_count: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="16+"
          />
        </div>
      </div>

      {/* Founder Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Founder Information
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Founder Name
          </label>
          <input
            type="text"
            value={localContent.founder_name || ""}
            onChange={(e) => updateContent({ founder_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Rajesh Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Founder Title
          </label>
          <input
            type="text"
            value={localContent.founder_title || ""}
            onChange={(e) => updateContent({ founder_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Founder & Creative Director"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Founder Image
          </label>
          <ImageInput
            value={localContent.founder_image || ""}
            onChange={(url) => updateContent({ founder_image: url })}
            token={token}
            label=""
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
            Image Grid ({localContent.images?.length || 0} images)
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
              No images yet. Click "Add Image" to get started. (Need 4 images for 2x2 grid)
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

