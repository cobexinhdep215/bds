'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Require dynamic import with ssr: false to prevent 'window is not defined' during build/SSR.
const EditorComponent = dynamic(() => import('./EditorComponent'), { 
  ssr: false,
  loading: () => <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>Đang tải bộ soạn thảo...</div>
});

export default function CKEditorWrapper({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return <EditorComponent value={value} onChange={onChange} />;
}
