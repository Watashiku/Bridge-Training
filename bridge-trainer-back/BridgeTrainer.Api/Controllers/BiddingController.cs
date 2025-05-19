using Microsoft.AspNetCore.Mvc;
using BridgeTrainer.Api.Models;
using BridgeTrainer.Api.Services;

namespace BridgeTrainer.Api.Controllers;

[ApiController]
[Route("api/exercice/bidding")]
public class BiddingController(DonneService service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetRandomBidding()
    {
        var (id, donne) = service.GetRandom();
        string[] joueursOrdre = ["Nord", "Est", "Sud", "Ouest"];
        var rnd = new Random();
        string joueur = joueursOrdre[rnd.Next(joueursOrdre.Length)];

        int indexDonneur = Array.IndexOf(joueursOrdre, donne.Donneur);
        int indexJoueur = Array.IndexOf(joueursOrdre, joueur);

        int count = 0;
        while (true)
        {
            int joueurActuel = (indexDonneur + count) % 4;
            if (joueurActuel == indexJoueur)
                break;
            count++;
        }

        var response = new
        {
            id,
            donneur = donne.Donneur,
            joueur,
            joueurActuel = service.JoueurActuel(donne, count),
            mainJoueur = donne.GetMain(joueur),
            encheresDejaFaites = donne.Encheres.Take(count).ToList(),
        };
        return Ok(response);
    }

    [HttpPost]
    public IActionResult PostBidding([FromBody] BiddingRequest request)
    {
        var res = service.ValidateBidding(request);
        return Ok(res);
    }
}