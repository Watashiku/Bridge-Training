using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Results;
using BridgeTrainer.Api.Infrastructure.Api.Models;
using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Api.Mappers;

public class BiddingApiMapper : IBiddingApiMapper
{
    public BiddingDescription ToRandomBiddingResponse(BiddingExerciseResult domain) => new(
            domain.DealId,
            domain.Dealer.ToString(),
            domain.Vulnerability.ToString(),
            domain.Player.ToString(),
            [.. domain.Hand.Cards.Select(e => e.ToString())],
            [.. domain.StartBids.Select(e => e.ToString())]);

    public BiddingResponse ToPostBiddingResponse(SubmitBidForExerciseResult domain) => new(
            domain.Correct,
            domain.BidsToNextChoice?.Select(e => e.ToString()).ToList(),
            domain.SequenceEnded);

    public SubmitBidForExerciseCommand ToSubmitBidForExerciseCommand(BiddingRequest dto) => new(
            dto.Id,
            Position.East,
            dto.BidNumber,
            ParseBid(dto.Proposition));

    private static Bid ParseBid(string proposition) => proposition switch
    {
        "Pass" => Bid.Pass,
        "Passe" => Bid.Pass,
        "Contre" => Bid.Double,
        "Double" => Bid.Double,
        "X" => Bid.Double,
        "Surcontre" => Bid.Redouble,
        "Redouble" => Bid.Redouble,
        "XX" => Bid.Redouble,
        _ => Bid.Normal(proposition[0] - '0', ParseSuit(proposition[1..]))
    };

    private static BidSuit ParseSuit(string v) => v switch
    {
        "C" => BidSuit.Club,
        "D" => BidSuit.Diamond,
        "H" => BidSuit.Heart,
        "S" => BidSuit.Spade,
        "NT" => BidSuit.NoTrump,
        _ => throw new ArgumentOutOfRangeException(nameof(v), v, null)
    };
}
