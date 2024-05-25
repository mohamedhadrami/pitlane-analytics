"use client";

import Loading from "@/components/Loading";
import { Button, ScrollShadow, Textarea, Tooltip } from "@nextui-org/react";
import { ArrowBigUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const Page: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/db/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault(); // prevent default behavior of adding a newline
      handleQuerySubmit();
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extralight mb-5">Query Executor</h1>
      <Textarea
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => handleKeyPress(e as React.KeyboardEvent<HTMLTextAreaElement>)}
        placeholder={`Write your SQL query here...`}
        radius="sm"
        variant="underlined"
        className="w-full"
        classNames={{
          inputWrapper: "bg-black text-primary hover:bg-black after:bg-primary",
          input: "placeholder:text-primary !text-primary text-md font-medium",
          description: "text-primary",
        }}
        spellCheck={false}
      />
      <br />
      <Tooltip
        content={
          <div className="flex items-center">
            <ArrowBigUp /> + Enter
          </div>
        }
      >
        <Button
          onClick={handleQuerySubmit}
          disabled={loading}
          className="flex ml-auto"
          startContent={loading ? <Loading size={25} /> : ""}
          color="primary"
          radius="sm"
          variant="bordered"
        >
          {loading ? "Executing..." : "Execute Query"}
        </Button>
      </Tooltip>
      <ScrollShadow hideScrollBar className="w-[300px] h-[400px]">
        <pre
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {result}
        </pre>
      </ScrollShadow>
    </div>
  );
};

export default Page;
