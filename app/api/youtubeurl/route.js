import fetchYouTubeVideoUrl from "@/app/_lib/fetchYoutubeUrl";

export async function POST(req) {
  try {
    const { query } = await req.json();

    const generatedUrl = await fetchYouTubeVideoUrl(query);

    return new Response(JSON.stringify({ content: generatedUrl }), {
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
