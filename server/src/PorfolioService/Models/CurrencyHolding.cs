using MongoDB.Entities;

namespace PorfolioService;

public class CurrencyHolding : Entity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
}

