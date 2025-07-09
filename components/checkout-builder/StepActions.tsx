import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Theme } from './types';
import { SelectableElement } from './SelectableElement';

interface StepActionsProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  theme: Theme;
  isPreview?: boolean;
}

export const StepActions: React.FC<StepActionsProps> = ({ 
  currentStep, 
  totalSteps, 
  isSubmitting, 
  onBack, 
  onNext, 
  theme,
  isPreview = false
}) => {
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: theme.borderRadius,
    border: "none",
    fontSize: theme.fontSize,
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: theme.primaryColor,
    color: "#ffffff",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    color: theme.primaryColor,
    border: `1px solid ${theme.primaryColor}`,
  };

  const backButtonElement = {
    id: 'back-button',
    type: 'button' as const,
    label: 'Back Button',
    buttonText: 'Back',
    path: 'checkoutConfig.buttons.back',
    styling: {
      backgroundColor: 'transparent',
      color: theme.primaryColor,
      padding: '12px 24px',
      margin: '0',
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.primaryColor}`,
      fontSize: theme.fontSize,
      fontWeight: '600',
      width: 'auto',
      height: 'auto',
    }
  };

  const nextButtonElement = {
    id: 'next-button',
    type: 'button' as const,
    label: 'Next/Complete Button',
    buttonText: currentStep === totalSteps - 1 ? 'Complete Order' : 'Continue',
    path: 'checkoutConfig.buttons.next',
    styling: {
      backgroundColor: theme.primaryColor,
      color: '#ffffff',
      padding: '12px 24px',
      margin: '0',
      borderRadius: theme.borderRadius,
      border: 'none',
      fontSize: theme.fontSize,
      fontWeight: '600',
      width: 'auto',
      height: 'auto',
    }
  };

  return (
    <div className="step-actions" style={buttonContainerStyle}>
      <SelectableElement element={backButtonElement} isPreview={isPreview}>
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          style={{
            ...secondaryButtonStyle,
            opacity: currentStep === 0 ? 0.5 : 1,
            cursor: currentStep === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={20} />
          {backButtonElement.buttonText}
        </button>
      </SelectableElement>

      <SelectableElement element={nextButtonElement} isPreview={isPreview}>
        <button
          onClick={onNext}
          disabled={isSubmitting}
          style={{
            ...primaryButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            nextButtonElement.buttonText
          )}
          {!isSubmitting && <ChevronRight size={20} />}
        </button>
      </SelectableElement>
    </div>
  );
}; 