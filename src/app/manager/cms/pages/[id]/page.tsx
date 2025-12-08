"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useManagerAuth } from "@/context/ManagerAuthContext";
import Link from "next/link";
import Image from "next/image";
import { hasVisualEditor, getEditorComponent } from "@/components/cms/editors";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Section {
  id: number;
  name: string;
  section_type: string;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
  is_global: boolean;
}

interface Page {
  id: number;
  slug: string;
  page_type: string;
  title: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  sections: number[];
  status: string;
}

const sectionTypes = [
  { 
    value: "hero", 
    label: "Hero Banner", 
    description: "Large banner with title, subtitle, and call-to-action button at the top of your page",
    icon: "🎯", 
    color: "bg-purple-500" 
  },
  { 
    value: "about_preview", 
    label: "About Preview", 
    description: "Show a preview of your company story with image and text",
    icon: "ℹ️", 
    color: "bg-blue-500" 
  },
  { 
    value: "services_grid", 
    label: "Services List", 
    description: "Display your services in a grid layout with images and descriptions",
    icon: "📋", 
    color: "bg-green-500" 
  },
  { 
    value: "portfolio_featured", 
    label: "Portfolio Gallery", 
    description: "Showcase your work with images in a beautiful gallery",
    icon: "🖼️", 
    color: "bg-pink-500" 
  },
  { 
    value: "blog_grid", 
    label: "Blog Posts Grid", 
    description: "Display your blog posts in a beautiful grid layout with images and excerpts",
    icon: "📝", 
    color: "bg-purple-500" 
  },
  { 
    value: "testimonials_carousel", 
    label: "Client Reviews", 
    description: "Display customer testimonials and reviews in a sliding carousel",
    icon: "💬", 
    color: "bg-yellow-500" 
  },
  { 
    value: "stats_counter", 
    label: "Numbers & Stats", 
    description: "Show impressive statistics like years of experience, projects completed, etc.",
    icon: "📊", 
    color: "bg-indigo-500" 
  },
  { 
    value: "cta_banner", 
    label: "Call to Action", 
    description: "Encourage visitors to contact you or take action with a prominent banner",
    icon: "📢", 
    color: "bg-red-500" 
  },
  { 
    value: "faq_accordion", 
    label: "FAQ Section", 
    description: "Answer common questions in an expandable accordion format",
    icon: "❓", 
    color: "bg-orange-500" 
  },
  { 
    value: "text_block", 
    label: "Text Content", 
    description: "Add paragraphs of text with optional images - perfect for detailed information",
    icon: "📝", 
    color: "bg-teal-500" 
  },
  { 
    value: "contact_form", 
    label: "Contact Form", 
    description: "Let visitors send you messages directly from your website",
    icon: "✉️", 
    color: "bg-cyan-500" 
  },
  { 
    value: "timeline", 
    label: "Timeline", 
    description: "Display milestones and achievements in a vertical timeline format",
    icon: "📅", 
    color: "bg-purple-500" 
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

export default function PageBuilder() {
  const params = useParams();
  const router = useRouter();
  const { token } = useManagerAuth();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [pageSections, setPageSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const lastSavedStateRef = useRef<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      
      // Fetch page
      const pageRes = await fetch(`${API_URL}/api/cms/admin/pages/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pageData = await pageRes.json();
      
      // Fetch all sections
      const sectionsRes = await fetch(`${API_URL}/api/cms/admin/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sectionsData = await sectionsRes.json();

      if (pageData.success) {
        setPage(pageData.data);
        const sectionIds = pageData.data.sections ? 
          (typeof pageData.data.sections === 'string' ? JSON.parse(pageData.data.sections) : pageData.data.sections) 
          : [];
        
        // Get page sections in order
        if (sectionsData.success) {
          setAllSections(sectionsData.data);
          const ordered = sectionIds
            .map((id: number) => sectionsData.data.find((s: Section) => s.id === id))
            .filter(Boolean);
          setPageSections(ordered);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [token, pageId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (showToast = true) => {
    if (!token || !page) return;
    
    setSaving(true);
    setAutoSaveStatus('saving');
    try {
      const sectionIds = pageSections.map(s => s.id);
      const currentState = JSON.stringify({ sections: sectionIds, page });
      
      const res = await fetch(`${API_URL}/api/cms/admin/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...page,
          sections: JSON.stringify(sectionIds),
        }),
      });

      const data = await res.json();
      if (data.success) {
        lastSavedStateRef.current = currentState;
        setAutoSaveStatus('saved');
        if (showToast) {
          toast.success('Page saved successfully!');
        }
      } else {
        setAutoSaveStatus('unsaved');
        if (showToast) {
          toast.error(data.message || "Save failed");
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      setAutoSaveStatus('unsaved');
      if (showToast) {
        toast.error("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  // Track unsaved changes (no auto-save)
  useEffect(() => {
    if (!token || !page || pageSections.length === 0) {
      setAutoSaveStatus('saved');
      return;
    }

    const currentState = JSON.stringify({ sections: pageSections.map(s => s.id), page });
    
    // Check if something changed
    if (currentState === lastSavedStateRef.current) {
      setAutoSaveStatus('saved');
    } else {
      setAutoSaveStatus('unsaved');
    }
  }, [pageSections, page, token]);

  const addSection = async (sectionType: string) => {
    if (!token) {
      toast.error("Please login to add sections");
      return;
    }

    if (!page) {
      toast.error("Page not loaded. Please refresh.");
      return;
    }

    const typeInfo = sectionTypes.find(t => t.value === sectionType);
    if (!typeInfo) {
      toast.error("Invalid section type selected");
      return;
    }

    const defaultContent = getDefaultContent(sectionType);

    try {
      const res = await fetch(`${API_URL}/api/cms/admin/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${page.title} - ${typeInfo.label}`,
          section_type: sectionType,
          content: defaultContent,
          settings: {},
          is_global: false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Server error" }));
        toast.error(errorData.message || `Failed to add section (${res.status})`);
        return;
      }

      const data = await res.json();
      if (data.success && data.data && data.data.id) {
        // Add to page sections
        const newSection = {
          id: data.data.id,
          name: `${page.title} - ${typeInfo.label}`,
          section_type: sectionType,
          content: defaultContent,
          settings: {},
          is_global: false,
        };
        setPageSections([...pageSections, newSection]);
        setAllSections([...allSections, newSection]);
        setShowAddSection(false);
        toast.success(`${typeInfo.label} added successfully!`);
      } else {
        toast.error(data.message || "Failed to add section. Please try again.");
        console.error("Add section response:", data);
      }
    } catch (error) {
      console.error("Add section error:", error);
      toast.error("Failed to add section. Please check your connection.");
    }
  };

  const duplicateSection = async (section: Section, index: number) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/cms/admin/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${section.name} (Copy)`,
          section_type: section.section_type,
          content: section.content,
          settings: section.settings || {},
          is_global: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.id) {
        const newSection = {
          ...section,
          id: data.id,
          name: `${section.name} (Copy)`,
        };
        const newSections = [...pageSections];
        newSections.splice(index + 1, 0, newSection);
        setPageSections(newSections);
        setAllSections([...allSections, newSection]);
        toast.success('Section duplicated!');
      }
    } catch (error) {
      console.error("Duplicate section error:", error);
      toast.error("Failed to duplicate section");
    }
  };

  const addExistingSection = (section: Section) => {
    if (!pageSections.find(s => s.id === section.id)) {
      setPageSections([...pageSections, section]);
    }
    setShowAddSection(false);
  };

  const removeSection = (index: number) => {
    setDeleteConfirm({ isOpen: true, index });
  };

  const confirmRemoveSection = () => {
    if (deleteConfirm.index !== null) {
      const newSections = [...pageSections];
      newSections.splice(deleteConfirm.index, 1);
      setPageSections(newSections);
      setDeleteConfirm({ isOpen: false, index: null });
      toast.success('Section removed');
    }
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...pageSections];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    setPageSections(newSections);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveSection(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getSectionTypeInfo = (type: string) => {
    return sectionTypes.find(t => t.value === type) || { value: type, label: type, description: "", icon: "📦", color: "bg-gray-500" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Page not found</p>
        <Link href="/manager/cms/pages" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Pages
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link href="/manager/cms" className="hover:text-blue-600">CMS</Link>
            <span>/</span>
            <Link href="/manager/cms/pages" className="hover:text-blue-600">Pages</Link>
            <span>/</span>
            <span>Edit</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {page.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">/{page.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/${page.slug === 'home' ? '' : page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </a>
          <div className="flex items-center gap-3">
            {/* Auto-save Status */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saving' && (
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All changes saved
                </span>
              )}
              {autoSaveStatus === 'unsaved' && (
                <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Unsaved changes
                </span>
              )}
            </div>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Page
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Help Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">What are Content Blocks?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Content blocks are the building pieces of your page. Each block adds a different type of content - like a banner with title, 
              a list of services, customer reviews, contact form, etc. You can add multiple blocks, drag them to reorder, and edit each one separately.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Builder - Main Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Page Content Blocks
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add and arrange content blocks to build your page. Drag to reorder.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSection(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Block
                </button>
              </div>
            </div>

            {pageSections.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No content blocks added yet.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                  Content blocks are the building pieces of your page - like banners, text, images, forms, etc.
                </p>
                <button
                  onClick={() => setShowAddSection(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Content Block
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pageSections.map((section, index) => {
                  const typeInfo = getSectionTypeInfo(section.section_type);
                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 transition-all cursor-move ${
                        draggedIndex === index
                          ? "border-blue-500 opacity-50"
                          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {/* Drag Handle */}
                      <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </div>

                      {/* Section Type Icon */}
                      <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {typeInfo.icon}
                      </div>

                      {/* Section Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {typeInfo.label}
                          {section.is_global && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                              Saved Block
                            </span>
                          )}
                        </p>
                        {typeInfo.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                            {typeInfo.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Content Block"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => duplicateSection(section, index)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Duplicate Section"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => index > 0 && moveSection(index, index - 1)}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => index < pageSections.length - 1 && moveSection(index, index + 1)}
                          disabled={index === pageSections.length - 1}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeSection(index)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove Content Block"
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
        </div>

        {/* Sidebar - Page Settings */}
        <div className="space-y-4">
          {/* Page Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Page Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={page.status}
                  onChange={(e) => setPage({ ...page, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">SEO</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={page.meta_title || ""}
                  onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                  maxLength={70}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{(page.meta_title || "").length}/70</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={page.meta_description || ""}
                  onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{(page.meta_description || "").length}/160</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={page.og_image || ""}
                  onChange={(e) => setPage({ ...page, og_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Content Block Modal */}
      {showAddSection && (
        <AddSectionModal
          isOpen={showAddSection}
          onClose={() => setShowAddSection(false)}
          onAddSection={addSection}
          onAddExisting={addExistingSection}
          allSections={allSections}
          pageSections={pageSections}
        />
      )}

      {/* Edit Content Block Modal */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          token={token}
          onClose={() => setEditingSection(null)}
          onSave={(updated) => {
            setPageSections(pageSections.map(s => s.id === updated.id ? updated : s));
            setAllSections(allSections.map(s => s.id === updated.id ? updated : s));
            setEditingSection(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, index: null })}
        onConfirm={confirmRemoveSection}
        title="Remove Section?"
        message="Are you sure you want to remove this section from the page? This action cannot be undone."
        confirmText="Remove Section"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

// Add Section Modal Component
function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
  onAddExisting,
  allSections,
  pageSections,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: string) => void;
  onAddExisting: (section: Section) => void;
  allSections: Section[];
  pageSections: Section[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter sections by search
  const filteredSections = sectionTypes.filter((type) => {
    if (!searchTerm) return true;
    return (
      type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Saved sections
  const savedSections = allSections.filter(
    (s) => s.is_global && !pageSections.find((ps) => ps.id === s.id)
  );

  // Helper function to get section type info
  const getSectionTypeInfo = (type: string) => {
    return sectionTypes.find(t => t.value === type) || { value: type, label: type, description: "", icon: "📦", color: "bg-gray-500" };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Content Block
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Choose a block type or reuse a saved block
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blocks..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* New Blocks Grid */}
            {filteredSections.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Block Types
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredSections.map((type) => (
                    <button
                      key={type.value}
                      onClick={async () => {
                        try {
                          await onAddSection(type.value);
                          // Don't close here - addSection already closes the modal
                        } catch (error) {
                          console.error("Error adding section:", error);
                        }
                      }}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {type.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white text-sm block">
                          {type.label}
                        </span>
                        {type.description && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {type.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Blocks */}
            {savedSections.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Saved Blocks ({savedSections.length})
                </h3>
                <div className="space-y-2">
                  {savedSections.map((section) => {
                    const typeInfo = getSectionTypeInfo(section.section_type);
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          onAddExisting(section);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:shadow-md transition-all text-left"
                      >
                        <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0`}>
                          {typeInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 dark:text-white text-sm block">
                            {section.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {typeInfo.label}
                          </span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium flex-shrink-0">
                          Saved
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredSections.length === 0 && savedSections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No blocks found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
    return null;
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

// Content Block Editor Component
function SectionEditor({
  section,
  token,
  onClose,
  onSave,
}: {
  section: Section;
  token: string | null;
  onClose: () => void;
  onSave: (section: Section) => void;
}) {
  const [formData, setFormData] = useState({
    name: section.name,
    content: JSON.stringify(section.content, null, 2),
    settings: JSON.stringify(section.settings || {}, null, 2),
    is_global: section.is_global,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'advanced'>('visual');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validate JSON
    try {
      JSON.parse(formData.content);
      JSON.parse(formData.settings);
    } catch {
      toast.error("Invalid JSON in content or settings");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/cms/admin/sections/${section.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          section_type: section.section_type,
          content: JSON.parse(formData.content),
          settings: JSON.parse(formData.settings),
          is_global: formData.is_global,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSave({
          ...section,
          name: formData.name,
          content: JSON.parse(formData.content),
          settings: JSON.parse(formData.settings),
          is_global: formData.is_global,
        });
      } else {
        alert(data.message || "Save failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Content Block
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update the content and settings for this block
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Block Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Block Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Homepage Hero Banner"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Give this block a name to identify it easily
              </p>
            </div>

            {/* Visual Editor Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all ${
                    activeTab === 'visual'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Visual Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('advanced')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all ${
                    activeTab === 'advanced'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Advanced (JSON)
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="pt-4">
              {activeTab === 'visual' ? (
                hasVisualEditor(section.section_type) ? (
                  <VisualEditorWrapper
                    section={section}
                    token={token}
                    onContentChange={(content, settings) => {
                      setFormData({
                        ...formData,
                        content: JSON.stringify(content, null, 2),
                        settings: JSON.stringify(settings || {}, null, 2),
                      });
                    }}
                  />
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Visual Editor:</strong> Visual editor is not available for this content block type. 
                      Use the "Advanced" tab to edit the content.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Content Data (JSON)
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Advanced: Edit the raw content data. Use Visual Editor for easier editing.
                    </p>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Settings (JSON)
                    </label>
                    <textarea
                      value={formData.settings}
                      onChange={(e) => setFormData({ ...formData, settings: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reusable Block Checkbox */}
            <div className="flex items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_global}
                  onChange={(e) => setFormData({ ...formData, is_global: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  Save as reusable block (can be used on multiple pages)
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default content for each section type
function getDefaultContent(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    hero: {
      heading: "Welcome to Our Page",
      subheading: "Add your compelling subtitle here",
      background_image: "",
      cta_primary: { text: "Get Started", url: "/contact" },
      cta_secondary: { text: "Learn More", url: "/about" },
    },
    about_preview: {
      heading: "Where Elegance Meets Excellence",
      subheading: "Our Story",
      description: "For over 15 years, Siara Events has been the trusted partner for discerning clients seeking extraordinary celebrations. Our team of visionary planners, designers, and coordinators bring unparalleled expertise and passion to every event we create.\n\nFrom intimate gatherings to grand galas, we believe every celebration deserves the same attention to detail, creative vision, and flawless execution that has become the hallmark of Siara Events.",
      stats: [
        { value: "15+", label: "Years of Excellence" },
        { value: "500+", label: "Events Curated" },
        { value: "50+", label: "Awards Won" },
        { value: "3", label: "Global Offices" },
      ],
      images: [],
    },
    services_grid: {
      heading: "Our Services",
      subheading: "What We Offer",
      description: "Discover our range of services",
      display_mode: "featured",
    },
    portfolio_featured: {
      heading: "Our Portfolio",
      subheading: "Recent Work",
      display_count: 6,
    },
    blog_grid: {
      heading: "Latest Blog Posts",
      subheading: "Insights & Tips",
      description: "Stay updated with our latest wedding planning tips, venue guides, and inspiration.",
      display_count: 6,
      display_mode: "all",
    },
    blog_featured: {
      heading: "Featured Articles",
      subheading: "Must Read",
      description: "Our most popular and insightful articles",
      display_count: 3,
      display_mode: "featured",
    },
    testimonials_carousel: {
      heading: "What Our Clients Say",
      subheading: "Testimonials",
    },
    stats_counter: {
      stats: [
        { value: "500+", label: "Events Completed" },
        { value: "15+", label: "Years Experience" },
        { value: "98%", label: "Client Satisfaction" },
      ],
    },
    cta_banner: {
      heading: "Ready to Get Started?",
      subheading: "Contact us today",
      cta_primary: { text: "Contact Us", url: "/contact" },
    },
    faq_accordion: {
      heading: "Frequently Asked Questions",
      items: [
        { question: "Sample Question?", answer: "Sample answer goes here." },
      ],
    },
    text_block: {
      heading: "Section Title",
      content: "Add your content here...",
    },
    contact_form: {
      heading: "Get in Touch",
      subheading: "We'd love to hear from you",
    },
    timeline: {
      subheading: "• Our Journey",
      heading: "Milestones of Excellence",
      description: "From our humble beginnings to becoming a trusted partner—here's our story.",
      items: [
        {
          year: "2020",
          icon: "star",
          title: "Company Founded",
          description: "Started with a vision to transform the industry.",
        },
        {
          year: "2022",
          icon: "location",
          title: "First Major Achievement",
          description: "Reached our first major milestone with excellence.",
        },
      ],
    },
    about_story: {
      subheading: "• Our Story",
      heading: "A Legacy of Creating",
      highlight: "Unforgettable Moments",
      paragraph1: "Founded in 2008 in the heart of **Jaipur**, Siara Events began with a simple yet profound mission: to transform the traditional Indian wedding into an extraordinary, personalized celebration.",
      paragraph2: "Our journey is rooted in deep respect for the rich cultural heritage of Rajasthan. We've spent over 16 years building relationships with the region's most prestigious venues.",
      paragraph3: "Today, Siara Events is synonymous with excellence in **destination wedding planning in North India**. We blend timeless traditions with contemporary elegance.",
      years_count: "16+",
      founder_name: "Rajesh Sharma",
      founder_title: "Founder & Creative Director",
      founder_image: "",
      images: [],
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

