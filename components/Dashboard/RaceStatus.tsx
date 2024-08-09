// @/components/Dashboard/RaceStatus.tsx

import { LiveArchiveStatus, LiveLapCount, LiveTrackStatus } from "@/interfaces/liveTiming";
import { Divider } from "@nextui-org/react";

interface RaceStatusProps {
    archiveStatus: LiveArchiveStatus;
    trackStatus: LiveTrackStatus;
    lapCount: LiveLapCount;
}

const RaceStatus: React.FC<RaceStatusProps> = ({
    archiveStatus,
    trackStatus,
    lapCount,
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 items-center w-full h-10 border-t border-zinc-800 bg-black">
            <div className="ml-16">
                <div className="flex flex-row items-center h-10 gap-3 px-3">
                    <div className="flex flex-row gap-1">
                        <p className="font-extralight">Lap</p>
                        <p className="font-extralight">{lapCount.CurrentLap}</p>
                        <p>/</p>
                        <p className="font-bold">{lapCount.TotalLaps}</p>
                    </div>
                    <Divider orientation="vertical" className="h-6" />
                    <div>
                        <p className={`font-extralight ${archiveStatus.Status == "Complete" ? 'text-success' : 'text-secondary'}`}>{archiveStatus.Status}</p>
                    </div>
                    <div>
                        <p className={`font-extralight ${trackStatus.Message == "AllClear" ? 'text-success' : 'text-secondary'}`}>{trackStatus.Message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RaceStatus;
