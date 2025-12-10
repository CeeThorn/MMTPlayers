
export default function Overlapping(bounds, players) {
  const { x = 0, y = 0, width = 0, height = 0, id } = bounds;

  for (let p of players) {
    if (p.id === id) continue; // skip self
    const px = p.x || 0;
    const py = p.y || 0;
    const pw = p.width || 0;
    const ph = p.height || 0;

    const isOverlap = !(x + width <= px || x >= px + pw || y + height <= py || y >= py + ph);
    if (isOverlap) return true;
  }
  return false;
}
