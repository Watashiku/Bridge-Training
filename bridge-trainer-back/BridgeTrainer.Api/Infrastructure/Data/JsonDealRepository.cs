using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.Entities;
using BridgeTrainer.Api.Models.Domain.ValueObjects;
using System.Drawing;
using System.Text.Json;

namespace BridgeTrainer.Api.Infrastructure.Data;

public class JsonDealRepository : IDealRepository
{
    private readonly Deal[] _deals;
    private readonly Random _random = new();
    public JsonDealRepository() =>
        // Todo Get path from configuration
        _deals = [.. GetDeals()];
    public Deal GetById(string dealId) => _deals.Single(deal => deal.Id == dealId);
    public Deal GetRandom() => _deals[_random.Next() % _deals.Length];
    private static IEnumerable<Deal> GetDeals()
    {
        var path = Path.Combine("Infrastructure", "Data", "data.json");
        var raw = File.ReadAllText(path);

        using var doc = JsonDocument.Parse(raw);

        foreach (var entry in doc.RootElement.EnumerateObject())
        {
            var source = Path.GetFileNameWithoutExtension(entry.Name);
            foreach (var donneJson in entry.Value.EnumerateArray())
            {
                var dto = JsonSerializer.Deserialize<DealDto>(donneJson.GetRawText())!;
                var deal = TryCreateDeal(source, dto);
                if (deal is not null)
                {
                    yield return deal;
                }
            }
        }
    }

    private static Deal? TryCreateDeal(string source, DealDto dto)
    {
        if (!ParseHands(dto.Cartes, out var hands))
        {
            return null;
        }
        return new Deal(
            source,
            dto.DonneNo,
            hands,
            ParsePosition(dto.Donneur),
            ParseVulnerability(dto.Vulnerabilite),
            [.. dto.Encheres.Select(ParseBid)],
            ParseCard(dto.Entame));
    }

    private static bool ParseHands(Dictionary<string, List<string>> hands, out Dictionary<Position, Hand> output)
    {
        var suits = new[] { '♠', '♥', '♦', '♣' };
        output = [];
        var firstParsing = hands.ToDictionary(
            x => ParsePosition(x.Key),
            x => Hand.TryCreate([.. x
                .Value
                .SelectMany((el, i) => el
                    .Split()
                    .Select(z => $"{z}{suits[i]}"))
                .Select(ParseCard)]));

        if (firstParsing.ContainsValue(null))
        {
            return false;
        }

        output = firstParsing.ToDictionary(x => x.Key, x => x.Value!);
        return true;
    }

    private static Vulnerability ParseVulnerability(string vulnerability) => vulnerability switch
    {
        "Personne" => Vulnerability.None,
        "Sud" => Vulnerability.NorthSouth,
        "Ouest" => Vulnerability.EstWest,
        "Tous" => Vulnerability.All,
        _ => Vulnerability.None
    };

    private static Bid ParseBid(string bid) => bid switch
    {
        "Fin" => Bid.Pass,
        "Passe" => Bid.Pass,
        "X" => Bid.Double,
        "Contre" => Bid.Double,
        "XX" => Bid.Redouble,
        "Surcontre" => Bid.Redouble,
        _ => ParseNormalBid(bid)
    };

    private static Bid ParseNormalBid(string bid)
    {
        var level = bid[0] - '0';
        var suit = bid[^1] switch
        {
            '♠' => BidSuit.Spade,
            '♥' => BidSuit.Heart,
            '♦' => BidSuit.Diamond,
            '♣' => BidSuit.Club,
            'A' => BidSuit.NoTrump,
            _ => throw new ArgumentOutOfRangeException(nameof(bid), bid, null)
        };
        return Bid.Normal(level, suit);
    }

    private static Card ParseCard(string cardName)
    {
        var rank = cardName[0] switch
        {
            'A' => Rank.Ace,
            'R' => Rank.King,
            'D' => Rank.Queen,
            'V' => Rank.Jack,
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

        var suit = cardName[^1] switch
        {
            '♠' => Suit.Spade,
            '♥' => Suit.Heart,
            '♦' => Suit.Diamond,
            '♣' => Suit.Club,
            _ => throw new ArgumentOutOfRangeException(nameof(cardName), cardName, null)
        };

        return new Card(rank, suit);
    }

    private static Position ParsePosition(string position) => position switch
    {
        "Nord" => Position.North,
        "Est" => Position.East,
        "Sud" => Position.South,
        "Ouest" => Position.West,
        _ => throw new ArgumentOutOfRangeException(nameof(position), position, null)
    };
}
