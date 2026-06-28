import OpenAI from "openai";

const {giminiApiKey} = useRuntimeConfig()

export const openai = new OpenAI({
    apiKey: giminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    maxRetries: 0,
});
