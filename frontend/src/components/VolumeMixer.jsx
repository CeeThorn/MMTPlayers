// src/components/VolumeMixer.jsx
import React, { useEffect, useRef } from "react";

// Detect player type by URL/ref
// function
const detectPlayerType = (player) => {
  if (!player || !player.ref) return "unknown";

  if (player.url?.includes("youtube.com")) return "youtube";
  if (player.url?.includes("twitch.tv")) return "twitch";
  if (player.url?.includes("spotify.com")) return "spotify";
  if (player.url?.includes("cineby.app")) return "cineby";


  if (player.ref?.tagName === "VIDEO") return "video";
  if (player.ref?.tagName === "AUDIO") return "audio";
  if (player.type === "hls") return "hls";

  return "unknown";


};

//when u pass something as a prop you dont need to define it in the function
 //console.log();
 //object - prop - method     (a prop can also be an object)

//function - react functional component
const VolumeMixer = ({ players, onVolumeChange }) => {
  const twitchPlayers = useRef({}); // store Twitch.Player instances
  //creates empty ref object to store Twitch player instances
  //React creates one ref object and keeps it the same across renders.

  // Load Twitch SDK once
  //It’s a React Hook call. Inside it, you pass a function (the () => { ... } arrow function) as an argument.
  //if a twitch player is loade on the page, it will load the twitch sdk which is a script from twitch
  //window is a global/built in object in browsers that represenrs the browser window
  //built in does not mean global - .Twitch is a global property added by the Twitch SDK script
  useEffect(() => {
    if (!window.Twitch) {
      //1.create a new <script> element-makes it equal to const script var
      //2. using script.src to set the source of the script to the twitch sdk url
      //3. script.async=true makes the script load asynchronously so it does not block the rest of the page from loading
      //4. document.body.appendChild(script) appends the script to the body of 
      // the document so it gets loaded and executed by the browser
      const script = document.createElement("script");
      script.src = "https://player.twitch.tv/js/embed/v1.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  //id unique id, event is the event object from the input range slider
  //(event.target.value) - current value of the slide,  parseFloat-converts it into a number so you can use it for
  //  volume calculations (volume expects a numeric value between 0 and 1).
  //onVolumeChange(id, vol); - callback function passed as a prop to VolumeMixer component
  // Passing id and vol ensures the correct player’s volume is updated in the React state

  //parseFloat() is a built-in JavaScript function used to parse 
  // (read and interpret) a string and return it as a floating-point number (a number that can have a decimal point).
  //event is a javascript option that acts as a container of information that allows your JavaScript code to control
  //  the outcome of a user action.
  //i dont the function in here because onVolumeChange is being passed as a prop
  const handleChange = async (id, event) => {
    const vol = parseFloat(event.target.value);
    onVolumeChange(id, vol);

    //function player is finding the player in the array of players by matching the id,if no 
    //id is found it returns nothing
    const player = players.find((p) => p.id === id);
    if (!player) return;

    //its puts the function in a variable called type so u xan use it in the switch statement
    const type = detectPlayerType(player);
    console.log(`Changing volume for ${id} (${type}) →`, vol);

    switch (type) {
      case "video":
      case "audio":
      case "hls":
        if (player.ref) player.ref.volume = vol;
        break;
//youtube embeds are iframes so we cant directly change the volume
//instead we use Youtube's JS API by sending a postMessage to the iframe, volume in it is scalled 0-100
//An <iframe> in HTML is basically a “window inside a window.contentWindow gives 
// you access to the JavaScript context of that iframe.
//You cannot access elements inside the iframe directly if it’s on a different domain (cross-origin),
//  but you can send messages to it via postMessage
//player.ref.contentWindow.postMessage(...) sends the message directly to the iframe’s 
// JavaScript context (the YouTube player).
      case "youtube":
        if (player.ref?.contentWindow) {
          player.ref.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "setVolume", args: [vol * 100] }),
            "*"
          );
        }
        break;

      case "twitch":
        if (window.Twitch && player.ref?.id) {
          if (!twitchPlayers.current[player.id]) {
            twitchPlayers.current[player.id] = new window.Twitch.Player(player.ref.id, {
              channel: player.url.split("/").pop(),
              width: 0,
              height: 0,
              autoplay: false,
              muted: false,
            });
          }
          try {
            twitchPlayers.current[player.id].setVolume(vol);
          } catch (e) {
            console.warn("Twitch setVolume failed", e);
          }
        }
        break;

    

      default:
        console.warn("Volume control not implemented for type:", type);
    }
  };

  if (!players || players.length === 0) {
    return <p className="text-white">No players loaded</p>;
  }

  return (
    <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
      {players.map((p) => (
        <div key={p.id} className="flex items-center gap-2">
          <span className="text-white truncate max-w-xs">{p.url}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={p.volume}
            onChange={(e) => handleChange(p.id, e)}
            className="flex-1"
          />
          <span className="text-white w-10 text-right">{Math.round(p.volume * 100)}</span>
        </div>
      ))}
    </div>
  );
};

export default VolumeMixer;
