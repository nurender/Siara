import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiaraNavbar, SiaraFooter } from '@/components/siara';
import { getSettings, getService, getServices, getPage } from '@/lib/cms';
import { SectionsRenderer } from '@/components/cms';
import Link from 'next/link';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, service] = await Promise.all([
    getSettings(),
    getService(slug)
  ]);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const siteName = settings.site_name || 'Siara Events';

  return {
    title: service.meta_title || `${service.name} | ${siteName}`,
    description: service.meta_description || service.short_description || `Discover our ${service.name} service. ${(service as any).description || ''}`,
    keywords: (service as any).meta_keywords || `${service.name}, wedding planning, event management, ${siteName}`,
    openGraph: {
      title: service.meta_title || `${service.name} | ${siteName}`,
      description: service.meta_description || service.short_description,
      type: 'website',
      images: service.featured_image ? [{ url: service.featured_image }] : [],
    },
  };
}

// Generate static params for known services
export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for services:', error);
    return [];
  }
}

// Fetch CMS data
async function getPageData(slug: string) {
  try {
    const [service, allServices, settings, pageData] = await Promise.all([
      getService(slug),
      getServices(),
      getSettings(),
      getPage(`service-${slug}`), // Try to get page-specific sections
    ]);

    if (!service) {
      return null;
    }

    // If there's a page with sections, use those, otherwise create default sections from service data
    const sections = pageData?.data?.sections || [];
    const relatedServices = allServices.filter(s => s.slug !== slug).slice(0, 3);
    
    return {
      service,
      relatedServices,
      sections,
      relatedData: {
        service,
        relatedServices,
        settings,
        ...pageData?.data?.relatedData,
      },
    };
  } catch (error) {
    console.error('Failed to fetch Service detail data:', error);
    return null;
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { service, sections, relatedData } = pageData;
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
        /* No CMS Content - Show Service Info */
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
              {service.name}
            </h1>

            <p className="font-dm-sans text-lg md:text-xl text-siara-purple-200/80 max-w-2xl mx-auto mb-10">
              {service.short_description || (service as any).description || 'Service content is being prepared. Please visit the admin panel to add sections.'}
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
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-siara-purple-500 text-white font-dm-sans font-semibold hover:bg-siara-purple-800/50 transition-all"
              >
                <span>Back to Services</span>
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

