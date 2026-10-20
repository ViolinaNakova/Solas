import { existsSync } from 'fs';
import { expect, test } from '../../fixtures/pom/test-options';
import { StorageStatePaths } from '../../enums/solas/storage-state-paths';
import { Routes } from '../../enums/solas/routes';

/**
 * Solas authenticates via Microsoft Entra ID SSO with mandatory MFA
 * (Authenticator app number-match), so a fresh login cannot be automated
 * unattended. Instead of logging in, this setup verifies that the
 * storage state file saved from a prior manual login is still valid.
 *
 * If this fails, regenerate the storage state manually:
 *   1. bash scripts/playwright-cli.sh open
 *   2. bash scripts/playwright-cli.sh goto <APP_URL>
 *   3. Sign in with Microsoft, approve the MFA push manually.
 *   4. bash scripts/playwright-cli.sh state-save .auth/solas/appStorageState.json
 */
test.describe('solas auth setup', () => {
    test('storage state is present and authenticated', async ({ browser }) => {
        expect(
            existsSync(StorageStatePaths.SOLAS),
            `Missing storage state at ${StorageStatePaths.SOLAS}. Regenerate it via a manual playwright-cli login (see comment in this file).`
        ).toBe(true);

        const context = await browser.newContext({
            storageState: StorageStatePaths.SOLAS,
        });
        try {
            const page = await context.newPage();

            await page.goto(Routes.SUBMISSIONS, {
                waitUntil: 'domcontentloaded',
            });

            await expect(
                page
                    .getByRole('main')
                    .getByRole('button', { name: 'Add a New Program' }),
                'Session appears expired (redirected to Microsoft login or the Submissions page did not render) — regenerate the storage state manually.'
            ).toBeVisible();
        } finally {
            await context.close();
        }
    });
});
