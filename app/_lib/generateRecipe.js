import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateRecipe(pantryName, servings) {
  const prompt = `
    Generate a detailed recipe based on the following details:

    Pantry Name: ${pantryName}
    Servings: ${servings}

    Include: Ingredients (with quantity and unit), step-by-step instructions, preparation time, cooking time, total time, and serving size.

   The response should be in the following JSON format:

    {
    "recipeName": "",
    "ingredients": [
        {
        "ingredientName": "",
        "quantity": "",
        "unit": ""
        }
    ],
    "instructions": "",
    "preparationTime": "",
    "cookingTime": "",
    "totalTime": "",
    "servingSize": "",
    }

    Return only the JSON object. Do not include any additional text or explanations.
    `;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates detailed and accurate recipes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    return {};
  }
}
