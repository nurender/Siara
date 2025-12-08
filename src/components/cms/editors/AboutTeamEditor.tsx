"use client";

import { useState } from "react";
import { ImageInput } from "../MediaPicker";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  instagram?: string;
}

interface AboutTeamContent {
  heading: string;
  subheading?: string;
  description?: string;
  team?: TeamMember[];
  team_note?: string;
}

interface AboutTeamSettings {
  // Add any settings if needed
}

interface AboutTeamEditorProps {
  content: AboutTeamContent;
  settings: AboutTeamSettings;
  onChange: (content: AboutTeamContent, settings: AboutTeamSettings) => void;
  token: string | null;
}

export default function AboutTeamEditor({ content, settings, onChange, token }: AboutTeamEditorProps) {
  const [localContent, setLocalContent] = useState<AboutTeamContent>({
    heading: content.heading || '',
    subheading: content.subheading || '',
    description: content.description || '',
    team: content.team || [],
    team_note: content.team_note || '',
  });
  const [localSettings, setLocalSettings] = useState<AboutTeamSettings>(settings);

  const updateContent = (updates: Partial<AboutTeamContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<AboutTeamSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const newTeam = [...(localContent.team || [])];
    newTeam[index] = { ...newTeam[index], [field]: value };
    updateContent({ team: newTeam });
  };

  const addMember = () => {
    const newTeam = [
      ...(localContent.team || []),
      { name: '', role: '', image: '', bio: '', linkedin: '', instagram: '' }
    ];
    updateContent({ team: newTeam });
  };

  const removeMember = (index: number) => {
    const newTeam = [...(localContent.team || [])];
    newTeam.splice(index, 1);
    updateContent({ team: newTeam });
  };

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newTeam = [...(localContent.team || [])];
    if (direction === 'up' && index > 0) {
      [newTeam[index - 1], newTeam[index]] = [newTeam[index], newTeam[index - 1]];
    } else if (direction === 'down' && index < newTeam.length - 1) {
      [newTeam[index], newTeam[index + 1]] = [newTeam[index + 1], newTeam[index]];
    }
    updateContent({ team: newTeam });
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
            placeholder="Our Leadership"
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
            placeholder="Meet the Visionaries"
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
            placeholder="Our leadership team combines decades of experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Note (HTML supported)
          </label>
          <textarea
            value={localContent.team_note || ''}
            onChange={(e) => updateContent({ team_note: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Plus a dedicated team of <strong>50+ professionals</strong>..."
          />
        </div>
      </div>

      {/* Team Members List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Team Members ({(localContent.team || []).length})
          </label>
          <button
            type="button"
            onClick={addMember}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Member
          </button>
        </div>

        <div className="space-y-4">
          {(localContent.team || []).map((member, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Member {index + 1}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveMember(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMember(index, 'down')}
                    disabled={index === (localContent.team?.length || 0) - 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Rajesh Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateMember(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Founder & Creative Director"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Image URL
                  </label>
                  <ImageInput
                    value={member.image || ''}
                    onChange={(url) => updateMember(index, 'image', url)}
                    token={token}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={member.bio || ''}
                    onChange={(e) => updateMember(index, 'bio', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="20+ years in luxury hospitality..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={member.linkedin || ''}
                      onChange={(e) => updateMember(index, 'linkedin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={member.instagram || ''}
                      onChange={(e) => updateMember(index, 'instagram', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

