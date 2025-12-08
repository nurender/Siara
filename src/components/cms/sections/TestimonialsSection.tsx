"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  client_image?: string;
  quote: string;
  rating: number;
  event_type?: string;
  location?: string;
}

interface TestimonialsContent {
  heading: string;
  subheading?: string;
  description?: string;
  display_count?: number;
}

interface TestimonialsProps {
  content: TestimonialsContent;
  settings?: { autoplay?: boolean };
  relatedData?: { testimonials?: Testimonial[]; featuredTestimonials?: Testimonial[] };
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-siara-gold-400" : "text-siara-purple-600"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function TestimonialsSection({ content, settings, relatedData }: TestimonialsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const displayCount = content?.display_count || 6;
  const testimonials = (relatedData?.testimonials || relatedData?.featuredTestimonials || []).slice(0, displayCount);
  
  // Safe defaults
  const heading = content?.heading || "Words from Our Cherished Clients";
  const subheading = content?.subheading || "Client Stories";
  const description = content?.description || "Discover why discerning clients trust Siara Events to bring their most important celebrations to life.";

  // Check if this is the About page testimonials (dark variant)
  const isAboutPage = heading === "What Our Clients Say";

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

  // Auto-rotate testimonials for About page variant
  useEffect(() => {
    if (isAboutPage && testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAboutPage, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  // Render About page variant (dark design)
  if (isAboutPage) {
    return (
      <section
        ref={sectionRef}
        className="relative py-24 lg:py-32 bg-gradient-to-b from-siara-purple-950 via-siara-purple-900 to-siara-purple-950 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-siara-purple-800/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-siara-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Quote icon */}
        <div className="absolute top-20 right-1/4 opacity-10 hidden lg:block">
          <svg className="w-64 h-64 text-siara-gold-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-800/50 backdrop-blur-sm border border-siara-purple-600/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-siara-gold-400"></span>
              <span className="font-dm-sans text-sm text-siara-gold-300 font-medium tracking-wide">
                {subheading || "Client Love"}
              </span>
            </div>
            <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-white mb-4">
              What Our Clients{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                Say
              </span>
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {testimonials.map((testimonial: Testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ${
                  index === activeIndex
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 absolute inset-0 translate-x-10"
                }`}
              >
                <div className="bg-siara-purple-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-siara-purple-700/30">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < (testimonial.rating || 5) ? "text-siara-gold-400" : "text-siara-purple-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-center mb-8">
                    <p className="font-cormorant text-2xl md:text-3xl text-white leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full bg-cover bg-center ring-4 ring-siara-gold-400/50 mb-4"
                      style={{
                        backgroundImage: `url(${
                          testimonial.client_image?.startsWith('http')
                            ? testimonial.client_image
                            : testimonial.client_image
                            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${testimonial.client_image}`
                            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                        })`,
                      }}
                    ></div>
                    <h4 className="font-cormorant text-xl font-semibold text-white mb-1">
                      {testimonial.client_name}
                    </h4>
                    <p className="font-dm-sans text-sm text-siara-gold-400">
                      {testimonial.client_title || 
                       (testimonial.event_type && testimonial.location 
                        ? `${testimonial.event_type} at ${testimonial.location}`
                        : testimonial.location || 
                         testimonial.event_type || 
                         '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-siara-gold-400 w-8"
                        : "bg-siara-purple-600 hover:bg-siara-purple-500"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-siara-cream to-siara-soft-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232d1b4e' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 border border-siara-gold-300/20 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-siara-purple-300/20 rotate-45"></div>

      {/* Large quote icon */}
      <div className="absolute top-32 right-20 text-siara-purple-100 opacity-30 hidden lg:block">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

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

          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-siara-purple-950 mb-6">
            {heading.includes("Cherished Clients") ? (
              <>
                Words from Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                  Cherished Clients
                </span>
              </>
            ) : heading.includes("Clients") ? (
              <>
                {heading.split("Clients")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
                  Clients
                </span>
                {heading.split("Clients")[1] || ""}
              </>
            ) : (
              heading
            )}
          </h2>

          {description && (
            <p className="font-dm-sans text-lg text-siara-purple-700/70 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Testimonials Carousel */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={testimonials.length > 1}
            autoplay={
              settings?.autoplay !== false
                ? {
                    delay: 5000,
                    disableOnInteraction: false,
                  }
                : false
            }
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !w-3 !h-3 !bg-siara-purple-300 !opacity-50",
              bulletActiveClass: "!bg-siara-gold-500 !opacity-100 !w-8 rounded-full",
            }}
            navigation={{
              prevEl: ".testimonial-prev",
              nextEl: ".testimonial-next",
            }}
            breakpoints={{
              768: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            className="testimonial-swiper !pb-16"
          >
            {testimonials.map((testimonial: Testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-siara-purple-100/50 border border-siara-purple-100/50 mx-2">
                  {/* Quote */}
                  <div className="relative mb-8">
                    <svg
                      className="absolute -top-4 -left-2 w-10 h-10 text-siara-gold-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="font-dm-sans text-lg text-siara-purple-700 leading-relaxed pl-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="mb-6">
                    <StarRating rating={testimonial.rating || 5} />
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-cover bg-center ring-2 ring-siara-gold-300/50"
                      style={{
                        backgroundImage: `url(${
                          testimonial.client_image?.startsWith('http')
                            ? testimonial.client_image
                            : testimonial.client_image
                            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${testimonial.client_image}`
                            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                        })`,
                      }}
                    ></div>
                    <div>
                      <h4 className="font-cormorant text-xl font-semibold text-siara-purple-950">
                        {testimonial.client_name}
                      </h4>
                      <p className="font-dm-sans text-sm text-siara-purple-500">
                        {testimonial.client_title || 
                         (testimonial.event_type && testimonial.location 
                          ? `${testimonial.event_type}${testimonial.location ? `, ${testimonial.location}` : ''}`
                          : testimonial.event_type || testimonial.location || '')}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button className="testimonial-prev w-12 h-12 rounded-full border-2 border-siara-purple-200 flex items-center justify-center text-siara-purple-600 hover:border-siara-gold-400 hover:text-siara-gold-600 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="testimonial-next w-12 h-12 rounded-full border-2 border-siara-purple-200 flex items-center justify-center text-siara-purple-600 hover:border-siara-gold-400 hover:text-siara-gold-600 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

