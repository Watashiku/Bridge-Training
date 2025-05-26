export type BiddingRequest = {
  Id: string;
  BidNumber: number;
  Proposition: string;
};

export type BiddingResponse = {
  correct: boolean;
  nextBids?: string[];
  sequenceEnded: boolean;
};

export type Donne = {
  id: string;
  dealer: string;
  player: string;
  playerHand: string[];
  bidsUpToPlayer: string[];
};

export interface LeadResponse {
  id: string;
  donneur: string;
  joueur: string;
  mainJoueur: string[];
  encheres: string[];
}
