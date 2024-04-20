// pages/constructors.tsx

import styles from '../../styles/championshipTable.module.css';
import { useRouter } from "next/router";

const ArchiveConstructorsTable: React.FC<{ data: any }> = ({ data }) => {
    const router = useRouter();

    const handleRowClick = (constructor: any) => {
        router.push(`/constructor/${constructor.Constructor.constructorId}`);
    };

    const hasStandingsData = data?.MRData.StandingsTable.StandingsLists[0];

    return (
        <div>
            {hasStandingsData ? (
                <div className={styles.container}>
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Name</th>
                                    <th>Nationality</th>
                                    <th>Wins</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map((constructors: any, index: number) => (
                                    <tr key={constructors.round} onClick={() => handleRowClick(constructors)}>
                                        <td>{constructors.position}</td>
                                        <td>{constructors.Constructor.name}</td>
                                        <td>{constructors.Constructor.nationality}</td>
                                        <td>{constructors.wins}</td>
                                        <td>{constructors.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No available constructors data.</p>
            )}
        </div>
    );
};

export default ArchiveConstructorsTable;
