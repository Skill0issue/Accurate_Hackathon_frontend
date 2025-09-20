// This file is now designed to handle GET requests for EventSource
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) { 
  try {
    const url = new URL(request.url);
    const prompt = url.searchParams.get('prompt');

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const flaskBackendUrl = process.env.FLASK_BACKEND_URL + '/chatbot/query-stream';

    if (!flaskBackendUrl) {
      console.error("FLASK_BACKEND_URL is not defined in environment variables.");
      return new Response(JSON.stringify({ error: "Application is not configured to connect to the chat service." }), { status: 500 });
    }

    // MODIFIED: Construct a GET request with URL parameters
    const backendUrl = new URL(`${flaskBackendUrl}/chatbot/query-stream`);
    backendUrl.searchParams.append('query', prompt);
    backendUrl.searchParams.append('save_history', 'true');

    const flaskResponse = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!flaskResponse.ok || !flaskResponse.body) {
        const errorBody = await flaskResponse.text();
        console.error(`Flask backend returned an error: ${flaskResponse.status}`, errorBody);
        return new Response(JSON.stringify({ error: "The chat service failed to process the request." }), { status: flaskResponse.status });
    }

    // Pipe the stream from the Flask backend directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = flaskResponse.body!.getReader();
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          }).catch(err => {
            console.error('Error reading stream from Flask backend:', err);
            controller.error(err);
          });
        }
        push();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error('Error in chat API proxy route:', errorMessage);
    return new Response(JSON.stringify({ error: "Failed to connect to the chat service.", details: errorMessage }), { status: 500 });
  }
}
