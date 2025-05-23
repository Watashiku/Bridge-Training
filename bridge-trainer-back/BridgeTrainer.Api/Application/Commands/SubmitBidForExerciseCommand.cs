using BridgeTrainer.Api.Infrastructure.Bidding;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Commands;

public record class SubmitBidForExerciseCommand(string DealId, Position Player, int BidNumber, Bid Bid);
