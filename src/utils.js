const getToken = async (task) => {
  const response = await fetch(`https://zadania.aidevs.pl/token/${task}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apikey: process.env.AI_DEVS_API_KEY,
    }),
  });
  const res = await response.json();

  return res.token;
};

const getInput = async (token) => {
  const response = await fetch(`https://zadania.aidevs.pl/task/${token}`);

  return response.json();
};

const submit = async (token, answer) => {
  const response = await fetch(`https://zadania.aidevs.pl/answer/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answer,
    }),
  });

  return response.json();
};

module.exports = { getToken, getInput, submit };
