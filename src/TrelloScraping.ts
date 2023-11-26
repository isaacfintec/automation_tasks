import { ElementHandle } from 'puppeteer';
import PuppeteerScraping from './Scraping';

class TrelloScraping extends PuppeteerScraping {
  readonly URL: string = 'https://trello.com/b/QvHVksDa/personal-work-goals';

  private async _homePage() {
    const self = this;
    const page = self.page;
    try {
      await page.goto(self.URL);
      await page.setViewport({ width: 1080, height: 1024 });
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _homePage: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  initPage(): TrelloScraping {
    const self = this;
    const operation = self._homePage.bind(self);
    self.doOperations.push(operation);
    return self;
  }

  private _processBatch(batch: ElementHandle[]): Promise<unknown>[] {
    const self = this;
    return batch.map(async (card: ElementHandle) => {
      try {
        const [titleElement] = await card.$$('a[data-testid=card-name]');
        const text = await titleElement.evaluate((node) => node.textContent);
        return text;
      } catch (error) {
        const err = error as Error;
        const message = `Unable to process _processBatch: ${err.message}`;
        self.process = { ...self.process, error: message, status: false };
        return '';
      }
    });
  }

  private async _downloadTasks(quantity: number) {
    const self = this;
    try {
      const page = self.page;
      const skipModal = 'button[data-testid="about-this-board-modal-cta-button"]';
      await page.waitForSelector(skipModal);
      await page.click(skipModal);

      const trelloCards = 'div[data-testid="trello-card"]';
      await page.waitForSelector(trelloCards);
      const cards = await page.$$(trelloCards);
      const batch = cards.splice(0, quantity);

      const resultPromises = self._processBatch(batch);
      const result = await Promise.all(resultPromises);
      self.process.data.tasks = result as string[];
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _downloadTasks: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  downloadTasks(quantity?: number) {
    const self = this;
    const operation = self._downloadTasks.bind(self, quantity || 5);
    self.doOperations.push(operation);
    return self;
  }
}

export default TrelloScraping;
