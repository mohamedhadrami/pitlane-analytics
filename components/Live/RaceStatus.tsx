// @/components/Dashboard/RaceStatus.tsx

import { LiveArchiveStatus, LiveExtrapolatedClock, LiveHeartbeat, LiveLapCount, LiveTrackStatus } from "@/interfaces/liveTiming.type";
import { Divider } from "@nextui-org/react";
import React from 'react';

interface RaceStatusProps {
    heartbeat: LiveHeartbeat;
    extrapolatedClock: LiveExtrapolatedClock;
    archiveStatus: LiveArchiveStatus;
    trackStatus: LiveTrackStatus;
    lapCount: LiveLapCount;
}

const calculateHeartbeatDelay = (utcTime: string): string => {
    const heartbeatTime = new Date(utcTime);
    const now = new Date();
    const delayMs = now.getTime() - heartbeatTime.getTime();
    const delaySeconds = Math.floor(delayMs / 1000);

    return delaySeconds > 60
        ? `${Math.floor(delaySeconds / 60)}m ${delaySeconds % 60}s ago`
        : `${delaySeconds}s ago`;
};

const RaceStatus: React.FC<RaceStatusProps> = ({
    heartbeat,
    extrapolatedClock,
    archiveStatus,
    trackStatus,
    lapCount,
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 items-center w-full h-10 border-t border-zinc-800 bg-black">
            <div className="ml-16">
                <div className="flex flex-row items-center h-10 gap-3 px-3">
                    {lapCount && (
                        <>
                            <div className="flex flex-row gap-1">
                                <p className="font-extralight">Lap</p>
                                <p className="font-extralight">{lapCount.CurrentLap}</p>
                                <p>/</p>
                                <p className="font-bold">{lapCount.TotalLaps}</p>
                            </div>
                            <Divider orientation="vertical" className="h-6" />
                        </>
                    )}
                    <div className="ml-auto flex flex-row gap-5">
                        <div>
                            <p className={`font-extralight ${trackStatus.Message === "AllClear" ? 'text-success' : 'text-secondary'}`}>
                                {trackStatus.Message}
                            </p>
                        </div>
                        <div><p className="font-extralight">{extrapolatedClock.Remaining}</p></div>
                        <div>
                            <p className={`font-extralight ${archiveStatus.Status === "Complete" ? 'text-success' : 'text-secondary'}`}>
                                {archiveStatus.Status}
                            </p>
                        </div>
                        {archiveStatus.Status !== "Complete" && (
                            <div><p className="font-extralight">{calculateHeartbeatDelay(heartbeat.Utc)}</p></div>
                        )                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaceStatus;
