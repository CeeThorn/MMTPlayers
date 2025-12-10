// frontend/src/components/Homepage.jsx

import React, { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import MediaPlayer from "./MediaPlayer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "/src/styles/index.css";


const HomePage = ({ players, onDeletePlayer, spotifyToken }) => {
  // Use a ref to track the previous player count
  const prevPlayerCountRef = useRef(players.length);
  
  const [customized, setCustomized] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Generate default layout based on player count (updated to accept players)
  const generateDefaultLayout = (currentPlayers) => {

    const defaultProps = { 
        isResizable: true,
        isDraggable: true,
        draggableHandle: ".drag-handle" 
        
    };

    switch (currentPlayers.length) {
      case 1:
        return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 24, h: 24, isResizable: true  },
        ];
      case 2:
        return currentPlayers.map((p, i) => ({
          i: p.id.toString(),
          x: i * 12,
          y: 0,
          w: 12,
          h: 24,
          ...defaultProps //not needed for any of them
        }));
      case 3:
        return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 12, h: 17,...defaultProps },
          { i: currentPlayers[1].id.toString(), x: 12, y: 0, w: 11.7, h: 8.5,...defaultProps },
          { i: currentPlayers[2].id.toString(), x: 12, y: 12, w: 11.7, h: 8.5,...defaultProps },
        ];
      case 4:
        return currentPlayers.map((p, i) => ({
          i: p.id.toString(),
          x: (i % 2) * 12,
          y: Math.floor(i / 2) * 5, // originally  Math.floor(i / 2) * 12
          w: 11.7,
          h: 8.5,               // originally h: 12
          ...defaultProps
        }));
        case 5:
           return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[1].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[2].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[3].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[4].id.toString(), x: 12, y: 0, w: 11.7, h: 17,...defaultProps },
         
        ];

        case 6:
               return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[1].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[2].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[3].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[4].id.toString(), x: 12, y: 0, w: 5.5, h: 17,...defaultProps },
          { i: currentPlayers[5].id.toString(), x: 18, y: 0, w: 5.5, h: 17,...defaultProps },
         
        ];

        case 7:
               return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[1].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[2].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[3].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[4].id.toString(), x: 12, y: 0, w: 5.5, h: 17,...defaultProps },
          { i: currentPlayers[5].id.toString(), x: 18, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[6].id.toString(), x: 18, y: 0, w: 5.5, h: 8.5,...defaultProps },
         
        ];

        case 8:
               return [
          { i: currentPlayers[0].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[1].id.toString(), x: 0, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[2].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[3].id.toString(), x: 6, y: 12, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[4].id.toString(), x: 12, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[5].id.toString(), x: 18, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[6].id.toString(), x: 18, y: 0, w: 5.5, h: 8.5,...defaultProps },
          { i: currentPlayers[7].id.toString(), x: 12, y: 0, w: 5.5, h: 8.5,...defaultProps },
         
        ];


      default:
        return currentPlayers.map((p, i) => ({
          i: p.id.toString(),
          x: (i % 4) * 6,
          y: Math.floor(i / 4) * 6,
          w: 5.7, //originally 6
          h: 5.7, //originally 6
          ...defaultProps
        }));
    }
  };

  // Initialize layout correctly
  const [layout, setLayout] = useState(() => generateDefaultLayout(players));
  //const stableLayout = React.useMemo(() => [layout, [layout]]);

  // Update window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
  const prevCount = prevPlayerCountRef.current;
  const currentCount = players.length;

  if (currentCount > prevCount) {
    
    const newLayout =
      currentCount <= 8
        ? generateDefaultLayout(players)
        : players.map((p, index) => ({
            i: p.id.toString(),
            x: (index % 4) * 6,
            y: Math.floor(index / 4) * 6,
            w: 5.7,
            h: 5.7,
            isResizable: true,
            isDraggable: true,
            draggableHandle: ".drag-handle",
          }));

    setLayout(newLayout);
    setCustomized(false); // marks layout as base again
  } else if (currentCount === 0) {
   
    setLayout([]);
    setCustomized(false);
  }

  // Always update ref for next comparison
  prevPlayerCountRef.current = currentCount;
}, [players.length]);


//useEffect(() => {

  //if (players.length === 0) {
    //   setLayout([]);
   // setCustomized(false);
   // return;
 // }
 // if (players.length <= 7) {
    //think of this as like for num of nums put using a map
   // const newLayout = generateDefaultLayout(players);
   // setLayout(newLayout);
   // setCustomized(true);
  //} else {
  //  const newLayout = players.map((p, index) => ({
    //  i: p.id.toString(),
     // x: (index % 4) * 6,         
     // y: Math.floor(index / 4) * 6,
    //  w: 5.7,
    //  h: 5.7,
     // isResizable: true,
    ///  isDraggable: true,
   //   draggableHandle: ".drag-handle",

  //} ));
  //  setLayout(newLayout);
   // setCustomized(true); // mark layout as customized to prevent default reset

  //}
//}, [players]);





  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    // User interacted with the layout, so it is now customized
    setCustomized(true);
  };

  

  return (
    <div className="w-full h-full overflow-hidden p-2">
      <GridLayout
        className="layout"
        layout={layout}
        cols={24}
        rowHeight={windowSize.height / 24}
        width={windowSize.width - 20}
        onLayoutChange={handleLayoutChange}
        isResizable={true}
        isDraggable={true}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={true}
        draggableCancel=".react-resizable-handle, .button-control"
        resizableHandles= {["se", "sw", "ne", "nw", "n", "s", "e", "w"]} //{['se', 'sw', 'nw', 'ne']}
      >
        {players.map((p) => (
          <div
            key={p.id} {...p}
            className="rounded-lg overflow-hidden shadow-lg bg-black"
          >
            <div className="drag-handle absolute top-0 left-0 right-0 h-6 cursor-move z-20 opacity-0" />
            
            <MediaPlayer
              id={p.id}
              url={p.url}
              name={p.name || "Player"}
              type={p.type || "browser"}
              volume={p.volume}
              spotifyToken={spotifyToken}
              onDelete={() => onDeletePlayer(p.id)}
              channel={p.channel}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};


export default HomePage;


