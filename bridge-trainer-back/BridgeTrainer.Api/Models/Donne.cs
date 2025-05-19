namespace BridgeTrainer.Api.Models;

public record Donne(int DonneNo, string Donneur, List<string> Encheres, Dictionary<string, List<string>> Cartes, string Entame)
{
    public List<string> GetMain(string joueur) => Cartes.TryGetValue(joueur, out List<string>? value) ? value : [];
}
