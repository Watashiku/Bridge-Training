using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Results;

public record class LeadExerciseResult(Position Player, string DealId, List<Bid> Bids, Position Dealer, Vulnerability Vulnerability, Hand Hand);
