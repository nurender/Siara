import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiaraNavbar, SiaraFooter } from '@/components/siara';
import { getSettings, getPortfolioItem, getPortfolio } from '@/lib/cms';
import { SectionsRenderer, SectionRenderer } from '@/components/cms';

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, portfolioData] = await Promise.all([
    getSettings(),
    getPortfolioItem(slug)
  ]);

  const portfolio = portfolioData?.item;
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  const siteName = settings.site_name || 'Siara Events';

  return {
    title: portfolio.meta_title || `${portfolio.title} | ${siteName} Portfolio`,
    description: portfolio.meta_description || portfolio.summary || `Explore ${portfolio.title} - ${portfolio.event_type} at ${portfolio.location}`,
    keywords: portfolio.meta_keywords || `${portfolio.title}, ${portfolio.event_type}, ${portfolio.location}, wedding portfolio`,
    openGraph: {
      title: portfolio.meta_title || `${portfolio.title} | ${siteName}`,
      description: portfolio.meta_description || portfolio.summary,
      type: 'website',
      images: portfolio.featured_image ? [{ url: portfolio.featured_image }] : [],
    },
  };
}

// Generate static params for known portfolio items
export async function generateStaticParams() {
  try {
    const portfolio = await getPortfolio();
    return portfolio.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for portfolio:', error);
    return [];
  }
}

// Fetch CMS data
async function getPageData(slug: string) {
  try {
    const [portfolioData, relatedPortfolio, settings] = await Promise.all([
      getPortfolioItem(slug),
      getPortfolio({ limit: 3 }),
      getSettings(),
    ]);

    const portfolio = portfolioData?.item;
    if (!portfolio) {
      return null;
    }

    // Get related portfolio (exclude current item)
    const filteredRelatedPortfolio = relatedPortfolio.filter(p => p.slug !== slug).slice(0, 3);
    
    return {
      portfolio,
      relatedPortfolio: portfolioData?.relatedItems || filteredRelatedPortfolio,
      sections: [], // No CMS sections needed - we use PortfolioDetailSection directly
      relatedData: {
        portfolio,
        relatedPortfolio: portfolioData?.relatedItems || filteredRelatedPortfolio,
        settings,
      },
    };
  } catch (error) {
    console.error('Failed to fetch Portfolio detail data:', error);
    return null;
  }
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { portfolio, sections, relatedData } = pageData;
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
        /* No CMS Content - Show Portfolio Detail */
        <SectionRenderer
          section={{
            id: 0,
            name: 'Portfolio Detail',
            section_type: 'portfolio_detail',
            content: { show_related: true, related_heading: 'Related Events' },
            settings: {},
          }}
          relatedData={relatedData}
        />
      )}

      {/* Footer */}
      <SiaraFooter />
    </main>
  );
}

