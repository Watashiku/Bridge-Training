namespace BridgeTrainer.Api.Models;

public record BiddingResponse(bool Correct, List<string>? Suivantes, bool Fin, string? Message);
