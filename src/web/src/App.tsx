import { Layout, theme as antTheme } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';

const { Content } = Layout;

export function AppLayout() {
  const { token } = antTheme.useToken();

  return (
    <Layout className="layout-noise" style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout style={{ background: token.colorBgLayout }}>
        <Content style={{
          margin:     24,
          padding:    28,
          background: token.colorBgContainer,
          borderRadius: 14,
          minHeight: 'calc(100vh - 48px)',
          boxShadow: token.boxShadowSecondary,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
