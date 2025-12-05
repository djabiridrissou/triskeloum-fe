import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-2 text-gray-700">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-gray-700">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-gray-700">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          code: ({ className: codeClassName, children }) => {
            const isInline = !codeClassName?.includes('language-');
            return isInline ? (
              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm text-red-600">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
