using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Application.Commands;

public record class SubmitLeadCardCommand(string DealId, Card Lead);
