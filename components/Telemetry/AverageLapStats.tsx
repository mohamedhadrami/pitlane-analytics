// components/Telemetry/AverageLapStats.tsx

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { CarDataParams, DriverParams, LapParams, LocationParams } from "../../interfaces/openF1";
import { calculateAverages } from "../../utils/telemetryUtils";


const AverageLapStats: React.FC<{
    driversData: Map<
        string,
        {
            driver: DriverParams;
            laps: LapParams[];
            carData: CarDataParams[];
            locationData: LocationParams[];
            raceControl: any[];
            chartData: any[];
        }
    >
}> = ({ driversData }) => {
    return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell>Driver</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Throttle</TableCell>
              <TableCell>Brake</TableCell>
            </TableHead>
            <TableBody>
              {Object.entries(calculateAverages(driversData)).map(([key, value]) => (
                <TableRow key={key}>
                  {key !== 'driver_name' && (
                    <>
                      <TableCell>{value["driver_name"]}</TableCell>
                      {value && Object.entries(value)
                        .filter(([subKey, subValue]) => subKey !== 'driver_name') // Exclude 'driver_name' key
                        .map(([subKey, subValue]) => (
                          <TableCell key={subKey}>{`${subValue.toFixed(2)}`}</TableCell>
                        ))}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      
};

export default AverageLapStats;

/*
<div>
    {Object.entries(calculateAverages(driversData)).map(([key, value]) => (
        <div key={key}>
            <p>{`${key} Average Stats`}</p>
            {value && (
                <div>
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <p key={subKey}>{`${subKey}: ${subValue.toFixed(2)}`}</p>
                    ))}
                </div>
            )}
        </div>
    ))}
</div>
*/