namespace TransactionService.DTOs;

public class GetUserBalanceDto
{
        public Guid UserId { get; set; }
        public double InitialBalance { get; set; }
        public double CurrentAmount { get; set; }
}