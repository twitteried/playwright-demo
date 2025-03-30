import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export class ProductsPage extends BasePage {
  // Selectors
  private readonly productsList = '.products-list';
  private readonly productItem = '.product-item';
  private readonly productName = '.product-name';
  private readonly productPrice = '.product-price';
  private readonly productCategory = '.product-category';
  private readonly addToCartButton = 'button.add-to-cart';
  private readonly filterDropdown = '#category-filter';
  private readonly sortDropdown = '#sort-options';
  private readonly searchInput = '#product-search';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/products');
  }

  async getProductCount(): Promise<number> {
    const products = await this.page.locator(this.productItem);
    return await products.count();
  }

  async getProductDetails(index: number): Promise<Product> {
    const products = await this.page.locator(this.productItem).all();
    
    if (index >= products.length) {
      throw new Error(`Product index ${index} is out of bounds. Only ${products.length} products available.`);
    }
    
    const product = products[index];
    const id = await product.getAttribute('data-product-id') || '';
    const name = await product.locator(this.productName).textContent() || '';
    const priceText = await product.locator(this.productPrice).textContent() || '0';
    const category = await product.locator(this.productCategory).textContent() || '';
    
    // Extract numeric price from string like "$10.99"
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    return { id, name, price, category };
  }

  async addProductToCart(index: number): Promise<void> {
    const products = await this.page.locator(this.productItem).all();
    
    if (index >= products.length) {
      throw new Error(`Product index
