using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Models.Domain.Entities;

public record Deal(
    string Source,
    int Number,
    Dictionary<Position, Hand> Hands,
    Position Dealer,
    Vulnerability Vulnerability,
    List<Bid> Bids,
    Card Lead)
{
    public string Id => $"{Source}-{Number}";

    public Hand GetHand(Position position) => Hands[position];
}
