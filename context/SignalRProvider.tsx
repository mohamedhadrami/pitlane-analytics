// @/context/SignalRProvider.tsx

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { startSignalRHub } from '@/services/signalr';
import type { LiveTimingSignalRSubs } from '@/types/liveTiming.types';

type SignalRContextType = {
	data: LiveTimingSignalRSubs | null;
};

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const useSignalR = () => {
	const context = useContext(SignalRContext);
	if (!context) {
		throw new Error('useLiveTiming must be used within a LiveTimingProvider');
	}
	return context;
};

let eventSource: EventSource | null = null;

const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [data, setData] = useState<LiveTimingSignalRSubs | null>(null);

	useEffect(() => {
		if (eventSource) {
			console.log('Reusing existing SSE connection.');
			return;
		}

		console.log('Starting SSE connection in provider');
		eventSource = new EventSource('/api/formula1/sse');

		eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log(event);
        setData(newData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };
    
		eventSource.onerror = error => {
			console.error('SSE connection failed:', error);
			eventSource?.close();
			eventSource = null;
		};

		return () => {
			console.log('Closing SSE connection in provider');
			eventSource?.close();
			eventSource = null;
		};
	}, []);

	useEffect(() => {
		startSignalRHub();
	}, []);

	return <SignalRContext.Provider value={{ data }}>{children}</SignalRContext.Provider>;
};

export default SignalRProvider;
