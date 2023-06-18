require('dotenv').config();
const moderation = require('./moderation');
const inprompt = require('./inprompt');
const blogger = require('./blogger');
const scraper = require('./scraper');

const TASKS = { moderation, inprompt, blogger, scraper }

const main = () => {
  const [, , task] = process.argv;

  if (!task) throw new Error('No task name was specified.');

  if (!task in TASKS) {
    const taskNames = Object.keys(TASKS).join(', ');
    throw new Error(
      `Invalid task name - pick one of the following: ${taskNames}`,
    );
  }

  TASKS[task]();
};

main();
