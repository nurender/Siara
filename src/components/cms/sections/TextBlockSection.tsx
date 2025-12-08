"use client";

import Image from "next/image";

interface TextBlockContent {
  heading?: string;
  subheading?: string;
  body?: string;
  content?: string; // Alternative to body
  image?: string;
  align?: "left" | "center" | "right";
}

interface TextBlockProps {
  content: TextBlockContent;
  settings: Record<string, any>;
}

export default function TextBlockSection({ content, settings }: TextBlockProps) {
  const textContent = content.body || content.content || '';
  const hasImage = !!content.image;
  const layout = settings?.layout || 'center';
  const isImageRight = layout === 'image_right' || layout === 'image-right';
  const isImageLeft = layout === 'image_left' || layout === 'image-left';
  const hasImageLayout = hasImage && (isImageRight || isImageLeft);
  
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[content.align || (hasImageLayout ? "left" : "center")];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-siara-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {hasImageLayout ? (
          // Image + Text Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className={isImageRight ? "order-2" : "order-1"}>
              {content.image && (
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                  <Image
                    src={content.image.startsWith('http') ? content.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${content.image}`}
                    alt={content.heading || "About us"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={isImageRight ? "order-1" : "order-2"}>
              {content.subheading && (
                <div className="mb-6">
                  <div className="inline-block w-24 h-0.5 bg-siara-gold-400 mb-4"></div>
                  <span className="block font-dm-sans text-sm font-semibold text-siara-gold-700 uppercase tracking-widest mb-4">
                    {content.subheading}
                  </span>
                </div>
              )}
              
              {content.heading && (
                <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-900 mb-8 leading-tight">
                  {content.heading.split(" ").map((word, i, words) => {
                    // Highlight "Unforgettable" or "Legacy" in gold
                    if (word.toLowerCase().includes("unforgettable") || word.toLowerCase().includes("legacy")) {
                      return (
                        <span key={i}>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                            {word}
                          </span>
                          {i < words.length - 1 ? " " : ""}
                        </span>
                      );
                    }
                    return <span key={i}>{word}{i < words.length - 1 ? " " : ""}</span>;
                  })}
                </h2>
              )}
              
              {textContent && (
                <div
                  className="font-dm-sans text-lg text-siara-charcoal/80 leading-relaxed prose prose-lg max-w-none prose-headings:font-cormorant prose-headings:text-siara-purple-900 prose-strong:text-siara-purple-900 prose-p:mb-6"
                  dangerouslySetInnerHTML={{ __html: textContent }}
                />
              )}
            </div>
          </div>
        ) : (
          // Centered Text Layout
          <div className={`max-w-4xl mx-auto ${alignClass}`}>
            {content.subheading && (
              <div className="mb-6 text-center">
                <div className="inline-block w-24 h-0.5 bg-siara-gold-400 mb-4"></div>
                <span className="block font-dm-sans text-sm font-semibold text-siara-gold-700 uppercase tracking-widest mb-4">
                  {content.subheading}
                </span>
              </div>
            )}
            
            {content.heading && (
              <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-900 mb-8 text-center leading-tight">
                {content.heading.split(" ").map((word, i, words) => {
                  if (word.toLowerCase().includes("unforgettable") || word.toLowerCase().includes("legacy")) {
                    return (
                      <span key={i}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                          {word}
                        </span>
                        {i < words.length - 1 ? " " : ""}
                      </span>
                    );
                  }
                  return <span key={i}>{word}{i < words.length - 1 ? " " : ""}</span>;
                })}
              </h2>
            )}
            
            {textContent && (
              <div
                className="font-dm-sans text-lg text-siara-charcoal/80 leading-relaxed prose prose-lg max-w-none prose-headings:font-cormorant prose-headings:text-siara-purple-900 prose-strong:text-siara-purple-900 prose-p:mb-6"
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            )}

            {content.image && !hasImageLayout && (
              <div className="mt-12 relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                <Image
                  src={content.image.startsWith('http') ? content.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${content.image}`}
                  alt={content.heading || "About us"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

