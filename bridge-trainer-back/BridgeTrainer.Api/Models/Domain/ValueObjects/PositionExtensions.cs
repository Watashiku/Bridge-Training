namespace BridgeTrainer.Api.Models.Domain.ValueObjects;

public static class PositionExtensions
{
    public static bool IsPartnerOrSelf(this Position self, Position other)
    {
        return (self == Position.North || self == Position.South) &&
               (other == Position.North || other == Position.South)
            || (self == Position.East || self == Position.West) &&
               (other == Position.East || other == Position.West);
    }

    public static Position Next(this Position self) => self switch
    {
        Position.North => Position.East,
        Position.East => Position.South,
        Position.South => Position.West,
        Position.West => Position.North,
        _ => throw new NotImplementedException(),
    };

    public static int StepsUntil(this Position currentPosition, Position targetPosition)
    {
        int steps = 0;
        while (currentPosition != targetPosition)
        {
            currentPosition = currentPosition.Next();
            steps++;
            if (steps > 4)
            {
                throw new InvalidOperationException("Infinite loop detected in StepsUntil calculation.");
            }
        }
        return steps;
    }
}
