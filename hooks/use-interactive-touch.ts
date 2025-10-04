import { useCallback } from 'react';

export function useInteractiveTouch() {
  const handleInteractiveTouch = useCallback((e: React.TouchEvent, callback: () => void) => {
    // Always prevent event bubbling for interactive elements
    e.preventDefault();
    e.stopPropagation();
    
    // Execute the callback
    callback();
  }, []);

  const handleInteractiveClick = useCallback((e: React.MouseEvent, callback: () => void) => {
    // Prevent event bubbling for interactive elements
    e.preventDefault();
    e.stopPropagation();
    
    // Execute the callback
    callback();
  }, []);

  return {
    handleInteractiveTouch,
    handleInteractiveClick,
  };
}
