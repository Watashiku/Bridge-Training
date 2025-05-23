using BridgeTrainer.Api.Infrastructure.Data;
using BridgeTrainer.Api.Models.Domain.ValueObjects;

namespace BridgeTrainer.Api.Tests;

[TestClass]
public sealed class TestSpecificDonne
{
    private readonly DealService service = new(new JsonDealRepository());
    const string DONNE_ID = "rouge_35_-_janvier_2017-3";

    [TestMethod]
    public void TestGetSpecific()
    {
        var donne = service.TryGetDeal(DONNE_ID);
        Assert.IsNotNull(donne);
    }

    [TestMethod]
    public void TestGetEntameur()
    {
        var donne = service.TryGetDeal(DONNE_ID)!;
        Assert.AreEqual(Position.West, service.GetEntameur(donne));
    }

    [TestMethod]
    public void TestJoueurActuel()
    {
        var donne = service.TryGetDeal(DONNE_ID)!;
        Assert.AreEqual(Position.North, service.JoueurActuel(donne, 2));
        Assert.AreEqual(Position.East, service.JoueurActuel(donne, 3));
    }

    [TestMethod]
    public void TestWrongLead()
    {
        var donne = service.TryGetDeal(DONNE_ID)!;
        var leadRequest = new LeadRequest(donne.Id, "3♣");
        var leadResponse = service.ValidateLead(leadRequest);
        Assert.AreEqual(false, leadResponse.Correct);
    }

    [TestMethod]
    public void TestGoodLead()
    {
        var donne = service.TryGetDeal(DONNE_ID)!;
        var leadRequest = new LeadRequest(donne.Id, "3♠");
        Assert.AreEqual(true, service.ValidateLead(leadRequest).Correct);
    }
}
