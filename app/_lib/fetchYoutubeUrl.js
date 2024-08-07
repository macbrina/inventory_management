const fetchYouTubeVideoUrl = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const maxResults = 1;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("q", query);
    url.searchParams.append("key", apiKey);
    url.searchParams.append("maxResults", maxResults);
    url.searchParams.append("type", "video");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const videos = data.items;

    if (videos.length > 0) {
      return `https://www.youtube.com/watch?v=${videos[0].id.videoId}`;
    }
    return "No relevant video found";
  } catch (error) {
    return "Error fetching video.";
  }
};

export default fetchYouTubeVideoUrl;
