import { Navigate, type RouteObject } from 'react-router-dom';
import { DashboardPage, EmpresasPage, CalendarioPage, DocumentacaoPage } from '@/pages';
import { AppLayout } from '@/App';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'empresas', element: <EmpresasPage /> },
      { path: 'calendario', element: <CalendarioPage /> },
      { path: 'documentacao', element: <DocumentacaoPage /> },
    ],
  },
];
