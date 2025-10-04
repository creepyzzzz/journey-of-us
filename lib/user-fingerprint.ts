import { nanoid } from 'nanoid';

// Generate a unique fingerprint for the current user/browser
export function generateUserFingerprint(): string {
  // Try to get existing fingerprint from localStorage
  const existingFingerprint = localStorage.getItem('user_fingerprint');
  if (existingFingerprint) {
    return existingFingerprint;
  }

  // Generate a new fingerprint based on browser characteristics
  const fingerprint = generateBrowserFingerprint();
  
  // Store it in localStorage for persistence
  localStorage.setItem('user_fingerprint', fingerprint);
  
  return fingerprint;
}

// Generate a browser fingerprint based on available browser characteristics
function generateBrowserFingerprint(): string {
  const components: string[] = [];
  
  // User agent (browser info)
  if (typeof navigator !== 'undefined') {
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(navigator.platform);
    components.push(navigator.hardwareConcurrency?.toString() || 'unknown');
    components.push(navigator.maxTouchPoints?.toString() || '0');
  }
  
  // Screen characteristics
  if (typeof screen !== 'undefined') {
    components.push(screen.width.toString());
    components.push(screen.height.toString());
    components.push(screen.colorDepth.toString());
    components.push(screen.pixelDepth.toString());
  }
  
  // Timezone
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }
  
  // Canvas fingerprint (if available)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas fingerprinting not available
  }
  
  // Combine all components and create a hash-like identifier
  const combined = components.join('|');
  const hash = simpleHash(combined);
  
  // Add a random component to ensure uniqueness even with identical browsers
  const randomComponent = nanoid(8);
  
  return `${hash}-${randomComponent}`;
}

// Simple hash function for creating a consistent identifier
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Get the current user's fingerprint
export function getUserFingerprint(): string {
  return generateUserFingerprint();
}

// Check if a game was created by the current user
export function isGameCreatedByCurrentUser(game: any): boolean {
  const currentFingerprint = getUserFingerprint();
  return game.creatorFingerprint === currentFingerprint;
}

// Clear the user fingerprint (useful for testing or if user wants to reset)
export function clearUserFingerprint(): void {
  localStorage.removeItem('user_fingerprint');
}
