
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showText = true, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      {showText && (
        <div className="text-right text-sm mt-1 text-opic-purple font-medium">
          {Math.round(progress)}/100
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
