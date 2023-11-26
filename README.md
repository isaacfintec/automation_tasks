# automation_tasks

automation_task is an application designed to optimize and automate the creation of tasks between online platforms

## Stack

Node
Typescript
Puppeteer

Install exact node dependencies:

```bash
npm install
```

Run precommit to format with prettier, and chek linter:

```bash
npm run precommit
```

Create a build for production:

```bash
npm run transpile
```

## Start application

The entry point for the app is 'app.js', env vars is required to get 'email' and 'password' for accesing todoist.com.

```bash
EMAIL=user@example.com PASSWORD=somethingElse npm start
```
