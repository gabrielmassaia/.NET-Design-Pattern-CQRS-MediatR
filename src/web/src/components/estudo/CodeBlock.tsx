import { useMemo } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';

const { useBreakpoint } = Grid;

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightLines?: number[];
  fileName?: string;
}

const C_KEYWORDS = [
  'public', 'private', 'protected', 'internal', 'sealed', 'static',
  'class', 'interface', 'abstract', 'readonly', 'virtual', 'override',
  'async', 'await', 'Task', 'void', 'bool', 'int', 'string', 'Guid',
  'var', 'new', 'return', 'throw', 'if', 'else', 'for', 'foreach',
  'in', 'null', 'true', 'false', 'this', 'base', 'using', 'namespace',
  'get', 'set', 'value', 'enum', 'record', 'struct',
];

const C_TYPES = [
  'IRequestHandler', 'IPipelineBehavior', 'IRequest', 'INotification',
  'INotificationHandler', 'IValidator', 'AbstractValidator',
  'ValidationException', 'CancellationToken',
  'IEmpresaAppService', 'IEmpresaRepository', 'IUnitOfWork',
  'IMediatrService', 'IDateTimeProvider', 'IObrigacaoRepository',
  'ITributaryRulesEngine', 'IEmpresaSearchService',
  'EmpresaModel', 'EmpresaResultViewModel', 'CreateEmpresaViewModel',
  'CreateEmpresaCommand', 'EmpresaCreatedEvent',
  'CreateEmpresaCommandHandler',
  'ResponseData', 'ResponseErrorCode',
  'AppDbContext', 'UnitOfWork', 'MediatrService',
  'EmpresaRepository', 'EmpresaAppService',
  'HttpContext', 'RequestDelegate',
];

const C_KEYWORDS_SET = new Set(C_KEYWORDS);
const C_TYPES_SET = new Set(C_TYPES);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightSyntax(line: string, lineNumber: number, highlightLines?: number[]): string {
  const isHighlighted = highlightLines?.includes(lineNumber);

  const tokens: string[] = [];
  // Works on the RAW line — angle brackets captured as punctuation, escaped per-token
  const regex = /(\/\/.*)|("[^"]*")|(@?"[^"]*")|(\b\w+\b)|([{}[\]();,.:!|&<>]|\s+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(escapeHtml(line.slice(lastIndex, match.index)));
    }

    const [, comment, str1, str2, word, punct] = match;

    if (comment) {
      tokens.push(`<span style="color:#6A9955;font-style:italic">${escapeHtml(comment)}</span>`);
    } else if (str1 || str2) {
      tokens.push(`<span style="color:#CE9178">${escapeHtml(str1 || str2)}</span>`);
    } else if (word) {
      const esc = escapeHtml(word);
      if (C_KEYWORDS_SET.has(word)) {
        tokens.push(`<span style="color:#569CD6;font-weight:500">${esc}</span>`);
      } else if (C_TYPES_SET.has(word)) {
        tokens.push(`<span style="color:#4EC9B0">${esc}</span>`);
      } else if (/^[A-Z]/.test(word) && word.length > 1 && !/^[A-Z\s]+$/.test(word)) {
        tokens.push(`<span style="color:#4FC1FF">${esc}</span>`);
      } else {
        tokens.push(esc);
      }
    } else if (punct) {
      const esc = escapeHtml(punct);
      tokens.push(punct.trim()
        ? `<span style="color:#D4D4D4">${esc}</span>`
        : esc);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push(escapeHtml(line.slice(lastIndex)));
  }

  let html = tokens.join('');

  if (isHighlighted) {
    html = `<div style="background:rgba(212,168,67,0.12);border-left:3px solid rgba(212,168,67,0.3);padding:0 0 0 13px;margin:0 -16px">${html}</div>`;
  }

  return html;
}

export function CodeBlock({ code, highlightLines, fileName }: CodeBlockProps) {
  const { appTheme } = useAppTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isDark = appTheme === 'dark';
  const lines = code.split('\n');

  const maxLineNum = Math.max(2, String(lines.length).length);

  const { html, lineCount } = useMemo(() => {
    const rendered = lines.map((line, i) => {
      const lineNum = i + 1;
      const highlighted = highlightSyntax(line, lineNum, highlightLines);
      return `<div style="display:flex;min-height:20px;line-height:1.6;padding:0">` +
        `<span style="user-select:none;text-align:right;padding-right:12px;min-width:${maxLineNum + 1}ch;color:rgba(255,255,255,0.25);font-size:${isMobile ? 11 : 12}px;flex-shrink:0">${lineNum}</span>` +
        `<span style="flex:1;white-space:pre;font-size:${isMobile ? 11 : 13}px;overflow-x:auto">${highlighted || ' '}</span>` +
        `</div>`;
    }).join('');
    return { html: rendered, lineCount: lines.length };
  }, [code, highlightLines, isMobile]);

  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      fontFamily: "'DM Mono', monospace",
      fontSize: isMobile ? 11 : 13,
    }}>
      {fileName && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: isMobile ? '8px 12px' : '10px 16px',
          background: isDark ? '#0A0D14' : '#F5F5F5',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: isMobile ? 10 : 11,
          fontFamily: "'DM Mono', monospace",
          overflow: 'hidden',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {fileName}
          </span>
        </div>
      )}
      <div
        style={{
          padding: isMobile ? '8px 12px' : '12px 16px',
          background: isDark ? '#0D1117' : '#FAFAFA',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          minHeight: 60,
        }}
      >
        <div
          style={{ minWidth: 'max-content' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '4px 12px' : '6px 16px',
        background: isDark ? '#0A0D14' : '#F5F5F5',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
      }}>
        <span>C#</span>
        <span>{lineCount} linhas</span>
      </div>
    </div>
  );
}
