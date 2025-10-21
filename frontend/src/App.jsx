import { useState, useEffect, useRef} from "react";

function App() {
    const [players, setPlayers] = useState([]);
    const [mixerVisible, setmixerVisible] = useState(false);
    const [reorderMode, setReorderMode] = useStae(false);
}

const playerRefs = useRef({});