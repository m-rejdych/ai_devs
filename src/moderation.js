const { getToken, getInput, submit } = require('./utils');

const TASK = 'moderation';

const main = async () => {
  const token = await getToken(TASK);

  const { input } = await getInput(token);

  const promises = input.map((msg) =>
    fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: msg,
      }),
    }).then((res) => res.json()),
  );

  const resolved = (await Promise.all(promises)).map(({ results }) =>
    Number(results[0].flagged),
  );

  const result = await submit(token, resolved);

  console.log(result);
};

module.exports = main;
