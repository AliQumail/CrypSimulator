namespace TransactionService.DTOs;

public class AddTransactionDto
{
    public string CurrencyName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int Price { get; set; }
    public bool IsBuy { get; set; }
    public Guid UserId { get; set; }
}