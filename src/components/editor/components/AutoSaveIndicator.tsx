import React, { useEffect, useState } from 'react';
import { Check, Cloud, Loader2 } from 'lucide-react';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface AutoSaveIndicatorProps {
  status?: SaveStatus;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status = 'saved' }) => {
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    if (status === 'saved') {
      setLastSaved(new Date());
    }
  }, [status]);

  const getTimeAgo = () => {
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />,
          text: 'Saving...',
          color: '#6b7280',
        };
      case 'saved':
        return {
          icon: <Check size={14} />,
          text: `Saved ${getTimeAgo()}`,
          color: '#10b981',
        };
      case 'unsaved':
        return {
          icon: <Cloud size={14} />,
          text: 'Unsaved changes',
          color: '#f59e0b',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={containerStyle}>
      <span style={{ ...iconStyle, color: config.color }}>
        {config.icon}
      </span>
      <span style={{ ...textStyle, color: config.color }}>
        {config.text}
      </span>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '6px',
  background: 'rgba(0, 0, 0, 0.03)',
  fontSize: '12px',
  fontWeight: 500,
};

const iconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const textStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
};

export default AutoSaveIndicator;
