using TransactionService.DTOs;
using TransactionService.Entities;
using AutoMapper;
using Contracts;


namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
      CreateMap<AddTransactionDto, Transaction>();
      CreateMap<Transaction, TransactionDto>();
      CreateMap<AddTransactionDto, TransactionCreated>();
    }
}