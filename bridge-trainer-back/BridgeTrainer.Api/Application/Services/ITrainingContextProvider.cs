using BridgeTrainer.Api.Application.Queries;
using BridgeTrainer.Api.Application.Results;

namespace BridgeTrainer.Api.Application.Services;

public interface ITrainingContextProvider
{
    ExerciseContext GetRandomExercise(GetRandomExerciseQuery query);
    ExerciseContext GetSpecificExercise(GetSpecificExerciseQuery query);
}
