import * as env from './env';
import PuppeteerScraping from './Scraping';

class TodoistScrapping extends PuppeteerScraping {
  readonly URL: string = 'https://app.todoist.com/auth/login';

  private async _login() {
    const { TODO_USERNAME, TODO_PASSWORD } = env;
    const self = this;
    const page = self.page;
    try {
      await page.goto(self.URL);
      await page.setViewport({ width: 1080, height: 1024 });

      const emailInput = 'input[type=email]';
      const passwordInput = 'input[type=password]';
      const submitButton = 'button[type=submit]';

      await page.waitForSelector(emailInput);
      await page.waitForSelector(passwordInput);
      await page.waitForSelector(submitButton);

      await page.type('input[type=email]', TODO_USERNAME);
      await page.type('input[type=password]', TODO_PASSWORD);
      await page.click(submitButton);
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _login: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  initPage() {
    const self = this;
    const operation = self._login.bind(self);
    self.doOperations.push(operation);
    return self;
  }

  private async _addTask(task: string) {
    const self = this;
    try {
      const [newTaskButton] = await self.page.$$('.task_actions');
      if (newTaskButton) {
        await newTaskButton.click();
      }
      const [textBoxHeader] = await self.page.$$('div[role=textbox] > p');
      await textBoxHeader.type(task);
      const [submitButton] = await self.page.$$('button[data-testid=task-editor-submit-button]');
      await submitButton.click();
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _addTask: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  private async _createTasks(tasks: string[]) {
    const self = this;
    try {
      for (const task of tasks) {
        await self._addTask(task);
      }
    } catch (error) {
      const err = error as Error;
      const message = `Unable to process _createTasks: ${err.message}`;
      self.process = { ...self.process, error: message, status: false };
    }
  }

  createTask(tasks: string[]) {
    const self = this;
    const operation = self._createTasks.bind(self, tasks);
    self.doOperations.push(operation);
    return self;
  }
}

export default TodoistScrapping;
