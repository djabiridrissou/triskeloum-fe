import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div
      style={{
        padding: '24px',
        background: '#f5f5f5',
        overflow: 'auto',
        flex: 1,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;