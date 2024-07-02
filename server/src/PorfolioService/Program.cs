using MassTransit;
using MongoDB.Driver;
using MongoDB.Entities;
using PorfolioService.Consumers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMassTransit( x => 
{
    x.AddConsumersFromNamespaceContaining<UpdateUserConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("portfolio", false));
    
    x.UsingRabbitMq((context, cfg) => {

        // To message consistent, if db fails 
         cfg.ReceiveEndpoint("portfolio-update-user", e => 
        {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<UpdateUserConsumer>(context);
        });

        cfg.ConfigureEndpoints(context);
    });

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

await DB.InitAsync("PortfolioDB", 
MongoClientSettings.FromConnectionString(
    builder.Configuration.GetConnectionString("MongoDbConnection")
));


app.Run();
