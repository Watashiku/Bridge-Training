namespace BridgeTrainer.Api.Models;

public record BiddingRequest(string Id, string Joueur, List<string> EncheresDejaFaites, string Proposition);
