"use client";

import { useEffect, useRef, useState } from "react";

interface Value {
  icon?: string;
  title: string;
  description: string;
}

interface AboutValuesContent {
  heading: string;
  subheading?: string;
  description?: string;
  values?: Value[];
}

interface AboutValuesProps {
  content: AboutValuesContent;
  settings?: Record<string, unknown>;
}

// Default icons for values
const defaultIcons = {
  heart: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  location: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  team: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  check: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  money: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  star: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

const getIcon = (iconName?: string) => {
  if (!iconName) return defaultIcons.heart;
  return defaultIcons[iconName as keyof typeof defaultIcons] || defaultIcons.heart;
};

export default function AboutValuesSection({ content }: AboutValuesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const values = content?.values || [];
  const heading = content?.heading || "The Siara Events Difference";
  const subheading = content?.subheading || "Why Choose Us";
  const description = content?.description || "What sets the best wedding planner in Rajasthan apart? It's our unwavering commitment to these core values.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            values.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [values.length]);

  if (values.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-cream overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-siara-purple-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
            <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
              {subheading}
            </span>
          </div>

          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-siara-purple-950 mb-6">
            {heading.includes("Difference") ? (
              <>
                The Siara Events{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                  Difference
                </span>
              </>
            ) : (
              heading
            )}
          </h2>

          <p
            className="font-dm-sans text-lg text-siara-purple-700/70 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: description.replace(
                /<strong>(.*?)<\/strong>/g,
                '<strong class="text-siara-purple-950">$1</strong>'
              ),
            }}
          />
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg shadow-siara-purple-100/30 transition-all duration-500 hover:shadow-2xl hover:shadow-siara-purple-200/50 hover:-translate-y-2 ${
                visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-siara-gold-400/0 to-siara-purple-400/0 group-hover:from-siara-gold-400/10 group-hover:to-siara-purple-400/5 transition-all duration-500"></div>

              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-siara-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-full"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-siara-purple-100 to-siara-purple-50 flex items-center justify-center text-siara-purple-700 mb-6 group-hover:from-siara-gold-100 group-hover:to-siara-gold-50 group-hover:text-siara-gold-700 transition-all duration-500">
                  {getIcon(value.icon)}
                </div>

                {/* Title */}
                <h3 className="font-cormorant text-2xl font-semibold text-siara-purple-950 mb-3 group-hover:text-siara-gold-700 transition-colors">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="font-dm-sans text-sm text-siara-purple-600/80 leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border border-siara-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

