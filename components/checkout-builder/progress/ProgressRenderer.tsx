import React from 'react';
import { Step, ProgressBarConfig } from '../types';
import { ProgressBar } from './ProgressBar';
import { StepIndicators } from './StepIndicators';
import { Breadcrumb } from './Breadcrumb';
import { Dots } from './Dots';
import { Numbers } from './Numbers';
import { Timeline } from './Timeline';
import { SelectableElement } from '../SelectableElement';

interface ProgressRendererProps {
  steps: Step[];
  currentStep: number;
  config: ProgressBarConfig;
  isPreview?: boolean;
}

export const ProgressRenderer: React.FC<ProgressRendererProps> = ({ 
  steps, 
  currentStep, 
  config,
  isPreview = false
}) => {
  const progressElement = {
    id: 'progress-bar',
    type: 'progress-bar' as const,
    label: 'Progress Bar',
    path: 'checkoutConfig.progressBar',
    styling: {
      backgroundColor: config.styling.backgroundColor,
      color: config.styling.textColor,
      padding: config.styling.padding,
      margin: '0 0 24px 0',
      borderRadius: config.styling.borderRadius,
      border: `${config.styling.borderWidth} solid ${config.styling.borderColor}`,
      fontSize: config.styling.fontSize,
      fontWeight: config.styling.fontWeight,
      width: '100%',
      height: config.styling.height,
    }
  };

  const renderProgress = () => {
    switch (config.type) {
      case 'progress_bar':
        return <ProgressBar steps={steps} currentStep={currentStep} config={config} />;
      
      case 'step_indicators':
        return <StepIndicators steps={steps} currentStep={currentStep} config={config} />;
      
      case 'breadcrumb':
        return <Breadcrumb steps={steps} currentStep={currentStep} config={config} />;
      
      case 'dots':
        return <Dots steps={steps} currentStep={currentStep} config={config} />;
      
      case 'numbers':
        return <Numbers steps={steps} currentStep={currentStep} config={config} />;
      
      case 'timeline':
        return <Timeline steps={steps} currentStep={currentStep} config={config} />;
      
      default:
        return <StepIndicators steps={steps} currentStep={currentStep} config={config} />;
    }
  };

  return (
    <SelectableElement element={progressElement} isPreview={isPreview}>
      {renderProgress()}
    </SelectableElement>
  );
}; 