import React from 'react';
import { Step, ProgressBarConfig } from '../../types';

interface DotsProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const Dots: React.FC<DotsProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  return (
    <div
      className="dots-progress"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="dots-container"
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
            className="dot-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              className="dot"
              style={{
                width: index === currentStep ? "16px" : "12px",
                height: index === currentStep ? "16px" : "12px",
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? config.styling.completedColor : config.styling.backgroundColor,
                border: `${config.styling.borderWidth} solid ${index <= currentStep ? config.styling.activeColor : config.styling.borderColor}`,
                transition: "all 0.3s ease",
                boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
              }}
            />
            
            {config.showStepNames && (
              <div
                className="step-name"
                style={{
                  fontSize: "12px",
                  color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                  fontWeight: index === currentStep ? "600" : "400",
                  textAlign: "center",
                  maxWidth: "80px",
                  lineHeight: "1.2",
                }}
              >
                {step.title}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {config.showStepDescriptions && (
        <div
          className="current-step-description"
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "14px",
            color: config.styling.textColor,
            fontWeight: "500",
          }}
        >
          {steps[currentStep]?.description}
        </div>
      )}
    </div>
  );
}; 