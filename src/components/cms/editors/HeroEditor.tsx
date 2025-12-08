"use client";

import { useState } from "react";
import { ImageInput } from "../MediaPicker";

interface HeroContent {
  heading: string;
  subheading: string;
  background_image?: string;
  background_video?: string;
  cta_primary?: { text: string; url: string };
  cta_secondary?: { text: string; url: string };
  stats?: { value: string; label: string }[];
}

interface HeroSettings {
  height?: "full" | "large" | "medium";
  overlay_opacity?: number;
}

interface HeroEditorProps {
  content: HeroContent;
  settings: HeroSettings;
  onChange: (content: HeroContent, settings: HeroSettings) => void;
  token: string | null;
}

export default function HeroEditor({ content, settings, onChange, token }: HeroEditorProps) {
  const [localContent, setLocalContent] = useState<HeroContent>(content);
  const [localSettings, setLocalSettings] = useState<HeroSettings>(settings);

  const updateContent = (updates: Partial<HeroContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<HeroSettings>) => {
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

  return (
    <div className="space-y-8">
      {/* Main Content */}
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
            value={localContent.heading || ""}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Main headline text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Subheading
          </label>
          <textarea
            value={localContent.subheading || ""}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Supporting text below the headline"
          />
        </div>
      </div>

      {/* Background */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Background
        </h4>
        
        <ImageInput
          value={localContent.background_image || ""}
          onChange={(url) => updateContent({ background_image: url })}
          token={token}
          label="Background Image"
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Background Video URL (optional)
          </label>
          <input
            type="url"
            value={localContent.background_video || ""}
            onChange={(e) => updateContent({ background_video: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="https://... (MP4 video)"
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Call to Actions
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Primary CTA Text
            </label>
            <input
              type="text"
              value={localContent.cta_primary?.text || ""}
              onChange={(e) => updateContent({ 
                cta_primary: { ...localContent.cta_primary, text: e.target.value, url: localContent.cta_primary?.url || "" } 
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="e.g., Get Started"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Primary CTA URL
            </label>
            <input
              type="text"
              value={localContent.cta_primary?.url || ""}
              onChange={(e) => updateContent({ 
                cta_primary: { ...localContent.cta_primary, url: e.target.value, text: localContent.cta_primary?.text || "" } 
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="/contact"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Secondary CTA Text
            </label>
            <input
              type="text"
              value={localContent.cta_secondary?.text || ""}
              onChange={(e) => updateContent({ 
                cta_secondary: { ...localContent.cta_secondary, text: e.target.value, url: localContent.cta_secondary?.url || "" } 
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="e.g., Learn More"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Secondary CTA URL
            </label>
            <input
              type="text"
              value={localContent.cta_secondary?.url || ""}
              onChange={(e) => updateContent({ 
                cta_secondary: { ...localContent.cta_secondary, url: e.target.value, text: localContent.cta_secondary?.text || "" } 
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="/about"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Statistics (optional)
          </h4>
          <button
            type="button"
            onClick={addStat}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Stat
          </button>
        </div>
        
        {(localContent.stats || []).map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(index, "value", e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="500+"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(index, "label", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="Events Completed"
            />
            <button
              type="button"
              onClick={() => removeStat(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="space-y-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
          Settings
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Height
            </label>
            <select
              value={localSettings.height || "full"}
              onChange={(e) => updateSettings({ height: e.target.value as HeroSettings["height"] })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="full">Full Screen</option>
              <option value="large">Large (80vh)</option>
              <option value="medium">Medium (60vh)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Overlay Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.overlay_opacity || 0.7}
              onChange={(e) => updateSettings({ overlay_opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{((localSettings.overlay_opacity || 0.7) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

