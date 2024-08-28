// /app/api/formula1/sse/route.ts

import { NextResponse } from 'next/server';
import { getState, addSseSubscriber, removeSseSubscriber } from '../state';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const sendData = (data: any) => {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const subscriber = {
        send: sendData,
        close: () => controller.close(),
      };

      addSseSubscriber(subscriber);

      sendData(getState());

      controller.close = () => {
        removeSseSubscriber(subscriber);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}
