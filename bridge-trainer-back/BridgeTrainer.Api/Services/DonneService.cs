using BridgeTrainer.Api.Models;
using System.Text.Json;

namespace BridgeTrainer.Api.Services;

public class DonneService
{
    private readonly List<(string Id, Donne Donne)> _donnes;
    private readonly Random _random = new();

    public DonneService()
    {
        var path = Path.Combine("Resources", "data.json");
        var raw = File.ReadAllText(path);

        using var doc = JsonDocument.Parse(raw);
        _donnes = [];

        foreach (var entry in doc.RootElement.EnumerateObject())
        {
            string prefix = Path.GetFileNameWithoutExtension(entry.Name);
            foreach (var donneJson in entry.Value.EnumerateArray())
            {
                var donne = JsonSerializer.Deserialize<Donne>(donneJson.GetRawText())!;
                string id = $"{prefix}-{donne.DonneNo}";
                _donnes.Add((id, donne));
            }
        }

        //var ddonnes = _donnes
        //    .Where(tuple =>
        //    {
        //        var (id, donne) = tuple;
        //        try
        //        {
        //            var entameur = GetEntameur(donne);
        //            var main = donne.GetMain(entameur);
        //            return main.Any(ligne => ligne.Contains(donne.Entame));
        //        }
        //        catch
        //        {
        //            return false; // Skip donne non analysable
        //        }
        //    })
        //    .ToList();

    }

    public (string Id, Donne Donne) GetRandom()
    {
        return _donnes[_random.Next(_donnes.Count)];
    }

    public (string Id, Donne Donne) GetById(string id)
    {
        return _donnes.FirstOrDefault(d => d.Id == id);
    }

    private static readonly string[] Positions = ["Nord", "Est", "Sud", "Ouest"];

    public string JoueurActuel(Donne donne, int enchereCount)
    {
        int donneurIndex = Array.IndexOf(Positions, donne.Donneur);
        int joueurIndex = (donneurIndex + enchereCount) % 4;
        return Positions[joueurIndex];
    }

    public BiddingResponse ValidateBidding(BiddingRequest request)
    {
        var (_, donne) = GetById(request.Id);
        if (donne == null)
            return new BiddingResponse(false, null, default, "Donne non trouvée");

        int count = request.EncheresDejaFaites.Count;

        string attendu = donne.Encheres[count];

        string joueurActuel = JoueurActuel(donne, count);
        if (joueurActuel != request.Joueur)
            return new BiddingResponse(false, null, default, $"Ce n'est pas au tour de {request.Joueur}");

        if (attendu != request.Proposition)
            return new BiddingResponse(false, null, default, $"Enchère attendue : {attendu}");

        int nextIndex = count + 1;
        var suivantes = new List<string>();
        for (int i = 0; i < 3; i++)
        {
            if (nextIndex + i < donne.Encheres.Count)
            {
                var e = donne.Encheres[nextIndex + i];
                if (e == "Fin") break;
                suivantes.Add(e);
            }
        }

        bool fin = (nextIndex + 3 >= donne.Encheres.Count) || donne.Encheres[nextIndex + 3] == "Fin";

        return new BiddingResponse(true, suivantes, fin, null);
    }

    private static readonly Dictionary<string, int> RangEnchere = new()
    {
        ["1♣"] = 1,
        ["1♦"] = 2,
        ["1♥"] = 3,
        ["1♠"] = 4,
        ["1SA"] = 5,
        ["2♣"] = 6,
        ["2♦"] = 7,
        ["2♥"] = 8,
        ["2♠"] = 9,
        ["2SA"] = 10,
        ["3♣"] = 11,
        ["3♦"] = 12,
        ["3♥"] = 13,
        ["3♠"] = 14,
        ["3SA"] = 15,
        ["4♣"] = 16,
        ["4♦"] = 17,
        ["4♥"] = 18,
        ["4♠"] = 19,
        ["4SA"] = 20,
        ["5♣"] = 21,
        ["5♦"] = 22,
        ["5♥"] = 23,
        ["5♠"] = 24,
        ["5SA"] = 25,
        ["6♣"] = 26,
        ["6♦"] = 27,
        ["6♥"] = 28,
        ["6♠"] = 29,
        ["6SA"] = 30,
        ["7♣"] = 31,
        ["7♦"] = 32,
        ["7♥"] = 33,
        ["7♠"] = 34,
        ["7SA"] = 35
    };

    private static string? ExtraireCouleur(string enchere)
    {
        if (enchere.EndsWith("SA")) return "SA";
        if (enchere.EndsWith("♠")) return "♠";
        if (enchere.EndsWith("♥")) return "♥";
        if (enchere.EndsWith("♦")) return "♦";
        if (enchere.EndsWith("♣")) return "♣";
        return null;
    }

    public string GetEntameur(Donne donne)
    {
        int donneurIndex = Array.IndexOf(Positions, donne.Donneur);
        string? couleurGagnante = null;
        int meilleureValeur = -1;
        int joueurEnchereIndex = -1;

        for (int i = 0; i < donne.Encheres.Count; i++)
        {
            string enchere = donne.Encheres[i];
            if (!RangEnchere.ContainsKey(enchere)) continue;

            int valeur = RangEnchere[enchere];
            if (valeur > meilleureValeur)
            {
                meilleureValeur = valeur;
                couleurGagnante = ExtraireCouleur(enchere);
                joueurEnchereIndex = i;
            }
        }

        if (couleurGagnante == null)
            throw new Exception("Aucune enchère valable trouvée");

        int joueurGagnantIndex = (donneurIndex + joueurEnchereIndex) % 4;
        string joueurGagnant = Positions[joueurGagnantIndex];

        bool campNS = joueurGagnant is "Nord" or "Sud";

        for (int i = 0; i < donne.Encheres.Count; i++)
        {
            string enchere = donne.Encheres[i];
            var couleur = ExtraireCouleur(enchere);
            if (couleur != couleurGagnante) continue;

            int joueurIndex = (donneurIndex + i) % 4;
            string joueur = Positions[joueurIndex];
            bool memeCamp = (joueur is "Nord" or "Sud") == campNS;
            if (memeCamp)
            {
                string joueurDeclarant = joueur;
                int entameurIndex = (Array.IndexOf(Positions, joueurDeclarant) + 1) % 4;
                return Positions[entameurIndex];
            }
        }

        throw new Exception("Impossible de déterminer l'entameur");
    }


    public LeadResponse ValidateLead(LeadRequest request)
    {
        var (_, donne) = GetById(request.Id);
        if (donne == null)
            return new LeadResponse(false, "Donne non trouvée");

        bool correct = request.Carte == donne.Entame;

        return new LeadResponse(correct, null);
    }
}