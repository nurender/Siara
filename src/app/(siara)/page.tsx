import { Metadata } from "next";
import {
  SiaraNavbar,
  SiaraFooter,
} from "@/components/siara";
import { getPage, getServices, getTestimonials, getSettings } from "@/lib/cms";
import { SectionsRenderer } from "@/components/cms";
import Link from "next/link";

// Generate metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    getPage("home"),
    getSettings()
  ]);

  const page = pageData?.data?.page;
  const siteName = settings.site_name || "Siara Events";

  return {
    title: page?.meta_title || settings.seo_title || `${siteName} | Luxury Event Management`,
    description: page?.meta_description || settings.seo_description || "Crafting extraordinary moments and unforgettable celebrations.",
    keywords: settings.seo_keywords || "luxury events, wedding planner, corporate events",
    openGraph: {
      title: page?.meta_title || siteName,
      description: page?.meta_description || settings.seo_description,
      images: page?.og_image ? [{ url: page.og_image }] : [],
    },
  };
}

// Fetch CMS data
async function getPageData() {
  try {
    const [pageData, services, testimonials, settings] = await Promise.all([
      getPage("home"),
      getServices({ featured: true }),
      getTestimonials({ featured: true }),
      getSettings(),
    ]);

    // Debug logs
    if (process.env.NODE_ENV === 'development') {
      console.log('Page Data:', pageData?.data?.page?.slug);
      console.log('Sections Count:', pageData?.data?.sections?.length || 0);
      console.log('Services Count:', services?.length || 0);
      console.log('Testimonials Count:', testimonials?.length || 0);
    }

    return {
      page: pageData?.data?.page || null,
      sections: pageData?.data?.sections || [],
      relatedData: {
        services: services || [],
        testimonials: testimonials || [],
        settings: settings || {},
        ...pageData?.data?.relatedData,
      },
    };
  } catch (error) {
    console.error("Failed to fetch CMS data:", error);
    return { page: null, sections: [], relatedData: {} };
  }
}

export default async function SiaraHomePage() {
  const { sections, relatedData } = await getPageData();

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Home Page - Sections:', sections?.length || 0);
    console.log('Home Page - Related Data:', Object.keys(relatedData || {}));
  }

  // Check if we have CMS sections to render
  const hasCMSSections = sections && Array.isArray(sections) && sections.length > 0;

  return (
    <main className="overflow-hidden">
      {/* Sticky Navigation */}
      <SiaraNavbar />

      {/* Render CMS sections if available */}
      {hasCMSSections ? (
        <SectionsRenderer
          sections={sections}
          relatedData={relatedData}
        />
      ) : (
        /* No CMS Content - Show Setup Message */
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-siara-purple-950 via-siara-purple-900 to-siara-charcoal">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-siara-purple-700/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-siara-gold-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center py-32">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-siara-purple-800/50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-siara-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              Website{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                Coming Soon
              </span>
            </h1>

            <p className="font-dm-sans text-lg md:text-xl text-siara-purple-200/80 max-w-2xl mx-auto mb-10">
              Our website content is being prepared. Please visit the admin panel to add 
              content sections to this page.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/manager/cms"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 font-dm-sans font-semibold hover:from-siara-gold-400 hover:to-siara-gold-300 transition-all hover:shadow-xl hover:shadow-siara-gold-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Content</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-siara-purple-500 text-white font-dm-sans font-semibold hover:bg-siara-purple-800/50 transition-all"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer - Always static */}
      <SiaraFooter />
    </main>
  );
}
