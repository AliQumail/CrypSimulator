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
    public async Task<ActionResult<List<CurrencyHolding>>> GetUserPortfolio([FromQuery] Guid UserId)
    {
         var holdings = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == UserId);
         Console.WriteLine("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
         Console.WriteLine(holdings.Count);
         return holdings; 
    }

    [HttpPost]
    public async Task<ActionResult<UpdateCurrencyHoldingDto>> UpdateUserPortfolio([FromBody] UpdateCurrencyHoldingDto updateCurrencyHoldingDto)
    {
         // Console.WriteLine("--> Consuming auction created: " + context.Message.Id);
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

                return updateCurrencyHoldingDto;

            }
            else
            {
                await DB.Update<CurrencyHolding>()
                    .Match(a => a.UserId == updateCurrencyHoldingDto.UserId && a.Name == updateCurrencyHoldingDto.Name)
                    .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - updateCurrencyHoldingDto.Quantity)
                    .ExecuteAsync();
                
                return updateCurrencyHoldingDto;

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

            return updateCurrencyHoldingDto;
            // Update the USD amount here

        }


    }


    


    
}
