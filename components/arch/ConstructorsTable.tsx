// pages/constructors.tsx

import styles from "../../styles/championshipTable.module.css";
import { useRouter } from "next/router";
import Image from "next/image";

const ConstructorsTable: React.FC<{ data: any }> = ({ data }) => {
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
              <tbody>
                {data?.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
                  (constructor: any, index: number) => (
                    <tr
                      key={constructor.round}
                      onClick={() => handleRowClick(constructor)}
                    >
                      <td>
                        <Image
                          key={constructor.round}
                          src={`/logos/${constructor.Constructor.constructorId}.png`}
                          alt={constructor.name}
                          width={35}
                          height={35}
                        />
                      </td>
                      <td>{constructor.position}</td>
                      <td>{constructor.Constructor.name}</td>
                      <td>{constructor.Constructor.nationality}</td>
                      <td>{constructor.wins}</td>
                      <td>{constructor.points}</td>
                    </tr>
                  )
                )}
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

export default ConstructorsTable;
