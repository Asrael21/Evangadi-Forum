import { useCallback, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import styles from './CodeBlock.module.css';

const LANG_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
};

const LANG_COLORS = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  jsx: '#61dafb',
  tsx: '#61dafb',
  html: '#e34c26',
  css: '#264de4',
  python: '#3572a5',
  bash: '#4eaa25',
  json: '#292929',
  sql: '#e38c00',
  yaml: '#cb171e',
  markdown: '#083fa1',
};

/**
 * Fenced code block with syntax highlighting, language badge, and copy button.
 * Used as a react-markdown `code` component override.
 *
 * @param {{ className?: string, children: import('react').ReactNode }} props
 */
export default function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);

  const langMatch = typeof className === 'string'
    ? className.match(/language-([\w+#.-]+)/)
    : null;
  const rawLang = langMatch ? langMatch[1].toLowerCase() : '';
  const lang = LANG_ALIASES[rawLang] || rawLang || 'text';
  const label = rawLang || 'code';
  const badgeColor = LANG_COLORS[lang] ?? '#6b7280';

  const code = String(children ?? '').replace(/\n$/, '');
  const lineCount = code.split('\n').length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [code]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.lang} style={{ color: badgeColor }}>
          {label}
        </span>
        <button
          type='button'
          className={styles.copy}
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? (
            <>
              <Check size={13} aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} aria-hidden />
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        showLineNumbers={lineCount > 4}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.84rem',
          lineHeight: 1.55,
          maxHeight: 'min(26rem, 58vh)',
          overflowY: 'auto',
        }}
        codeTagProps={{ style: { fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
