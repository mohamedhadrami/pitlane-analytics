// components/Skeletons/DriversTableSkeleton.tsx

import styles from '../../styles/championshipTable.module.css';

const DriversTableSkeleton: React.FC<any> = () => (
    <div className={styles.container}>
        <div className={styles.tableContainer}>
            <h2>Driver Standings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Driver Code</th>
                        <th>Full Name</th>
                        <th>Nationality</th>
                        <th>Team</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody className="flasher">
                    {Array.from({ length: 20 }).map((_, index: number) => (
                        <tr key={index}>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                            <td>{'◦◦◦◦◦◦◦◦◦'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default DriversTableSkeleton;
