// components/Skeletons/ConstructorTableSkeleton.tsx

import styles from "../../styles/championshipTable.module.css";

const ConstructorsTableSkeleton: React.FC<any> = () =>  (
        <div className={styles.container}>
          <div className={styles.tableContainer}>
          <h2>Constructors Standings</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Position</th>
                  <th>Name</th>
                  <th>Nationality</th>
                  <th>Wins</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody className="flasher">
                  {Array.from({ length: 20 }).map((_, index: number) => (
                      <tr key={index}>
                          <td>{''}</td>
                          <td>{''}</td>
                          <td>{''}</td>
                          <td>{''}</td>
                          <td>{''}</td>
                          <td>{''}</td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
  );

export default ConstructorsTableSkeleton;
