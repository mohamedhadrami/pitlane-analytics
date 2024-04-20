
import React from "react";
import { DriverParams, LapParams, StintParams } from "../../interfaces/openF1";
import { TableRow, TableCell } from "@nextui-org/react";
import { getCompoundComponent } from "../Tyres";
import SectorSegment from "./SectorSegments";

const DriverRowData = ( drivers: DriverParams[], stints: StintParams[], laps: LapParams[] ) => {

    let data = {}

    for (var driver in drivers) {
        let stint = stints.filter(stint => stint.driver_number === driver.driver_number).pop();
        let lap = laps.pop();//[laps.length - 1]

    }

    return data;
}
/**
 * <TableCell>POS</TableCell>
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
 */

export default DriverRowData;
