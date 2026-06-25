import { notFound } from "next/navigation";
import { getSeoPage, FOR } from "@/lib/seo-data";
import SeoPageLayout from "@/components/SeoPageLayout";
import { Metadata } from "next";

export async function generateStaticParams() {
  return FOR.map(p => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getSeoPage("for", slug);
  if (!data) return {};

  const canonicalUrl = `https://sendmyform.live/for/${slug}`;

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
      type: "website",
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
  const data = getSeoPage("for", slug);
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
        "name": "For",
        "item": "https://sendmyform.live/for"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.h1,
        "item": `https://sendmyform.live/for/${data.slug}`
      }
    ]
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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <SeoPageLayout data={data} category="for" />
    </>
  );
}
