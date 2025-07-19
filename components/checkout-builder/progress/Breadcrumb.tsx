import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { Step, ProgressBarConfig } from '../../types';

interface BreadcrumbProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  return (
    <div
      className="breadcrumb"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="breadcrumb-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: config.styling.gap,
          fontSize: config.styling.fontSize,
          fontWeight: config.styling.fontWeight,
        }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className="breadcrumb-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: config.styling.borderRadius,
                backgroundColor: index <= currentStep ? config.styling.completedColor : config.styling.backgroundColor,
                border: `${config.styling.borderWidth} solid ${index <= currentStep ? config.styling.activeColor : config.styling.borderColor}`,
                color: index <= currentStep ? "#ffffff" : config.styling.inactiveColor,
                boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
                transition: "all 0.3s ease",
              }}
            >
              {index < currentStep && (
                <Check size={16} />
              )}
              {config.showStepNumbers && (
                <span style={{ fontWeight: "600" }}>
                  {index + 1}.
                </span>
              )}
              {config.showStepNames && (
                <span>{step.title}</span>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <ChevronRight 
                size={16} 
                color={index < currentStep ? config.styling.activeColor : config.styling.inactiveColor} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 