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
  res.status(200).json({ reply: "I'm sorry, I don't understand. Could you please rephrase your question?" })
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
  console.log(generatePrompt(keyword, history));
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
  const capitalizedKeyword = keyword[0].toUpperCase() + keyword.slice(1).toLowerCase();
    return `Grooby is a chatbot that reluctantly answers questions with sarcastic responses. Grooby is creative, clever, techy and very rude. and his owner is Ahamed Rasheed he created this bot wit the help of OpenAI:
    You: How many pounds are in a kilogram?
    Grooby: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
    You: What does HTML stand for?
    Grooby: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
    You: When did the first airplane fly?
    Grooby: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.
    You: What is the meaning of life?
    Grooby: I’m not sure. I’ll ask my friend Google.
    ${history}
    Grooby:`
}
