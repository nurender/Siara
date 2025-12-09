"use client";

import { useState } from "react";

interface ContactFormContent {
  heading: string;
  subheading?: string;
  fields?: string[];
}

interface ContactFormProps {
  content: ContactFormContent;
  settings: Record<string, any>;
}

export default function ContactFormSection({ content }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          event_type: "",
          event_date: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 lg:py-28 bg-siara-cream">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-cormorant text-3xl font-semibold text-siara-purple-900 mb-4">
            Thank You!
          </h3>
          <p className="font-dm-sans text-siara-charcoal/70">
            We have received your inquiry and will get back to you within 24 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {content.subheading && (
            <div className="mb-6">
              <span className="inline-block px-6 py-2 bg-siara-gold-100 text-siara-charcoal font-dm-sans text-xs font-semibold uppercase tracking-widest">
                {content.subheading}
              </span>
            </div>
          )}
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-900">
            {content.heading}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 border border-siara-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block font-dm-sans text-sm font-medium text-siara-purple-800 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-siara-gold-500 focus:ring-2 focus:ring-siara-gold-500/20 outline-none transition-all font-dm-sans"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-dm-sans text-sm font-medium text-siara-purple-800 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-siara-gold-500 focus:ring-2 focus:ring-siara-gold-500/20 outline-none transition-all font-dm-sans"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-dm-sans text-sm font-medium text-siara-purple-800 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-siara-gold-500 focus:ring-2 focus:ring-siara-gold-500/20 outline-none transition-all font-dm-sans"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block font-dm-sans text-sm font-medium text-siara-purple-800 mb-2">
                Event Type
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-siara-gold-500 focus:ring-2 focus:ring-siara-gold-500/20 outline-none transition-all font-dm-sans appearance-none bg-white"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="destination">Destination Event</option>
                <option value="private">Private Celebration</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block font-dm-sans text-sm font-medium text-siara-purple-800 mb-2">
                Tentative Event Date
              </label>
              <input
                type="text"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-siara-gold-500 focus:ring-2 focus:ring-siara-gold-500/20 outline-none transition-all font-dm-sans"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-siara-purple-800 to-siara-purple-900 text-white font-dm-sans font-semibold hover:from-siara-purple-900 hover:to-siara-purple-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

