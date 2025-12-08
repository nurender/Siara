import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiaraNavbar, SiaraFooter } from '@/components/siara';
import { getSettings, getBlog, getBlogs, getPage } from '@/lib/cms';
import { SectionsRenderer, SectionRenderer } from '@/components/cms';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, blogData] = await Promise.all([
    getSettings(),
    getBlog(slug)
  ]);

  const blog = blogData?.blog;
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const siteName = settings.site_name || 'Siara Events';

  return {
    title: blog.meta_title || `${blog.title} | ${siteName} Blog`,
    description: blog.meta_description || blog.excerpt || blog.content?.substring(0, 160) || `Read ${blog.title} on ${siteName}`,
    keywords: blog.meta_keywords || `${blog.title}, wedding planning, ${blog.category || 'blog'}`,
    openGraph: {
      title: blog.meta_title || `${blog.title} | ${siteName}`,
      description: blog.meta_description || blog.excerpt,
      type: 'article',
      publishedTime: blog.published_at,
      images: blog.featured_image ? [{ url: blog.featured_image }] : [],
    },
  };
}

// Generate static params for known blog posts
export async function generateStaticParams() {
  try {
    const { blogs } = await getBlogs({ limit: 100 });
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blogs:', error);
    return [];
  }
}

// Fetch CMS data
async function getPageData(slug: string) {
  try {
    const [blogData, relatedBlogs, settings] = await Promise.all([
      getBlog(slug),
      getBlogs({ limit: 3 }),
      getSettings(),
    ]);

    const blog = blogData?.blog;
    if (!blog) {
      return null;
    }

    // Get related blogs (exclude current blog)
    const filteredRelatedBlogs = relatedBlogs.blogs.filter(b => b.slug !== slug).slice(0, 3);
    
    return {
      blog,
      relatedBlogs: blogData?.relatedBlogs || filteredRelatedBlogs,
      sections: [], // No CMS sections needed - we use BlogDetailSection directly
      relatedData: {
        blog,
        relatedBlogs: blogData?.relatedBlogs || filteredRelatedBlogs,
        settings,
      },
    };
  } catch (error) {
    console.error('Failed to fetch Blog detail data:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { blog, sections, relatedData } = pageData;
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
        /* No CMS Content - Show Blog Detail */
        <SectionRenderer
          section={{
            id: 0,
            name: 'Blog Detail',
            section_type: 'blog_detail',
            content: { show_related: true, related_heading: 'Related Articles' },
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

