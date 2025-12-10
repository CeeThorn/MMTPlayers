export default async function getChannelName(url, type) {
  if (type === "youtube") {
    // Extract channel from YouTube URL (basic version)
    const match = url.match(/(youtube\.com\/(c|channel|@)[^\/]+)/);
    return match ? match[0].split("/").pop() : "YouTube Channel";
  }

  if (type === "twitch") {
    // Extract Twitch channel name
    const match = url.match(/twitch\.tv\/([^\/]+)/);
    return match ? match[1] : "Twitch Channel";
  }

  return "Unknown";
}
