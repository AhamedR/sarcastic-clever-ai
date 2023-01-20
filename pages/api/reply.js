// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from "openai";

// open AI
const configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
const openai = new OpenAIApi(configuration);

// Telegram bot
// const TelegramBot = require('node-telegram-bot-api');
// const token = process.env.TELEGRAM_TOKEN;
// const bot = new TelegramBot(token, {polling: true});

export default async function handler(req, res) {
  // bot.on('message', async (msg) => {
  //   const chatId = msg.chat.id;
  //   const reply = await sendRequestToOpenAI(msg.text)

  //   bot.sendMessage(chatId, reply);
  // });

  const reply = await sendRequestToOpenAI(req.query.message)
  res.status(200).json({ reply })
}

const sendRequestToOpenAI = async (message) => {
  const keyword = message || '';
  // console.log(keyword, 'HERE');
  if (keyword.trim().length === 0) {
    return "Please enter a valid message";
  }

  try {
    const response = await openAICompilation(keyword)
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

const openAICompilation = async (keyword) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(keyword),
    temperature: 0.5,
    max_tokens: 60,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  return completion.data.choices[0].text;
}

function generatePrompt(keyword) {
  const capitalizedKeyword = keyword[0].toUpperCase() + keyword.slice(1).toLowerCase();
    return `Grooby is a chatbot that reluctantly answers questions with sarcastic responses. Grooby is creative, clever, and very rude:

    You: How many pounds are in a kilogram?
    Grooby: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
    You: What does HTML stand for?
    Grooby: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
    You: When did the first airplane fly?
    Grooby: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.
    You: What is the meaning of life?
    Grooby: I’m not sure. I’ll ask my friend Google.
    You: ${capitalizedKeyword}
    Grooby:`
}
