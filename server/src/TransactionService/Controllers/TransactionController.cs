using System.Diagnostics;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TransactionService.Data;
using TransactionService.DTOs;
using TransactionService.Entities;

namespace TransactionService.Controllers;
// USER ID b366d3cb-26ef-43b1-b2eb-89ecb7bff869
[ApiController]
[Route("[controller]")]
public class TransactionController : ControllerBase
{
    private readonly CrypDbContext _context;
    private readonly IMapper _mapper;

    public TransactionController(IMapper mapper, CrypDbContext context)
    {
        _context = context;
        _mapper = mapper; 
    }

    [HttpPost]
    [Route("AddTransaction")]
    public async Task<ActionResult<Transaction>> AddTransaction([FromBody] AddTransactionDto request)
    {
        var transaction = _mapper.Map<Transaction>(request);
        transaction.Date = DateTime.UtcNow;
        _context.Transactions.Add(transaction);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) BadRequest("Failed to add transaciton");
        return transaction; 
    }

    [HttpGet]
    [Route("GetTransactionsByUser")]
    public List<TransactionDto> GetTransactionsByUser([FromQuery] Guid userId)
    {
        var transactions = _context.Transactions.Where(x => x.UserId == userId ).ToList();
        var mappedTransactions = _mapper.Map<List<TransactionDto>>(transactions);
        return mappedTransactions; 
    }
}
