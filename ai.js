import Anthropic from "@anthropic-ai/sdk"
import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

// Debug: Check if API keys are loaded
const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
const hfAccessToken = import.meta.env.VITE_HF_ACCESS_TOKEN

console.log("Environment variables check:")
console.log("VITE_ANTHROPIC_API_KEY:", anthropicApiKey ? "Present" : "Missing")
console.log("VITE_HF_ACCESS_TOKEN:", hfAccessToken ? "Present" : "Missing")

if (!anthropicApiKey) {
    throw new Error("Anthropic API key is missing. Please check your .env file.")
}

if (!hfAccessToken) {
    throw new Error("Hugging Face access token is missing. Please check your .env file.")
}

const anthropic = new Anthropic({
    apiKey: anthropicApiKey,
    dangerouslyAllowBrowser: true,
})

export async function getRecipeFromChefClaude(ingredientsArr) {
    try {
        const ingredientsString = ingredientsArr.join(", ")
        console.log("Sending request to Claude with ingredients:", ingredientsString)

        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
        });
        console.log("Received response from Claude")
        return msg.content[0].text
    } catch (error) {
        console.error("Claude API Error:", error)
        if (error.status === 401) {
            throw new Error("Invalid API key. Please check your Anthropic API key.")
        } else if (error.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.")
        } else {
            throw new Error(`API Error: ${error.message || "Unknown error"}`)
        }
    }
}

const hf = new HfInference(hfAccessToken)

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error("Mistral API Error:", err)
        if (err.status === 401) {
            throw new Error("Invalid API key. Please check your Hugging Face access token.")
        } else if (err.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.")
        } else {
            throw new Error(`API Error: ${err.message || "Unknown error"}`)
        }
    }
}
