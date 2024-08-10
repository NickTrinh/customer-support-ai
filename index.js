import OpenAI from "openai"
import readline from "readline"; // Import the readline module

// Create an interface for input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

// Function to get user input
const getUserInput = () => {
    return new Promise((resolve) => {
        rl.question("Please enter your question: ", (input) => {
            resolve(input);
        });
    });
};

const main = async () => {
    const userInput = await getUserInput(); // Get user input
    const openai = new OpenAI();

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: userInput }, { role: "system", content: systemPrompt }],
        model: "gpt-3.5-turbo"
    });

    console.log(chatCompletion.choices[0].message);
    rl.close(); // Close the readline interface
};

main(); // Call the main function