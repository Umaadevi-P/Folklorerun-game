import React, { useEffect, useState, useRef } from 'react';
import './IntroAnimation.css';

/**
 * IntroAnimation Component
 * Displays the opening video intro with audio and skip functionality
 * Falls back to CSS animation for reduced motion
 * 
 * @param {Function} onComplete - Callback when video ends or skip is tapped
 * @param {Boolean} reducedMotion - Use CSS fallback instead of video
 */
function IntroAnimation({ onComplete, reducedMotion = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Detect user's motion preference if not explicitly provided
  const prefersReducedMotion = window.matchMedia 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  // Enable audio on first user interaction
  const enableAudio = () => {
    if (!audioEnabled && audioRef.current) {
      audioRef.current.volume = 0.4; // Reduce intro audio by 60% (from default 1.0 to 0.4)
      audioRef.current.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
      setAudioEnabled(true);
    }
  };

  // Handle skip button click
  const handleSkip = () => {
    if (isFadingOut) return; // Prevent multiple clicks
    
    enableAudio(); // Try to play audio if not already playing
    
    // Stop video and audio
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Start crossfade transition
    setIsFadingOut(true);
    
    // Complete transition after 300ms
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 300);
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (isFadingOut) return; // Already transitioning
    handleSkip();
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      // Use CSS animation fallback for reduced motion
      const duration = 3000;
      
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Try to play audio when video starts (may be blocked by browser)
      if (videoRef.current && audioRef.current) {
        const handleVideoPlay = () => {
          audioRef.current.volume = 0.4; // Reduce intro audio by 60% (from default 1.0 to 0.4)
          audioRef.current.play().catch(err => {
            console.warn('Audio autoplay prevented - click Skip to enable audio');
          });
        };
        
        videoRef.current.addEventListener('play', handleVideoPlay);
        
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener('play', handleVideoPlay);
          }
        };
      }
    }
  }, [onComplete, shouldReduceMotion, isFadingOut]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`intro-animation ${shouldReduceMotion ? 'reduced-motion' : ''} ${isFadingOut ? 'fade-out' : ''}`}
      role="banner"
      aria-label="FOLKLORERUN intro"
    >
      {shouldReduceMotion ? (
        // CSS animation fallback for reduced motion
        <>
          {/* Layered fog effects */}
          <div className="fog-layer fog-layer-1" aria-hidden="true"></div>
          <div className="fog-layer fog-layer-2" aria-hidden="true"></div>
          <div className="fog-layer fog-layer-3" aria-hidden="true"></div>

          {/* Main title with stroke reveal effect */}
          <h1 className="intro-title">
            FOLKLORERUN
          </h1>
        </>
      ) : (
        // Video intro with audio
        <>
          {/* Full-screen video element */}
          <video
            ref={videoRef}
            className="intro-video"
            src="/assets/Intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onClick={enableAudio}
            aria-label="FOLKLORERUN intro video - click to enable audio"
          />
          
          {/* Synchronized audio */}
          <audio
            ref={audioRef}
            src="/assets/intro audio.mp3"
            loop={false}
            aria-label="FOLKLORERUN intro audio"
          />
          
          {/* Skip button - top right */}
          <button
            className="skip-button"
            onClick={handleSkip}
            aria-label="Skip intro"
          >
            Skip
          </button>
        </>
      )}
    </div>
  );
}

export default IntroAnimation;
