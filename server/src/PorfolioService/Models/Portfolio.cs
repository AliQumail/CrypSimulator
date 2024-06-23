using MongoDB.Entities;

namespace PorfolioService;

public class Transaction : Entity
{
    public Guid UserId { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public double Quantity { get; set; }
}

