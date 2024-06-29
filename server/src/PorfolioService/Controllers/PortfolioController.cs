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

    // [HttpPost]
    // public async Task<ActionResult<UpdateCurrencyHoldingDto>> UpdateUserPortfolio([FromBody] UpdateCurrencyHoldingDto updateCurrencyHoldingDto)
    // {
    
    // }


    


    
}
