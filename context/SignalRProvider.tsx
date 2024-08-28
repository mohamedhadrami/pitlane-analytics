// @/context/SignalRProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { startSignalRHub } from '@/services/signalr';
import { LiveTimingSignalRSubs } from '@/interfaces/liveTiming.type';

type SignalRContextType = {
  data: LiveTimingSignalRSubs;
};

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useLiveTiming must be used within a LiveTimingProvider');
  }
  return context;
};

const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    startSignalRHub();
  }, []);

  const [data, setData] = useState<any>();

  useEffect(() => {
    console.log("Starting SSE connection in provider");
    const eventSource = new EventSource('/api/formula1/sse');

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log(newData)
      setData(newData)
      //setData((prevData) => [...prevData, newData]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection failed:", error);
      eventSource.close();
    };

    return () => {
      console.log("Closing SSE connection in provider");
      eventSource.close();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ data }}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRProvider;
