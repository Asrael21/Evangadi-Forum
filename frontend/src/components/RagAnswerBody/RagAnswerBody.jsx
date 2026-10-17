/**
 * Renders RAG "answer" text as Markdown (incl. fenced code) with readable styling.
 */
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../CodeBlock/CodeBlock.jsx';
import styles from './RagAnswerBody.module.css';

/**
 * @param {{ children: string }} props - Markdown source in `children`.
 * @returns {JSX.Element | null} Styled markdown, or null when empty.
 */
export default function RagAnswerBody({ children }) {
  const text = typeof children === 'string' ? children : '';
  if (!text.trim()) return null;

  return (
    <div className={styles.root}>
      <ReactMarkdown
        components={{
          p: ({ node: _n, ...props }) => <p className={styles.p} {...props} />,
          ul: ({ node: _n, ...props }) => (
            <ul className={styles.ul} {...props} />
          ),
          ol: ({ node: _n, ...props }) => (
            <ol className={styles.ol} {...props} />
          ),
          li: ({ node: _n, ...props }) => (
            <li className={styles.li} {...props} />
          ),
          h2: ({ node: _n, ...props }) => (
            <h2 className={styles.h2} {...props} />
          ),
          h3: ({ node: _n, ...props }) => (
            <h3 className={styles.h3} {...props} />
          ),
          blockquote: ({ node: _n, ...props }) => (
            <blockquote className={styles.blockquote} {...props} />
          ),
          a: ({ node: _n, ...props }) => (
            <a
              className={styles.a}
              target='_blank'
              rel='noreferrer noopener'
              {...props}
            />
          ),
          hr: ({ node: _n, ...props }) => (
            <hr className={styles.hr} {...props} />
          ),
          pre: ({ node: _n, children }) => <>{children}</>,
          code: ({ node: _n, className, children, ...props }) => {
            const isBlock = /language-/.test(className || '');
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

