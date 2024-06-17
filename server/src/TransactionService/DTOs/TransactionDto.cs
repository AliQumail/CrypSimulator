namespace TransactionService.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int Price { get; set; }
    public bool IsBuy { get; set; }
    public DateTime Date { get; set; }
    public Guid UserId { get; set; }
}