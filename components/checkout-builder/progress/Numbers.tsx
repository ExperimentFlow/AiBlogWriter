import React from 'react';
import { Check } from 'lucide-react';
import { Step, ProgressBarConfig } from '../../types';

interface NumbersProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const Numbers: React.FC<NumbersProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  return (
    <div
      className="numbers-progress"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="numbers-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: config.styling.gap,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="number-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              className="number-circle"
              style={{
                width: config.styling.iconSize,
                height: config.styling.iconSize,
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? config.styling.completedColor : config.styling.backgroundColor,
                border: `${config.styling.borderWidth} solid ${index <= currentStep ? config.styling.activeColor : config.styling.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: config.styling.fontSize,
                fontWeight: config.styling.fontWeight,
                color: index <= currentStep ? "#ffffff" : config.styling.inactiveColor,
                boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
                transition: "all 0.3s ease",
              }}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </div>
            
            {config.showStepNames && (
              <div
                className="step-name"
                style={{
                  fontSize: "12px",
                  color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                  fontWeight: index === currentStep ? "600" : "400",
                  textAlign: "center",
                  maxWidth: "100px",
                  lineHeight: "1.2",
                }}
              >
                {step.title}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div
        className="progress-info"
        style={{
          textAlign: "center",
          marginTop: "16px",
          fontSize: "14px",
          color: config.styling.textColor,
        }}
      >
        <span style={{ fontWeight: "600" }}>
          Step {currentStep + 1} of {steps.length}
        </span>
        {config.showStepDescriptions && (
          <div style={{ marginTop: "4px", color: config.styling.inactiveColor }}>
            {steps[currentStep]?.description}
          </div>
        )}
      </div>
    </div>
  );
}; 