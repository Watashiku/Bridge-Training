using BridgeTrainer.Api.Models.Domain.Services;

namespace BridgeTrainer.Api.Infrastructure.Bidding;

public abstract partial record Bid
{
    private sealed record PassBid : Bid
    {
        public override BiddingState ApplyAndValidate(BiddingState state)
        {
            var passes = state.PassesSinceLastBid + 1;
            var endOfBidding = false;
            if (passes == 3 && state.MaxBid != Pass)
            {
                endOfBidding = true;
            }
            if (passes > 3)
            {
                endOfBidding = true;
            }
            return new BiddingState(state.MaxBid, passes, endOfBidding, state.DoubleStatus, false);
        }
    }
}