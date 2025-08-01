import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    // Remove any existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Base organization schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Funding For Scotland",
      "url": "https://fundingforscotland.com",
      "logo": "https://fundingforscotland.com/lovable-uploads/beb68662-b15e-4c22-bae2-7be4c6bb42e7.png",
      "description": "Leading provider of government funding assistance for ECO4, solar panels, gas boilers and home improvements in Scotland",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB",
        "addressRegion": "Scotland"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "GB-SCT",
        "availableLanguage": "English"
      },
      "serviceArea": {
        "@type": "Place",
        "name": "Scotland"
      }
    };

    // Page-specific schemas
    let pageSchema = {};

    switch (location.pathname) {
      case '/':
        pageSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Funding For Scotland",
          "url": "https://fundingforscotland.com",
          "description": "Get 100% free government funding for ECO4 insulation, solar panels, gas boilers and home improvements in Scotland",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://fundingforscotland.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        break;

      case '/eco4':
        pageSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "ECO4 Funding Scotland",
          "description": "Free ECO4 government funding for insulation and energy efficiency improvements in Scottish homes",
          "provider": {
            "@type": "Organization",
            "name": "Funding For Scotland"
          },
          "areaServed": "Scotland",
          "serviceType": "Government Funding Assistance",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "GBP",
            "description": "100% free ECO4 funding with no upfront costs"
          }
        };
        break;

      case '/solar':
        pageSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Solar Panel Grants Scotland",
          "description": "Free solar panel installation through government grants and funding schemes in Scotland",
          "provider": {
            "@type": "Organization",
            "name": "Funding For Scotland"
          },
          "areaServed": "Scotland",
          "serviceType": "Solar Panel Installation Funding"
        };
        break;

      case '/gas-boilers':
        pageSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Gas Boiler Replacement Grants Scotland",
          "description": "Free gas boiler replacement and upgrade funding for Scottish households",
          "provider": {
            "@type": "Organization",
            "name": "Funding For Scotland"
          },
          "areaServed": "Scotland",
          "serviceType": "Boiler Replacement Funding"
        };
        break;

      case '/home-improvements':
        pageSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Home Improvement Grants Scotland",
          "description": "Government funding for home improvements including insulation, windows, doors and energy efficiency upgrades",
          "provider": {
            "@type": "Organization",
            "name": "Funding For Scotland"
          },
          "areaServed": "Scotland",
          "serviceType": "Home Improvement Funding"
        };
        break;
    }

    // FAQ Schema for home page
    const faqSchema = location.pathname === '/' ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is ECO4 funding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ECO4 is a government scheme that provides 100% free funding for energy efficiency improvements including insulation, heating upgrades, and renewable energy installations for eligible households in Scotland."
          }
        },
        {
          "@type": "Question",
          "name": "Am I eligible for government funding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Eligibility depends on your household income, benefits received, property type, and energy efficiency rating. We provide free assessments to determine your eligibility for various funding schemes."
          }
        },
        {
          "@type": "Question",
          "name": "How much funding can I receive?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Funding amounts vary by scheme and improvements needed. ECO4 can cover up to £10,000+ for eligible households, while solar grants can cover full installation costs."
          }
        }
      ]
    } : null;

    // Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://fundingforscotland.com"
        }
      ]
    };

    // Add breadcrumb items based on current page
    if (location.pathname !== '/') {
      const pathParts = location.pathname.split('/').filter(Boolean);
      pathParts.forEach((part, index) => {
        const name = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
        breadcrumbSchema.itemListElement.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": `https://fundingforscotland.com/${pathParts.slice(0, index + 1).join('/')}`
        });
      });
    }

    // Create and append schema scripts
    const schemas = [organizationSchema, pageSchema, breadcrumbSchema];
    if (faqSchema) schemas.push(faqSchema);

    schemas.forEach(schema => {
      if (Object.keys(schema).length > 0) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }, [location.pathname]);

  return null;
};

export default StructuredData;