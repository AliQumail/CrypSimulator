using MongoDB.Entities;

namespace PortfolioService;

public class CurrencyHolding : Entity
{
    public Guid UserId { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public double Quantity { get; set; }
}

