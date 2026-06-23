using Microsoft.EntityFrameworkCore;
using CleanArchReference.Domain.Dashboard.Models;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Obrigacoes.Repositories;
using CleanArchReference.Infrastructure.Data.Context;
using CleanArchReference.Infrastructure.Data.Entities;

namespace CleanArchReference.Infrastructure.Data.Obrigacoes.Repositories;

public sealed class ObrigacaoRepository : IObrigacaoRepository
{
    private readonly AppDbContext _context;

    public ObrigacaoRepository(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        _context = context;
    }

    public async Task<ObrigacaoModel?> FindByIdAsync(Guid id)
    {
        var entity = await _context.Obrigacoes.AsNoTracking()
            .Include(o => o.Empresa)
            .FirstOrDefaultAsync(o => o.Id == id);
        return entity is null ? null : ToModel(entity);
    }

    public async Task<IList<ObrigacaoReadModel>> FindByEmpresaAndMonthAsync(
        Guid empresaId, int ano, int mes, int skip = 0, int take = 100)
    {
        var competencia = new DateTime(ano, mes, 1);
        return await _context.Obrigacoes.AsNoTracking()
            .Include(o => o.Empresa)
            .Where(o => o.EmpresaId == empresaId && o.Competencia == competencia)
            .OrderBy(o => o.DataVencimento)
            .Skip(skip).Take(take)
            .Select(o => ToReadModel(o))
            .ToListAsync();
    }

    public async Task<IList<ObrigacaoReadModel>> FindEntreguesByEmpresaAsync(Guid empresaId)
    {
        return await _context.Obrigacoes.AsNoTracking()
            .Include(o => o.Empresa)
            .Where(o => o.EmpresaId == empresaId && o.DataEntrega != null)
            .OrderByDescending(o => o.DataEntrega)
            .Select(o => ToReadModel(o))
            .ToListAsync();
    }

    public async Task<IList<AlertaModel>> FindAlertasAsync(DateTime dataLimite, int limite = 50)
    {
        var hoje = DateTime.UtcNow.Date;
        return await _context.Obrigacoes.AsNoTracking()
            .Include(o => o.Empresa)
            .Where(o => o.DataEntrega == null && o.DataVencimento.Date <= dataLimite.Date)
            .OrderBy(o => o.DataVencimento)
            .Take(limite)
            .Select(o => new AlertaModel
            {
                Id = o.Id,
                EmpresaId = o.EmpresaId,
                RazaoSocial = o.Empresa.RazaoSocial,
                CNPJ = o.Empresa.CNPJ,
                Tipo = o.Tipo,
                DataVencimento = o.DataVencimento,
                DiasRestantes = (int)(o.DataVencimento.Date - hoje).TotalDays,
                Status = o.DataVencimento.Date < hoje
                    ? StatusObrigacao.Atrasada
                    : StatusObrigacao.Pendente
            })
            .ToListAsync();
    }

    public async Task<DashboardModel> GetDashboardCountsAsync(int ano, int mes)
    {
        var competencia = new DateTime(ano, mes, 1);
        var hoje = DateTime.UtcNow.Date;

        var totalEmpresas = await _context.Empresas.CountAsync();

        var currentMonth = await _context.Obrigacoes.AsNoTracking()
            .Where(o => o.Competencia == competencia)
            .GroupBy(o => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Entregues = g.Count(o => o.DataEntrega.HasValue),
            })
            .FirstOrDefaultAsync();

        var totalAtrasadas = await _context.Obrigacoes.AsNoTracking()
            .CountAsync(o => !o.DataEntrega.HasValue && o.DataVencimento.Date < hoje);

        var total = currentMonth?.Total ?? 0;
        var entregues = currentMonth?.Entregues ?? 0;

        return new DashboardModel
        {
            TotalEmpresas = totalEmpresas,
            TotalObrigacoesMes = total,
            Pendentes = total - entregues,
            Entregues = entregues,
            Atrasadas = totalAtrasadas
        };
    }

    public async Task<bool> HasObrigacoesInYearAsync(Guid empresaId, int ano)
    {
        var inicio = new DateTime(ano, 1, 1);
        var fim = new DateTime(ano, 12, 31);
        return await _context.Obrigacoes
            .AnyAsync(o => o.EmpresaId == empresaId
                        && o.Competencia >= inicio
                        && o.Competencia <= fim);
    }

    public void AdicionarTag(Guid obrigacaoId, Guid tagId)
        => _context.ObrigacaoTags.Add(new ObrigacaoTagEntity { ObrigacaoId = obrigacaoId, TagId = tagId });

    public void RemoverTag(Guid obrigacaoId, Guid tagId)
    {
        var junction = _context.ObrigacaoTags.Local
            .FirstOrDefault(ot => ot.ObrigacaoId == obrigacaoId && ot.TagId == tagId);

        if (junction is null)
        {
            junction = new ObrigacaoTagEntity { ObrigacaoId = obrigacaoId, TagId = tagId };
            _context.ObrigacaoTags.Attach(junction);
        }

        _context.ObrigacaoTags.Remove(junction);
    }

    public void CreateRange(IEnumerable<ObrigacaoModel> models)
        => _context.Obrigacoes.AddRange(models.Select(ToEntity));

    public void Update(ObrigacaoModel model)
    {
        var tracked = _context.Obrigacoes.Local.FirstOrDefault(o => o.Id == model.Id);
        if (tracked is null)
            _context.Obrigacoes.Update(ToEntity(model));
        else
        {
            tracked.DataEntrega = model.DataEntrega;
            tracked.Status = model.Status;
            tracked.UpdatedAt = model.UpdatedAt;
        }
    }

    private static ObrigacaoModel ToModel(ObrigacaoEntity o) => new()
    {
        Id = o.Id,
        EmpresaId = o.EmpresaId,
        Tipo = o.Tipo,
        Competencia = o.Competencia,
        DataVencimento = o.DataVencimento,
        DataEntrega = o.DataEntrega,
        Status = o.Status,
        CreatedAt = o.CreatedAt,
        UpdatedAt = o.UpdatedAt
    };

    private static ObrigacaoReadModel ToReadModel(ObrigacaoEntity o) => new()
    {
        Id = o.Id,
        EmpresaId = o.EmpresaId,
        RazaoSocial = o.Empresa?.RazaoSocial ?? string.Empty,
        Tipo = o.Tipo,
        Competencia = o.Competencia,
        DataVencimento = o.DataVencimento,
        DataEntrega = o.DataEntrega,
        Status = o.Status
    };

    private static ObrigacaoEntity ToEntity(ObrigacaoModel m) => new()
    {
        Id = m.Id,
        EmpresaId = m.EmpresaId,
        Tipo = m.Tipo,
        Competencia = m.Competencia,
        DataVencimento = m.DataVencimento,
        DataEntrega = m.DataEntrega,
        Status = m.Status,
        CreatedAt = m.CreatedAt,
        UpdatedAt = m.UpdatedAt
    };
}
