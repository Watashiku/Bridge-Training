const rankMap: Record<string, string> = {
  "Ace": "A",
  "King": "K",
  "Queen": "Q",
  "Jack": "J",
  "Ten": "10",
  "Nine": "9",
  "Eight": "8",
  "Seven": "7",
  "Six": "6",
  "Five": "5",
  "Four": "4",
  "Three": "3",
  "Deuce": "2",
};

const suitMap: Record<string, string> = {
  "Spade": "S",
  "Heart": "H",
  "Diamond": "D",
  "Club": "C",
  "NoTrump": "NT",
};

function mapCard(card: string): string {
  const rankMatch = card.match(/Rank\s*=\s*(\w+)/);
  const suitMatch = card.match(/Suit\s*=\s*(\w+)/);

  if (!rankMatch || !suitMatch) return "?";
  
  const rank = rankMap[rankMatch[1]] ?? "?";
  const suit = suitMap[suitMatch[1]] ?? "?";

  return `${rank}${suit}`;
}

function mapBid(bid: string): string {
  if (bid.includes("PassBid")) return "Passe";
  if (bid.includes("X")) return "Contre";
  if (bid.includes("Double")) return "Contre";
  if (bid.includes("XX")) return "Surcontre";
  if (bid.includes("Redouble")) return "Surcontre";

  const levelMatch = bid.match(/Level\s*=\s*(\d)/);
  const suitMatch = bid.match(/Suit\s*=\s*(\w+)/);

  if (!levelMatch || !suitMatch) return "?";

  const level = levelMatch[1];
  const suit = suitMap[suitMatch[1]] ?? "?";

  return `${level}${suit}`;
}

export {mapBid, mapCard};