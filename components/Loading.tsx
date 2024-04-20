// component/Loading.tsx

import React from "react";
import { Triangle } from "react-loader-spinner";

const Loading: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <Triangle
          visible={true}
          height={75}
          width={75}
          color="#e10600"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </div>
  );
};

export default Loading;
