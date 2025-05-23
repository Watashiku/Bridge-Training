import { BiddingRequest, Donne, LeadResponse } from "../models/types";

export async function fetchLead(): Promise<LeadResponse> {
  const res = await fetch('http://localhost:8080/api/exercice/lead');
  if (!res.ok) throw new Error('Erreur API');
  return res.json();
}

export async function sendLead(id: string, carte: string): Promise<{ correct: boolean; message?: string }> {
  const res = await fetch('http://localhost:8080/api/exercice/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, carte })
  });

  return res.json();
}

export async function fetchBidding(): Promise<Donne> {
  const res = await fetch('http://localhost:8080/api/exercice/bidding');
  if (!res.ok) throw new Error('Erreur API');
  return res.json();
}

export async function postBidding(payload: BiddingRequest) {
  return await fetch('http://localhost:8080/api/exercice/bidding', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });
}
