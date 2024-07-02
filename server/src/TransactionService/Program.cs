using MassTransit;
using Microsoft.EntityFrameworkCore;
using TransactionService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configuring MassTransit RabbitMQ to communicate between services
builder.Services.AddMassTransit( x => 
{
    // To create an outbox to store data to avoid data inconsistency between services
    x.AddEntityFrameworkOutbox<CrypDbContext>(o =>
    {
        o.QueryDelay = TimeSpan.FromSeconds(10);
        o.UsePostgres();
        o.UseBusOutbox();
    });

    // Config
    x.UsingRabbitMq((context, cfg) => {
        cfg.ConfigureEndpoints(context);
    });

});

builder.Services.AddDbContext<CrypDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();

app.UseCors(options =>
            options.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
