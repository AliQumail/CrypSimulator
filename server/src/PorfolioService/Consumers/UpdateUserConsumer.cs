using MassTransit;
using MongoDB.Entities;
using PorfolioService;

namespace SearchService;

public class UpdateUserConsumer : IConsumer<UpdateCurrencyHoldingDto>
{
    public UpdateUserConsumer() { }
    
    public async Task Consume(ConsumeContext<UpdateCurrencyHoldingDto> context)
    {
        // Console.WriteLine("--> Consuming auction created: " + context.Message.Id);

        var updateCurrencyHoldingDto = context.Message;
        Console.WriteLine("-----------------");
        Console.WriteLine(context.Message);
        var foundCurrencyHolding = await DB.Find<CurrencyHolding>()
        .ManyAsync(a => a.UserId == updateCurrencyHoldingDto.UserId && a.Name == updateCurrencyHoldingDto.Name);

        if (foundCurrencyHolding.Count > 0)
        {
            if (updateCurrencyHoldingDto.IsBuy)
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == updateCurrencyHoldingDto.UserId && a.Name == updateCurrencyHoldingDto.Name)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity + updateCurrencyHoldingDto.Quantity)
                    .ExecuteAsync();

            }
            else
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == updateCurrencyHoldingDto.UserId && a.Name == updateCurrencyHoldingDto.Name)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - updateCurrencyHoldingDto.Quantity)
                    .ExecuteAsync();

            }

            // Update the USD amount here
        }
        else
        {
            var currencyHolding = new CurrencyHolding
            {
                UserId = updateCurrencyHoldingDto.UserId,
                Name = updateCurrencyHoldingDto.Name,
                Quantity = updateCurrencyHoldingDto.Quantity
            };

            await DB.SaveAsync(currencyHolding);

            // Update the USD amount here

        }


    }
}