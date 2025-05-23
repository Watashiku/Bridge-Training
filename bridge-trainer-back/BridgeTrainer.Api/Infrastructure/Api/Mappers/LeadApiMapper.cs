using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Results;
using BridgeTrainer.Api.Infrastructure.Api.Models;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Api.Mappers;

public class LeadApiMapper : ILeadApiMapper
{
    public LeadDescription ToRandomLeadResponse(LeadExerciseResult domain) => new(
            id: domain.DealId,
            joueur: domain.Player.ToString(),
            donneur: domain.Dealer.ToString(),
            mainJoueur: [.. domain.Hand.Cards.Select(e => e.ToString())],
            encheres: [.. domain.Bids.Select(e => e.ToString())]
        );

    public LeadResponse ToPostLeadResponse(SubmitLeadCardResult domain) => new(domain.Correct, null);

    public SubmitLeadCardCommand ToSubmitLeadForExerciseCommand(LeadRequest dto) => new(
            dto.Id,
            ParseCard(dto.Carte));

    private static Card ParseCard(string cardName)
    {
        var rank = cardName[0] switch
        {
            'A' => Rank.Ace,
            'K' => Rank.King,
            'Q' => Rank.Queen,
            'J' => Rank.Jack,
            '1' => Rank.Ten,
            '9' => Rank.Nine,
            '8' => Rank.Eight,
            '7' => Rank.Seven,
            '6' => Rank.Six,
            '5' => Rank.Five,
            '4' => Rank.Four,
            '3' => Rank.Three,
            '2' => Rank.Deuce,
            _ => throw new ArgumentOutOfRangeException(nameof(cardName), cardName, null)
        };

        var suit = ParseSuit(cardName[^1].ToString());

        return new Card(rank, suit);
    }

    private static Suit ParseSuit(string v) => v switch
    {
        "C" => Suit.Club,
        "D" => Suit.Diamond,
        "H" => Suit.Heart,
        "S" => Suit.Spade,
        _ => throw new ArgumentOutOfRangeException(nameof(v), v, null)
    };
}
