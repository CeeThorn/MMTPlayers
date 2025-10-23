// src/components/MediaPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
//import { Resizable } from "re-resizable";
import detectMediaType from "@/utils/detectMediaType";
import { setSpotifyVolume } from "../utils/spotify";
import Hls from "hls.js";
import getCrunchyrollEmbed from "../utils/getCrunchyrollEmbed";
import { Trash2 } from "lucide-react";

const MediaPlayer = ({ id, url, volume = 1, onDelete, updatePlayerRef }) => {
  const [type, setType] = useState("loading");
  const [showChat, setShowChat] = useState(false);
  const [hovered, setHovered] = useState(false);
  

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const ytRef = useRef(null);
  const twitchContainerRef = useRef(null);
  const twitchPlayerRef = useRef(null);



  // Detect media type
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let detected = await detectMediaType(url);
        if (detected){console.log("Detected type:", detected);}
        if (url.endsWith(".m3u8")) detected = "hls";
        if (mounted) setType(detected);
      } catch {
        if (mounted) setType("unsupported");
      }
    })();
    return () => { mounted = false; };
  }, [url]);

  // Apply volume
  useEffect(() => {
    if (type === "video" && videoRef.current) videoRef.current.volume = volume;
    if (type === "audio" && audioRef.current) audioRef.current.volume = volume;
    if (type === "hls" && videoRef.current) videoRef.current.volume = volume;

    if (type === "youtube" && ytRef.current?.contentWindow) {
      ytRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "setVolume", args: [volume * 100] }),
        "*"
      );
    }

    if (type === "spotify") {
      const token = localStorage.getItem("spotifyAccessToken");
      if (token) setSpotifyVolume(volume, token).catch(() => console.warn("Spotify volume failed"));
    }

    if (type === "twitch" && twitchPlayerRef.current) {
      twitchPlayerRef.current.setMuted(false);
      twitchPlayerRef.current.setVolume(volume);
    }
  }, [volume, type]);

  // HLS setup
  useEffect(() => {
    if (type === "hls" && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
      } else {
        videoRef.current.src = url;
      }
    }
  }, [url, type]);

  // Helper for Twitch parent
  const getTwitchParent = () => {
    const isDev = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    return isDev ? [window.location.hostname] : ["mmtplayer.com"];
  };

  // Twitch SDK
  useEffect(() => {
    if (type !== "twitch") return;

    const twitchInfo = extractTwitchInfo(url);
    if (!twitchInfo || !twitchContainerRef.current) return;

    function initTwitch() {
      const options = {
        width: "100%",
        height: "100%",
        parent: getTwitchParent(),
        autoplay: true,
      };

      if (twitchInfo.type === "vod") options.video = twitchInfo.id;
      else if (twitchInfo.type === "clip") options.clip = twitchInfo.id;
      else options.channel = twitchInfo.id;

      twitchPlayerRef.current = new window.Twitch.Player(
        twitchContainerRef.current,
        options
      );
      twitchPlayerRef.current.setVolume(volume);

      if (updatePlayerRef) updatePlayerRef(id, twitchPlayerRef.current);
    }

    if (!window.Twitch) {
      const script = document.createElement("script");
      script.src = "https://player.twitch.tv/js/embed/v1.js";
      script.async = true;
      script.onload = initTwitch;
      document.body.appendChild(script);
    } else {
      initTwitch();
    }

    return () => {
      if (twitchPlayerRef.current) {
        twitchPlayerRef.current.pause();
        twitchPlayerRef.current = null;
      }
    };
  }, [type, url]);

  // Report refs for other types
  useEffect(() => {
    if (!updatePlayerRef) return;
    if (type === "video" || type === "hls") updatePlayerRef(id, videoRef.current);
    if (type === "audio") updatePlayerRef(id, audioRef.current);
    if (type === "youtube") updatePlayerRef(id, ytRef.current);
  }, [type, videoRef.current, audioRef.current, ytRef.current, updatePlayerRef, id]);

  // --- Chat embeds ---
  const renderChat = () => {
    if (type === "twitch") {
      const channelMatch = url.match(/twitch\.tv\/([^/?]+)/);
      if (!channelMatch) return null;
      const channel = channelMatch[1];
      return (
        <iframe
          src={`https://www.twitch.tv/embed/${channel}/chat?parent=${getTwitchParent()[0]}`}
          height="100%"
          width="100%"
          frameBorder="0"
          title="Twitch Chat"
        />
      );
    }
    if (type === "youtube") {
      const vid = extractYouTubeId(url);
      if (!vid) return null;
      return (
        <iframe
          src={`https://www.youtube.com/live_chat?v=${vid}&embed_domain=${getTwitchParent()[0]}`}
          height="100%"
          width="100%"
          frameBorder="0"
          title="YouTube Chat"
          
        />
      );
    }
    return null;
  };

  // --- Main Player content ---
  let content;
  switch (type) {
    case "loading":
      content = <p className="text-white">Detecting media type...</p>;
      break;
    case "youtube":
      content = (
        <iframe
          ref={ytRef}
          src={`https://www.youtube.com/embed/${extractYouTubeId(url)}?enablejsapi=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="YouTube Player"
          style={{pointerEvents: 'none'}}
        />
      );
      break;
    case "twitch":
      content = <div ref={twitchContainerRef} 
       style={{ pointerEvents: 'none' }}
      className="w-full h-full" />;
      break;
    case "spotify":
      content = (
        <iframe
          className="w-full h-full"
          src={`https://open.spotify.com/embed${extractSpotifyPath(url)}`}
          allow="encrypted-media"
          title="Spotify Player"
          style={{pointerEvents: 'none'}}
        />
      );
      break;
    case "crunchyroll":
      content = (
        <iframe
          src={getCrunchyrollEmbed(url)}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Crunchyroll Player"
          style={{pointerEvents: 'none'}}
        />
      );
      break;

    
      case "cineby":
        content = (
   <iframe
      src={`http://localhost:5000/proxy?url=${encodeURIComponent(url)}`}
      className="w-full h-full"
      frameBorder="0"
      allow="autoplay; fullscreen; encrypted-media"
      allowFullScreen
      style={{pointerEvents: 'none'}}
    />


  );

  break;

  case "hianime":
  content = (
    <iframe
      src={url}
      className="w-full h-full"
      allow="autoplay; fullscreen"
      allowFullScreen
      title="HiAnime Player"
      style={{pointerEvents: 'none'}}
    />
  );
  break;

 

  case "google":
  content = (
    <iframe
  src={`http://localhost:5000/proxy?url=${encodeURIComponent(url)}`}
  className="w-full h-full"
  allow="autoplay; fullscreen"
  allowFullScreen
  style={{pointerEvents: 'none'}}
/>
  );
  break;

  case "browser":
  content = (
    <iframe
      src={`http://localhost:5000/proxy?url=${encodeURIComponent(url)}`}
      className="w-full h-full"
      frameBorder="0"
      allow="autoplay; fullscreen; encrypted-media"
      allowFullScreen
      title="Browser Player"
      style={{pointerEvents: 'none'}}
    />
  );
  break;



  case "hls":
  content = (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-cover"
       style={{ pointerEvents: 'none' }}

    >
      <source src={url} type="application/x-mpegURL" />
    </video>
  );
  break;

case "mp4":
case "video":
  content = (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-cover"
       style={{ pointerEvents: 'none' }}
    >
      <source src={url} type="video/mp4" /> 
    </video>
  );
  break;

    case "audio":
      content = (
        <audio ref={audioRef} controls 
        className="w-full"
         style={{ pointerEvents: 'none' }}
        >
          <source src={url} type="audio/mp3" />
        </audio>
      );
      break;


    default:
      content = <p className="text-white">Unsupported media type</p>;
  }

 return (
    <div
      className="relative w-full h-full flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

         

       <div className={`h-full relative z-0 ${showChat ? 'w-2/3' : 'w-full'}`}>
      {content}
    </div>

  

      {/* Chat */}
      {showChat && (type === "twitch" || type === "youtube") && (
        <div className="w-1/3 h-full border-l border-gray-700">
          {renderChat()}
        </div>
      )}
      {/* Delete button */}
      {hovered && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full 
          shadow-lg z-[60] button-control"
          >
            <Trash2 className="w-5 h-5" />
</button>
  )}

      {/* Chat toggle */}
      {hovered && (type === "twitch" || type === "youtube") && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="absolute bottom-12 right-4 px-3 py-2 bg-purple-600 hover:bg-purple-700
           text-white text-sm rounded-lg shadow-md z-[60] button-control"
        >
          {showChat ? "Hide Chat" : "Show Chat"}
        </button>
      )}
    </div>
  );
};

export default MediaPlayer;

// --- HELPERS ---
function extractYouTubeId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
  return match ? match[1] : "";
}

function extractTwitchInfo(url) {
  const vodMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
  if (vodMatch) return { type: "vod", id: vodMatch[1] };
  const clipMatch = url.match(/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/);
  if (clipMatch) return { type: "clip", id: clipMatch[1] };
  const channelMatch = url.match(/twitch\.tv\/([^/?]+)/);
  if (channelMatch) return { type: "channel", id: channelMatch[1] };
  return null;
}

function extractSpotifyPath(url) {
  const base = url.replace("https://open.spotify.com", "");
  return base.split("?")[0];
}