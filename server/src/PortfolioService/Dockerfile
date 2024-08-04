FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /app
EXPOSE 80

# copy all .csproj files and restore as distinct layers.   Use of the same COPY command
# for every dockerfile in the project to take advantage of docker caching
COPY src/src.sln src/src.sln
COPY src/TransactionService/TransactionService.csproj src/TransactionService/TransactionService.csproj
COPY src/PortfolioService/PortfolioService.csproj src/PortfolioService/PortfolioService.csproj
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj

# Restore package deps
RUN dotnet restore src/src.sln

# Copy the app folders over
COPY src/PortfolioService src/PortfolioService
COPY src/Contracts src/Contracts
WORKDIR /app/src/PortfolioService
RUN dotnet publish -c Release -o /app/src/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT [ "dotnet", "PortfolioService.dll" ]