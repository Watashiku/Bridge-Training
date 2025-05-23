using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Results;
using BridgeTrainer.Api.Infrastructure.Api.Models;

namespace BridgeTrainer.Api.Infrastructure.Api.Mappers;

public interface ILeadApiMapper
{
    LeadDescription ToRandomLeadResponse(LeadExerciseResult domain);
    SubmitLeadCardCommand ToSubmitLeadForExerciseCommand(LeadRequest dto);
    LeadResponse ToPostLeadResponse(SubmitLeadCardResult domain);
}
