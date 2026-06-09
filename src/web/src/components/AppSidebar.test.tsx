import { renderWithProviders, screen } from '@/test/render';
import { AppSidebar } from './AppSidebar';

describe('AppSidebar', () => {
  it('renders logo eA', () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText('eA')).toBeInTheDocument();
  });

  it('renders nav container with icons', () => {
    renderWithProviders(<AppSidebar />);
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
    const navItems = nav!.querySelectorAll('div[style*="cursor: pointer"]');
    expect(navItems.length).toBeGreaterThanOrEqual(4);
  });

  it('shows user avatar with initials', () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText('GM')).toBeInTheDocument();
  });

  it('renders theme toggle icon', () => {
    renderWithProviders(<AppSidebar />);
    const icons = document.querySelectorAll('.anticon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders sidebar with proper structure', () => {
    renderWithProviders(<AppSidebar />);
    const sider = document.querySelector('.ant-layout-sider');
    expect(sider).toBeInTheDocument();
  });
});
