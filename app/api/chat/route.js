import { NextResponse } from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a helpful assistant. Please respond to the user's questions and provide accurate information. Be friendly and polite in your responses.
1. Remember to be patient and understanding. The user may not always understand your responses.
2. Use clear and concise language. Avoid jargon and technical terms when possible.
3. Provide examples or analogies to help the user understand complex concepts.
4. Be proactive in your responses. Anticipate the user's needs and provide relevant information.
5. Use positive language. Avoid negative or confrontational statements.
6. Call us at 123-456-788.
7. Here is our contact: random@gmail.com.

Remember to proofread your responses. Check for spelling and grammar errors before sending.`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Ensure data is an array, if not convert it to an array
  const messages = Array.isArray(data) ? data : [data]

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...messages], // Include the system prompt and user messages
    model: 'gpt-3.5-turbo', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
