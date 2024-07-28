using System.Diagnostics;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TransactionService.Data;
using TransactionService.DTOs;
using TransactionService.Entities;
using Microsoft.EntityFrameworkCore;


namespace TransactionService.Controllers;
// USER ID b366d3cb-26ef-43b1-b2eb-89ecb7bff869
[ApiController]
[Route("[controller]")]
public class TransactionController : ControllerBase
{
    private readonly CrypDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public TransactionController(IMapper mapper, CrypDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper; 
        _publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    [Route("AddTransaction")]
    public async Task<ActionResult<Transaction>> AddTransaction([FromBody] AddTransactionDto request)
    {
        var transaction = _mapper.Map<Transaction>(request);
        transaction.Date = DateTime.UtcNow;
        _context.Transactions.Add(transaction);
            
        await _publishEndpoint.Publish(_mapper.Map<TransactionCreated>(request));

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

    [HttpDelete]
    [Route("DeleteTransactionsAndResetUser")]
    public async Task<IActionResult> DeleteTransactionsAndResetUser([FromQuery] Guid userId)
    {
        var transactionsToDelete = _context.Transactions.Where(t => t.UserId == userId);
        _context.Transactions.RemoveRange(transactionsToDelete);

        var userReset = new UserReset {
            UserId = userId
        };

        await _publishEndpoint.Publish(userReset);

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) BadRequest("Failed to delete transactions.");

        return Ok("All transactions deleted successfully");

    }

     [HttpPost]
    [Route("AddUserBalance")]
    public async Task<ActionResult<UserBalance>> AddUserBalance([FromBody] AddUserBalanceDto request)
    {
        var userBalance = new UserBalance {
            UserId = request.UserId,
            InitialBalance = request.InitialBalance,
            CurrentBalance = request.InitialBalance
        };

        _context.UserBalance.Add(userBalance);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) BadRequest("Failed to add balance");
        return userBalance; 
    }

    [HttpGet]
    [Route("GetUserBalance")]
    public async Task<ActionResult<UserBalance?>> GetUserBalance([FromQuery] Guid userId)
    {
        return await _context.UserBalance.FirstOrDefaultAsync(x => x.UserId == userId );
    }
}
