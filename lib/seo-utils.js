/**
 * SEO utility functions for generating structured data and metadata
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://travelverdict.vercel.app";

/**
 * Generate Organization Schema (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StrateStats",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Independent scorecards for Indian travel platforms. Clear weekly reviews of platform quality and support performance.",
    sameAs: [
      "https://twitter.com/stratestats",
      "https://linkedin.com/company/stratestats",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "Customer Service",
    },
  };
}

/**
 * Generate WebSite Schema (JSON-LD) for search queries
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StrateStats",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      query_input: "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList Schema (JSON-LD)
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Product Schema for platforms (JSON-LD)
 */
export function generateProductSchema(platform, rating, description) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: platform.name,
    description:
      description || `StrateStats rating and reviews for ${platform.name}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating?.score || "N/A",
      ratingCount: rating?.count || 0,
    },
    url: `${SITE_URL}/platforms/${platform.id}`,
  };
}

/**
 * Generate Article Schema (JSON-LD) for reviews
 */
export function generateArticleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_URL}/icon.svg`,
    datePublished: article.publishedDate || new Date().toISOString(),
    dateModified: article.modifiedDate || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "StrateStats",
    },
  };
}

/**
 * Generate FAQ Schema (JSON-LD)
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
