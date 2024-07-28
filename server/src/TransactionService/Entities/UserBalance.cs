namespace TransactionService.Entities;

public class UserBalance
{
    public Guid Id { get; set; }
    public double InitialBalance { get; set; }
    public double CurrentBalance { get; set; }
    public Guid UserId { get; set; }
}