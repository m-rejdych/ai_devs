const { getInput, getToken, submit } = require('./utils');

const TASK_NAME = 'scraper';

const main = async () => {
  const token = await getToken(TASK_NAME);

  const sourceResponse = await fetch(
    'https://zadania.aidevs.pl/text_pasta_history.txt',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    },
  );
  const source = await sourceResponse.text();

  if (source.includes('error')) {
    const msg = 'Could not read article due to server error.';
    const result = await submit(token, msg);
    console.log(result);
  } else {
    const input = await getInput(token);

    const completionResponse = await fetch(process.env.COMPLETION_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `${input.msg}

### ARTICLE
${source}`,
          },
          {
            role: 'user',
            content: input.question,
          },
        ],
      }),
    });

    const completion = await completionResponse.json();
    const answer = completion.choices[0].message.content;
    const result = await submit(token, answer);
    console.log(input.msg, input.question, answer);
    console.log(result);
  }
};

module.exports = main;
