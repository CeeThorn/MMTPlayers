// frontend/src/components/ReorderPanel.jsx
import React, { useState } from "react";
import youtubeIcon from "../assets/icons/youtube.png";
import twitchIcon from "../assets/icons/twitch.png";
import spotifyIcon from "../assets/icons/spotify.png";
import defaultIcon from "../assets/icons/default.png";



const ICONS = {
  youtube: youtubeIcon,
  twitch: twitchIcon,
  spotify: spotifyIcon,
  default: defaultIcon,
}


const PlayerIcon = ({ type }) => {
  const normalizedType = type ? type.toLowerCase().trim() : "";
  const src = ICONS[normalizedType] || ICONS.default;
  console.log("%c[PlayerIcon] raw type:", "color: orange;", type);
  console.log("%c[PlayerIcon] normalized type:", "color: yellow;", normalizedType);

  return (
    <img
      src={src}
       alt={normalizedType}
      style={{
        width: "40px",
        height: "40px",
        objectFit: "contain",
        borderRadius: "8px",
      }}
    />
  );

};

export default function ReorderPanel({ players, onSave, onCancel }) {
  const [gridPlayers, setGridPlayers] = useState([...players]);
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => setDragIndex(index);
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const newGrid = [...gridPlayers];
    [newGrid[dragIndex], newGrid[index]] = [newGrid[index], newGrid[dragIndex]];
    setGridPlayers(newGrid);
    setDragIndex(null);
  };
  const handleDragOver = (e) => e.preventDefault();

  const renderIcon = (player, index, className) => {
    console.log(
      "%c[ReorderPanel] Rendering icon for player:",
      "color: cyan;",
      player.name || player.url,
      "→ type:",
      player.type
    );

    return (
      <div
        key={player.id}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(index)}
        className={`${className} bg-gray-100 rounded-xl flex items-center justify-center cursor-move 
                    shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
      >
        <PlayerIcon type={player.type} />
      </div>
    );
  };

  const renderLayout = () => {
    switch (gridPlayers.length) {
      case 1:
        return (
          <div className="w-full h-64 flex items-center justify-center">
            {renderIcon(gridPlayers[0], 0, "w-full h-full")}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-2 w-full h-64">
            {gridPlayers.map((p, i) => renderIcon(p, i, "w-full h-full"))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-64">
            <div className="row-span-2">
              {renderIcon(gridPlayers[0], 0, "w-full h-full")}
            </div>
            <div>{renderIcon(gridPlayers[1], 1, "w-full h-full")}</div>
            <div>{renderIcon(gridPlayers[2], 2, "w-full h-full")}</div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-64">
            {gridPlayers.map((p, i) => renderIcon(p, i, "w-full h-full"))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-64">
            {gridPlayers.map((p, i) => renderIcon(p, i, "w-full h-32"))}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl p-6">
        <h2 className="text-gray-900 text-2xl font-semibold mb-4">
          Reorder Players
        </h2>

        {renderLayout()}

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(gridPlayers)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
