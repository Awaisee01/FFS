// Console override disabled for debugging
// Production console override to remove console.log in production
// Temporarily disabled to debug white screen issue
/*
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  // Completely disable all console methods in production for maximum performance
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  
  // Keep only critical errors
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.toString().includes('💥') || args[0]?.toString().includes('Critical')) {
      originalError(...args);
    }
  };
}
*/

export default {};
