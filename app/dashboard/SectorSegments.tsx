import React from "react";
import { LapParams, segmentColor } from "../../interfaces/openF1";

const Segment: React.FC<{ segment: number }> = ({ segment }) => (
    <div
        style={{
            width: "2px",
            height: "10px",
            borderRadius: "50vh",
            backgroundColor: segmentColor[segment],
            border: `1px solid ${segment ? segmentColor[segment] : "#fff"}`,
            marginRight: "5px"
        }}
    />
);

const SectorSegment: React.FC<{ lap: LapParams }> = ({ lap }) => {
    return (
        <div style={{ display: "flex" }}>
            {lap && (
                <>
                    <div>
                        <div style={{ display: "flex" }}>
                            {lap.segments_sector_1!.length === 0 ? <p>no data</p> : (lap.segments_sector_1!.map((segment: number, index: React.Key) => (
                                <React.Fragment key={index}>
                                    <Segment segment={segment} />
                                </React.Fragment>
                            )))}
                        </div>
                        <div>{lap.duration_sector_1}</div>
                    </div>

                    <div style={{ width: "10px" }} />
                    <div>
                        <div style={{ display: "flex" }}>
                            {lap.segments_sector_2!.length === 0 ? 
                            <p>no data</p> : 
                            (lap.segments_sector_2!.map((segment: number, index: React.Key) => (
                                <React.Fragment key={index}>
                                    <Segment segment={segment} />
                                </React.Fragment>
                            )))}
                        </div>
                        <div>{lap.duration_sector_2}</div>
                    </div>

                    <div style={{ width: "10px" }} />
                    <div>
                        <div style={{ display: "flex" }}>
                            {lap.segments_sector_3!.length === 0 ? 
                            <div className="h-[10px] w-[50px] px-2 rounded-full border-white border-1"></div> 
                            :
                            (lap.segments_sector_3!.map((segment: number, index: React.Key) => (
                                <React.Fragment key={index}>
                                    <Segment segment={segment} />
                                </React.Fragment>
                            )))}
                        </div>
                        <div>{lap.duration_sector_3}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SectorSegment;
