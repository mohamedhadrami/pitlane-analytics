// @/app/gloabl-error.tsx

"use client";

import { Card, CardBody, ScrollShadow, Button } from "@nextui-org/react";
import { useEffect } from "react";

const GlobalError: React.FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-5 max-w-screen-md mx-auto">
      <p className="flex justify-center text-3xl font-light">{error.name}</p>
      <h2 className="flex text-xl font-extralight">
        Uh oh! Something went wrong!
      </h2>
      <p className="flex text-xl font-extralight text-primary">
        {error.message}
      </p>
      <Card className="m-3 p-3 flex mx-auto" radius="sm">
        <CardBody>
          <ScrollShadow hideScrollBar className="h-[400px]">
            <p>{error.stack}</p>
          </ScrollShadow>
        </CardBody>
      </Card>
      <Button
        className="flex mx-auto mt-5"
        color="primary"
        variant="ghost"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
};

export default GlobalError;
