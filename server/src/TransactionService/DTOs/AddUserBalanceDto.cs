namespace TransactionService.DTOs;

public class AddUserBalanceDto
{
        public Guid UserId { get; set; }
        public double InitialBalance { get; set; }
}