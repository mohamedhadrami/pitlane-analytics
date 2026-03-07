// @/components/Live/SectorSegments.tsx

import type React from "react";
import { segmentColor } from "@/types/openF1.types";
import type { LiveTimingDataF1LineDataSectors } from "@/types/liveTiming.types";

const Segment: React.FC<{ segment: number }> = ({ segment }) => (
    <div
        className="rounded-full w-0.5 h-3"
        style={{
            backgroundColor: segment !== null ? segmentColor[segment] : '#FF9966',
        }}
    />
);

const SectorSegment: React.FC<{ sectors: LiveTimingDataF1LineDataSectors[] }> = ({ sectors }) => {

    const arr = Array<number>(7).fill(2064);
    /*
    {sectors.length === 0
                ? arr.map((segment, index) => (
                    <Segment key={index} segment={segment} />
                )) : 
    */
    const getSectorColor = (sector: LiveTimingDataF1LineDataSectors) => {
        if (sector.OverallFastest) return "#FF00FF";
        if (sector.PersonalFastest) return "#00FF00";
        return "#FFFF00"
    }

    const renderSegments = () => (
        <div className="flex flex-row gap-3 mx-1 w-14">
            {sectors.map((sector, sectorIndex) => (
                <div key={sectorIndex}>
                    <div className="flex gap-1">
                        {sector.Segments.map((segment, segmentIndex) => (
                            <Segment key={segmentIndex} segment={segment.Status} />
                        ))}
                    </div>
                    <div style={{ color: getSectorColor(sector) }} className="text-left">{sector.Value}</div>
                    <div  className="w-full h-1 rounded" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex">
            {renderSegments()}
        </div>
    );
};

export default SectorSegment;
