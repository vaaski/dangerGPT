import { execa } from "execa"
import { Configuration, OpenAIApi } from "openai"
import prompts from "prompts"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const pretext = `
assume the user wants to run any code in the current directory.
generate necessary python code to solve the following problem:
`

const pythonCodeBlockRegex = /```(?:python)?([\S\s]+)```/
const getCodeFromMarkdown = (inputString: string) => {
  const match = inputString.match(pythonCodeBlockRegex)
  if (!match) return inputString
  return match[1]
}

try {
  const response = await prompts({
    type: "text",
    name: "value",
    message: "What problem would you like to solve with code?",
    validate: Boolean,
  })

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "you're a code-generator. do not explain anything, just return the code.",
      },
      {
        role: "user",
        content: pretext + response.value,
      },
    ],
  })

  const message = completion.data.choices[0].message
  if (!message) throw new Error("No message returned from OpenAI")

  console.log("executing:")
  console.log(getCodeFromMarkdown(message.content))

  await execa("python", ["-c", getCodeFromMarkdown(message.content)], {
    stdio: "inherit",
  })
} catch (error) {
  console.error(error)
}

export {}
