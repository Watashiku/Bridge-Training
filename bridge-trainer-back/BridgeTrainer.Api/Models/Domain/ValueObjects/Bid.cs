using BridgeTrainer.Api.Models.Domain.Services;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Bidding;

public abstract partial record Bid
{
    public abstract BiddingState ApplyAndValidate(BiddingState state);
    public static Bid Pass { get; } = new PassBid();
    public static Bid Double { get; } = new DoubleBid();
    public static Bid Redouble { get; } = new RedoubleBid();
    public static Bid Normal(int level, BidSuit suit) => new NormalBid(level, suit);
};
