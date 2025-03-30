// @/hooks/assertTelemetry.ts
import type { OFSession, OFMeeting } from "@/types/openF1.types";

export function assertDefined<T>(value: T | undefined | null, name: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(`${name} is not defined`);
  }
}

export function assertSession(session?: OFSession): asserts session is OFSession {
  assertDefined(session, "Session");
}

export function assertMeeting(meeting?: OFMeeting): asserts meeting is OFMeeting {
  assertDefined(meeting, "Meeting");
}

export function assertLap(lap?: number | null): asserts lap is number {
  if (lap === null || lap === undefined) {
    throw new Error("Lap is not selected");
  }
}
