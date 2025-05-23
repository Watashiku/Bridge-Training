using BridgeTrainer.Api.Models.Domain.Entities;
using BridgeTrainer.Api.Models.Domain.Services;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Results;

public record class ExerciseContext(Deal Deal, Position Player, BiddingSequence BiddingSequence);
