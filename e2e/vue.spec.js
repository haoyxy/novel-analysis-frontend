import { test, expect } from '@playwright/test';

test('navigates across mock dashboard pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('全栈');

  await page.getByRole('menuitem', { name: '用户管理' }).click();
  await expect(page.getByText('创作者与读者用户管理')).toBeVisible();

  await page.getByRole('button', { name: '刷新 Mock 数据' }).click();
  await expect(page.getByRole('button', { name: '新增用户' })).toBeVisible();
});
