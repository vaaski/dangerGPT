import { Configuration, OpenAIApi } from "openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: `This is a test. Reply with 'longus amongus' and nothing else.`,
    },
  ],
})
console.log(completion.data.choices[0].message)

export {}
