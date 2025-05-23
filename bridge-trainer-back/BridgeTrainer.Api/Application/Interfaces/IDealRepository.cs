using BridgeTrainer.Api.Models.Domain.Entities;

namespace BridgeTrainer.Api.Application.Interfaces;

public interface IDealRepository
{
    Deal GetById(string id);
    Deal GetRandom();
}
