import puppeteer, { Browser, Page } from 'puppeteer';
import { TOperation, Reply } from './Interface';

abstract class PuppeteerScraping {
  doOperations: TOperation[] = [];
  page: Page | null = null;
  browser: Browser | null = null;
  process: {
    error?: string;
    status: boolean;
    data: { [key: string]: unknown };
  };

  constructor() {
    // this.doOperations = [];
    // this.page = null;
    // this.browser = null;
    this.process = {
      status: true,
      data: {},
    };
  }

  private async _initBrowser(): Reply<void> {
    const self = this;
    try {
      const browser = await puppeteer.launch({
        headless: false,
      });
      self.browser = browser;
      self.page = await self.browser.newPage();
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _initBrowser: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  // time in milliseconds
  private _delay(time?: number): Reply<number> {
    return new Promise((res) => {
      setTimeout(() => {
        res(time);
      }, time | 5000);
    });
  }

  private async close(): Reply<void> {
    const self = this;
    if (self.browser) {
      await self.browser.close();
    }
  }

  initBrowser(): PuppeteerScraping {
    const self = this;
    const operation = self._initBrowser.bind(self);
    self.doOperations.push(operation);
    return self;
  }

  // time in milliseconds
  delay(time?: number): PuppeteerScraping {
    const self = this;
    const operation = self._delay.bind(self, time);
    self.doOperations.push(operation);
    return self;
  }

  async exec() {
    const self = this;

    for (const operation of self.doOperations) {
      if (self.process.error) break;
      await operation();
    }

    await self.close();
    return self.process;
  }

  abstract initPage();
}

export default PuppeteerScraping;
