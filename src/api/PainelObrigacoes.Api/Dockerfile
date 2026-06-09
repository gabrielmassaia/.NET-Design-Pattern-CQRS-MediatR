FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["PainelObrigacoes.Api/PainelObrigacoes.Api.csproj", "PainelObrigacoes.Api/"]
COPY ["PainelObrigacoes.Application/PainelObrigacoes.Application.csproj", "PainelObrigacoes.Application/"]
COPY ["PainelObrigacoes.Domain/PainelObrigacoes.Domain.csproj", "PainelObrigacoes.Domain/"]
COPY ["PainelObrigacoes.Infrastructure.Data/PainelObrigacoes.Infrastructure.Data.csproj", "PainelObrigacoes.Infrastructure.Data/"]
COPY ["PainelObrigacoes.Infrastructure.CrossCutting.IoC/PainelObrigacoes.Infrastructure.CrossCutting.IoC.csproj", "PainelObrigacoes.Infrastructure.CrossCutting.IoC/"]
COPY ["PainelObrigacoes.Shared/PainelObrigacoes.Shared.csproj", "PainelObrigacoes.Shared/"]
RUN dotnet restore "PainelObrigacoes.Api/PainelObrigacoes.Api.csproj"
COPY . .
WORKDIR "/src/PainelObrigacoes.Api"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PainelObrigacoes.Api.dll"]
