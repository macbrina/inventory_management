import getSuggestionFromImage from "@/app/_lib/getSuggestionFromImage";

export async function POST(req) {
  try {
    const { base64Image } = await req.json();

    const generatedContent = await getSuggestionFromImage(base64Image);

    return new Response(JSON.stringify({ content: generatedContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
