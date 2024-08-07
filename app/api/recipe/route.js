import generateRecipe from "@/app/_lib/generateRecipe";

export async function POST(req) {
  try {
    const { pantryName, servings } = await req.json();

    const generatedContent = await generateRecipe(pantryName, servings);

    return new Response(JSON.stringify({ content: generatedContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Recipe Error Api: ", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
