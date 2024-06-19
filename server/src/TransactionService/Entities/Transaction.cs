namespace TransactionService.Entities;

public class Transaction 
{
    public Guid Id { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public double Price { get; set; }
    public bool IsBuy { get; set; }
    public DateTime Date { get; set; }
    public Guid UserId { get; set; }
}