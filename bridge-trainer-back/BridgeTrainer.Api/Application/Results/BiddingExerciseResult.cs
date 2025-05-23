using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Results;

public record class BiddingExerciseResult(Position Player, string DealId, Position Dealer, Vulnerability Vulnerability, Hand Hand, IEnumerable<Bid> StartBids);
