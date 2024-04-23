// pages/drivers.tsx

import styles from '../../styles/championshipTable.module.css';
import { useRouter } from "next/router";

const ArchiveDriversTable: React.FC<{ data: any }> = ({ data }) => {
    const router = useRouter();
    
    const handleRowClick = (driver: any) => {
        router.push(`/archive/driver/${driver.Driver.driverId}`)
    };

    const hasDriverCode = data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.some((driver: any) => driver.Driver.code);

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            {hasDriverCode && <th>Driver Code</th>}
                            <th>Full Name</th>
                            <th>Nationality</th>
                            <th>Team</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.map((driver: any, index: number) => (
                            <tr key={driver.round} onClick={() => handleRowClick(driver)}>
                                <td>{driver.position}</td>
                                {hasDriverCode && <td>{driver.Driver.code}</td>}
                                <td>{`${driver.Driver.givenName} ${driver.Driver.familyName}`}</td>
                                <td>{driver.Driver.nationality}</td>
                                <td>{driver.Constructors[0].name}</td>
                                <td>{driver.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArchiveDriversTable;
