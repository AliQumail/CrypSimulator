namespace TransactionService;

public class UpdateCurrencyHoldingDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public double Price { get; set; }
    public bool IsBuy { get; set; }
}