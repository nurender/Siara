"use client";

import React from "react";

interface TimelineItem {
  year: string;
  icon: string;
  title: string;
  description: string;
}

interface TimelineContent {
  subheading?: string;
  heading: string;
  description?: string;
  items: TimelineItem[];
}

interface TimelineProps {
  content: TimelineContent;
  settings?: Record<string, any>;
}

const iconComponents: Record<string, React.ReactElement> = {
  star: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  location: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  palace: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  confetti: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  mountain: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l9-9 9 9" />
    </svg>
  ),
};

export default function TimelineSection({ content, settings }: TimelineProps) {
  const items = content.items || [];
  
  // Split heading to highlight "Excellence" in gold
  const headingWords = content.heading.split(" ");
  const highlightIndex = headingWords.findIndex(word => 
    word.toLowerCase().includes("excellence")
  );

  return (
    <section className="py-20 lg:py-28 bg-siara-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {content.subheading && (
            <div className="mb-4">
              <span className="text-siara-purple-700 font-dm-sans text-sm font-medium">
                {content.subheading}
              </span>
            </div>
          )}
          
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
            {headingWords.map((word, i) => {
              if (highlightIndex !== -1 && i === highlightIndex) {
                return (
                  <span key={i}>
                    <span className="text-siara-gold-500">{word}</span>
                    {i < headingWords.length - 1 ? " " : ""}
                  </span>
                );
              }
              return (
                <span key={i} className="text-siara-purple-900">
                  {word}{i < headingWords.length - 1 ? " " : ""}
                </span>
              );
            })}
          </h2>
          
          {content.description && (
            <p className="font-dm-sans text-lg text-siara-purple-700 max-w-3xl mx-auto leading-relaxed">
              {content.description.split("Rajasthan's most trusted wedding planners").map((part, i, arr) => {
                if (i === arr.length - 1) return part;
                return (
                  <React.Fragment key={i}>
                    {part}
                    <span className="text-siara-purple-900 font-semibold">Rajasthan's most trusted wedding planners</span>
                  </React.Fragment>
                );
              })}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-siara-gold-400 via-siara-gold-500 to-siara-gold-400"></div>

          {/* Timeline Items */}
          <div className="relative space-y-16">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              const iconKey = item.icon || 'star';
              const IconComponent = iconComponents[iconKey] || iconComponents.star;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${isLeft ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Content Box */}
                  <div className={`w-full md:w-[45%] ${isLeft ? 'pr-8 md:pr-12' : 'pl-8 md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-siara-purple-100">
                      {/* Year with Icon */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-siara-gold-100 flex items-center justify-center text-siara-gold-600">
                          {IconComponent}
                        </div>
                        <span className="font-cormorant text-2xl font-semibold text-siara-gold-600">
                          {item.year}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-siara-purple-900 mb-3">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="font-dm-sans text-base text-siara-purple-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Marker */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-siara-gold-500 border-4 border-white shadow-lg z-10"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

