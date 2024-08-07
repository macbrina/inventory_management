import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function getSuggestionFromImage(base64Image) {
  const prompt = `
    Identify the product in the provided image and give 10 suggestions for the name in an array. Also include the following information in the JSON format:
    - quantity
    - category
    - expiration date
    - brand
    - a short note about it
    - purchase date
    - default location

    Ensure the response is a JSON object structured as follows:
    {
    name: ["suggestion1", "suggestion2", ...],
    quantity: <number>,
    category: "<category>",
    expirationDate: "<expiration_date>",
    brand: "<brand>",
    notes: "<short_note>",
    purchaseDate: "<purchase_date>",
    location: "<default_location>"
    }
    Return only the JSON object. Do not include any additional text or explanations.
    `;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI that identifies the image user provides and gives information about it.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      model: "gpt-4-turbo",
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    return {};
  }
}
