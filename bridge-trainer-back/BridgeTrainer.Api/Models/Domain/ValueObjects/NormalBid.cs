using BridgeTrainer.Api.Models.Domain.Services;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Bidding;

public abstract partial record Bid
{
    public sealed record NormalBid(int Level, BidSuit Suit) : Bid
    {
        public override BiddingState ApplyAndValidate(BiddingState state)
        {
            var errorFound = false;
            if (IsOvercallOf(state.MaxBid))
            {
                errorFound = true;
            }
            return new BiddingState(this, 0, false, DoubleStatus.None, errorFound);
        }

        public bool IsOvercallOf(Bid other)
        {
            if (other is PassBid)
            {
                return true;
            }
            if (other is DoubleBid || other is RedoubleBid)
            {
                return false;
            }
            if (other is not NormalBid normalOther)
            {
                throw new ArgumentException($"Unknown Bid Type for {nameof(other)} - {other.GetType()} - {other}");
            }
            if (Level != normalOther.Level)
            {
                return Level > normalOther.Level;
            }
            return SuitRank(Suit) > SuitRank(normalOther.Suit);
        }

        private static int SuitRank(BidSuit s) => s switch
        {
            BidSuit.Club => 0,
            BidSuit.Diamond => 1,
            BidSuit.Heart => 2,
            BidSuit.Spade => 3,
            BidSuit.NoTrump => 4,
            _ => throw new ArgumentOutOfRangeException(nameof(s))
        };
    }
}