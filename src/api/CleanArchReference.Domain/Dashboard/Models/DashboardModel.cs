namespace CleanArchReference.Domain.Dashboard.Models;

public sealed class DashboardModel
{
    public int TotalEmpresas { get; set; }
    public int TotalObrigacoesMes { get; set; }
    public int Pendentes { get; set; }
    public int Entregues { get; set; }
    public int Atrasadas { get; set; }
}
