import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const router = express.Router();

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1', // Added /v1 to the base URL
    apiKey: process.env.VITE_OPEN_API_KEY // Changed from env() to process.env
});

router.get('/', async (req, res) => {
  try {
    // const recipeTitle = "Classic Scrambled Eggs";
    // const recipeInstructions =
    //   "1. Whisk 2 eggs with salt and pepper\n2. Heat butter in pan\n3. Cook eggs on low heat, stirring constantly\n4. Remove when slightly runny";
    // const question = "How can I make the eggs fluffier?";

    const {recipeTitle, recipeInstructions, question} = req.body;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat", // ✅ Make sure this model is correct and accessible with your key
      messages: [
        {
          role: "system",
          content: `You are a helpful cooking assistant specialized in this recipe:
          Title: ${recipeTitle}
          Instructions: ${recipeInstructions}`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.7,
    });

    // ✅ Log and return DeepSeek's response
    console.log(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to get response from AI",
      details: error.message,
    });
  }
});


export default router;




