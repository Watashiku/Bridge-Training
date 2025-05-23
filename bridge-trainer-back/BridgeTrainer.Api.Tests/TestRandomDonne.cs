using BridgeTrainer.Api.Infrastructure.Data;
using BridgeTrainer.Api.Models.Domain.Entities;

namespace BridgeTrainer.Api.Tests;

[TestClass]
public sealed class TestRandomDonne
{
    private readonly DealService service = new(new JsonDealRepository());
    private readonly Deal donne = new DealService(new JsonDealRepository()).RandomDeal();

    [TestMethod]
    public void TestGetRandom() {; }

    [TestMethod]
    public void TestGetEntameur() => service.GetEntameur(donne);

    [TestMethod]
    public void TestJoueurActuel() => service.JoueurActuel(donne, 0);

    [TestMethod]
    public void TestValidateLead()
    {
        var leadRequest = new LeadRequest(donne.Id, "A♣");
        var lead = service.ValidateLead(leadRequest);
        Assert.IsNotNull(lead);
    }
}
