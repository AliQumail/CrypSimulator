using Contracts;
using MassTransit;
using MongoDB.Entities;
namespace PortfolioService.Consumers;

public class UpdateUserConsumer : IConsumer<TransactionCreated>
{
    public async Task Consume(ConsumeContext<TransactionCreated> context)
    {
        Console.WriteLine("--> Consuming auction created: " + context.Message.UserId);

        var TransactionCreated = context.Message;
        var foundCurrencyHolding = await DB.Find<CurrencyHolding>()
        .ManyAsync(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName);

        if (foundCurrencyHolding.Count > 0)
        {
            if (TransactionCreated.IsBuy)
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity + TransactionCreated.Quantity)
                    .ExecuteAsync();
            }
            else
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - TransactionCreated.Quantity)
                    .ExecuteAsync();
            }
        }
        else
        {
            var currencyHolding = new CurrencyHolding
            {
                UserId = TransactionCreated.UserId,
                CurrencyName = TransactionCreated.CurrencyName,
                Quantity = TransactionCreated.Quantity
            };
            await DB.SaveAsync(currencyHolding);
        }
    }
}