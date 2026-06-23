namespace CleanArchReference.Application.Dashboard.ViewModels;

public sealed class DashboardResultViewModel
{
    public int TotalEmpresas { get; set; }
    public int TotalObrigacoesMes { get; set; }
    public int Pendentes { get; set; }
    public int Entregues { get; set; }
    public int Atrasadas { get; set; }
}
