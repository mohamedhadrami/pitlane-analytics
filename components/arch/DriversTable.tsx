// components/DriversTable.tsx

import styles from '../../styles/championshipTable.module.css';
import { useRouter } from "next/router";

const DriversTable: React.FC<{ data: any }> = ({ data }) => {
    const router = useRouter();

    const handleRowClick = (driver: any) => {
        router.push(`/driver/${driver.Driver.code}`)
    };

    const hasDriverCode = data?.MRData.StandingsTable.StandingsLists[0].DriverStandings.some((driver: any) => driver.Driver.code);

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <h2>Driver Standings</h2>
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

export default DriversTable;
