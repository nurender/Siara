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

interface FAQProps {
  content: FAQContent;
  settings: Record<string, any>;
}

export default function FAQSection({ content }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-siara-cream">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {content.subheading && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-siara-gold-100 text-siara-gold-700 font-dm-sans text-sm font-medium uppercase tracking-wider mb-4">
              {content.subheading}
            </span>
          )}
          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-siara-purple-900">
            {content.heading}
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {content.items?.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-siara-purple-100/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-dm-sans font-semibold text-siara-purple-900 pr-4">
                  {item.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    openIndex === index
                      ? "bg-siara-gold-500 text-siara-purple-950 rotate-180"
                      : "bg-siara-purple-100 text-siara-purple-600"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="font-dm-sans text-siara-charcoal/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

