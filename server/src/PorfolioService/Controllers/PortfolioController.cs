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
         var authors = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == UserId);
         return authors; 
    }

    [HttpPost]
    public async Task<ActionResult<CurrencyHolding>> UpdateUserPortfolio([FromBody] CurrencyHolding currencyHolding, bool isBuy)
    {
        var foundCurrencyHolding = await DB.Find<CurrencyHolding>().ManyAsync(a => a.UserId == currencyHolding.UserId && a.Name == currencyHolding.Name);
        if ( foundCurrencyHolding != null ){
            if (isBuy){
                await DB.Update<CurrencyHolding>()
                .Match(a => a.UserId == currencyHolding.UserId && a.Name == currencyHolding.Name)
                .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity + currencyHolding.Quantity)
                .ExecuteAsync();
                return currencyHolding;
            } else {
                await DB.Update<CurrencyHolding>()
                .Match(a => a.UserId == currencyHolding.UserId && a.Name == currencyHolding.Name)
                .Modify(a => a.Quantity, foundCurrencyHolding[0].Quantity - currencyHolding.Quantity)
                .ExecuteAsync();
                return currencyHolding;
            }
            
        } else {
            await DB.SaveAsync(currencyHolding);
            return currencyHolding;
        };
    }

    


    
}
