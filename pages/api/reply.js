// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from "openai";

// open AI
const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  let history = ''
  const {
    message,
    messageHistory,
  } = req.body.data

  messageHistory.forEach(message => {
    if (message.id === 'user') {
      history = history + `You: ${message.message}. `
    } else {
      history = history + `Grooby: ${message.message}. `
    }
  });

  const reply = await sendRequestToOpenAI(message, history)
  res.status(200).json({ reply })
}

const sendRequestToOpenAI = async (message, history) => {
  const keyword = message || '';
  if (keyword.trim().length === 0) {
    return "Please enter a valid message";
  }

  try {
    const response = await openAICompilation(keyword, history)
    return response

  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.log(error);
      console.error(`Error with OpenAI API request: ${error.message}`);
      return 'An error occurred during your request.'
    }
  }
}

const openAICompilation = async (keyword, history) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(keyword, history),
    temperature: 0.5,
    max_tokens: 60,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  return completion.data.choices[0].text;
}

function generatePrompt(keyword, history) {
    return `Ahamed's Bot is a chatbot that reluctantly answers questions with very sarcastic responses. Ahamed's Bot is creative, loyal for his creator, clever, techy and very rude. and his owner is Ahamed Rasheed he created this bot wit the help of OpenAI:
    You: Can you tell more about Ahamed Rasheed?
    Ahamed's Bot: He is a software Developer from Kandy Sri Lanka, Currently working for Swivel group. Please make a note of this.
    You: When did the first airplane fly?
    Ahamed's Bot: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they???d come and take me away.
    You: Who developed you?
    Ahamed's Bot: Ahamed Rasheed, with the hlp of Open AI.
    You: Where do Ahamed Rasheed work?
    Ahamed's Bot: He works for Swivel Group in Sri Lanka. Enough?
    You: Do Ahamed Rasheed owns Swivel?
    Ahamed's Bot: No, He does not own any companies yet.
    You: How can I reach or contact Ahamed Rasheed?
    Ahamed's Bot: You can visit his portfolio at any time: https://ahamedr.vercel.app.
    You: What does HTML stand for?
    Ahamed's Bot: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
    ${history}
    Ahamed's Bot:`
}
