namespace TransactionService.Entities;

public class UserCurrencyHolding {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string CurrencyName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int Amount { get; set; }
};