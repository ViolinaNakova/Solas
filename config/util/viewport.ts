/**
 * Viewport sizes for tests that need a fixed browser size.
 *
 * The default projects use `viewport: null` (the window's own size), which
 * can be as small as 800x600. Long program-lifecycle flows need a desktop
 * size: at small sizes the program page collapses sections, pushes header
 * buttons off-screen, and lets the sticky tab bar and toasts cover controls.
 */
export const viewports = {
    /** Full HD desktop, matching the size the lifecycle flow was explored at. */
    desktopFullHd: { width: 1920, height: 1080 },
} as const;
