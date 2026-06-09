import {
  AlertOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MenuOutlined,
  MoonOutlined,
  ShopOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Drawer, Grid, Layout, Tooltip, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppTheme } from '@/context/ThemeContext';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const NAV_ITEMS: { path: string; icon: React.ReactNode; label: string }[] = [
  { path: '/dashboard',    icon: <DashboardOutlined />, label: 'Dashboard'    },
  { path: '/empresas',     icon: <ShopOutlined />,      label: 'Empresas'     },
  { path: '/calendario',   icon: <CalendarOutlined />,  label: 'Calendário'   },
  { path: '/dashboard?alertas=1', icon: <AlertOutlined />, label: 'Alertas'   },
  { path: '/documentacao', icon: <FileTextOutlined />,  label: 'Documentação' },
];

const GOLD = '#D4A843';
const SIDER_BG = '#0D1118';

const itemStyle = (active: boolean): React.CSSProperties => ({
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  position:        'relative',
  height:          44,
  fontSize:        17,
  cursor:          'pointer',
  color:           active ? '#E8EAF0' : 'rgba(255,255,255,0.32)',
  background:      active ? 'rgba(212,168,67,0.07)' : 'transparent',
  borderLeft:      active ? `3px solid ${GOLD}` : '3px solid transparent',
  transition:      'color 0.15s ease-out, background 0.15s ease-out',
});

const footerItemStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  height:         42,
  cursor:         'pointer',
  fontSize:       17,
  color:          'rgba(255,255,255,0.32)',
  transition:     'color 0.15s ease-out',
};

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function AppSidebar({ open, onClose, onToggle }: AppSidebarProps) {
  const { appTheme, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawerItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 20px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: active ? 700 : 500,
    color: active ? GOLD : 'rgba(255,255,255,0.65)',
    background: active ? 'rgba(212,168,67,0.12)' : 'transparent',
    border: active ? `1px solid rgba(212,168,67,0.2)` : '1px solid transparent',
    transition: 'all 0.15s ease',
    marginBottom: 2,
  });

  const drawerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: SIDER_BG }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 400,
          color: GOLD, letterSpacing: '0.05em',
        }}>
          e-Auditoria
        </span>
        <Avatar
          size={32}
          style={{ background: '#1E3558', fontSize: 12, fontWeight: 700, color: GOLD }}
        >
          GM
        </Avatar>
      </div>
      <nav style={{ flex: 1, padding: '12px 12px 0' }}>
        {NAV_ITEMS.map((item) => (
          <div key={item.path} style={drawerItemStyle(isActive(item.path))} onClick={() => handleNav(item.path)}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px 4px' }}
          onClick={toggleTheme}
        >
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
            {appTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            {appTheme === 'light' ? 'Modo escuro' : 'Modo claro'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
          <Avatar size={28} style={{ background: '#1E3558', fontSize: 11, fontWeight: 700, color: GOLD }}>GM</Avatar>
          <div>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', lineHeight: 1.3 }}>
              Gabriel Massaia
            </Typography.Text>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, display: 'block' }}>
              gabrielmassaia50@gmail.com
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sider — hidden on mobile */}
      <div style={{ display: isMobile ? 'none' : 'block' }}>
        <Sider
          width={48}
          theme="dark"
          style={{ background: SIDER_BG, overflow: 'hidden', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Tooltip title="e-Auditoria" placement="right" mouseEnterDelay={0}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 52, borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'default',
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 400,
                  color: GOLD, letterSpacing: '0.05em',
                }}>eA</span>
              </div>
            </Tooltip>
            <nav style={{ flex: 1, paddingTop: 6 }}>
              {NAV_ITEMS.map((item) => (
                <Tooltip key={item.path} title={item.label} placement="right" mouseEnterDelay={0}>
                  <div style={itemStyle(isActive(item.path))} onClick={() => navigate(item.path)}>
                    {item.icon}
                  </div>
                </Tooltip>
              ))}
            </nav>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 10 }}>
              <Tooltip title={appTheme === 'light' ? 'Modo escuro' : 'Modo claro'} placement="right" mouseEnterDelay={0}>
                <div style={footerItemStyle} onClick={toggleTheme}>
                  {appTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                </div>
              </Tooltip>
              <Tooltip placement="right" mouseEnterDelay={0} title={
                <div>
                  <div style={{ fontWeight: 600 }}>Gabriel Massaia</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>gabrielmassaia50@gmail.com</div>
                </div>
              }>
                <div style={{ ...footerItemStyle, paddingBottom: 4 }}>
                  <Avatar size={28} style={{ background: '#1E3558', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: GOLD }}>GM</Avatar>
                </div>
              </Tooltip>
            </div>
          </div>
        </Sider>
      </div>

      {/* Mobile hamburger trigger */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed', top: 12, left: 12, zIndex: 1000,
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36,
          border: 'none', borderRadius: 8,
          background: 'rgba(0,0,0,0.3)',
          color: '#fff', fontSize: 18,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}
        aria-label="Abrir menu"
      >
        <MenuOutlined />
      </button>

      {/* Mobile Drawer overlay */}
      <Drawer
        open={open}
        onClose={onClose}
        placement="left"
        width={280}
        styles={{ body: { padding: 0, background: SIDER_BG }, mask: { background: 'rgba(0,0,0,0.6)' } }}
        closable={false}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
