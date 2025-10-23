
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

export default function HomeComponents({
  onAddPlayer,
  onSaveLayout,
  onDeleteAll,
  onToggleMixer,
  onToggleReorder,
  children,

}) {

  const [isOpen, setIsOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [pendingFile, setPendingFile] = useState(null);

const handleAdd = () => {
    // If a link is typed, use that
    if (linkInput) {
      onAddPlayer(linkInput);
      setLinkInput(""); // reset input
      return;
    }

    // If a file was selected via file picker, add it immediately
    if (pendingFile) {
      onAddPlayer(pendingFile);
      setPendingFile(null);
      return;
    }
  };

   return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md w-full">
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 border-2 border-black rounded-md"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>

          <h1 className="text-xl font-bold text-white">MMT Player</h1>

          {/* Input */}
          <div className="flex items-center gap-2 w-full max-w-md ml-4">
            <Input
              type="text"
              placeholder="Enter video/audio link or select a file"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onDoubleClick={() => fileInputRef.current?.click()}
              className="bg-white text-black placeholder-gray-500 border border-gray-400 focus:ring-0 focus:border-gray-500"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const blobUrl = URL.createObjectURL(file);
                const fileData = {
                  url: blobUrl,
                  name: file.name,
                  type: file.type.startsWith("audio") ? "audio" : "video",
                };

                // Add immediately
                onAddPlayer(fileData);

                // Reset input so the next file can be picked
                e.target.value = "";
              }}
            />
            <Button
              className="bg-[rgb(66,14,152)] hover:bg-[rgb(56,10,130)] text-white"
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-3">
          {/* Donate */}
          <Button
            className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => window.open("https://linktr.ee/ceethorn", "_blank")}
          >
            <Heart className="h-5 w-5" />
            <span className="hidden group-hover:inline">Donate</span>
          </Button>

          {/* Layout */}
          <Button
            className="group flex items-center gap-2 bg-[#0cd102] hover:bg-green-600 text-white"
            onClick={onToggleReorder}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden group-hover:inline">Layout</span>
          </Button>

          {/* Save */}
          <Button
            onClick={onSaveLayout}
            className="group flex items-center gap-2 bg-[#0cd102] hover:bg-green-600 text-white"
          >
            <Save className="h-5 w-5" />
            <span className="hidden group-hover:inline">Save</span>
          </Button>

          {/* Clear */}
          <Button
            onClick={onDeleteAll}
            className="group flex items-center gap-2 bg-[#d10819] hover:bg-red-700 text-white"
          >
            <Trash2 className="h-5 w-5" />
            <span className="hidden group-hover:inline">Clear</span>
          </Button>

          {/* Mixer */}
          <Button
            onClick={onToggleMixer}
            className="group flex items-center gap-2 bg-[#02d185] hover:bg-emerald-600 text-white"
          >
            <Sliders className="h-5 w-5" />
            <span className="hidden group-hover:inline">Mixer</span>
          </Button>
        </div>
      </header>

      {/* SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR PANEL */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-700 shadow-lg z-50 flex flex-col p-3 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onItemClick={() => setIsOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto w-full">
        <div className="flex-1 w-full">{children}</div>
      </main>
    </div>
  );
}