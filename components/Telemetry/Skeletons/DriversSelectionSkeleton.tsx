// components/Telemetry/SkeletonDriverSelection.tsx

import React from "react";
import styled from "styled-components";
import styles from "../../../styles/telemetry.module.css";

const DriverImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 1px solid #999;
  background-color: #222;
`;

const DriverSelectionSkeleton: React.FC<any> = () => {
  const driverSkeletons = new Array(20).fill(null);

  return (
    <>
      <h3>Selected Drivers</h3>
      <div className={styles.driverContainer}>
        {driverSkeletons.map((_, index) => (
          <DriverImage
            key={index}
            src={'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/null/null01_null_null/null01.png.transform/1col/image.png'}
            alt={``}
          />
        ))}
      </div>
    </>
  );
};

export default DriverSelectionSkeleton;

