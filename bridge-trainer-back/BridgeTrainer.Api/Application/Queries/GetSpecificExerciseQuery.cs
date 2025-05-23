using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Queries;

public record GetSpecificExerciseQuery(string DealId, Position? Player, int? BidNumber);
