import { Grid, Layout, theme as antTheme } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';

const { Content } = Layout;
const { useBreakpoint } = Grid;

export function AppLayout() {
  const { token } = antTheme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Layout className="layout-noise" style={{ minHeight: '100vh' }}>
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <Layout style={{ background: token.colorBgLayout }}>
        <Content style={{
          margin:     isMobile ? 8 : 24,
          padding:    isMobile ? 12 : 28,
          background: token.colorBgContainer,
          borderRadius: 14,
          minHeight: isMobile ? 'calc(100vh - 16px)' : 'calc(100vh - 48px)',
          boxShadow: token.boxShadowSecondary,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
