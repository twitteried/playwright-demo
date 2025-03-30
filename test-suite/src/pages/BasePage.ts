import { Page, Locator } from '@playwright/test';
import { Logger } from '@utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  protected async navigate(path: string): Promise<void> {
    this.logger.info(`Navigating to ${path}`);
    await this.page.goto(path);
  }

  protected async getElement(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  protected async waitForElement(selector: string, options?: { timeout?: number }): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options?.timeout });
    return element;
  }

  protected async waitForNavigation(): Promise<void> {
    this.logger.debug('Waiting for navigation');
    await this.page.waitForLoadState('networkidle');
  }

  protected async takeScreenshot(name: string): Promise<void> {
    this.logger.debug(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `./test-results/screenshots/${name}.png` });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }
}
