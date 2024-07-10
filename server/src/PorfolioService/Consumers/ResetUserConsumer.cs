using Contracts;
using MassTransit;
using MongoDB.Driver;
using MongoDB.Entities;
namespace PorfolioService.Consumers;

public class ResetUserConsumer : IConsumer<UserReset>
{
    public async Task Consume(ConsumeContext<UserReset> context)
    {
        var userReset = context.Message;
        await DB.DeleteAsync<CurrencyHolding>(ch => ch.UserId == userReset.UserId);
    }
    
}