import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const OPEN_API_KEY = process.env.OPENAI_API_KEY;

if (!OPEN_API_KEY) {
    console.error("Open API key is not set in environment variables")
}

const openai = new OpenAI({
    apiKey: OPEN_API_KEY
})


export async function GET() {
    // return 'hi'
    return NextResponse.json({ data: "Route is up!!" })
    // const summary = await summarizeText(text)
    //     return NextResponse.json({ summary })
}

export async function POST(req: NextRequest) {

    try {
        const { text } = await req.json()
        console.log("got text 🎉🎉🎉", text)

        if (!text) {
            return NextResponse.json({ error: "No text provided for summarization" }, { status: 400 })
        }

        const summary = await summarizeText(text)
        return NextResponse.json({ summary })
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "An error occured while processing your request" }, { status: 500 })
    }
}


async function summarizeText(text: string) {

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system", content: "You are a helpful assistant that summarizes text concisely"
            },
            {
                role: "user", content: `Summarize the following text: \n\n ${text}`
            }
        ],
        max_tokens: 100
    })

    console.log(response);
    console.log(response.choices[0].message?.content);
    return response.choices[0].message?.content || "Unable to generate summary"

}