// Ordered left→right: navigating to a higher index = forward (right→left sweep)
const PAGE_ORDER = ['/', '/about', '/keyboards', '/build-service'];

export function dispatchPageWipe(fromPath: string, toPath: string) {
  const from = PAGE_ORDER.indexOf(fromPath);
  const to = PAGE_ORDER.indexOf(toPath);
  const direction: 'forward' | 'backward' = to >= from ? 'forward' : 'backward';
  window.dispatchEvent(new CustomEvent('page-wipe', { detail: { direction } }));
}

// Time until all panels are fully covering — callers delay navigate() by this
// Last panel (stagger i=2): 40% × 900ms + 2 × 90ms = 360 + 180 = 540ms, +10ms buffer
export const PAGE_WIPE_COVER_MS = 550;
