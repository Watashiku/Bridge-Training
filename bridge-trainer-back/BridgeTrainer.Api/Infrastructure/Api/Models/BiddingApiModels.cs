namespace BridgeTrainer.Api.Infrastructure.Api.Models;

public record BiddingDescription(
    string Id,
    string Dealer,
    string Vulnerability,
    string Player,
    string[] PlayerHand,
    string[] BidsUpToPlayer);
public record BiddingRequest(string Id, int BidNumber, string Proposition);
public record BiddingResponse(bool Correct, List<string>? NextBids, bool SequenceEnded);