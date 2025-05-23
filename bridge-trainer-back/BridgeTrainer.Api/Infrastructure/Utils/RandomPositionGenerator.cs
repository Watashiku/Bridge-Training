using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Infrastructure.Utils;

public class RandomPositionGenerator : IPositionGenerator
{
    private readonly Random _random = new();
    private readonly Position[] _values = Enum.GetValues<Position>();
    public Position GetRandom() => _values[_random.Next(_values.Length)];
}
