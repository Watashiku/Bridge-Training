using BridgeTrainer.Api.Application.Commands;
using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public interface ILeadTrainingService
{
    LeadExerciseResult GetLeadExercise(LeadExerciseQuery query);
    SubmitLeadCardResult SubmitLeadCardForExercise(SubmitLeadCardCommand command);
}
