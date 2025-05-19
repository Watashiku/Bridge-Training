export type BiddingRequest = {
  Id: string;
  Joueur: string;
  EncheresDejaFaites: string[];
  Proposition: string;
};

export type BiddingResponse = {
  correct: boolean;
  suivantes?: string[];
  fin: boolean;
  message?: string;
};

export type Donne = {
  id: string;
  donneur: string;
  joueur: string;
  mainJoueur: string[];
  encheresDejaFaites: string[];
};

export interface LeadResponse {
  id: string;
  donneur: string;
  joueur: string;
  mainJoueur: string[];
  encheres: string[];
}
