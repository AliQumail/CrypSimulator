using Contracts;
using MassTransit;
using MongoDB.Entities;
namespace PorfolioService.Consumers;

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
            if (TransactionCreated.CurrencyName == "USD"){
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName)
                    .Modify(a => a.Quantity, TransactionCreated.Quantity)
                    .ExecuteAsync();
                    return;

            }

            var foundUSDHolding = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD");

            if (TransactionCreated.IsBuy)
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity + TransactionCreated.Quantity)
                    .ExecuteAsync();

                Console.WriteLine("REACHED HERE");
            
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD")
                    .Modify(a => a.Quantity, foundUSDHolding[0].Quantity - TransactionCreated.Price)
                    .ExecuteAsync();

            }
            else
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == TransactionCreated.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - TransactionCreated.Quantity)
                    .ExecuteAsync();
                
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD")
                    .Modify(a => a.Quantity, foundUSDHolding[0].Quantity + TransactionCreated.Price)
                    .ExecuteAsync();

            }

            // Update the USD amount here
        }
        else
        {
            var currencyHolding = new CurrencyHolding
            {
                UserId = TransactionCreated.UserId,
                CurrencyName = TransactionCreated.CurrencyName,
                Quantity = TransactionCreated.Quantity
            };

            if (TransactionCreated.CurrencyName != "USD")
            {
                var foundUSDHolding = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD");
                if (TransactionCreated.IsBuy){
                    await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD")
                    .Modify(a => a.Quantity, foundUSDHolding[0].Quantity - TransactionCreated.Price)
                    .ExecuteAsync();
                } 
                else 
                {
                    await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == TransactionCreated.UserId && a.CurrencyName == "USD")
                    .Modify(a => a.Quantity, foundUSDHolding[0].Quantity + TransactionCreated.Price)
                    .ExecuteAsync();

                }
            }

            await DB.SaveAsync(currencyHolding);

            // Update the USD amount here

        }


    }
}