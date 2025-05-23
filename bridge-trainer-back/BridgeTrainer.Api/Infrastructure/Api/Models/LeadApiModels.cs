namespace BridgeTrainer.Api.Infrastructure.Api.Models;

public record LeadResponse(bool Correct, string? Message);
public record LeadRequest(string Id, string Carte);
public record LeadDescription(string id, string donneur, string joueur, string[] mainJoueur, string[] encheres);