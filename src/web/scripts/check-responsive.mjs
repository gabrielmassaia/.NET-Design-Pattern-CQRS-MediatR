/**
 * check-responsive.mjs
 *
 * Valida se os componentes do frontend estão implementados com
 * responsividade mobile. Usado por AI agents para verificar
 * conformidade antes de marcar tarefas como concluídas.
 *
 * Uso: node scripts/check-responsive.mjs
 *
 * Retorna: exit code 0 se tudo OK, 1 se houver falhas.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '..', 'src');

let passed = 0;
let failed = 0;

function read(filePath) {
  const full = resolve(SRC, filePath);
  if (!existsSync(full)) return null;
  return readFileSync(full, 'utf-8');
}

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS  ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL  ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

/* ──────────────────────────────────────────────
 * 1. AppSidebar — deve ter Drawer para mobile
 * ────────────────────────────────────────────── */
{
  const file = read('components/AppSidebar.tsx');
  if (!file) { check('AppSidebar.tsx não encontrado', false); }
  else {
    check('AppSidebar: importa Drawer do antd',
      /import.*\{[^}]*Drawer[^}]*\}\s+from\s+['"]antd['"]/.test(file));
    check('AppSidebar: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('AppSidebar: renderiza <Drawer> para mobile',
      /<Drawer/.test(file) && /placement="left"/.test(file));
    check('AppSidebar: esconde Sider em mobile (isMobile)',
      /isMobile\s*\?\s*'none'\s*:\s*'block'/.test(file) ||
      /display:\s*isMobile\s*\?\s*'none'/.test(file));
    check('AppSidebar: hamburger button com MenuOutlined',
      /MenuOutlined/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 2. App.tsx — margens responsivas
 * ────────────────────────────────────────────── */
{
  const file = read('App.tsx');
  if (!file) { check('App.tsx não encontrado', false); }
  else {
    check('App.tsx: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('App.tsx: margin responsivo (isMobile ? 8 : 24)',
      /margin:/.test(file) && /isMobile/.test(file));
    check('App.tsx: padding responsivo (isMobile ? 12 : 28)',
      /padding:/.test(file) && /isMobile/.test(file));
    check('App.tsx: passa sidebarOpen/onClose/onToggle para AppSidebar',
      /sidebarOpen/.test(file) && /onClose/.test(file) && /onToggle/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 3. KpiGrid — flexWrap 'wrap' (não 'nowrap')
 * ────────────────────────────────────────────── */
{
  const file = read('components/dashboard/KpiGrid.tsx');
  if (!file) { check('KpiGrid.tsx não encontrado', false); }
  else {
    check('KpiGrid: flexWrap = "wrap" (não "nowrap")',
      /flexWrap:\s*['"]wrap['"]/.test(file));
    check('KpiGrid: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('KpiGrid: flex responsivo (isMobile ? calc)',
      /isMobile/.test(file) && /flex/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 4. StatCard — padding e fontSize responsivos
 * ────────────────────────────────────────────── */
{
  const file = read('components/dashboard/StatCard.tsx');
  if (!file) { check('StatCard.tsx não encontrado', false); }
  else {
    check('StatCard: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('StatCard: fontSize responsivo (isMobile ? 24 : 34)',
      /fontSize:\s*isMobile\s*\?\s*\d+\s*:\s*\d+/.test(file));
    check('StatCard: padding responsivo',
      /padding:.*isMobile/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 5. DonutChart — tema e tamanho responsivos
 * ────────────────────────────────────────────── */
{
  const file = read('components/dashboard/DonutChart.tsx');
  if (!file) { check('DonutChart.tsx não encontrado', false); }
  else {
    check('DonutChart: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('DonutChart: importa theme do antd',
      /import.*theme.*from\s+['"]antd['"]/.test(file));
    check('DonutChart: usa token.colorText (não hardcoded #E8EAF0)',
      !/#E8EAF0/.test(file) && /token\.colorText/.test(file));
    check('DonutChart: usa token.colorTextTertiary',
      /token\.colorTextTertiary/.test(file));
    check('DonutChart: usa token.colorBorderSecondary',
      /token\.colorBorderSecondary/.test(file));
    check('DonutChart: size responsivo (isMobile ? 100 : 148)',
      /isMobile\s*\?\s*\d+\s*:\s*148/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 6. AlertasChart — flexWrap wrap
 * ────────────────────────────────────────────── */
{
  const file = read('components/dashboard/AlertasChart.tsx');
  if (!file) { check('AlertasChart.tsx não encontrado', false); }
  else {
    check('AlertasChart: flexWrap wrap no container',
      /flexWrap:\s*['"]wrap['"]/.test(file));
    check('AlertasChart: importa useBreakpoint',
      /useBreakpoint/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 7. PageHeader — flexDirection responsivo
 * ────────────────────────────────────────────── */
{
  const file = read('components/ui/PageHeader.tsx');
  if (!file) { check('PageHeader.tsx não encontrado', false); }
  else {
    check('PageHeader: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('PageHeader: flexDirection responsivo (column em mobile)',
      /flexDirection:\s*isMobile/.test(file));
    check('PageHeader: fontSize título responsivo',
      /fontSize:\s*isMobile/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 8. DashboardPage — header responsivo
 * ────────────────────────────────────────────── */
{
  const file = read('pages/Dashboard/DashboardPage.tsx');
  if (!file) { check('DashboardPage.tsx não encontrado', false); }
  else {
    check('DashboardPage: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('DashboardPage: header flexDirection responsivo',
      /flexDirection:\s*isMobile/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 9. DocsLayout — sidebar some em mobile
 * ────────────────────────────────────────────── */
{
  const file = read('components/documentacao/DocsLayout.tsx');
  if (!file) { check('DocsLayout.tsx não encontrado', false); }
  else {
    check('DocsLayout: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('DocsLayout: importa Select do antd',
      /import.*\{[^}]*Select[^}]*\}\s+from\s+['"]antd['"]/.test(file));
    check('DocsLayout: sidebar escondida em mobile (!isMobile)',
      /\{!isMobile\s*&&/.test(file));
    check('DocsLayout: Select de navegação em mobile',
      /\{isMobile\s*&&/.test(file) && /<Select/.test(file));
    check('DocsLayout: padding responsivo no main',
      /padding:\s*isMobile/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 10. HistoricoDrawer — width responsivo
 * ────────────────────────────────────────────── */
{
  const file = read('components/empresa/HistoricoDrawer.tsx');
  if (!file) { check('HistoricoDrawer.tsx não encontrado', false); }
  else {
    check('HistoricoDrawer: width responsivo (mobile 100%)',
      /width=\{\s*isMobile\s*\?\s*['"]100%['"]/.test(file) ||
      /width:\s*isMobile\s*\?/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * 11. RegimeMatrixModal — width responsivo
 * ────────────────────────────────────────────── */
{
  const file = read('components/empresa/RegimeMatrixModal.tsx');
  if (!file) { check('RegimeMatrixModal.tsx não encontrado', false); }
  else {
    check('RegimeMatrixModal: importa useBreakpoint',
      /useBreakpoint/.test(file));
    check('RegimeMatrixModal: width responsivo (mobile 100%)',
      /width=\{\s*isMobile\s*\?\s*['"]100%['"]/.test(file) ||
      /width:\s*isMobile\s*\?/.test(file));
  }
}

/* ──────────────────────────────────────────────
 * Sumário
 * ────────────────────────────────────────────── */
console.log('\n══════════════════════════════════════');
console.log(`  Total: ${passed + failed}  |  ✅ ${passed}  |  ❌ ${failed}`);
console.log('══════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
