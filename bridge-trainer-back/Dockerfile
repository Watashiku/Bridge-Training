FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore BridgeTrainer.Api/BridgeTrainer.Api.csproj
RUN dotnet build BridgeTrainer.Api/BridgeTrainer.Api.csproj -c Release -o /app/build
RUN dotnet publish BridgeTrainer.Api/BridgeTrainer.Api.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BridgeTrainer.Api.dll"]
