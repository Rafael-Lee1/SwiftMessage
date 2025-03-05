
export const fetchAIResponse = async (message: string): Promise<string> => {
  const response = await fetch('https://api.puter.com/v2/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in a chat application. Be concise and friendly.'
        },
        { role: 'user', content: message.slice(3).trim() }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
