import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import MediaPlayer from "./MediaPlayer";
import Overlapping from "./Overlapping"; 


const GRID_SIZE = 24;

const HomePage = ({ players, onDeletePlayer, updatePlayerRef, onLayoutChange }) => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  

  return (
    // The container for the Rnd elements needs position: relative
    <div 
      style={{ 
        position: 'relative', 
        width: windowSize.width, 
        height: windowSize.height,
       
        overflow: 'hidden' 
      }}
    >
      {/*  Iterate over the players array */}
      {players.map((player) => (
        <Rnd
          key={player.id}
          // Rnd gets the position/size from the central 'players' state in App.js
          size={{ width: player.width, height: player.height }}
          position={{ x: player.x, y: player.y }}

          //  Snapping setup (24x24 pixels)
          resizeGrid={[GRID_SIZE, GRID_SIZE]}
          dragGrid={[GRID_SIZE, GRID_SIZE]}

          
          bounds="parent" 

          // ----------------------------------------------------
          // 1. Resize Stop Handler with Overlap Check
          // ----------------------------------------------------
          onResizeStop={(e, direction, ref, delta, position) => {
            const newBounds = {
              id: player.id, // Include ID for the self-exclusion in the overlap check
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: position.x,
              y: position.y,
            };
            
            // Check for overlap against all other current players
            if (Overlapping(newBounds, players)) {
              console.log("Resize rejected: Overlap detected. Reverting to previous state.");
              // By returning, we prevent the state update, forcing Rnd to revert
              return; 
            }

            // If valid, pass the new data up to App.js to save the change
            onLayoutChange(player.id, newBounds);
          }}

          // ----------------------------------------------------
          // 2. Drag Stop Handler with Overlap Check
          // ----------------------------------------------------
          onDragStop={(e, data) => {
            const newBounds = {
              id: player.id,
              width: player.width,
              height: player.height,
              x: data.x, // Rnd provides the new snapped x/y directly
              y: data.y,
            };

            // Check for overlap
            if (Overlapping(newBounds, players)) {
              console.log("Drag rejected: Overlap detected. Reverting to previous state.");
              return;
            }
            
            // If valid, pass the new data up to App.js
            onLayoutChange(player.id, newBounds);
          }}
        >
          <MediaPlayer
            player={player}
            onDelete={onDeletePlayer}
            updatePlayerRef={updatePlayerRef}
          />
        </Rnd>
      ))}
    </div>
  );
};

export default HomePage;