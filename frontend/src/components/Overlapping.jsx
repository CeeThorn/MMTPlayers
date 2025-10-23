// Overlapping.jsx
const isOverlapping = (newBounds, allPlayers) => {
    // We expect newBounds to have {id, x, y, width, height}
    const { id, x, y, width, height } = newBounds;

    const newX1 = x;
    const newY1 = y;
    const newX2 = x + width;
    const newY2 = y + height;

    for (const existingPlayer of allPlayers) {
        // 1. Skip comparing the item to itself
        if (existingPlayer.id === id) continue;

        // 2. Get the bounds of the existing item
        const existingX1 = existingPlayer.x;
        const existingY1 = existingPlayer.y;
        const existingX2 = existingPlayer.x + existingPlayer.width;
        const existingY2 = existingPlayer.y + existingPlayer.height;

        // 3. Collision Check (A is NOT separated from B)
        const isSeparated = 
            newX2 <= existingX1 || // A is left of B
            newX1 >= existingX2 || // A is right of B
            newY2 <= existingY1 || // A is above B
            newY1 >= existingY2;  // A is below B

        // If they are NOT separated, they must be overlapping.
        if (!isSeparated) {
            return true; // Overlap detected!
        }
    }
    return false; // No overlaps found
};

export default isOverlapping;