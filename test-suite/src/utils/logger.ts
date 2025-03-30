export class Logger {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  info(message: string): void {
    console.log(`[INFO][${this.source}] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN][${this.source}] ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[ERROR][${this.source}] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG][${this.source}] ${message}`);
    }
  }
}