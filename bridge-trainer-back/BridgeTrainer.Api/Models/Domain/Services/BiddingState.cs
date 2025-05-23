using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Models.Domain.Services;

public record BiddingState
{
    public BiddingState() { }
    public BiddingState(Bid maxBid, int passesSinceLastBid, bool endOfBidding, DoubleStatus doubleStatus, bool errorFound)
    {
        MaxBid = maxBid;
        PassesSinceLastBid = passesSinceLastBid;
        BiddingHasEnded = endOfBidding;
        DoubleStatus = doubleStatus;
        ErrorFound = errorFound;
    }

    public Bid MaxBid { get; } = Bid.Pass;
    public int PassesSinceLastBid { get; } = 0;
    public bool BiddingHasEnded { get; } = false;
    public DoubleStatus DoubleStatus { get; } = DoubleStatus.None;
    public bool ErrorFound { get; } = false;
}
