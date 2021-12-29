import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {

  // Go to http://localhost:4201/#/dashboard
  await page.goto('http://localhost:4200/#/dashboard')

  // Click text=Customize
  await page.click('text=Customize');
  await expect(page).toHaveURL('http://localhost:4200/#/customize')


  // Click text=Automatic NgxFileUpload
  await page.click('text=Automatic NgxFileUpload');
  await expect(page).toHaveURL('http://localhost:4200/#/auto-upload')
  // Click text=Typescript
  await page.click('text=Typescript');

  // Click igx-tab-header[role="tab"]:has-text("Html")
  await page.click('igx-tab-header[role="tab"]:has-text("Html")')

  // Click text=Validation
  await page.click('text=Validation');
  await expect(page).toHaveURL('http://localhost:4200/#/validation')

  // Click text=Ngx File Drop
  await page.click('text=Ngx File Drop');
  await expect(page).toHaveURL('http://localhost:4200/#/drop-zone');

  // Click text=Ngx Dropzone
  await page.click('text=Ngx Dropzone');
  await expect(page).toHaveURL('http://localhost:4200/#/ngx-dropzone');
});
