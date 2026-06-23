using Microsoft.EntityFrameworkCore;
using CleanArchReference.Api.Endpoints;
using CleanArchReference.Api.Middleware;
using CleanArchReference.Infrastructure.CrossCutting.IoC;
using CleanArchReference.Infrastructure.Data.Context;
using CleanArchReference.Infrastructure.Data.Seed;
using QuestPDF.Infrastructure;
using System.Threading.RateLimiting;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1 * 1024 * 1024;
    options.Limits.MaxConcurrentConnections = 100;
    options.Limits.MaxConcurrentUpgradedConnections = 100;
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "Painel de Obrigações API", Version = "v1" }));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowedOrigins", p =>
        p.WithOrigins("http://localhost:5173", "http://localhost:3000")
         .AllowAnyMethod()
         .AllowAnyHeader()
         .SetPreflightMaxAge(TimeSpan.FromMinutes(10))));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;

    options.AddPolicy("ApiGlobal", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0,
            }));

    options.AddPolicy("Export", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
            }));
});

builder.Services.AddHealthChecks();

builder.Services.RegisterServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowedOrigins");
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapEmpresasEndpoints();
app.MapObrigacoesEndpoints();
app.MapDashboardEndpoints();
app.MapTagsEndpoints();
app.MapHealthChecks("/health");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.ProviderName?.Contains("InMemory") == true)
        db.Database.EnsureCreated();
    else
        db.Database.Migrate();

    if (!app.Environment.IsEnvironment("Test"))
        await DatabaseSeeder.SeedAsync(scope.ServiceProvider);
}

app.Run();

// Expose for integration tests
public partial class Program { }
