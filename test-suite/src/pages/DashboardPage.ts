import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Selectors
  private readonly welcomeMessage = '.welcome-message';
  private readonly dashboardStats = '.dashboard-stats';
  private readonly recentActivity = '.recent-activity';
  private readonly quickActions = '.quick-actions';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/dashboard');
  }

  async getWelcomeMessage(): Promise<string> {
    const element = await this.getElement(this.welcomeMessage);
    return await element.textContent() || '';
  }

  async getStatsCount(): Promise<number> {
    const statsElements = await this.page.locator(`${this.dashboardStats} .stat-item`);
    return await statsElements.count();
  }

  async getRecentActivityItems(): Promise<string[]> {
    const activityItems = await this.page.locator(`${this.recentActivity} .activity-item`).all();
    
    const itemTexts: string[] = [];
    for (const item of activityItems) {
      const text = await item.textContent();
      if (text) itemTexts.push(text.trim());
    }
    
    return itemTexts;
  }

  async clickQuickAction(actionName: string): Promise<void> {
    const actionButton = this.page.locator(`${this.quickActions} button`, { hasText: actionName });
    await actionButton.click();
  }

  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.welcomeMessage);
      await this.waitForElement(this.dashboardStats);
      return true;
    } catch (error) {
      this.logger.error('Dashboard failed to load properly', error as Error);
      return false;
    }
  }
}
