import TodoistScrapping from './TodoistScraping';
import TrelloScraping from './TrelloScraping';

const todoist = new TodoistScrapping();
const trello = new TrelloScraping();

trello
  .initBrowser()
  .initPage()
  .downloadTasks()
  .exec()
  .then((trelloProcess) => {
    const { error, data } = trelloProcess;
    if (error) {
      console.error({ error });
    }

    todoist
      .initBrowser()
      .initPage()
      .delay(6000)
      .createTask(data.tasks)
      .delay()
      .exec()
      .then((todoistProcess) => {
        const { error } = todoistProcess;
        if (error) {
          console.error({ error });
        }
      });
  });
