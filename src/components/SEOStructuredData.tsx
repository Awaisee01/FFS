
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOStructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Remove existing structured data
    const existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    let structuredData = {};

    // Base organization data
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Funding For Scotland",
      "description": "Scotland's leading consultancy for homeowner grants and funding",
      "url": "https://fundingforscotland.co.uk",
      "areaServed": "Scotland",
      "serviceType": "Energy Efficiency Consultation",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB",
        "addressRegion": "Scotland"
      }
    };

    // Page-specific structured data
    switch (location.pathname) {
      case '/':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "WebSite",
              "name": "Funding For Scotland",
              "url": "https://fundingforscotland.co.uk",
              "description": "Access ECO4 grants, solar panels, boiler replacements, and home improvement funding up to £25,000"
            }
          ]
        };
        break;

      case '/eco4':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "Service",
              "name": "ECO4 Grant Consultation",
              "description": "Free consultation for ECO4 grants covering heating upgrades, solar panels, and insulation",
              "provider": organizationData,
              "areaServed": "Scotland",
              "serviceType": "Energy Efficiency Grant Consultation"
            }
          ]
        };
        break;

      case '/solar':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "Service",
              "name": "Free Solar Panel Installation",
              "description": "Government-backed free solar panel installation scheme in Scotland",
              "provider": organizationData,
              "areaServed": "Scotland",
              "serviceType": "Solar Panel Installation Consultation"
            }
          ]
        };
        break;

      case '/gas-boilers':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "Service",
              "name": "Free Gas Boiler Replacement",
              "description": "Free gas boiler replacement through government funding schemes",
              "provider": organizationData,
              "areaServed": "Scotland",
              "serviceType": "Boiler Replacement Consultation"
            }
          ]
        };
        break;

      case '/home-improvements':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "Service",
              "name": "Home Improvement Grants",
              "description": "Government grants for windows, doors, roofing, and rendering in Scotland",
              "provider": organizationData,
              "areaServed": "Scotland",
              "serviceType": "Home Improvement Grant Consultation"
            }
          ]
        };
        break;

      case '/contact':
        structuredData = {
          "@context": "https://schema.org",
          "@graph": [
            organizationData,
            {
              "@type": "ContactPage",
              "name": "Contact Funding For Scotland",
              "description": "Get your free consultation for Scottish grants and funding",
              "url": "https://fundingforscotland.co.uk/contact"
            }
          ]
        };
        break;

      default:
        structuredData = organizationData;
    }

    // Add structured data to head
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [location.pathname]);

  return null;
};

export default SEOStructuredData;
