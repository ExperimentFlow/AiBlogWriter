import React from 'react';
import { Check } from 'lucide-react';
import { Step, ProgressBarConfig } from '../../types';

interface StepIndicatorsProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const StepIndicators: React.FC<StepIndicatorsProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  return (
    <div
      className="step-indicators"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="steps-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: config.styling.gap,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="step-indicator"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <div
              className="step-circle"
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
                marginBottom: "8px",
                boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
                transition: "all 0.3s ease",
              }}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                config.showStepNumbers ? index + 1 : ""
              )}
            </div>
            
            {config.showStepNames && (
              <div
                className="step-title"
                style={{
                  fontSize: config.styling.fontSize,
                  color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                  fontWeight: index === currentStep ? "600" : "400",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
              >
                {step.title}
              </div>
            )}
            
            {config.showStepDescriptions && (
              <div
                className="step-description"
                style={{
                  fontSize: "12px",
                  color: config.styling.inactiveColor,
                  textAlign: "center",
                  marginTop: "4px",
                  lineHeight: "1.2",
                }}
              >
                {step.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 