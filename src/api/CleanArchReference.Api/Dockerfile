FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CleanArchReference.Api/CleanArchReference.Api.csproj", "CleanArchReference.Api/"]
COPY ["CleanArchReference.Application/CleanArchReference.Application.csproj", "CleanArchReference.Application/"]
COPY ["CleanArchReference.Domain/CleanArchReference.Domain.csproj", "CleanArchReference.Domain/"]
COPY ["CleanArchReference.Infrastructure.Data/CleanArchReference.Infrastructure.Data.csproj", "CleanArchReference.Infrastructure.Data/"]
COPY ["CleanArchReference.Infrastructure.CrossCutting.IoC/CleanArchReference.Infrastructure.CrossCutting.IoC.csproj", "CleanArchReference.Infrastructure.CrossCutting.IoC/"]
COPY ["CleanArchReference.Shared/CleanArchReference.Shared.csproj", "CleanArchReference.Shared/"]
RUN dotnet restore "CleanArchReference.Api/CleanArchReference.Api.csproj"
COPY . .
WORKDIR "/src/CleanArchReference.Api"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CleanArchReference.Api.dll"]
