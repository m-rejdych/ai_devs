const { getInput, getToken, submit } = require('./utils');

const TASK_NAME = 'blogger';

const main = async () => {
  const token = await getToken(TASK_NAME);
  const input = await getInput(token);

  const response = await fetch(process.env.COMPLETION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a good cook and you specialize in making pizzas. You are also a hobbyst blogger.',
        },
        {
          role: 'user',
          content: `We are going to prepare a blog post on how to make a Margheritta. I am going to give you an input array. Each element of input array is going to be a topic for different section of the blog post. Prepare "sections" array, where each element is a text content for each topic of the blog post that corresponds to respective topic from input array Answer in following json format:
{
  "sections": []
}
"sections" array should have the same length as an input array.

### INPUT
${JSON.stringify(input.blog)}`,
        },
      ],
    }),
  });

  const completionResult = await response.json();
  const answer = JSON.parse(
    completionResult.choices[0].message.content,
  ).sections;
  console.log('ANSWER', answer);

  const result = await submit(token, answer);
  console.log('RESULT', result);
};

module.exports = main;
