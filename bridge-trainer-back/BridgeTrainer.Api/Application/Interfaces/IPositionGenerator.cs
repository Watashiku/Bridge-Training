using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Interfaces;

public interface IPositionGenerator
{
    Position GetRandom();
}
