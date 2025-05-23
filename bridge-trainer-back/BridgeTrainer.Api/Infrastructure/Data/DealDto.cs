namespace BridgeTrainer.Api.Infrastructure.Data;

public record DealDto(int DonneNo, string Donneur, string Vulnerabilite, List<string> Encheres, Dictionary<string, List<string>> Cartes, string Entame);