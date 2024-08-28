// @/context/FooterContext.tsx

"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FooterContextProps {
    isFooterVisible: boolean;
    setFooterVisible: (isVisible: boolean) => void;
}

const FooterContext = createContext<FooterContextProps>({
    isFooterVisible: false,
    setFooterVisible: () => {},
});

export const FooterProvider = ({ children }: { children: ReactNode }) => {
    const [isFooterVisible, setFooterVisible] = useState(false);

    return (
        <FooterContext.Provider value={{ isFooterVisible, setFooterVisible }}>
            {children}
        </FooterContext.Provider>
    );
};

export const useFooter = () => useContext(FooterContext);
