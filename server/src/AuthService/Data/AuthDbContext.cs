using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace AuthService.Data;

public class AuthDbContext: IdentityDbContext
{
    public AuthDbContext(DbContextOptions options): base(options) {}

}