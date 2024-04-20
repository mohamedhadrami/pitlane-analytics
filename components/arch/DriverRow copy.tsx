
import React from "react";
import { DriverParams, LapParams, StintParams } from "../../interfaces/openF1";
import { TableRow, TableCell } from "@mui/material";
import { getCompoundComponent } from "../Tyres";
import SectorSegment from "../Dashboard/SectorSegments";

const DriverRow: React.FC<{ driver: DriverParams, stints: StintParams[], laps: LapParams[] }> = ({ driver, stints, laps }) => {

    const stint = stints.filter(stint => stint.driver_number === driver.driver_number).pop();
    const lap = laps.pop();//[laps.length - 1]

    return (
        <TableRow>
            <TableCell>POS</TableCell>
            <TableCell style={{color: `#${driver?.team_colour}`, textAlign: "center"}}>{driver.driver_number} {driver.name_acronym}</TableCell>
            <TableCell>{lap?.lap_duration}</TableCell>
            <TableCell>Gap</TableCell>
            <TableCell>
                <div style={{width: "25px", marginLeft: "auto", marginRight: "auto"}}>
                    {getCompoundComponent(stint?.compound)}
                </div>
            </TableCell>
            <TableCell style={{width: "25px", textAlign: "center" }}>{lap?.lap_number}</TableCell>
            <TableCell><SectorSegment lap={lap}/></TableCell>
        </TableRow>
    )
}

export default DriverRow;
