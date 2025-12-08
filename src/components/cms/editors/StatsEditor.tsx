"use client";

import { useState } from "react";

interface StatItem {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
}

interface TrustIndicator {
  platform: string;
  rating: string;
}

interface StatsContent {
  heading?: string;
  subheading?: string;
  description?: string;
  stats: StatItem[];
  trust_indicators?: TrustIndicator[];
}

interface StatsSettings {
  style?: string;
  animate?: boolean;
}

interface StatsEditorProps {
  content: StatsContent;
  settings: StatsSettings;
  onChange: (content: StatsContent, settings: StatsSettings) => void;
  token: string | null;
}

export default function StatsEditor({ content, settings, onChange, token }: StatsEditorProps) {
  const [localContent, setLocalContent] = useState<StatsContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    stats: content.stats || [],
    trust_indicators: content.trust_indicators || [],
  });
  const [localSettings, setLocalSettings] = useState<StatsSettings>({
    style: settings.style || 'default',
    animate: settings.animate !== false,
  });

  const updateContent = (updates: Partial<StatsContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<StatsSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateStat = (index: number, field: keyof StatItem, value: string | number) => {
    const newStats = [...localContent.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent({ stats: newStats });
  };

  const addStat = () => {
    const newStats = [
      ...localContent.stats,
      { value: '', label: '', icon: '', description: '' }
    ];
    updateContent({ stats: newStats });
  };

  const removeStat = (index: number) => {
    const newStats = [...localContent.stats];
    newStats.splice(index, 1);
    updateContent({ stats: newStats });
  };

  const updateTrustIndicator = (index: number, field: keyof TrustIndicator, value: string) => {
    const newIndicators = [...(localContent.trust_indicators || [])];
    newIndicators[index] = { ...newIndicators[index], [field]: value };
    updateContent({ trust_indicators: newIndicators });
  };

  const addTrustIndicator = () => {
    const newIndicators = [
      ...(localContent.trust_indicators || []),
      { platform: '', rating: '' }
    ];
    updateContent({ trust_indicators: newIndicators });
  };

  const removeTrustIndicator = (index: number) => {
    const newIndicators = [...(localContent.trust_indicators || [])];
    newIndicators.splice(index, 1);
    updateContent({ trust_indicators: newIndicators });
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
            placeholder="Our Achievements"
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
            placeholder="Numbers That Speak Excellence"
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
            placeholder="Over 16 years, we've built a legacy of trust..."
          />
        </div>
      </div>

      {/* Stats List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stats ({(localContent.stats || []).length})
          </label>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Stat
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.stats || []).map((stat, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Stat {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="16+"
                />
                <input
                  type="text"
                  value={stat.icon || ''}
                  onChange={(e) => updateStat(index, 'icon', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="🏆"
                />
              </div>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Years of Excellence"
              />
              <input
                type="text"
                value={stat.description || ''}
                onChange={(e) => updateStat(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Trusted since 2008"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Trust Indicators ({(localContent.trust_indicators || []).length})
          </label>
          <button
            type="button"
            onClick={addTrustIndicator}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Indicator
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.trust_indicators || []).map((indicator, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center gap-3">
              <input
                type="text"
                value={indicator.platform}
                onChange={(e) => updateTrustIndicator(index, 'platform', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="WedMeGood"
              />
              <input
                type="text"
                value={indicator.rating}
                onChange={(e) => updateTrustIndicator(index, 'rating', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="4.9/5"
              />
              <button
                type="button"
                onClick={() => removeTrustIndicator(index)}
                className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={localSettings.animate !== false}
            onChange={(e) => updateSettings({ animate: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Animation
          </span>
        </label>
      </div>
    </div>
  );
}

