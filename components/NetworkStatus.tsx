// components/NetworkStatus.tsx
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

const NetworkStatus: React.FC = () => {
    const [isOnline, setOnline] = useState<boolean>(true);
    const toastIdRef = useRef<string | number | null>(null);

    useEffect(() => {
        const isOnlineCheck = () => {
            fetch('https://8.8.8.8', { mode: 'no-cors' })
                .then(() => {
                    if (!isOnline) {
                        setOnline(true);
                        if (toastIdRef.current) {
                            toast.success('You are back online', { id: toastIdRef.current });
                            toastIdRef.current = null;
                        }
                    }
                })
                .catch(() => {
                    if (isOnline) {
                        setOnline(false);
                        retryConnection();
                    }
                });
        };

        isOnlineCheck();

        const onlineInterval = setInterval(isOnlineCheck, 5000);

        return () => clearInterval(onlineInterval);
    }, [isOnline]);

    const retryConnection = () => {
        toastIdRef.current = toast.promise(
            new Promise<void>((resolve) => {
                const checkOnline = setInterval(() => {
                    fetch('https://8.8.8.8', { mode: 'no-cors' })
                        .then(() => {
                            setOnline(true);
                            clearInterval(checkOnline);
                            resolve();
                        })
                        .catch(() => setOnline(false));
                }, 5000);
            }),
            {
                loading: 'Waiting for connection...',
                success: 'You are back online!',
                error: 'Still offline...',
            }
        );
    };

    return null;
};

export default NetworkStatus;
