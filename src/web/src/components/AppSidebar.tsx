import {
  AlertOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MoonOutlined,
  ShopOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppTheme } from '@/context/ThemeContext';

const { Sider } = Layout;

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

export function AppSidebar() {
  const { appTheme, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <Sider
      width={48}
      theme="dark"
      style={{ background: SIDER_BG, overflow: 'hidden', flexShrink: 0 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Logo */}
        <Tooltip title="e-Auditoria" placement="right" mouseEnterDelay={0}>
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            height:         52,
            borderBottom:   '1px solid rgba(255,255,255,0.07)',
            cursor:         'default',
          }}>
            <span style={{
              fontFamily:    "'DM Mono', monospace",
              fontSize:      12,
              fontWeight:    400,
              color:         GOLD,
              letterSpacing: '0.05em',
            }}>
              eA
            </span>
          </div>
        </Tooltip>

        {/* Nav items */}
        <nav style={{ flex: 1, paddingTop: 6 }}>
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.path} title={item.label} placement="right" mouseEnterDelay={0}>
              <div style={itemStyle(isActive(item.path))} onClick={() => navigate(item.path)}>
                {item.icon}
              </div>
            </Tooltip>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 10 }}>

          <Tooltip
            title={appTheme === 'light' ? 'Modo escuro' : 'Modo claro'}
            placement="right"
            mouseEnterDelay={0}
          >
            <div style={footerItemStyle} onClick={toggleTheme}>
              {appTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
            </div>
          </Tooltip>

          <Tooltip
            placement="right"
            mouseEnterDelay={0}
            title={
              <div>
                <div style={{ fontWeight: 600 }}>Gabriel Massaia</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>gabrielmassaia50@gmail.com</div>
              </div>
            }
          >
            <div style={{ ...footerItemStyle, paddingBottom: 4 }}>
              <Avatar
                size={28}
                style={{ background: '#1E3558', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: GOLD }}
              >
                GM
              </Avatar>
            </div>
          </Tooltip>

        </div>
      </div>
    </Sider>
  );
}
