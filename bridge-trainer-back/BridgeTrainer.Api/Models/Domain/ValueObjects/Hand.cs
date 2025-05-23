namespace BridgeTrainer.Api.Models.Domain.ValueObjects;

public record Hand
{
    public static Hand? TryCreate(List<Card> cards)
    {
        if (cards.Count != 13)
        {
            return null;
        }
        return new Hand(cards);
    }
    private Hand(List<Card> cards)
    {
        Cards = cards;
    }
    public List<Card> Cards { get; } = [];
};
