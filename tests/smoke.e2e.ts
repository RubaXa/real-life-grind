// @file: tests/smoke.e2e.ts
// @consumers: infra-base
// @tasks: TSK-03

import { expect, test } from '@playwright/test';

test('app-loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#app')).toBeAttached();
});
