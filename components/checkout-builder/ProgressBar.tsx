import React from 'react';
import { Check } from 'lucide-react';
import { Step, Theme } from '../types';

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  theme: Theme;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  steps, 
  currentStep, 
  theme 
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div
      className="progress-container"
      style={{ marginBottom: theme.spacing.xl }}
    >
      <div
        className="progress-steps"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: theme.spacing.sm,
        }}
      >
        {steps.map((step: Step, index: number) => (
          <div
            key={step.id}
            className="progress-step"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <div
              className="step-number"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? theme.primaryColor : theme.borderColor,
                color: index <= currentStep ? "#ffffff" : theme.secondaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: theme.spacing.xs,
              }}
            >
              {index < currentStep ? <Check size={16} /> : index + 1}
            </div>
            <div
              className="step-title"
              style={{
                fontSize: "12px",
                color: index <= currentStep ? theme.primaryColor : theme.secondaryColor,
                textAlign: "center",
              }}
            >
              {step.title}
            </div>
          </div>
        ))}
      </div>
      <div
        className="progress-bar"
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: theme.borderColor,
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: theme.primaryColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}; 