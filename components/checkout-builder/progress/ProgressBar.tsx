import React from 'react';
import { Step, ProgressBarConfig } from '../../types';

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div
      className="progress-container"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="progress-bar"
        style={{
          width: "100%",
          height: config.styling.height,
          backgroundColor: config.styling.backgroundColor,
          borderRadius: config.styling.borderRadius,
          overflow: "hidden",
          boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
        }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: config.styling.completedColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      
      {config.showStepNames && (
        <div
          className="progress-labels"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            fontSize: config.styling.fontSize,
            color: config.styling.textColor,
            fontWeight: config.styling.fontWeight,
          }}
        >
          {steps.map((step, index) => (
            <span
              key={step.id}
              style={{
                color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                fontWeight: index === currentStep ? "600" : "400",
              }}
            >
              {step.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 