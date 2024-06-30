using MassTransit;
using Microsoft.EntityFrameworkCore;
using TransactionService.Entities;

namespace TransactionService.Data;


public class CrypDbContext: DbContext 
{
    public CrypDbContext(DbContextOptions options): base(options) {}
    public DbSet<Transaction> Transactions { get; set; }


    // To create an outbox to store data to avoid data inconsistency between services
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }
}

