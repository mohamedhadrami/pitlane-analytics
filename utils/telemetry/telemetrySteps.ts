// @/utils/telemetry/telemetrySteps.ts

import type { DriverChartData } from "@/types/custom";

export enum TelemetryStep {
    Year = "year",
    Meeting = "meeting",
    Session = "session",
    StatsDrivers = "stats-drivers",
    DriverLap = "driver-lap",
    LapTelemetry = "lap-telemetry",
}

export const stepOrder: TelemetryStep[] = [
    TelemetryStep.Year,
    TelemetryStep.Meeting,
    TelemetryStep.Session,
    TelemetryStep.StatsDrivers,
    TelemetryStep.DriverLap,
    TelemetryStep.LapTelemetry,
];

export interface TelemetryStateShape {
  selectedYear?: string;
  selectedMeetingKey?: number;
  selectedSessionKey?: number;
  selectedDrivers: Map<string, DriverChartData>;
  selectedLap?: number;
  selectedCompound?: string;
  // extend with more filters as needed
}

export const getStepOrder = (state: TelemetryStateShape): TelemetryStep[] => {
  const baseSteps: TelemetryStep[] = [
    TelemetryStep.Year,
    TelemetryStep.Meeting,
    TelemetryStep.Session,
    TelemetryStep.StatsDrivers,
    TelemetryStep.DriverLap,
  ];

  const dynamicSteps: TelemetryStep[] = [];

  if (state.selectedDrivers.size > 1) {
    dynamicSteps.push(TelemetryStep.LapTelemetry); // will insert compound filter later if needed
  } else {
    dynamicSteps.push(TelemetryStep.LapTelemetry);
  }

  return [...baseSteps, ...dynamicSteps];
};


type StepValidationFn = (state: TelemetryStateShape) => boolean;

export const stepValidations: Record<TelemetryStep, StepValidationFn> = {
  [TelemetryStep.Year]: () => true,
  [TelemetryStep.Meeting]: (state) => !!state.selectedYear,
  [TelemetryStep.Session]: (state) => !!state.selectedMeetingKey,
  [TelemetryStep.StatsDrivers]: (state) => !!state.selectedSessionKey,
  [TelemetryStep.DriverLap]: (state) => state.selectedDrivers.size > 0,
  [TelemetryStep.LapTelemetry]: (state) => !!state.selectedLap,
};



export const getNextStep = (
  current: TelemetryStep,
  stepOrder: TelemetryStep[]
): TelemetryStep | null => {
  const idx = stepOrder.indexOf(current);
  return idx < stepOrder.length - 1 ? stepOrder[idx + 1] : null;
};

export const getPreviousStep = (
  current: TelemetryStep,
  stepOrder: TelemetryStep[]
): TelemetryStep | null => {
  const idx = stepOrder.indexOf(current);
  return idx > 0 ? stepOrder[idx - 1] : null;
};

export const isFirstStep = (
  step: TelemetryStep,
  stepOrder: TelemetryStep[]
): boolean => step === stepOrder[0];

export const isLastStep = (
  step: TelemetryStep,
  stepOrder: TelemetryStep[]
): boolean => step === stepOrder[stepOrder.length - 1];
