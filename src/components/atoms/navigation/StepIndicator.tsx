import { clsx } from 'clsx';
import styles from './step-indicator.module.scss';

export interface StepIndicatorProps {
  steps: Array<{ label: string }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepIndicator({ steps, currentStep, onStepClick, className }: StepIndicatorProps) {
  return (
    <div className={clsx(styles.stepIndicator, className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className={clsx(styles.stepIndicator__item, onStepClick && styles['stepIndicator__item--clickable'])}>
            <div
              onClick={() => onStepClick?.(stepNumber)}
              className={clsx(
                styles.stepIndicator__circle,
                isActive && styles['stepIndicator__circle--active'],
                isCompleted && styles['stepIndicator__circle--completed'],
              )}
            >
              {isCompleted ? (
                <span className={styles.stepIndicator__check}>✓</span>
              ) : (
                <span>{stepNumber}</span>
              )}
            </div>
            <span
              className={clsx(
                styles.stepIndicator__label,
                (isActive || isCompleted) && styles['stepIndicator__label--active'],
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  styles.stepIndicator__line,
                  isCompleted && styles['stepIndicator__line--completed'],
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
