import {
  listenAndServe,
  ServerRequest,
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "./deps.ts";
import { routes } from "./router.ts";
import {
  getStore,
  addUser,
  removeUser,
  changeName,
  joinRoom,
} from "./store.ts";

const PORT = 8080;

async function handleWebsocketEvent(sock: WebSocket) {
  console.log("ws:connected");

  addUser(sock.conn.rid);

  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        console.log("ws:text", ev);
        // await sock.send(ev);
        if (ev.startsWith("join:")) {
          const [command, roomid] = ev.split(":");
          joinRoom(sock.conn.rid, roomid);
        }

        if (ev.startsWith("changename:")) {
          const [command, name] = ev.split(":");
          changeName(sock.conn.rid, name);
        }
      } else if (isWebSocketCloseEvent(ev)) {
        const { code, reason } = ev;
        console.log("ws:close", code, reason);
        removeUser(sock.conn.rid);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}

listenAndServe(`:${PORT}`, async (request: ServerRequest) => {
  if (request.url === "/ws") {
    acceptWebSocket({
      conn: request.conn,
      bufReader: request.r,
      bufWriter: request.w,
      headers: request.headers,
    })
      .then(handleWebsocketEvent)
      .catch(async (err) => {
        console.error(`failed to accept websocket: ${err}`);
        await request.respond({ status: 400 });
      });
    return;
  }

  const [path, query] = request.url.split("?");

  if (routes.has(path)) {
    routes.get(path)(request, getStore());
    return;
  }

  await request.respond({
    body: "Not Found",
    status: 404,
  });
});
