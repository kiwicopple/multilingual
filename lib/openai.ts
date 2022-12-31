import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Takes an array of strings and returns an array of translated strings
export async function translateStrings(strings: string[], locale: string) {
  // Prepare the prompt
  const description = `Translate from en-us to ${locale}:`
  const toTranslate = JSON.stringify(strings)
  const prompt = `${description}\n${toTranslate}=>["`

  // Get the translated strings
  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const translated = `["${response.data.choices[0].text}`
  console.log("translated", translated)
  return JSON.parse(translated || "[]")
}
