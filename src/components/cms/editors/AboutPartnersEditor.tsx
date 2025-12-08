"use client";

import { useState } from "react";
import { ImageInput } from "../MediaPicker";

interface Partner {
  name: string;
  logo?: string;
  logo_url?: string;
}

interface PressFeature {
  name: string;
  type: string;
}

interface Award {
  award: string;
  org: string;
  icon?: string;
}

interface AboutPartnersContent {
  heading?: string;
  subheading?: string;
  description?: string;
  venue_partners?: Partner[];
  press_features?: PressFeature[];
  awards?: Award[];
}

interface AboutPartnersSettings {
  // Add any settings if needed
}

interface AboutPartnersEditorProps {
  content: AboutPartnersContent;
  settings: AboutPartnersSettings;
  onChange: (content: AboutPartnersContent, settings: AboutPartnersSettings) => void;
  token: string | null;
}

export default function AboutPartnersEditor({ content, settings, onChange, token }: AboutPartnersEditorProps) {
  const [localContent, setLocalContent] = useState<AboutPartnersContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    venue_partners: content.venue_partners || [],
    press_features: content.press_features || [],
    awards: content.awards || [],
  });
  const [localSettings, setLocalSettings] = useState<AboutPartnersSettings>(settings);

  const updateContent = (updates: Partial<AboutPartnersContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<AboutPartnersSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  // Venue Partners
  const updateVenuePartner = (index: number, field: keyof Partner, value: string) => {
    const newPartners = [...(localContent.venue_partners || [])];
    newPartners[index] = { ...newPartners[index], [field]: value };
    updateContent({ venue_partners: newPartners });
  };

  const addVenuePartner = () => {
    const newPartners = [
      ...(localContent.venue_partners || []),
      { name: '', logo: '', logo_url: '' }
    ];
    updateContent({ venue_partners: newPartners });
  };

  const removeVenuePartner = (index: number) => {
    const newPartners = [...(localContent.venue_partners || [])];
    newPartners.splice(index, 1);
    updateContent({ venue_partners: newPartners });
  };

  // Press Features
  const updatePressFeature = (index: number, field: keyof PressFeature, value: string) => {
    const newFeatures = [...(localContent.press_features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateContent({ press_features: newFeatures });
  };

  const addPressFeature = () => {
    const newFeatures = [
      ...(localContent.press_features || []),
      { name: '', type: '' }
    ];
    updateContent({ press_features: newFeatures });
  };

  const removePressFeature = (index: number) => {
    const newFeatures = [...(localContent.press_features || [])];
    newFeatures.splice(index, 1);
    updateContent({ press_features: newFeatures });
  };

  // Awards
  const updateAward = (index: number, field: keyof Award, value: string) => {
    const newAwards = [...(localContent.awards || [])];
    newAwards[index] = { ...newAwards[index], [field]: value };
    updateContent({ awards: newAwards });
  };

  const addAward = () => {
    const newAwards = [
      ...(localContent.awards || []),
      { award: '', org: '', icon: '🏆' }
    ];
    updateContent({ awards: newAwards });
  };

  const removeAward = (index: number) => {
    const newAwards = [...(localContent.awards || [])];
    newAwards.splice(index, 1);
    updateContent({ awards: newAwards });
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
            placeholder="Trusted Partners"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={localContent.heading || ''}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Partnerships & Recognition"
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
            placeholder="We're proud to partner with India's finest hospitality brands..."
          />
        </div>
      </div>

      {/* Venue Partners */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Venue Partners ({(localContent.venue_partners || []).length})
          </label>
          <button
            type="button"
            onClick={addVenuePartner}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Partner
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.venue_partners || []).map((partner, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
              <input
                type="text"
                value={partner.name}
                onChange={(e) => updateVenuePartner(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Partner Name"
              />
              <input
                type="text"
                value={partner.logo || ''}
                onChange={(e) => updateVenuePartner(index, 'logo', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Emoji/Icon"
              />
              <button
                type="button"
                onClick={() => removeVenuePartner(index)}
                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Press Features */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Press Features ({(localContent.press_features || []).length})
          </label>
          <button
            type="button"
            onClick={addPressFeature}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Feature
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.press_features || []).map((feature, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
              <input
                type="text"
                value={feature.name}
                onChange={(e) => updatePressFeature(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Media Name"
              />
              <input
                type="text"
                value={feature.type}
                onChange={(e) => updatePressFeature(index, 'type', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Type (Featured)"
              />
              <button
                type="button"
                onClick={() => removePressFeature(index)}
                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Awards ({(localContent.awards || []).length})
          </label>
          <button
            type="button"
            onClick={addAward}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Award
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.awards || []).map((award, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={award.icon || ''}
                  onChange={(e) => updateAward(index, 'icon', e.target.value)}
                  className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="🏆"
                />
                <input
                  type="text"
                  value={award.award}
                  onChange={(e) => updateAward(index, 'award', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Award Name"
                />
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={award.org}
                onChange={(e) => updateAward(index, 'org', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Organization Name"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

