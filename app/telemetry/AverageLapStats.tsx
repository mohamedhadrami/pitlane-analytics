// components/Telemetry/AverageLapStats.tsx

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";
import { calculateAverages } from "../../utils/telemetryUtils";
import { DriverChartData } from "@/interfaces/custom";


const TelemetryLapSummary: React.FC<{ driversData: Map<string, DriverChartData> }> = ({ driversData }) => {
  const data = calculateAverages(driversData);
  console.log(data)
  return (
    <>
    <p>hello</p>
      <Table>
        <TableHeader>
          <TableCell>Driver</TableCell>
          <TableCell>Speed</TableCell>
          <TableCell>Throttle</TableCell>
          <TableCell>Brake</TableCell>
        </TableHeader>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>help</TableCell>
              <TableCell>help</TableCell>
              <TableCell>help</TableCell>
              <TableCell>help</TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );

};

export default TelemetryLapSummary;