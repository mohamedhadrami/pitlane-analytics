// components/Telemetry/Skeleton/SessionStatsSkeleton.tsx

import styles from "../../../styles/telemetry/session.module.css";

const SessionStatsSkeleton: React.FC<any> = () => {
  return (
    <>
      <h3>Session Stats</h3>
      <div className={styles.wrapper}>
        <div
          className={`${styles.statsSkeletonContainer} ${styles.statsContainer}`}
        ></div>

        <div
          className={`${styles.statsSkeletonContainer} ${styles.statsContainer}`}
        ></div>

        <div
          className={`${styles.statsSkeletonContainer} ${styles.statsContainer}`}
        ></div>
      </div>
    </>
  );
};

export default SessionStatsSkeleton;
