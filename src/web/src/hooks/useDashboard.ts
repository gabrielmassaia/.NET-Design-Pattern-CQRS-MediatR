import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/application/services';
import { dashboardKeys } from '@/lib/query-keys';

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.dashboard,
    queryFn: () => dashboardService.getDashboard(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useAlertas() {
  return useQuery({
    queryKey: dashboardKeys.alertas,
    queryFn: () => dashboardService.getAlertas(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
