import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and manage reduced motion preferences
 * Detects system preference and allows manual override
 * @returns {Object} { reducedMotion: boolean, toggleReducedMotion: function }
 */
function useReducedMotion() {
  // Check system preference on mount
  const getSystemPreference = () => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  };

  const [reducedMotion, setReducedMotion] = useState(getSystemPreference);

  // Listen for changes to system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Manual toggle function
  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  return { reducedMotion, toggleReducedMotion };
}

export default useReducedMotion;
