// /app/api/formula1/sse/route.ts

import { NextResponse } from 'next/server';
import { getState, addSseSubscriber, removeSseSubscriber } from '../state';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendData = (data: any) => {
        if (!controller.desiredSize) {
          // If the stream has no desired size, it means it's closed or the buffer is full
          return;
        }
        try {
          const jsonData = JSON.stringify(data); // Ensure data is serialized to JSON
          controller.enqueue(encoder.encode(`data: ${jsonData}\n\n`));
          //controller.enqueue(encoder.encode(`data: hello\n\n`));
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

      const subscriber = {
        send: sendData,
        close: () => controller.close(),
      };

      // Add the subscriber
      addSseSubscriber(subscriber);

      // Send the initial state
      sendData(getState());

      // Remove the subscriber when the stream is canceled (client disconnects)
      controller.close = () => {
        removeSseSubscriber(subscriber);
      };
    },

    cancel() {
      console.log('Stream was canceled by the client.');
      // Perform any necessary cleanup here
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
