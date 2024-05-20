import React from "react";
import { LapParams, segmentColor } from "../../interfaces/openF1";
import { Divider } from "@nextui-org/react";

const Segment: React.FC<{ segment: number }> = ({ segment }) => (
    <div
        className="rounded-full w-0.5 h-3"
        style={{
            backgroundColor: segment !== null ? segmentColor[segment] : '#FF9966',
        }}
    />
);

const SectorSegment: React.FC<{ lap: LapParams, fastestLap: LapParams }> = ({ lap, fastestLap }) => {
    var arr = Array<number>(7).fill(2064);
    const renderSegments = (segments: number[] | undefined, sectorDuration: number | undefined) => (
        <div className="flex flex-col mx-1 w-14">
            <div className="flex gap-1">
                {segments?.length === 0 
                    ? arr.map((segment, index) => (
                        <Segment key={index} segment={segment} />
                    )) : segments?.map((segment, index) => (
                        <Segment key={index} segment={segment} />
                    ))
                }
            </div>
            <div className="text-left">{sectorDuration}</div>
        </div>
    );

    return (
        <div className="flex">
            {lap && (
                <>
                    {renderSegments(lap.segments_sector_1, lap.duration_sector_1)}
                    {renderSegments(lap.segments_sector_2, lap.duration_sector_2)}
                    {renderSegments(lap.segments_sector_3, lap.duration_sector_3)}
                </>
            )}
        </div>
    );
};

export default SectorSegment;
