namespace TransactionService.Entities;

public class Transaction 
{
    public Guid Id { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int Price { get; set; }
    public bool IsBuy { get; set; }
    public DateTime Date { get; set; }
}