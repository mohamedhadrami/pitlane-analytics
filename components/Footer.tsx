// @/components/Footer.tsx

"use client"

import { useFooter } from "@/context/FooterContext";
import { Link } from "@nextui-org/react";

const Footer = () => {
    const { isFooterVisible } = useFooter();

    if (!isFooterVisible) return null;

    return (
        <footer className="m-2 text-center mt-5">
            <hr />
            <p className="m-3">
                Powered by{" "}
                <Link isExternal href="https://openf1.org/">OpenF1 API</Link>{" "}
                and{" "}
                <Link isExternal href="https://ergast.com/mrd/">Ergast API</Link>
            </p>
        </footer>
    );
};

export default Footer;