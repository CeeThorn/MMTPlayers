//Siderbar.jsx
import { Button } from "@/components/ui/button";
import { Home, Info, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ onItemClick }) {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-xl font-bold mb-6 text-white">My App</h1>
      <nav className="flex flex-col gap-2">
        <Button asChild className="justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition rounded-md" onClick={onItemClick}>
          <Link to="/"><Home className="mr-2 h-4 w-4" /> Home</Link>
        </Button>

        <Button asChild className="justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition rounded-md" onClick={onItemClick}>
          <Link to="/about"><Info className="mr-2 h-4 w-4" /> About</Link>
        </Button>

        <Button asChild className="justify-start text-gray-300 hover:bg-gray-800 hover:text-white transition rounded-md" onClick={onItemClick}>
          <Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
        </Button>
      </nav>
    </div>
  );
}
