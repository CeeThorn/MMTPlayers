// src/utils/detectMediaType.js
export default  function detectMediaType(url, fileType = null) {
 
  if (!url) return "unsupported";

  const lower = url.toLowerCase();

  // Local blobs (check fileType if provided)
  if (url.startsWith("blob:")) {
    if (fileType) {
      if (fileType.startsWith("audio")) return "audio";
      if (fileType.startsWith("video")) return "video";
    }
    return "video"; // fallback 
  }

  // File extension detection
  if (lower.endsWith(".mp3")) return "audio";
  if (lower.endsWith(".mp4")) return "video";
  
  // Platform checks
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("twitch.tv") || lower.includes("clips.twitch.tv")) return "twitch";
  if (lower.includes("soundcloud.com")) return "soundcloud";
  if (lower.includes("open.spotify.com")) return "spotify";
  if (lower.endsWith(".m3u8")) return "hls"; // HLS streams (Crunchyroll, anime, etc.)
  if (lower.includes("cineby.app")) return "cineby";
  if (lower.includes("hianime.to/watch")) return "hianime";
  
  


  return "unsupported";
}









