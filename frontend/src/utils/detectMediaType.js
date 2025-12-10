export default function detectMediaType(url, fileType = null) {
  if (!url) return "unsupported";

  // Handle proxied URLs
  try {
    const urlObj = new URL(url, window.location.origin);
    if (urlObj.searchParams.get("url")) url = urlObj.searchParams.get("url");
  } catch (e) {}

  const lower = url.trim().toLowerCase();


    // Platforms
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("twitch.tv") || lower.includes("clips.twitch.tv")) return "twitch";
  if (lower.includes("soundcloud.com")) return "soundcloud";
  if (lower.includes("open.spotify.com")) return "spotify";
  if (lower.includes("crunchyroll.com")) return "crunchyroll";
  if (lower.endsWith(".m3u8")) return "hls";
  if (lower.includes("cineby.app")) return "cineby";
  if (lower.includes("hianime.to/watch")) return "hianime";
  if (lower.includes("google.com")) return "google";

  // Local blobs
  if (lower.startsWith("blob:")) {
    if (fileType?.startsWith("audio")) return "audio";
    if (fileType?.startsWith("video")) return "video";
    return "video";
  }



  // File extensions
  if (lower.endsWith(".mp3")) return "audio";
  if (lower.endsWith(".mp4")) return "video";



  return "unsupported";
}
