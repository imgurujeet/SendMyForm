import { notFound } from "next/navigation";
import { getSeoPage, BLOG } from "@/lib/seo-data";
import SeoPageLayout from "@/components/SeoPageLayout";
import { Metadata } from "next";

export async function generateStaticParams() {
  return BLOG.map(p => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getSeoPage("blog", slug);
  if (!data) return {};

  const canonicalUrl = `https://sendmyform.live/blog/${slug}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: canonicalUrl,
      type: "article",
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: ["/og-image.png"],
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = getSeoPage("blog", slug);
  if (!data) notFound();

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sendmyform.live"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://sendmyform.live/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.h1,
        "item": `https://sendmyform.live/blog/${data.slug}`
      }
    ]
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "datePublished": "2025-03-15",
    "dateModified": "2026-06-01",
    "author": {
      "@type": "Organization",
      "name": "SendMyForm",
      "url": "https://sendmyform.live"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SendMyForm",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sendmyform.live/logo.png"
      }
    },
    "image": "https://sendmyform.live/og-image.png",
    "mainEntityOfPage": `https://sendmyform.live/blog/${data.slug}`
  };

  const faqLd = data.faq && data.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <SeoPageLayout data={data} category="blog" />
    </>
  );
}
