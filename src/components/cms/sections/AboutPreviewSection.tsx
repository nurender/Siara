"use client";

import Image from "next/image";

interface AboutPreviewContent {
  heading: string;
  subheading?: string;
  description: string;
  images?: string[];
  stats?: { value: string; label: string }[];
}

interface AboutPreviewProps {
  content: AboutPreviewContent;
  settings: { layout?: string };
}

export default function AboutPreviewSection({ content, settings }: AboutPreviewProps) {
  const images = content.images || [];
  
  // Split description into paragraphs if it contains newlines
  const descriptionParagraphs = content.description?.split('\n').filter(p => p.trim()) || [content.description || ''];
  
  // Extract heading parts for highlighting
  const headingParts = content.heading || '';
  const highlightText = "Meets Excellence"; // Default highlight text

  return (
    <section className="relative py-24 lg:py-32 bg-siara-cream overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-siara-purple-50/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-siara-gold-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {content.subheading && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
                <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
                <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
                  {content.subheading.replace('• ', '')}
                </span>
              </div>
            )}

            <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-950 mb-6 leading-tight">
              {headingParts.includes(highlightText) ? (
                <>
                  {headingParts.split(highlightText)[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                    {highlightText}
                  </span>
                </>
              ) : (
                headingParts
              )}
            </h2>

            <div className="space-y-6 font-dm-sans leading-relaxed mb-8">
              {descriptionParagraphs.map((para, idx) => (
                <p 
                  key={idx} 
                  className={idx === 0 ? "text-lg text-siara-purple-700/70" : "text-siara-purple-600/80"}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Stats Grid */}
            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {content.stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-white shadow-lg shadow-siara-purple-100/30">
                    <div className="font-cormorant text-3xl font-bold text-siara-gold-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="font-dm-sans text-sm text-siara-purple-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Image Grid */}
          <div className="relative">
            {images.length >= 4 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl overflow-hidden shadow-xl relative">
                    <Image
                      src={images[0]?.startsWith('http') ? images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[0]}`}
                      alt={`${content.heading} - Image 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden shadow-xl relative">
                    <Image
                      src={images[2]?.startsWith('http') ? images[2] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[2]}`}
                      alt={`${content.heading} - Image 3`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-64 rounded-2xl overflow-hidden shadow-xl relative">
                    <Image
                      src={images[1]?.startsWith('http') ? images[1] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${images[1]}`}
                      alt={`${content.heading} - Image 2`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-48 rounded-2xl overflow-hidden shadow-xl relative">
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
            {content.stats && content.stats.some(s => s.label.toLowerCase().includes('satisfaction')) && (
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl shadow-siara-purple-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-siara-gold-400 to-siara-gold-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    {content.stats.find(s => s.label.toLowerCase().includes('satisfaction')) && (
                      <>
                        <div className="font-cormorant text-2xl font-bold text-siara-purple-950">
                          {content.stats.find(s => s.label.toLowerCase().includes('satisfaction'))?.value}
                        </div>
                        <div className="font-dm-sans text-sm text-siara-purple-500">
                          {content.stats.find(s => s.label.toLowerCase().includes('satisfaction'))?.label}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

