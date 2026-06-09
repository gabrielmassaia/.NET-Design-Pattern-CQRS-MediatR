import { theme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { AppTheme } from '../context/ThemeContext';

const FONT_SANS = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const sharedTokens: ThemeConfig['token'] = {
  borderRadius:       10,
  borderRadiusLG:     12,
  borderRadiusSM:     6,
  fontFamily:         FONT_SANS,
  fontSize:           14,
  fontSizeLG:         15,
  lineHeight:         1.6,
  motionDurationMid:  '0.15s',
  motionDurationSlow: '0.22s',
};

const sharedComponents: ThemeConfig['components'] = {
  Card: { paddingLG: 20, borderRadiusLG: 12 },
  Button: { borderRadius: 8, fontWeight: 500 },
  Input: { borderRadius: 8 },
  Select: { borderRadius: 8 },
  DatePicker: { borderRadius: 8 },
  Tag: { borderRadiusSM: 20, fontSizeSM: 12 },
  Modal: { borderRadiusLG: 14 },
  Timeline: { itemPaddingBottom: 24 },
};

export function buildTheme(mode: AppTheme): ThemeConfig {
  if (mode === 'dark') {
    return {
      algorithm: theme.darkAlgorithm,
      token: {
        ...sharedTokens,
        // Precision Ledger palette
        colorPrimary:          '#D4A843',
        colorSuccess:          '#4CAF7D',
        colorWarning:          '#E8944A',
        colorError:            '#C0392B',
        colorInfo:             '#4A7FC1',
        // Surfaces
        colorBgLayout:         '#0F1117',
        colorBgContainer:      '#161B27',
        colorBgElevated:       '#1E2535',
        colorBgSpotlight:      '#252E40',
        // Borders
        colorBorder:           'rgba(255,255,255,0.10)',
        colorBorderSecondary:  'rgba(255,255,255,0.06)',
        // Text
        colorText:             '#E8EAF0',
        colorTextSecondary:    'rgba(232,234,240,0.55)',
        colorTextTertiary:     'rgba(232,234,240,0.35)',
        colorTextQuaternary:   'rgba(232,234,240,0.20)',
        // Shadows
        boxShadow:             '0 4px 16px rgba(0,0,0,0.45)',
        boxShadowSecondary:    '0 1px 4px rgba(0,0,0,0.35)',
      },
      components: {
        ...sharedComponents,
        Layout: {
          siderBg: '#0D1118',
          headerBg: '#0D1118',
        },
        Menu: {
          darkItemBg: '#0D1118',
          darkSubMenuItemBg: '#0D1118',
        },
        Table: {
          headerBg:           '#1E2535',
          headerColor:        'rgba(232,234,240,0.40)',
          headerSortActiveBg: 'rgba(255,255,255,0.05)',
          rowHoverBg:         'rgba(255,255,255,0.03)',
          borderColor:        'rgba(255,255,255,0.06)',
          cellPaddingBlock:   13,
          cellPaddingInline:  16,
        },
        Card: {
          paddingLG:        20,
          borderRadiusLG:   12,
          colorBgContainer: '#1E2535',
        },
        Divider: {
          colorSplit: 'rgba(255,255,255,0.07)',
        },
      },
    };
  }

  // ── Light theme ────────────────────────────────────────────
  return {
    token: {
      ...sharedTokens,
      colorPrimary:          '#1565C0',
      colorSuccess:          '#2E7D32',
      colorWarning:          '#F57F17',
      colorError:            '#C62828',
      colorInfo:             '#00ACC1',
      colorBgLayout:         '#F0F4F8',
      colorBgContainer:      '#FFFFFF',
      colorBgElevated:       '#FFFFFF',
      colorBorder:           '#DDE3EE',
      colorBorderSecondary:  '#EEF1F8',
      colorText:             '#0D1B2A',
      colorTextSecondary:    '#536172',
      colorTextTertiary:     '#8A98AA',
      boxShadow:             '0 2px 12px rgba(13,27,42,0.08)',
      boxShadowSecondary:    '0 1px 4px rgba(13,27,42,0.06)',
    },
    components: {
      ...sharedComponents,
      Layout: {
        siderBg: '#0D1B2A',
        headerBg: '#0D1B2A',
      },
      Menu: {
        darkItemBg: '#0D1B2A',
        darkSubMenuItemBg: '#0D1B2A',
      },
      Table: {
        headerBg:           '#F7F9FC',
        headerColor:        '#536172',
        headerSortActiveBg: '#EEF1F8',
        rowHoverBg:         '#F7F9FC',
        borderColor:        '#EEF1F8',
        cellPaddingBlock:   13,
        cellPaddingInline:  16,
      },
    },
  };
}
