using System.Diagnostics;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionService.Data;
using TransactionService.DTOs;
using TransactionService.Entities;

namespace TransactionService.Controllers;
// USER ID b366d3cb-26ef-43b1-b2eb-89ecb7bff869
[ApiController]
[Route("[controller]")]
public class UserBalanceController : ControllerBase
{
    private readonly CrypDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public UserBalanceController(IMapper mapper, CrypDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper; 
        _publishEndpoint = publishEndpoint;
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
