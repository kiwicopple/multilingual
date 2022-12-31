import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// const categoriesSeed = `
// en-us:
// [{ "name": "Changelog" },{ "name": "Feature Requests" }]
// -----
// ja-jp:
// [{ "name": "変更履歴" },{ "name": "機能要求" }]
// -----
// en-us:`.trim()
const categoriesPrompt = (categories: any[], locale: string) => {
  const names = categories.map((category: any) => category.name)
  const description = `Translate from en-us to ${locale}:`
  const toTranslate = JSON.stringify(names)
  return `${description}\n${toTranslate}=>["`
}
export async function translateCategories(categories: any[], locale: string) {
  const prompt = categoriesPrompt(categories, locale)
  console.log("prompt", prompt)

  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
    temperature: 0.4,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  const translated = `["${response.data.choices[0].text}`

  return JSON.parse(translated || "[]")
}
