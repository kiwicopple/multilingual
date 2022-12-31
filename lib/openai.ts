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
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const translated = `["${response.data.choices[0].text}`
  // console.log("translated", translated)
  return JSON.parse(translated || "[]")
}

// Takes a large block of text the translated value
export async function translateMarkdown(string: string, locale: string) {
  try {
    let description = ``
    description += `Translate from en-us to ${locale}.\n`
    description += `All markdown and formatting should be unchanged.\n`
    description += `Do not translate anything that looks like programming code:\n`
    const prompt = `${description}\n-----\n` + string
    // console.log("prompt", prompt)

    // Get the translated string
    const response = await openai.createCompletion({
      prompt,
      model: "text-davinci-003",
      temperature: 0.3,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const translated = response.data.choices[0].text
    return translated
  } catch (error) {
    const e = error as Error
    console.error("Error in translateHTML():", e.message)
    return null
  }
}
