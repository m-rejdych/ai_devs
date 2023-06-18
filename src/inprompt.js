const { getToken, getInput, submit } = require('./utils');

const TASK = 'inprompt';

const QUERIES = ['koloru', 'włosy', 'zawodu', 'śniadanie'];

const SCRAP_REGEXP =
  /(.+ ma )|( oczy,)|( włosy i pracuje jako)|(, a na śniadanie najbardziej lubi jeść)/gi;

const main = async () => {
  const token = await getToken(TASK);

  const { input, question } = await getInput(token);

  const splittedQuestion = question.split(' ');
  const name = splittedQuestion[splittedQuestion.length - 1].replace('?', '');
  if (!name) {
    throw new Error('Name not found');
  }

  const text = input.find((chunk) => chunk.includes(name));
  if (!text) {
    throw new Error(`${name} not found in input.`);
  }

  const answerIndex = QUERIES.findIndex((value) => question.includes(value));
  if (answerIndex === -1) {
    throw new Error(`Question type not found for: ${question}`);
  }

  const values = text
    .replace(SCRAP_REGEXP, '')
    .split(' ')
    .reduce((acc, item, index) => {
      if (index > 3) {
        acc[acc.length - 1] += ` ${item}`;
      } else {
        acc.push(item);
      }

      return acc;
    }, []);

  const result = await submit(token, values[answerIndex]);

  console.log(result);
};

module.exports = main;
