"use client"

import { Button } from "@nextui-org/react";
import { toast } from "sonner";

const Page: React.FC = () => {

    const handleClick = () => {
        toast.success("Success", {
            description: "No data to display. Please select a driver or reload the page.",
        })
        toast.warning("Warning", {
            description: "No data to display. Please select a driver or reload the page.",
        })
        toast.error("Error", {
            description: "No data to display. Please select a driver or reload the page.",
        })

        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));
    }

    return (
        <div className="flex justify-center m-20">
            <Button onClick={() => handleClick()}>test</Button>
        </div>
    );
};

export default Page;