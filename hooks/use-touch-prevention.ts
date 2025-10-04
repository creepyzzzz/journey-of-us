import { useRef, useCallback } from 'react';

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isScrolling: boolean;
  hasMoved: boolean;
}

export function useTouchPrevention() {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isScrolling: false,
    hasMoved: false,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isScrolling: false,
      hasMoved: false,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.current.startX || !touchState.current.startY) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchState.current.startX);
    const deltaY = Math.abs(touch.clientY - touchState.current.startY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If moved more than 10px, consider it a scroll gesture
    if (distance > 10) {
      touchState.current.hasMoved = true;
      touchState.current.isScrolling = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent, onClick?: () => void) => {
    const touchDuration = Date.now() - touchState.current.startTime;
    
    // Check if the touch target is a button or interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, [role="button"], [role="menuitem"], input, select, textarea, a');
    
    // If it's an interactive element, let it handle its own events
    if (isInteractiveElement && isInteractiveElement !== e.currentTarget) {
      return;
    }
    
    // Prevent click if:
    // 1. User was scrolling (hasMoved is true)
    // 2. Touch duration was too long (more than 500ms)
    // 3. User moved more than 10px
    if (
      touchState.current.isScrolling ||
      touchState.current.hasMoved ||
      touchDuration > 500
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Only trigger click if it was a genuine tap
    if (onClick && touchDuration < 500 && !touchState.current.hasMoved) {
      onClick();
    }

    // Reset state
    touchState.current = {
      startX: 0,
      startY: 0,
      startTime: 0,
      isScrolling: false,
      hasMoved: false,
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent, onClick?: () => void) => {
    // For mouse events, we can be more permissive
    if (onClick) {
      onClick();
    }
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleClick,
  };
}
