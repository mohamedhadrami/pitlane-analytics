// @/hooks/useTelemetryStep.ts

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  type TelemetryStep,
  getStepOrder,
  stepValidations,
  getNextStep,
  getPreviousStep,
  isFirstStep,
  isLastStep,
  type TelemetryStateShape
} from "@/utils/telemetry/telemetrySteps";

const useTelemetryStep = (telemetryState: TelemetryStateShape) => {
  const stepOrder = useMemo(() => getStepOrder(telemetryState), [telemetryState]);

  const [currentStep, setCurrentStep] = useState<TelemetryStep>(stepOrder[0]);

  const maxUnlockedStep = useMemo(() => {
    let lastValid = stepOrder[0];
    for (const step of stepOrder) {
      const isValid = stepValidations[step]?.(telemetryState);
      if (isValid) {
        lastValid = step;
      } else {
        break;
      }
    }
    return lastValid;
  }, [stepOrder, telemetryState]);

  useEffect(() => {
    const currentIndex = stepOrder.indexOf(currentStep);
    const maxIndex = stepOrder.indexOf(maxUnlockedStep);
    if (currentIndex > maxIndex) {
      setCurrentStep(maxUnlockedStep);
    }
  }, [maxUnlockedStep, currentStep, stepOrder]);

  useEffect(() => {
    const nextStep = getNextStep(currentStep, stepOrder);
    const canAdvance =
      nextStep && stepOrder.indexOf(nextStep) <= stepOrder.indexOf(maxUnlockedStep);
  
    if (canAdvance) {
      setCurrentStep(nextStep);
    }
  }, [maxUnlockedStep, stepOrder, currentStep]);

  const goToNextStep = useCallback(() => {
    const next = getNextStep(currentStep, stepOrder);
    if (next && stepOrder.indexOf(next) <= stepOrder.indexOf(maxUnlockedStep)) {
      setCurrentStep(next);
    }
  }, [currentStep, stepOrder, maxUnlockedStep]);

  const goToPreviousStep = useCallback(() => {
    const prev = getPreviousStep(currentStep, stepOrder);
    if (prev) {
      setCurrentStep(prev);
    }
  }, [currentStep, stepOrder]);

  const canGoToStep = useCallback(
    (step: TelemetryStep) => stepOrder.indexOf(step) <= stepOrder.indexOf(maxUnlockedStep),
    [stepOrder, maxUnlockedStep]
  );

  return {
    stepOrder,
    currentStep,
    setCurrentStep,
    maxUnlockedStep,
    goToNextStep,
    goToPreviousStep,
    canGoToStep,
    isFirstStep: isFirstStep(currentStep, stepOrder),
    isLastStep: isLastStep(currentStep, stepOrder),
  };
};

export default useTelemetryStep;
