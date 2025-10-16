export const ChatStyles = () => (
  <style>{`
    .markdown-content pre {
      background: #1a1a2e !important;
      color: #eee !important;
      padding: 1rem !important;
      border-radius: 0.5rem !important;
      margin: 1rem 0 !important;
      overflow-x: auto !important;
      max-width: 100% !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
      border: 1px solid #2d2d44 !important;
    }

    .markdown-content pre code {
      background: transparent !important;
      color: inherit !important;
      padding: 0 !important;
      white-space: pre !important;
    }

    .markdown-content code:not(pre code) {
      background: #f3f4f6 !important;
      color: #1f2937 !important;
      padding: 0.125rem 0.375rem !important;
      border-radius: 0.25rem !important;
      font-size: 0.875rem !important;
      font-family: 'Consolas', 'Monaco', monospace !important;
      word-break: break-word !important;
    }

    .markdown-content table {
      border-collapse: collapse !important;
      width: 100% !important;
      margin: 1rem 0 !important;
      font-size: 0.875rem !important;
      display: block !important;
      overflow-x: auto !important;
    }

    .markdown-content th {
      background: #f8f9fa !important;
      border: 1px solid #dee2e6 !important;
      padding: 0.75rem !important;
      text-align: left !important;
      font-weight: 600 !important;
    }

    .markdown-content td {
      border: 1px solid #dee2e6 !important;
      padding: 0.75rem !important;
    }

    .markdown-content p {
      margin: 0.75rem 0 !important;
      line-height: 1.6 !important;
    }

    @keyframes listening-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .listening-indicator {
      animation: listening-pulse 2s ease-in-out infinite;
    }

    @keyframes recording-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .recording-indicator {
      animation: recording-pulse 1.5s ease-in-out infinite;
    }

    @keyframes badge-appear {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .conversation-badge {
      animation: badge-appear 0.3s ease-out;
    }

    .thread-control-button {
      transition: all 0.2s ease;
    }

    .thread-control-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  `}</style>
);