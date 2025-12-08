"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface AboutStoryContent {
  subheading?: string;
  heading: string;
  highlight?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  years_count?: string;
  founder_name?: string;
  founder_title?: string;
  founder_image?: string;
  images?: string[];
}

interface AboutStoryProps {
  content: AboutStoryContent;
  settings?: Record<string, any>;
}

export default function AboutStorySection({ content, settings }: AboutStoryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const images = content.images || [];
  const headingParts = content.heading || '';
  const highlightText = content.highlight || '';

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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-soft-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-siara-purple-50/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-siara-gold-100/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image Grid */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            {images.length >= 4 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl overflow-hidden bg-cover bg-center shadow-xl relative">
                    <Image
                      src={images[0]?.startsWith('http') ? images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[0]}`}
                      alt={`${content.heading} - Image 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden bg-cover bg-center shadow-xl relative">
                    <Image
                      src={images[2]?.startsWith('http') ? images[2] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[2]}`}
                      alt={`${content.heading} - Image 3`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-64 rounded-2xl overflow-hidden bg-cover bg-center shadow-xl relative">
                    <Image
                      src={images[1]?.startsWith('http') ? images[1] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[1]}`}
                      alt={`${content.heading} - Image 2`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-48 rounded-2xl overflow-hidden bg-cover bg-center shadow-xl relative">
                    <Image
                      src={images[3]?.startsWith('http') ? images[3] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[3]}`}
                      alt={`${content.heading} - Image 4`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-siara-purple-100 to-siara-purple-200"></div>
                  <div className="h-64 rounded-2xl bg-gradient-to-br from-siara-purple-100 to-siara-purple-200"></div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-64 rounded-2xl bg-gradient-to-br from-siara-purple-100 to-siara-purple-200"></div>
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-siara-purple-100 to-siara-purple-200"></div>
                </div>
              </div>
            )}

            {/* Floating badge */}
            {content.years_count && (
              <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white rounded-2xl p-6 shadow-2xl shadow-siara-purple-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siara-gold-400 to-siara-gold-600 flex items-center justify-center">
                    <span className="font-cormorant text-2xl font-bold text-siara-purple-950">
                      {content.years_count}
                    </span>
                  </div>
                  <div>
                    <div className="font-cormorant text-xl font-bold text-siara-purple-950">Years</div>
                    <div className="font-dm-sans text-sm text-siara-purple-500">of Excellence</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            {content.subheading && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
                <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
                <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
                  {content.subheading.replace('• ', '')}
                </span>
              </div>
            )}

            <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-siara-purple-950 mb-6 leading-tight">
              {headingParts}{" "}
              {highlightText && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                  {highlightText}
                </span>
              )}
            </h2>

            <div className="space-y-6 font-dm-sans text-siara-purple-700/80 leading-relaxed">
              {content.paragraph1 && (
                <p dangerouslySetInnerHTML={{ 
                  __html: content.paragraph1
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-siara-purple-900">$1</strong>')
                }} />
              )}

              {content.paragraph2 && (
                <p dangerouslySetInnerHTML={{ 
                  __html: content.paragraph2
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-siara-purple-900">$1</strong>')
                }} />
              )}

              {content.paragraph3 && (
                <p dangerouslySetInnerHTML={{ 
                  __html: content.paragraph3
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-siara-purple-900">$1</strong>')
                }} />
              )}
            </div>

            {/* Signature */}
            {(content.founder_name || content.founder_title) && (
              <div className="mt-8 flex items-center gap-4">
                {content.founder_image ? (
                  <div
                    className="w-16 h-16 rounded-full bg-cover bg-center ring-4 ring-siara-gold-200 relative overflow-hidden"
                  >
                    <Image
                      src={content.founder_image.startsWith('http') ? content.founder_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${content.founder_image}`}
                      alt={content.founder_name || 'Founder'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siara-purple-200 to-siara-purple-300 ring-4 ring-siara-gold-200"></div>
                )}
                <div>
                  {content.founder_name && (
                    <div className="font-cormorant text-xl font-semibold text-siara-purple-950">
                      {content.founder_name}
                    </div>
                  )}
                  {content.founder_title && (
                    <div className="font-dm-sans text-sm text-siara-purple-500">
                      {content.founder_title}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

