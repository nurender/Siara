"use client";

import { useState, useEffect, useCallback } from "react";
import { useManagerAuth } from "@/context/ManagerAuthContext";
import Link from "next/link";
import { hasVisualEditor, getEditorComponent } from "@/components/cms/editors";
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Section {
  id: number;
  name: string;
  section_type: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  is_global: boolean;
  created_at: string;
}

const sectionTypes = [
  { 
    value: "hero", 
    label: "Hero Banner", 
    description: "Large banner with title, subtitle, and buttons at the top",
    icon: "🎯",
    color: "bg-purple-500"
  },
  { 
    value: "services_grid", 
    label: "Services List", 
    description: "Display your services in a grid with images",
    icon: "📋",
    color: "bg-green-500"
  },
  { 
    value: "portfolio_grid", 
    label: "Portfolio Gallery", 
    description: "Showcase your work with images",
    icon: "🖼️",
    color: "bg-pink-500"
  },
  { 
    value: "blog_grid", 
    label: "Blog Posts Grid", 
    description: "Display blog posts in a beautiful grid layout",
    icon: "📝",
    color: "bg-purple-500"
  },
  { 
    value: "testimonials", 
    label: "Client Reviews", 
    description: "Display customer testimonials in a slider",
    icon: "💬",
    color: "bg-yellow-500"
  },
  { 
    value: "cta_banner", 
    label: "Call to Action", 
    description: "Encourage visitors to contact or take action",
    icon: "📢",
    color: "bg-red-500"
  },
  { 
    value: "content_block", 
    label: "Text Content", 
    description: "Add paragraphs of text with optional images",
    icon: "📝",
    color: "bg-teal-500"
  },
  { 
    value: "image_gallery", 
    label: "Image Gallery", 
    description: "Display multiple images in a gallery",
    icon: "🎨",
    color: "bg-indigo-500"
  },
  { 
    value: "stats", 
    label: "Numbers & Stats", 
    description: "Show statistics like projects completed, years of experience",
    icon: "📊",
    color: "bg-blue-500"
  },
  { 
    value: "team", 
    label: "Team Members", 
    description: "Display your team members with photos and info",
    icon: "👥",
    color: "bg-cyan-500"
  },
  { 
    value: "faq_accordion", 
    label: "FAQ Section", 
    description: "Answer common questions in expandable format",
    icon: "❓",
    color: "bg-orange-500"
  },
  { 
    value: "contact_form", 
    label: "Contact Form", 
    description: "Let visitors send you messages",
    icon: "✉️",
    color: "bg-cyan-500"
  },
  { 
    value: "pricing", 
    label: "Pricing Cards", 
    description: "Display pricing plans or packages",
    icon: "💰",
    color: "bg-emerald-500"
  },
  { 
    value: "timeline", 
    label: "Process Timeline", 
    description: "Show your process or journey in timeline format",
    icon: "⏳",
    color: "bg-violet-500"
  },
  { 
    value: "about_story", 
    label: "About Story", 
    description: "Display company story with text content and image grid",
    icon: "📖",
    color: "bg-indigo-500"
  },
  { 
    value: "about_values", 
    label: "About Values", 
    description: "Display company values and differentiators in a grid layout",
    icon: "💎",
    color: "bg-amber-500"
  },
  { 
    value: "about_team", 
    label: "About Team", 
    description: "Display team members with photos, roles, and bios",
    icon: "👥",
    color: "bg-teal-500"
  },
  { 
    value: "about_partners", 
    label: "About Partners", 
    description: "Display venue partners, press features, and awards",
    icon: "🤝",
    color: "bg-purple-500"
  },
];

