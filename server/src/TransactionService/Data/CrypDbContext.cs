using Microsoft.EntityFrameworkCore;
using TransactionService.Entities;

namespace TransactionService.Data;


public class CrypDbContext: DbContext 
{
    public CrypDbContext(DbContextOptions options): base(options) {}
    public DbSet<Transaction> Transactions { get; set; }
}

