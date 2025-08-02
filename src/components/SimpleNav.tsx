import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SimpleNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const location = useLocation();

  // Simple mobile detection that works immediately
  useEffect(() => {
    const checkIfMobile = () => {
      setShowMobile(window.innerWidth < 768);
    };

    // Check immediately
    checkIfMobile();

    // Check on resize
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "ECO4", path: "/eco4" },
    { name: "Solar", path: "/solar" },
    { name: "Gas Boilers", path: "/gas-boilers" },
    { name: "Home Improvements", path: "/home-improvements" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* Logo - Always Visible */}
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/lovable-uploads/headop-40.webp"
            alt="Funding For Scotland - Home Energy Efficiency Grants"
            width="40"
            height="40"
            fetchPriority="high"
            decoding="async"
          />
          <div className="text-2xl text-black  font-black" >
            Funding <span className="text-xl font-black">for</span> Scotland
          </div>
        </Link>

        {/* DESKTOP MENU - Only show if NOT mobile */}
        {!showMobile && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                  backgroundColor: isActive(item.path)
                    ? "#2563eb !important"
                    : "transparent",
                  color: isActive(item.path) ? "#ffffff !important" : "#374151",
                  transition: "all 0.2s",
                  border: isActive(item.path) ? "2px solid #2563eb" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* MOBILE HAMBURGER - Only show if mobile */}
        {showMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "32px",
              height: "32px",
            }}
            aria-label="Toggle menu"
          >
            {/* Hamburger Lines */}
            <div
              style={{
                width: "20px",
                height: "2px",
                backgroundColor: "#374151",
                margin: "2px 0",
                transition: "0.3s",
              }}
            />
            <div
              style={{
                width: "20px",
                height: "2px",
                backgroundColor: "#374151",
                margin: "2px 0",
                transition: "0.3s",
              }}
            />
            <div
              style={{
                width: "20px",
                height: "2px",
                backgroundColor: "#374151",
                margin: "2px 0",
                transition: "0.3s",
              }}
            />
          </button>
        )}
      </div>

      {/* MOBILE DROPDOWN MENU - Only show if mobile AND open */}
      {showMobile && isOpen && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "1rem",
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 49,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "16px 8px",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "16px",
                color: isActive(item.path) ? "#2563eb" : "#374151",
                borderBottom:
                  index !== navItems.length - 1 ? "1px solid #e5e7eb" : "none",
                textAlign: "left",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default SimpleNav;