export default function SectionsManagement() {
  const { token } = useManagerAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sectionId: number | null }>({ isOpen: false, sectionId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    section_type: "hero",
    content: "{}",
    settings: "{}",
    is_global: false,
  });
  const [activeTab, setActiveTab] = useState<'visual' | 'advanced'>('visual');
  const [visualContent, setVisualContent] = useState<Record<string, unknown>>({});
  const [visualSettings, setVisualSettings] = useState<Record<string, unknown>>({});

  const fetchSections = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cms/admin/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Use visual editor data if available, otherwise use JSON
    let finalContent = visualContent;
    let finalSettings = visualSettings;

    if (activeTab === 'advanced') {
      // Validate JSON
      try {
        finalContent = JSON.parse(formData.content);
        finalSettings = JSON.parse(formData.settings);
      } catch {
        alert("Invalid JSON in content or settings");
        return;
      }
    }

    try {
      const url = editingSection
        ? `${API_URL}/api/cms/admin/sections/${editingSection.id}`
        : `${API_URL}/api/cms/admin/sections`;

      const res = await fetch(url, {
        method: editingSection ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          section_type: formData.section_type,
          content: finalContent,
          settings: finalSettings,
          is_global: formData.is_global,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingSection(null);
        resetForm();
        fetchSections();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      section_type: "hero",
      content: "{}",
      settings: "{}",
      is_global: false,
    });
    setVisualContent({});
    setVisualSettings({});
    setActiveTab('visual');
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    const content = section.content || {};
    const settings = section.settings || {};
    setVisualContent(content);
    setVisualSettings(settings);
    setFormData({
      name: section.name,
      section_type: section.section_type,
      content: JSON.stringify(content, null, 2),
      settings: JSON.stringify(settings, null, 2),
      is_global: section.is_global,
    });
    // Show visual editor if available, otherwise show advanced
    setActiveTab(hasVisualEditor(section.section_type) ? 'visual' : 'advanced');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, sectionId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.sectionId || !token) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/cms/admin/sections/${deleteConfirm.sectionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Section deleted successfully');
        fetchSections();
        setDeleteConfirm({ isOpen: false, sectionId: null });
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete section");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSectionTypeInfo = (type: string) => {
    return sectionTypes.find((t) => t.value === type) || { 
      value: type, 
      label: type, 
      description: "",
      icon: "📦",
      color: "bg-gray-500"
    };
  };

  return (
    <div className="space-y-6">
      {/* Help Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">What are Saved Content Blocks?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Saved content blocks are reusable pieces of content you can use on multiple pages. 
              For example, if you create a "Contact Us" banner, you can save it here and add it to any page without recreating it. 
              This saves time and keeps your content consistent across your website.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link href="/manager/cms" className="hover:text-blue-600">CMS</Link>
            <span>/</span>
            <span>Content Blocks</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Saved Content Blocks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create content blocks once and reuse them on multiple pages
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSection(null);
            resetForm();
            // Initialize with default content for hero type
            const defaultContent = getDefaultContent("hero");
            setVisualContent(defaultContent);
            setVisualSettings({});
            setFormData({
              name: "",
              section_type: "hero",
              content: JSON.stringify(defaultContent, null, 2),
              settings: "{}",
              is_global: false,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Content Block
        </button>
      </div>

      {/* Sections Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-700 dark:text-gray-300">No saved content blocks yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create content blocks here to reuse them on multiple pages. This saves time when building similar pages!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {sections.map((section) => {
              const typeInfo = getSectionTypeInfo(section.section_type);
              return (
                <div
                  key={section.id}
                  className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 ${
                    section.is_global
                      ? "border-blue-200 dark:border-blue-800"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-12 h-12 ${typeInfo.color || 'bg-gray-500'} rounded-lg flex items-center justify-center text-xl text-white shadow-sm flex-shrink-0`}>
                        {typeInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {section.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {typeInfo.label}
                        </p>
                        {typeInfo.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                            {typeInfo.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {section.is_global && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded flex-shrink-0">
                        Reusable
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Created: {new Date(section.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Edit Content Block"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete Content Block"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingSection ? "Edit Content Block" : "Create Content Block"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editingSection ? "Update your saved content block" : "Create a new reusable content block"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Block Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Homepage Hero Banner"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Give this block a name so you can find it easily later
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Block Type *
                  </label>
                  <select
                    value={formData.section_type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaultContent = getDefaultContent(newType);
                      setVisualContent(defaultContent);
                      setVisualSettings({});
                      setFormData({ 
                        ...formData, 
                        section_type: newType,
                        content: JSON.stringify(defaultContent, null, 2),
                        settings: "{}",
                      });
                      // Switch to visual editor if available
                      setActiveTab(hasVisualEditor(newType) ? 'visual' : 'advanced');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {sectionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  {sectionTypes.find(t => t.value === formData.section_type)?.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {sectionTypes.find(t => t.value === formData.section_type)?.description}
                    </p>
                  )}
                  {hasVisualEditor(formData.section_type) && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      ✓ Visual editor available for this type
                    </p>
                  )}
                </div>
              </div>

              {/* Visual/Advanced Editor Tabs */}
              {hasVisualEditor(formData.section_type) && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('visual')}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'visual'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Visual Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('advanced')}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'advanced'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Advanced (JSON)
                    </button>
                  </div>
                </div>
              )}

              {/* Visual Editor */}
              {activeTab === 'visual' && hasVisualEditor(formData.section_type) ? (
                <VisualEditorWrapper
                  section={{
                    id: editingSection?.id || 0,
                    name: formData.name,
                    section_type: formData.section_type,
                    content: visualContent,
                    settings: visualSettings,
                    is_global: formData.is_global,
                    created_at: editingSection?.created_at || new Date().toISOString(),
                  }}
                  token={token}
                  onContentChange={(content, settings) => {
                    setVisualContent(content);
                    setVisualSettings(settings);
                    // Also update JSON for sync
                    setFormData({
                      ...formData,
                      content: JSON.stringify(content, null, 2),
                      settings: JSON.stringify(settings || {}, null, 2),
                    });
                  }}
                />
              ) : (
                <>
                  {hasVisualEditor(formData.section_type) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Visual Editor:</strong> Switch to "Visual Editor" tab for easier editing. 
                        Use "Advanced" tab only if you need to edit raw JSON.
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content Data (JSON)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                      placeholder='{"title": "Your Title", "subtitle": "Your Subtitle"}'
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {hasVisualEditor(formData.section_type) 
                        ? "Advanced: Edit the raw content data. Use Visual Editor tab for easier editing."
                        : "Enter valid JSON format for section content"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Settings (JSON)
                    </label>
                    <textarea
                      value={formData.settings}
                      onChange={(e) => setFormData({ ...formData, settings: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                      placeholder='{"background": "light", "padding": "large"}'
                    />
                  </div>
                </>
              )}

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_global}
                    onChange={(e) => setFormData({ ...formData, is_global: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Make this reusable (can be used on multiple pages)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSection ? "Save Changes" : "Create Block"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, sectionId: null })}
        onConfirm={confirmDelete}
        title="Delete Section?"
        message="Are you sure you want to delete this content block? It will be removed from all pages using it. This action cannot be undone."
        confirmText="Delete Section"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

// Get default content for section type
function getDefaultContent(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    hero: {
      heading: "Welcome to Our Page",
      subheading: "Add your compelling subtitle here",
      background_image: "",
      cta_primary: { text: "Get Started", url: "/contact" },
      cta_secondary: { text: "Learn More", url: "/about" },
    },
    cta_banner: {
      heading: "Ready to Get Started?",
      subheading: "Contact us today to learn more",
      button_text: "Contact Us",
      button_url: "/contact",
    },
    faq_accordion: {
      items: [
        { question: "Question 1?", answer: "Answer 1" },
        { question: "Question 2?", answer: "Answer 2" },
      ],
    },
    services_grid: {
      heading: "Our Services",
      services: [],
    },
    blog_grid: {
      heading: "From Our Journal",
      subheading: "Insights & Inspiration",
      description: "Expert insights, inspiring stories, and the latest trends in luxury event design and planning.",
      display_count: 3,
      display_mode: "featured",
      cta: { text: "View All Articles", url: "/blog" },
    },
    about_values: {
      heading: "The Siara Events Difference",
      subheading: "Why Choose Us",
      description: "What sets the <strong>best wedding planner in Rajasthan</strong> apart? It's our unwavering commitment to these core values.",
      values: [
        {
          icon: "heart",
          title: "Personalized Planning",
          description: "Every celebration is unique. We craft bespoke experiences that reflect your personality, heritage, and love story—never cookie-cutter, always extraordinary.",
        },
        {
          icon: "location",
          title: "Local Knowledge",
          description: "With 16+ years in Rajasthan, we know every palace, every tradition, every hidden gem. Our local expertise unlocks exclusive experiences others simply can't offer.",
        },
        {
          icon: "team",
          title: "Expert Team",
          description: "Our team of 50+ professionals includes designers, coordinators, and specialists who bring world-class expertise to every event, big or small.",
        },
        {
          icon: "check",
          title: "Flawless Execution",
          description: "We obsess over details so you don't have to. From the first meeting to the final farewell, every moment is meticulously planned and perfectly executed.",
        },
        {
          icon: "money",
          title: "Transparent Pricing",
          description: "No hidden fees, no surprises. We believe in complete transparency, providing detailed breakdowns so you always know exactly where your investment goes.",
        },
        {
          icon: "star",
          title: "Creative Excellence",
          description: "Our award-winning design team creates stunning visual experiences—from décor concepts to floral artistry—that transform venues into magical wonderlands.",
        },
      ],
    },
    about_team: {
      heading: "Meet the Visionaries",
      subheading: "Our Leadership",
      description: "Our leadership team combines decades of experience in luxury hospitality, event design, and deep expertise in Rajasthan's wedding culture.",
      team: [
        {
          name: "Rajesh Sharma",
          role: "Founder & Creative Director",
          image: "",
          bio: "20+ years in luxury hospitality. Former Taj Hotels executive turned wedding visionary.",
          linkedin: "#",
          instagram: "#",
        },
        {
          name: "Priya Mehta",
          role: "Lead Wedding Designer",
          image: "",
          bio: "Award-winning designer specializing in Rajasthani heritage aesthetics and contemporary fusion.",
          linkedin: "#",
          instagram: "#",
        },
        {
          name: "Amit Verma",
          role: "Operations Director",
          image: "",
          bio: "Logistics expert managing 100+ weddings annually across Rajasthan's most prestigious venues.",
          linkedin: "#",
          instagram: "#",
        },
      ],
      team_note: "Plus a dedicated team of <strong>50+ professionals</strong> including designers, coordinators, and specialists across our three offices.",
    },
    about_partners: {
      heading: "Partnerships & Recognition",
      subheading: "Trusted Partners",
      description: "We're proud to partner with India's finest hospitality brands and be recognized by leading media outlets.",
      venue_partners: [
        { name: "Taj Hotels", logo: "🏨" },
        { name: "Oberoi Hotels", logo: "⭐" },
        { name: "Leela Palaces", logo: "👑" },
        { name: "ITC Hotels", logo: "🌟" },
        { name: "Rambagh Palace", logo: "🏰" },
        { name: "Umaid Bhawan", logo: "🏯" },
      ],
      press_features: [
        { name: "Vogue India", type: "Featured" },
        { name: "WedMeGood", type: "Top Rated" },
        { name: "Wedding Wire", type: "Awarded" },
        { name: "Elle India", type: "Featured" },
        { name: "Femina", type: "Expert Panel" },
        { name: "The Times of India", type: "Interviewed" },
      ],
      awards: [
        {
          award: "Best Destination Wedding Planner",
          org: "Asian Wedding Awards 2023",
          icon: "🏆",
        },
        {
          award: "Top Wedding Planner in Rajasthan",
          org: "WedMeGood Awards 2024",
          icon: "⭐",
        },
        {
          award: "Excellence in Event Design",
          org: "India Event Excellence 2023",
          icon: "🎨",
        },
      ],
    },
  };
  return defaults[type] || {};
}

// Visual Editor Wrapper Component
function VisualEditorWrapper({
  section,
  token,
  onContentChange,
}: {
  section: Section;
  token: string | null;
  onContentChange: (content: Record<string, unknown>, settings: Record<string, unknown>) => void;
}) {
  const EditorComponent = getEditorComponent(section.section_type);
  
  if (!EditorComponent) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center text-gray-500">
        Visual editor not available for this block type
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EditorComponent
        content={section.content as Record<string, unknown>}
        settings={(section.settings || {}) as Record<string, unknown>}
        onChange={(content, settings) => {
          onContentChange(content, settings);
        }}
        token={token}
      />
    </div>
  );
}

