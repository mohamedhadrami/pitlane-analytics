// @/context/FooterContext.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FooterContextProps {
    isFooterVisible: boolean;
    setFooterVisible: (isVisible: boolean) => void;
}

const FooterContext = createContext<FooterContextProps>({
    isFooterVisible: true,
    setFooterVisible: () => {},
});

export const FooterProvider = ({ children }: { children: ReactNode }) => {
    const [isFooterVisible, setFooterVisible] = useState(true);

    return (
        <FooterContext.Provider value={{ isFooterVisible, setFooterVisible }}>
            {children}
        </FooterContext.Provider>
    );
};

export const useFooter = () => useContext(FooterContext);
