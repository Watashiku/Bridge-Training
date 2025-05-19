using Microsoft.AspNetCore.Mvc;
using BridgeTrainer.Api.Models;
using BridgeTrainer.Api.Services;

namespace BridgeTrainer.Api.Controllers;

[ApiController]
[Route("api/exercice/lead")]
public class LeadController(DonneService service) : ControllerBase
{
    [HttpGet]
    public IActionResult GetRandomLead()
    {
        var (id, donne) = service.GetRandom();

        var joueur = service.GetEntameur(donne);

        var response = new
        {
            id,
            donneur = donne.Donneur,
            joueur,
            mainJoueur = donne.GetMain(joueur),
            encheres = donne.Encheres
        };

        return Ok(response);
    }

    [HttpPost]
    public IActionResult PostLead([FromBody] LeadRequest request)
    {
        var (_, donne) = service.GetById(request.Id);
        if (donne == null)
            return BadRequest("Donne non trouvée");

        bool correct = request.Carte == donne.Entame;
        return Ok(new LeadResponse(correct, null));
    }

}