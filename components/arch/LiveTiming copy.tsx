

import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, tableCellClasses } from "@mui/material";
import { DriverParams, LapParams, StintParams } from "../../interfaces/openF1";
import DriverRow from "../Dashboard/DriverRowData";


const LiveTiming: React.FC<{ drivers: DriverParams[], stints: StintParams[], laps: LapParams[] }> = ({ drivers, stints, laps }) => {

    return (
        <div>
            <TableContainer>
                <Table
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none",
                            color: "#fff"
                        }
                    }}
                >
                    <TableHead sx={{
                        [`& .${tableCellClasses.root}`]: {
                            backgroundColor: "#e10600aa"
                        }
                    }}>
                        <LiveTimingHeader />
                    </TableHead>
                    <TableBody sx={{
                        [`& .${tableCellClasses.root}`]: {
                            backgroundColor: "#111",
                            padding: "2px"
                        }
                    }}>
                        {drivers && drivers.map((driver: DriverParams) => (
                            <DriverRow driver={driver} stints={stints} laps={laps} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

const LiveTimingHeader: React.FC = () => {
    /*
            <TableCell style={{textAlign: "center"}}>Gear/RPM</TableCell>
            <TableCell style={{textAlign: "center"}}>Speed</TableCell>
            <TableCell style={{textAlign: "center"}}>Throttle</TableCell>
            <TableCell style={{textAlign: "center"}}>DRS</TableCell>
    */
    return (
        <TableRow>
            <TableCell style={{textAlign: "center"}}>POS</TableCell>
            <TableCell style={{textAlign: "center"}}>Driver</TableCell>
            <TableCell style={{textAlign: "center"}}>Lap Time</TableCell>
            <TableCell style={{textAlign: "center"}}>Gap</TableCell>
            <TableCell style={{textAlign: "center"}}>Tyre</TableCell>
            <TableCell style={{textAlign: "center"}}>Lap</TableCell>
            <TableCell style={{textAlign: "center"}}>Sectors</TableCell>
        </TableRow>
    )
}

export default LiveTiming;
