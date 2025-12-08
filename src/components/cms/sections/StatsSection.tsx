"use client";

import { useEffect, useState, useRef } from "react";

interface StatItem {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
}

interface StatsContent {
  heading?: string;
  subheading?: string;
  description?: string;
  stats: StatItem[];
  trust_indicators?: { platform: string; rating: string }[];
}

interface StatsProps {
  content: StatsContent;
  settings?: { style?: string; animate?: boolean };
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="font-cormorant text-5xl md:text-6xl font-bold text-siara-gold-400">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function StatsSection({ content, settings }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const heading = content?.heading || "Numbers That Speak Excellence";
  const subheading = content?.subheading || "Our Achievements";
  const description = content?.description || "Over 16 years, we've built a legacy of trust and excellence as Rajasthan's leading wedding planners.";
  const stats = content?.stats || [];
  const trustIndicators = content?.trust_indicators || [
    { platform: "WedMeGood", rating: "4.9/5" },
    { platform: "WeddingWire", rating: "5.0/5" },
    { platform: "Google", rating: "4.8/5" },
    { platform: "Zomato Events", rating: "4.9/5" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-purple-950 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-siara-purple-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-siara-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a855' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-800/50 backdrop-blur-sm border border-siara-purple-600/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-siara-gold-400"></span>
            <span className="font-dm-sans text-sm text-siara-gold-300 font-medium tracking-wide">
              {subheading}
            </span>
          </div>

          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-white mb-4">
            {heading.includes("Excellence") ? (
              <>
                Numbers That Speak{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                  Excellence
                </span>
              </>
            ) : (
              heading
            )}
          </h2>

          <p
            className="font-dm-sans text-lg text-siara-purple-200/70 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: description.replace(
                /<strong>(.*?)<\/strong>/g,
                '<strong class="text-siara-gold-400">$1</strong>'
              ),
            }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-siara-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-siara-purple-700/30 hover:border-siara-gold-500/30 hover:bg-siara-purple-900/70 transition-all duration-500">
                {/* Icon */}
                {stat.icon && (
                  <div className="text-4xl mb-4">{stat.icon}</div>
                )}

                {/* Value */}
                <div className="font-cormorant text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-siara-gold-300 to-siara-gold-500 mb-2">
                  {typeof stat.value === 'string' ? stat.value : String(stat.value)}
                </div>

                {/* Label */}
                <div className="font-dm-sans text-sm font-medium text-white mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                {stat.description && (
                  <div className="font-dm-sans text-xs text-siara-purple-300/60">
                    {stat.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        {trustIndicators.length > 0 && (
          <div
            className={`mt-16 flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-siara-purple-200/60">
                <svg className="w-5 h-5 text-siara-gold-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-dm-sans text-sm">
                  <span className="text-white font-medium">{item.rating}</span>
                  {" "}on {item.platform}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

