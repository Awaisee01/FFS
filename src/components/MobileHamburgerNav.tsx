import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

const MobileHamburgerNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'ECO4', path: '/eco4' },
    { name: 'Solar', path: '/solar' },
    { name: 'Gas Boilers', path: '/gas-boilers' },
    { name: 'Home Improvements', path: '/home-improvements' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 9999,
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
            alt="Funding For Scotland Logo" 
            style={{ height: '32px', width: 'auto' }}
          />
        </Link>

        {/* Desktop Menu - ONLY ON DESKTOP */}
        {!isMobile && (
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '14px',
                backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
                color: isActive(item.path) ? '#ffffff' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              {item.name}
            </Link>
          ))}
          </div>
        )}

        {/* Mobile Hamburger - ONLY ON MOBILE */}
        {isMobile && (
          <div style={{ 
            display: 'block'
          }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px'
            }}
            aria-label="Menu"
          >
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#374151',
              margin: '2px 0',
              transition: '0.3s',
              transform: isOpen ? 'rotate(-45deg) translate(-4px, 4px)' : 'none'
            }} />
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#374151',
              margin: '2px 0',
              opacity: isOpen ? '0' : '1',
              transition: '0.3s'
            }} />
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#374151',
              margin: '2px 0',
              transition: '0.3s',
              transform: isOpen ? 'rotate(45deg) translate(-4px, -4px)' : 'none'
            }} />
          </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && isMobile && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '1rem',
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          zIndex: 9998,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                color: isActive(item.path) ? '#2563eb' : '#374151',
                borderBottom: '1px solid #f3f4f6'
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

export default MobileHamburgerNav;