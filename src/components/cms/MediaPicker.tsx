"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Media {
  id: number;
  original_name: string;
  file_name: string;
  file_url: string;
  file_type: string;
  folder: string;
  alt_text: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  token: string | null;
  multiple?: boolean;
  allowedTypes?: string[];
}

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  token,
  multiple = false,
  allowedTypes = ["image"],
}: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [folders, setFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Memoize allowedTypes string to prevent dependency array changes
  const allowedTypesString = useMemo(() => allowedTypes.join(','), [allowedTypes]);
  
  const fetchMedia = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeFolder !== "all") params.append("folder", activeFolder);
      if (allowedTypes.length > 0) params.append("file_type", allowedTypes[0]);

      const res = await fetch(`${API_URL}/api/media?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
        // Extract unique folders
        const uniqueFolders = [...new Set(data.data.map((m: Media) => m.folder))];
        setFolders(uniqueFolders as string[]);
      }
    } catch (error) {
      console.error("Fetch media error:", error);
    } finally {
      setLoading(false);
    }
  }, [token, activeFolder, allowedTypesString]);

  useEffect(() => {
    if (isOpen && token) {
      fetchMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token, activeFolder, allowedTypesString]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !token) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("folder", activeFolder === "all" ? "general" : activeFolder);

      const res = await fetch(`${API_URL}/api/media/upload-multiple`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchMedia();
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (item: Media) => {
    if (multiple) {
      if (selectedMedia.find((m) => m.id === item.id)) {
        setSelectedMedia(selectedMedia.filter((m) => m.id !== item.id));
      } else {
        setSelectedMedia([...selectedMedia, item]);
      }
    } else {
      onSelect(item);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (selectedMedia.length > 0) {
      selectedMedia.forEach((m) => onSelect(m));
      onClose();
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Media
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
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
              placeholder="Search media..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Folder Filter */}
          <select
            value={activeFolder}
            onChange={(e) => setActiveFolder(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>

          {/* Upload */}
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedMedia.find((m) => m.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/50"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={item.file_url.startsWith("http") ? item.file_url : `${API_URL}${item.file_url}`}
                      alt={item.alt_text || item.original_name}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {isSelected ? (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    {/* File name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs truncate">{item.original_name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {multiple && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedMedia.length} item{selectedMedia.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedMedia([])}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedMedia.length === 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Standalone Image URL Input with Media Picker
interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  token: string | null;
  label?: string;
  placeholder?: string;
}

export function ImageInput({
  value,
  onChange,
  token,
  label = "Image URL",
  placeholder = "https://...",
}: ImageInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-start">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          title="Select from Media Library"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-3 relative inline-block">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
            <Image
              src={value.startsWith("http") ? value : `${API_URL}${value}`}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md transition-all hover:scale-110"
              title="Remove image"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <MediaPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(media) => {
          onChange(media.file_url.startsWith("http") ? media.file_url : `${API_URL}${media.file_url}`);
        }}
        token={token}
      />
    </div>
  );
}

