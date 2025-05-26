using BridgeTrainer.Api.Application.Interfaces;
using BridgeTrainer.Api.Application.Services;
using BridgeTrainer.Api.Infrastructure.Api.Mappers;
using BridgeTrainer.Api.Infrastructure.Data;
using BridgeTrainer.Api.Infrastructure.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy => 
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Services
builder.Services.AddScoped<IBiddingTrainingService, BiddingTrainingService>();
builder.Services.AddScoped<ILeadTrainingService, LeadTrainingService>();
builder.Services.AddScoped<ITrainingContextProvider, TrainingContextProvider>();

// Repositories
builder.Services.AddScoped<IDealRepository, JsonDealRepository>();
builder.Services.AddScoped<IPositionGenerator, RandomPositionGenerator>();

// Api
builder.Services.AddScoped<IBiddingApiMapper, BiddingApiMapper>();
builder.Services.AddScoped<ILeadApiMapper, LeadApiMapper>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("DevCors");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();

/*
 /MyApp
  /Controllers
    UserController.cs

  /Models
    CreateUserRequest.cs
    UserResponse.cs

  /Services
    /Interfaces
      IUserService.cs
    UserService.cs
    OtherService.cs

  /Infrastructure
    /Repositories
      IUserRepository.cs
      UserRepository.cs

  /Tests
    /Services
      UserServiceTests.cs

  Program.cs

 
 */