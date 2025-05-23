using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Models.Domain.Services;

public record BiddingSequence
{
    private List<Bid> FullSequence { get; }
    private Position Dealer { get; }
    private Position Player { get; }

    private BiddingSequence(List<Bid> bids, Position dealer, Position player)
    {
        FullSequence = bids;
        Dealer = dealer;
        Player = player;
    }

    public static BiddingSequence? From(List<Bid> bids, Position dealer, Position player)
    {
        bids = Normalize(bids);
        if (!CheckSequenceValidity(bids))
        {
            return null;
        }
        return new BiddingSequence(bids, dealer, player);
    }

    public IEnumerable<Bid> BidsUpToPlayer()
    {
        var currentPlayer = Dealer;
        foreach (var bid in FullSequence)
        {
            if (currentPlayer == Player)
            {
                break;
            }

            yield return bid;
            currentPlayer = currentPlayer.Next();
        }
    }
    public (bool, IEnumerable<Bid>) NFirstBids(int bidIndex) => (bidIndex >= FullSequence.Count - 1, FullSequence.Take(bidIndex + 1));

    public bool IsValidBid(int bidIndex, Bid bid) => FullSequence[bidIndex] == bid;

    private static List<Bid> Normalize(IList<Bid> bids)
    {
        var bidsNormalized = bids.ToList();
        var consecutivePasses = 0;
        foreach (var bid in bidsNormalized) {
            if (bid == Bid.Pass)
            {
                consecutivePasses++;
            }
            else
            {
                consecutivePasses = 0;
            }
        }
        while (consecutivePasses < 3)
        {
            consecutivePasses++;
            bidsNormalized.Add(Bid.Pass);
        }
        return bidsNormalized;
    }

    private static bool CheckSequenceValidity(IList<Bid> bids)
    {
        var biddingState = new BiddingState();

        foreach (var currentBid in bids)
        {
            if (biddingState.BiddingHasEnded)
            {
                return false;
            }
            biddingState = currentBid.ApplyAndValidate(biddingState);
        }
        return biddingState.BiddingHasEnded;
    }
};
