import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.53.0/http/server.ts";
import { WebSocketServer } from "https://deno.land/x/websocket_server/mod.ts";

const wss = new WebSocketServer();
const http = serve(":8080");

async function serverHandler(wss: WebSocketServer) {
  for await (const { event, socket } of wss) {
    console.log(event);
  }
}

serverHandler(wss);

const routes = new Map();

routes.set("/rooms", async (request: ServerRequest) => {
  await request.respond({
    body: "Rooms",
    status: 200,
  });
});

for await (const request of http) {
  if (request.url === "/ws") {
    wss.handleUpgrade(request);
    break;
  } else {
    if (routes.has(request.url)) {
      routes.get(request.url)(request);
      break;
    }

    await request.respond({
      body: "Not Found",
      status: 404,
    });
  }
}
