"use client";

import { useState, useEffect, useCallback } from "react";
import { useManagerAuth } from "@/context/ManagerAuthContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  guest_count: number | null;
  budget: string | null;
  venue_preference: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function ContactsManagement() {
  const { token } = useManagerAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      const res = await fetch(`${API_URL}/api/contacts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Fetch contacts error:", error);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, currentPage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const updateStatus = async (id: number, status: string, notes?: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });

      const data = await res.json();
      if (data.success) {
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status: status as "closed" | "new" | "contacted" | "qualified" | "converted", admin_notes: notes || null });
        }
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      qualified: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      converted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.new}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link href="/manager/cms" className="hover:text-blue-600">CMS</Link>
            <span>/</span>
            <span>Contact Form Submissions</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Contact Form Submissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage contact form submissions from your website
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            Total: {pagination.total} submissions
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No contact submissions found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {contact.name}
                          </h3>
                          {getStatusBadge(contact.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.phone}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {contact.event_type} • {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details Sidebar */}
        {selectedContact && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedContact.name}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                    {selectedContact.phone}
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Event Type
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedContact.event_type}</p>
              </div>

              {selectedContact.event_date && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Event Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedContact.event_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedContact.guest_count && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Guest Count
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedContact.guest_count}</p>
                </div>
              )}

              {selectedContact.budget && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Budget
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedContact.budget}</p>
                </div>
              )}

              {selectedContact.venue_preference && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Venue Preference
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedContact.venue_preference}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Message
                </label>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Admin Notes
                </label>
                <textarea
                  value={selectedContact.admin_notes || ""}
                  onChange={(e) => {
                    setSelectedContact({ ...selectedContact, admin_notes: e.target.value });
                  }}
                  onBlur={(e) => {
                    if (selectedContact?.id) {
                      updateStatus(selectedContact.id, e.target.value as "closed" | "new" | "contacted" | "qualified" | "converted", selectedContact.admin_notes || null);
                    }
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="Add notes about this contact..."
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Contact
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Submitted: {new Date(selectedContact.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

