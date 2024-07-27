using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using PorfolioService;

namespace PortfolioService.Controllers;


// USER ID b366d3cb-26ef-43b1-b2eb-89ecb7bff869
[ApiController]
[Route("[controller]")]
public class PortfolioController : ControllerBase
{
    [HttpGet]
    [Route("GetUserPorfolio")]
    public async Task<ActionResult<List<CurrencyHolding>>> GetUserPortfolio([FromQuery] Guid UserId)
    {
         var holdings = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == UserId);
         return holdings; 
    }

    [HttpGet]
    [Route("GetUserUSDBalance")]
    public async Task<ActionResult<CurrencyHolding>?> GetUserUSDAmount([FromQuery] Guid UserId)
    {
        var holdings = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == UserId && a.CurrencyName == "USD");
        if (holdings.Count > 0) return holdings[0];
        else return null;
    }

    [HttpPost]
    public async Task<ActionResult<AddTransactionDto>> UpdateUserPortfolio([FromBody] AddTransactionDto AddTransactionDto)
    {
        // Console.WriteLine("--> Consuming auction created: " + context.Message.Id);
        var foundCurrencyHolding = await DB.Find<CurrencyHolding>()
        .ManyAsync(a => a.UserId == AddTransactionDto.UserId && a.CurrencyName == AddTransactionDto.CurrencyName);

        if (foundCurrencyHolding.Count > 0)
        {
            if (AddTransactionDto.IsBuy)
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == AddTransactionDto.UserId && a.CurrencyName == AddTransactionDto.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity + AddTransactionDto.Quantity)
                    .ExecuteAsync();

                return AddTransactionDto;

            }
            else
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == AddTransactionDto.UserId && a.CurrencyName == AddTransactionDto.CurrencyName)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - AddTransactionDto.Quantity)
                    .ExecuteAsync();
                
                return AddTransactionDto;

            }

            // Update the USD amount here
        }
        else
        {
            var currencyHolding = new CurrencyHolding
            {
                UserId = AddTransactionDto.UserId,
                CurrencyName = AddTransactionDto.CurrencyName,
                Quantity = AddTransactionDto.Quantity
            };

            await DB.SaveAsync(currencyHolding);

            return AddTransactionDto;
            // Update the USD amount here

        }


    }


    


    
}
