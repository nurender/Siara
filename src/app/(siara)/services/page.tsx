import { Metadata } from 'next';
import { SiaraNavbar, SiaraFooter } from '@/components/siara';
import { getSettings, getServices, getPage, getTestimonials } from '@/lib/cms';
import { SectionsRenderer } from '@/components/cms';
import Link from 'next/link';

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const [settings, pageData] = await Promise.all([
    getSettings(),
    getPage('services')
  ]);

  const page = pageData?.data?.page;
  const siteName = settings.site_name || 'Siara Events';

  return {
    title: page?.meta_title || `Our Services | ${siteName} - Luxury Event Planning`,
    description: page?.meta_description || 'Discover our comprehensive range of luxury event planning services including weddings, corporate galas, destination events, and private celebrations.',
    keywords: 'wedding planning services, corporate events, destination weddings, private celebrations, luxury event management',
    openGraph: {
      title: page?.meta_title || `Our Services | ${siteName}`,
      description: page?.meta_description || 'Discover our comprehensive range of luxury event planning services.',
      type: 'website',
      images: page?.og_image ? [{ url: page.og_image }] : [],
    },
  };
}

// Fetch CMS data
async function getPageData() {
  try {
    const [pageData, services, testimonials, settings] = await Promise.all([
      getPage('services'),
      getServices(),
      getTestimonials({ featured: true }),
      getSettings(),
    ]);

    return {
      page: pageData?.data?.page || null,
      sections: pageData?.data?.sections || [],
      relatedData: {
        services,
        testimonials,
        settings,
        ...pageData?.data?.relatedData,
      },
    };
  } catch (error) {
    console.error('Failed to fetch Services page data:', error);
    return { page: null, sections: [], relatedData: {} };
  }
}

export default async function ServicesPage() {
  const { sections, relatedData } = await getPageData();
  
  // Check if we have CMS sections
  const hasCMSSections = sections && sections.length > 0;

  return (
    <main className="overflow-hidden">
      {/* Navigation */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
              Services{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-300 via-siara-gold-400 to-siara-gold-500">
                Coming Soon
              </span>
            </h1>

            <p className="font-dm-sans text-lg md:text-xl text-siara-purple-200/80 max-w-2xl mx-auto mb-10">
              Our services page content is being prepared. Please visit the admin panel to add sections.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/manager/cms/pages"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-siara-gold-500 to-siara-gold-400 text-siara-purple-950 font-dm-sans font-semibold hover:from-siara-gold-400 hover:to-siara-gold-300 transition-all hover:shadow-xl hover:shadow-siara-gold-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Sections</span>
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

      {/* Footer */}
      <SiaraFooter />
    </main>
  );
}
