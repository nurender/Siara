"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  heading: string;
  subheading?: string;
  items: FAQItem[];
}

interface FAQSettings {
  allow_multiple_open?: boolean;
}

interface FAQEditorProps {
  content: FAQContent;
  settings: FAQSettings;
  onChange: (content: FAQContent, settings: FAQSettings) => void;
  token: string | null;
}

export default function FAQEditor({ content, settings, onChange }: FAQEditorProps) {
  const [localContent, setLocalContent] = useState<FAQContent>(content);
  const [localSettings, setLocalSettings] = useState<FAQSettings>(settings);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateContent = (updates: Partial<FAQContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent, localSettings);
  };

  const updateSettings = (updates: Partial<FAQSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange(localContent, newSettings);
  };

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const newItems = [...(localContent.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent({ items: newItems });
  };

  const addItem = () => {
    const newItems = [...(localContent.items || []), { question: "", answer: "" }];
    updateContent({ items: newItems });
    setExpandedIndex(newItems.length - 1);
  };

  const removeItem = (index: number) => {
    const newItems = [...(localContent.items || [])];
    newItems.splice(index, 1);
    updateContent({ items: newItems });
    setExpandedIndex(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...(localContent.items || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    updateContent({ items: newItems });
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Section Header
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading
          </label>
          <input
            type="text"
            value={localContent.heading || ""}
            onChange={(e) => updateContent({ heading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Frequently Asked Questions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subheading (optional)
          </label>
          <input
            type="text"
            value={localContent.subheading || ""}
            onChange={(e) => updateContent({ subheading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Common questions about our services"
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Questions ({(localContent.items || []).length})
          </h4>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>

        {(localContent.items || []).length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p>No questions added yet</p>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Add your first question
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(localContent.items || []).map((item, index) => (
              <div 
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div 
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium text-gray-900 dark:text-white truncate">
                    {item.question || "New Question"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveItem(index, "up"); }}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveItem(index, "down"); }}
                      disabled={index === (localContent.items || []).length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedIndex === index ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                {expandedIndex === index && (
                  <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateItem(index, "question", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter the question"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Answer *
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateItem(index, "answer", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter the answer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
          Settings
        </h4>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localSettings.allow_multiple_open || false}
            onChange={(e) => updateSettings({ allow_multiple_open: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Allow multiple questions open at once
          </span>
        </label>
      </div>
    </div>
  );
}

