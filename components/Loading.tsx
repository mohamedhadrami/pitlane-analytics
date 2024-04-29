// component/Loading.tsx

import React from "react";
import { Triangle } from "react-loader-spinner";

const Loading: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <div className="loading-overlay flex flex-col justify-center items-center h-[calc(100vh-150px)]">
      <div className="loading-spinner">
        <Triangle
          visible={true}
          height={size ? size : 75}
          width={size ? size : 75}
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
