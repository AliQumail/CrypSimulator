namespace Contracts;

public class TransactionCreated 
{
    public string CurrencyName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public double Price { get; set; }
    public bool IsBuy { get; set; }
    public Guid UserId { get; set; }
}