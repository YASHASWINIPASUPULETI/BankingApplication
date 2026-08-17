import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Alert({ type, message, onClose }) {
  if (!message) return null;
  const isSuccess = type === 'success';

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      background: isSuccess ? '#ecfdf5' : '#fef2f2',
      color: isSuccess ? '#065f46' : '#991b1b',
      border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {isSuccess ? <CheckCircle2 size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.7
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
