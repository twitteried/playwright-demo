import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '@data/testUsers';

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.error-message';
  private readonly forgotPasswordLink = 'a[href*="forgot-password"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/login');
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging in as ${username}`);
    
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    
    // Wait for navigation to complete after login
    await this.waitForNavigation();
  }

  async loginAsUser(user: User): Promise<void> {
    await this.login(user.username, user.password);
  }

  async fillUsername(username: string): Promise<void> {
    const usernameElement = await this.getElement(this.usernameInput);
    await usernameElement.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    const passwordElement = await this.getElement(this.passwordInput);
    await passwordElement.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    const button = await this.getElement(this.loginButton);
    await button.click();
  }

  async getErrorMessage(): Promise<string> {
    const errorElement = await this.getElement(this.errorMessage);
    return errorElement.textContent() || '';
  }

  async clickForgotPassword(): Promise<void> {
    const link = await this.getElement(this.forgotPasswordLink);
    await link.click();
  }

  async isErrorVisible(): Promise<boolean> {
    const errorElement = this.page.locator(this.errorMessage);
    return await errorElement.isVisible();
  }
}
