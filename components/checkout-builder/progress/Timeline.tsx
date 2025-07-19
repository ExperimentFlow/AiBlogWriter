import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Step, ProgressBarConfig } from '../../types';

interface TimelineProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  steps, 
  currentStep, 
  config 
}) => {
  return (
    <div
      className="timeline-progress"
      style={{ 
        marginBottom: "32px",
        padding: config.styling.padding,
      }}
    >
      <div
        className="timeline-container"
        style={{
          position: "relative",
          paddingLeft: "32px",
        }}
      >
        {/* Timeline line */}
        <div
          className="timeline-line"
          style={{
            position: "absolute",
            left: "16px",
            top: "0",
            bottom: "0",
            width: "2px",
            backgroundColor: config.styling.backgroundColor,
            borderRadius: "1px",
          }}
        >
          <div
            className="timeline-progress-fill"
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              width: "100%",
              height: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: config.styling.completedColor,
              borderRadius: "1px",
              transition: "height 0.3s ease",
            }}
          />
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="timeline-item"
            style={{
              position: "relative",
              marginBottom: "24px",
              paddingLeft: "24px",
            }}
          >
            {/* Timeline dot */}
            <div
              className="timeline-dot"
              style={{
                position: "absolute",
                left: "-8px",
                top: "4px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? config.styling.completedColor : config.styling.backgroundColor,
                border: `2px solid ${index <= currentStep ? config.styling.activeColor : config.styling.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 ${config.styling.shadowBlur} ${config.styling.shadowColor}`,
                transition: "all 0.3s ease",
              }}
            >
              {index < currentStep ? (
                <Check size={10} color="#ffffff" />
              ) : index === currentStep ? (
                <Clock size={10} color={index <= currentStep ? "#ffffff" : config.styling.inactiveColor} />
              ) : null}
            </div>

            {/* Timeline content */}
            <div
              className="timeline-content"
              style={{
                backgroundColor: index <= currentStep ? config.styling.completedColor + "10" : config.styling.backgroundColor,
                border: `1px solid ${index <= currentStep ? config.styling.activeColor + "30" : config.styling.borderColor}`,
                borderRadius: config.styling.borderRadius,
                padding: "16px",
                transition: "all 0.3s ease",
              }}
            >
              <div
                className="timeline-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                {config.showStepNumbers && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                    }}
                  >
                    {index + 1}.
                  </span>
                )}
                {config.showStepNames && (
                  <h4
                    style={{
                      fontSize: config.styling.fontSize,
                      fontWeight: config.styling.fontWeight,
                      color: index <= currentStep ? config.styling.activeColor : config.styling.inactiveColor,
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h4>
                )}
              </div>
              
              {config.showStepDescriptions && (
                <p
                  style={{
                    fontSize: "14px",
                    color: config.styling.textColor,
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 