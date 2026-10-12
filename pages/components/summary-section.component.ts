import { expect, Locator, Page } from '@playwright/test';

/**
 * Collapsible sections on a program's tabs (Files, Financial Layers, Contract
 * Review, Checks, ...). Each section's toggle is an icon whose data-ref is
 * `summary-open-<key>` while collapsed and `summary-hide-<key>` while
 * expanded (Layer Checks uses `open-layer-checks` / `hide-layer-checks`).
 * Sections can render collapsed, hiding (and unmounting) their content. The
 * icon is clicked directly: some toggles wrap it in a button, others (e.g.
 * the Underwriting Checklist) do not.
 */
export class SummarySectionComponent {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    toggleIcon(dataRef: string): Locator {
        // Icon-only toggles have no accessible name: matched by the icon data-ref.
        return this.page.locator(`[data-ref="${dataRef}"]`);
    }

    // ==================== Actions ====================

    /**
     * Expands a section if it is currently collapsed.
     * @param {string} sectionKey - The section key used in its toggle's `summary-open-<key>` / `summary-hide-<key>` data-ref (e.g. "files").
     * @returns {Promise<void>}
     */
    async expand(sectionKey: string): Promise<void> {
        await this.expandByIcons(
            `summary-open-${sectionKey}`,
            `summary-hide-${sectionKey}`
        );
    }

    /**
     * Expands a section whose toggle icons do not follow the `summary-*`
     * naming, if it is currently collapsed.
     * @param {string} openRef - The data-ref of the icon shown while collapsed.
     * @param {string} hideRef - The data-ref of the icon shown while expanded.
     * @returns {Promise<void>}
     */
    async expandByIcons(openRef: string, hideRef: string): Promise<void> {
        const openIcon = this.toggleIcon(openRef);
        const hideIcon = this.toggleIcon(hideRef);
        // Some toggles only show at small window sizes (e.g. the Underwriting
        // Checklist is always expanded on desktop and its toggle is hidden),
        // so the toggle only has to exist, and is clicked only when visible.
        await expect(openIcon.or(hideIcon)).toBeAttached();
        if (await openIcon.isVisible()) {
            await openIcon.click();
            await expect(hideIcon).toBeAttached();
        }
    }
}
