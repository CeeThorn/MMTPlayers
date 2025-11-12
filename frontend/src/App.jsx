<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useState, useEffect, useRef} from "react";
import { Routes, Route } from "react-router-dom";
import detectMediaTypeImport from "@/utils/detectMediaType";
import HomePage from "./components/Homepage";
import ReorderPanel from "./components/ReorderPanel";
import HomeComponents from "./components/HomeComponents";
import VolumeMixer from "./components/VolumeMixer";

function App() {
    const [players, setPlayers] = useState([]);
    const [mixerVisible, setmixerVisible] = useState(false);
    const [reorderMode, setReorderMode] = useStae(false);


const playerRefs = useRef({});

useEffect(() => {
    const saved = localStorage.getItem("savedPlayers");
    if (saved) {
        try {
    const parsed = JSON.parse(saved);
    //map() - built in method that creates a new array by applying a provided 
    // function to every element in the calling array.
    //.map() loops through the parsed array, passing each 
    // individual player object to the function as the variable p.
    const upgraded = parsed.map(player => {
        if (!player.type || player.type === "unknown") {
            return { ...player, type: detectMediaTypeImport(player.url) };
            //copying all properties of player and retyruning a new object
            //not changing the value of player though
        }
        return player;
    });
        setPlayers(upgraded);
        localStorage.setItem("savedPlayers", JSON.stringify(upgraded));
        } catch (err) { 
            console.error("Failed to parse saved players", err);

        //understand the returns better - 
    }
}

}, []);
//best thing i ccan do is use the old code that i can and only use if it is understood

const addPlayer = async (input) => {
    if (!input) return; 
    let url, providedType, name;
    if (typeof input === "string"){
        url = input;
    } else {
        url = input.url;
        providedType = input.type;  //type from the caases after url is passsed
        name = input.name || "Player";
    }
    console.log("[addPlayer] Raw input:", input);
    console.log("[addPlayer] URL:", url)
    
 const detectedType =  detectMediaTypeImport(url);
  console.log("[addPlayer] Detected type from detectMediaType:", detectedType)
    
    const finalType = providedType || detectedType || "unknown";
    console.log("[addPlayer] Final Type:", finalType);

    const newPlayer = {
        id: Date.now(),
        url,
        name: name || url,
        volume: 1,
        type: finalType,
        ref: null,
    };
  const savedPlayers = JSON.parse(localStorage.getItem("savedPlayers")) || [];
  const updated = [...savedPlayers, newPlayer];
  localStorage.setItem("savedPlayers", JSON.stringify(updated));



  console.log("[addPlayer] New player object:", newPlayer);

  setPlayers((prev) => {
    const updated = [...prev, newPlayer];
    localStorage.setItem("savedPlayers", JSON.stringify(updated));

    console.log("[addPlayer] Updated players list saved to localStorage:", updated);

    return updated;
  });
};

// Update ref for a player (pass from MediaPlayer)
  const updatePlayerRef = (id, ref) => {
    setPlayers(prev => prev.map(player => player.id === id ? { ...player, ref } : player));
    playerRefs.current[id] = ref;
  };

  // Delete a player
  const handleDeletePlayer = (id) => {
    setPlayers(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem("savedPlayers", JSON.stringify(updated));
      return updated;
    });
    delete playerRefs.current[id];
  };

  // Delete all
  const handleDeleteAll = () => {
    setPlayers([]);
    localStorage.removeItem("savedPlayers");
    playerRefs.current = {};
  };

    
// Save layout manually
const handleSaveLayout =  () => localStorage.setItem("savedPlayers", JSON.stringify(players));

// Toggle mixer
  const handleToggleMixer = () => setMixerVisible(v => !v);

  // Save new order from ReorderPanel
  const handleReorderSave = (newOrder) => {
    setPlayers(newOrder);
    localStorage.setItem("savedPlayers", JSON.stringify(newOrder));
    setReorderMode(false);
  };

  // Handle volume changes from mixer
  const handleVolumeChange = (id, vol) => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const updated = { ...p, volume: vol };
        const ref = playerRefs.current[id];

        if (!ref) return updated;

        // Apply volume to actual element
        if (ref instanceof HTMLVideoElement || ref instanceof HTMLAudioElement) {
          ref.volume = vol;
        } else if (ref.contentWindow && p.type === "youtube") {
          ref.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "setVolume", args: [vol * 100] }),
            "*"
          );
        } 
        return updated;
      })
    );


};
    return (
<>
 <HomeComponents
       
        onDeleteAll={handleDeleteAll}
        onSaveLayout={handleSaveLayout}
        onToggleMixer={handleToggleMixer}
        onAddPlayer={addPlayer}
        onToggleReorder={() => setReorderMode(r => !r)}
       
      >
        <Routes>
          <Route path="/" element={
            <HomePage
              players={players}
              onDeletePlayer={handleDeletePlayer}
              updatePlayerRef={updatePlayerRef} // pass function to attach refs
            />
          }/>
        
        
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            </div>
          }/>
        </Routes>
      </HomeComponents>
       {/* Volume Mixer */}
      {mixerVisible && (
        <div className="fixed bottom-4 right-4 bg-gray-900 p-4 rounded-lg shadow-lg z-50">
          <VolumeMixer
            players={players}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      )}

      {/* Reorder Panel */}
      {reorderMode && (
        <ReorderPanel
          players={players}
          onSave={handleReorderSave}
          onCancel={() => setReorderMode(false)}
        />
      )}

    </>
  );
}

export default App;
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> Stashed changes
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> Stashed changes
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> Stashed changes
